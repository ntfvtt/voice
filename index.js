const express = require('express');
const axios = require('axios');
const { promisify } = require('util');
const { pipeline } = require('stream');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/generate', async (req, res) => {
    const apiKey = req.query.key;
    const prompt = req.query.prompt;

    if (!apiKey || !prompt) {
        return res.status(400).json({ error: "API key and prompt are required." });
    }

    if (apiKey === "sudiptoisgay") {
        try {
            const payload = {
                text: prompt,
            };

            const apiUrl = 'https://api.elevenlabs.io/v1/text-to-speech/zrHiDhphv9ZnVXBqCLjz';
            const apiKey = 'e3bc9b24bf7240186872e8285125f85a';

            const response = await axios.post(apiUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': apiKey,
                },
                responseType: 'stream',
            });

            res.setHeader('Content-Type', 'audio/mpeg');

            // Pipe the audio stream directly to the response object
            pipeline(response.data, res, (err) => {
                if (err) {
                    console.error('Pipeline failed', err);
                    res.status(500).json({ error: "Failed to process audio stream." });
                }
            });
        } catch (error) {
            res.status(500).json({ error: `Error processing response: ${error.message}` });
        }
    } else {
        res.status(401).json({ error: "Access denied! Invalid API key." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
