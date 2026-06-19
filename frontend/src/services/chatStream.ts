const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

const typeText = async (
    text: string,
    onChunk: (chunk: string) => void
) => {
    for (const char of text) {
        onChunk(char);
        await sleep(15);
    }
};

export const streamMessage = async (
    message: string,
    onChunk: (chunk: string) => void
) => {
    const response = await fetch(
        "http://localhost/Backend/Api/chat-stream.php",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message }),
        }
    );

    if (!response.body) {
        throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, {
            stream: true,
        });

        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const event of events) {
            const line = event
                .split("\n")
                .find(line => line.startsWith("data:"));

            if (!line) continue;

            const jsonText = line.replace("data:", "").trim();

            if (jsonText === "[DONE]") continue;

            try {
                const parsed = JSON.parse(jsonText);

                const text =
                    parsed?.choices?.[0]?.delta?.content || "";

                if (text) {
                    await typeText(text, onChunk);
                }
            } catch (error) {
                console.log("Parse error:", error);
            }
        }
    }
};