const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// When someone goes to /checkfollowing
app.get('/checkfollowing', async (req, res) => {
    const { userid, targetid } = req.query;

    // Error if missing parameters
    if (!userid || !targetid) {
        return res.status(400).json({ error: 'Missing userid or targetid' });
    }

    try {
        // Call Roblox API
        const response = await axios.get(`https://friends.roblox.com/v1/users/${userid}/followings`);

        const following = response.data.data || [];
        const isFollowing = following.some(user => user.id.toString() === targetid);

        res.json({ isFollowing: isFollowing });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch followings' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
