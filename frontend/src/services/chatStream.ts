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
    conversationId: number | null,
    onChunk: (chunk: string) => void
) => {
    const token =
        localStorage.getItem("token");

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["X-Auth-Token"] =
            `Bearer ${token}`;
    }

    const response = await fetch(
        "http://localhost/Backend/Api/chat-stream.php",
        {
            method: "POST",
            credentials: "include",
            headers,
            body: JSON.stringify({
                message,
                conversation_id: conversationId,
            }),
        }
    );

    if (!response.body) {
        throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    while (true) {
        const { done, value } =
            await reader.read();

        if (done) break;

        buffer += decoder.decode(value, {
            stream: true,
        });

        const events =
            buffer.split("\n\n");

        buffer =
            events.pop() || "";

        for (const event of events) {
            const line = event
                .split("\n")
                .find(line =>
                    line.startsWith("data:")
                );

            if (!line) continue;

            const jsonText = line
                .replace("data:", "")
                .trim();

            if (jsonText === "[DONE]") {
                continue;
            }

            try {
                const parsed =
                    JSON.parse(jsonText);

                const text =
                    parsed?.choices?.[0]
                        ?.delta?.content || "";

                if (text) {
                    await typeText(
                        text,
                        onChunk
                    );
                }
            } catch (error) {
                console.log(
                    "Parse error:",
                    error
                );
            }
        }
    }
};