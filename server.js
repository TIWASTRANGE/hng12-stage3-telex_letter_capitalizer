require("dotenv").config();

const express = require("express");
const axios = require("axios");
const capitalizeSentences = require("./capitalize");

const app = express();
app.use(express.json());

const TELEX_WEBHOOK_URL = process.env.TELEX_WEBHOOK_URL;
channel_id = "019519ca-76a3-77d7-8ff9-9b437d7771bd"

app.post("/modify-message", async (req, res) => {
    try {
        const { message, channel_id } = req.body;

        // Check if the message was sent by the bot in the same channel (to prevent infinite loops)
        if (channel_id) {
            console.log("Ignoring bot message to prevent looping.");
            return res.status(200).json({ status: "ignored", message: "Bot message ignored." });
        }

        if (!message) {
            return res.status(400).json({ error: "No message provided" });
        }

        const modifiedMessage = capitalizeSentences(message);

        // Send modified message back to Telex
        await axios.post(TELEX_WEBHOOK_URL, {
            event_name: "message_formatted",
            message: modifiedMessage,
            status: "success",
            username: "sentence-capitalizer",
            channel_id, // Ensure message stays in the same channel
        });

        res.json({
            event_name: "message_formatted",
            message: modifiedMessage,
            status: "success",
            username: "sentence-capitalizer",
        });
    } catch (error) {
        console.error("Error modifying message:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// GET route to return integration JSON
app.get("/integration-json", (req, res) => {
    const integrationJSON = {
        "data": {
            "date": {
                "created_at": new Date().toISOString().split("T")[0],
                "updated_at": new Date().toISOString().split("T")[0]
            },
            "descriptions": {
                "app_description": "Automatically capitalizes the first letter of each sentence and ensures proper capitalization of 'i'.",
                "app_logo": "https://images.app.goo.gl/oP1zU4UTsj8sHVwH6",
                "app_name": "Sentence Capitalizer",
                "app_url": "https://hng12-stage3-telex-capitalizer-v1.onrender.com",
                "background_color": "#F5F5F5"
            },
            "integration_category": "Communication & Collaboration",
            "integration_type": "modifier",
            "is_active": true,
            "output": [
                {
                    "label": "output_channel_1",
                    "value": true
                }
            ],
            "key_features": [
                "Capitalizes the first letter of every sentence.",
                "Corrects standalone lowercase 'i' to 'I'.",
                "Ensures proper formatting for better readability.",
                "Lightweight and works seamlessly in Telex chats."
            ],
            "permissions": {
                "monitoring_user": {
                    "always_online": true,
                    "display_name": "Capitalization Monitor"
                }
            },
            "settings": [
                {
                    "label": "Enable Auto Capitalization",
                    "type": "checkbox",
                    "required": true,
                    "default": "Yes"
                },
                {
                    "label": "Fix lowercase 'i'",
                    "type": "checkbox",
                    "required": true,
                    "default": "Yes"
                },
                {
                    "label": "Preferred Language",
                    "type": "dropdown",
                    "required": false,
                    "default": "English",
                    "options": ["English", "French", "Spanish"]
                }
            ],
            "target_url": "https://hng12-stage3-telex-capitalizer-v1.onrender.com/modify-message"
        }
    };

    res.json(integrationJSON);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
