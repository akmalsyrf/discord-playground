require('dotenv').config()
const express = require('express')
const url = require('url')
const axios = require('axios')

const app = express()
const port = 3001
const { CLIENT_ID, CLIENT_SECRET } = process.env
const discord_base_url = 'https://discord.com/api/v10'

app.get('/', (_, res) => res.send("Hello world oauth"))

// you must setting oauth2 authorization on discord developer portal
app.get('/api/auth/discord/redirect', async (req, res) => {
    const { code } = req.query
    try {
        if (code) {
            const formData = new url.URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code.toString(),
                redirect_uri: 'http://localhost:3001/api/auth/discord/redirect'
            })
    
            const output = await axios.post(`${discord_base_url}/oauth2/token`,
                formData, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                },
            )
            if (output.data) {
                const accessToken = output.data.access_token
                const refreshToken = output.data.refresh_token
                const userInfo = await axios.get(`${discord_base_url}/users/@me`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                res.status(200).json(userInfo.data)
            }
        } else {
            res.status(404).json({ message: 'You must including code' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

app.use((_, res) => res.sendStatus(404))

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})