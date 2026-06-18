export const streamMessage = async (
    message: string,
    onChunk: (chunk: string) => void
) => {
    try {
        const response = await fetch(
            "http://localhost/Backend/Api/chat-stream.php",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message,
                }),
            }
        );

        if (!response.ok) {
            throw new Error(
                `HTTP Error: ${response.status}`
            );
        }

        if (!response.body) {
            throw new Error(
                "Response body is null"
            );
        }

        const reader =
            response.body.getReader();

        const decoder =
            new TextDecoder();

        let buffer = "";

        while (true) {

            const {
                done,
                value
            } = await reader.read();

            if (done) break;

            buffer += decoder.decode(
                value,
                {
                    stream: true,
                }
            );

            const lines =
                buffer.split("\n");

            buffer =
                lines.pop() || "";

            for (const line of lines) {

                if (
                    !line.startsWith(
                        "data:"
                    )
                ) {
                    continue;
                }

                const jsonText =
                    line
                        .replace(
                            "data:",
                            ""
                        )
                        .trim();

                if (
                    !jsonText ||
                    jsonText === "[DONE]"
                ) {
                    continue;
                }

                try {

                    const parsed =
                        JSON.parse(
                            jsonText
                        );

                    const text =
                        parsed
                            ?.candidates?.[0]
                            ?.content?.parts?.[0]
                            ?.text || "";

                    if (text) {
                        console.log("TEXT:", text);
                        await new Promise(resolve =>
                            setTimeout(resolve, 500)
                        );

                        onChunk(text);
                    }

                } catch (error) {

                    console.log(
                        "Parse error:",
                        error
                    );

                    console.log(
                        jsonText
                    );
                }
            }
        }

    } catch (error) {

        console.error(
            "Stream error:",
            error
        );

        throw error;
    }
};