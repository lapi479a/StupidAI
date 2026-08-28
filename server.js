const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post("/api/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        if (!userMessage) {
            return res.status(400).json({
                error: "No message provided"
            });
        }

        console.log("You:", userMessage);

        const response = await fetch(
            "http://127.0.0.1:11434/api/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama3.2:1b",
                    messages: [
                        {
                            role: "user",
                            content: userMessage
                        }
                    ],
                    stream: false
                })
            }
        );

        const data = await response.json();

        console.log("Ollama:", data);

        if (!response.ok) {
            return res.status(500).json({
                error:
                    data.error ||
                    "Ollama returned an error."
            });
        }

        const reply =
            data.message &&
            data.message.content;

        if (!reply || !reply.trim()) {
            return res.status(500).json({
                error:
                    "Ollama returned an empty response. Check the terminal."
            });
        }

        res.json({
            reply: reply
        });

    } catch (error) {

        console.error("ERROR:", error);

        res.status(500).json({
            error:
                "Could not connect to Ollama. " +
                error.message
        });
    }
});

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "index.html")
    );
});

app.listen(PORT, () => {

    console.log("");
    console.log("=================================");
    console.log("🤖 STUPID AI IS RUNNING!");
    console.log("=================================");
    console.log("");
    console.log(
        `Website: http://localhost:${PORT}`
    );
    console.log(
        "Ollama:  http://127.0.0.1:11434"
    );
    console.log("");
    console.log(
        "Model:   llama3.2:1b"
    );
    console.log("");
});