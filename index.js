const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

app.get('/', async (req, res) => {
    const { userid } = req.query;

    if (!userid) {
        return res.status(400).json({ error: 'Missing userid' });
    }

    try {
        let cursor = null;
        let followingIds = [];

        do {
            await delay(500);

            const url = `https://friends.roblox.com/v1/users/${userid}/followings?limit=100${cursor ? `&cursor=${cursor}` : ''}`;
            const response = await axios.get(url);

            const following = response.data.data || [];
            following.forEach(user => {
                followingIds.push(user.id);
            });

            cursor = response.data.nextPageCursor;
        } while (cursor);

        res.json({ followingIds });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch followings' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
