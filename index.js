const express = require('express');
const axios = require('axios');
const { pipeline } = require('stream');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

// Hardcoded API key
const apiKey = '765ff544a7378394b1434d6ca54ab24a';

app.get('/generate', async (req, res) => {
    const prompt = req.query.prompt;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
    }

    try {
        const payload = {
            text: prompt,
        };

        const apiUrl = 'https://api.elevenlabs.io/v1/text-to-speech/zrHiDhphv9ZnVXBqCLjz';

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
        if (error.response && error.response.status === 401) {
            res.status(401).json({ error: "Access denied! Invalid API key." });
        } else {
            res.status(500).json({ error: `Error processing response: ${error.message}` });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
