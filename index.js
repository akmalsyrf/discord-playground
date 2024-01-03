require('dotenv').config()
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express')
const app = express()
const port = 3000

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once('ready', () => {
  console.log(`Bot ${client.user.tag} telah aktif`);
});

client.login(process.env.BOT_TOKEN)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (_, res) => res.send("Hello world"))

app.get('/followers', async (req, res) => {
  try {
    const guildId = '865122839047831552';
    const channelId = '865122839047831555';

    const guild = await client.guilds.fetch(guildId);
    const channel = guild.channels.cache.get(channelId);

    if (channel) {
      const followers = await channel.guild.members.fetch();
      const followersList = followers.map(member => member.user.tag);
      res.json({ followers: followersList });
    } else {
      res.status(404).json({ message: 'Channel not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/check-follower/:username', async (req, res) => {
  try {
    const guildId = '865122839047831552';
    const channelId = '865122839047831555';
    const usernameToCheck = req.params.username;

    const guild = await client.guilds.fetch(guildId);
    const channel = guild.channels.cache.get(channelId);

    if (channel) {
      const member = await channel.guild.members.fetch({ query: usernameToCheck, limit: 1 });
      
      if (member.size > 0) {
        res.json({ message: `${usernameToCheck} is following the channel` });
      } else {
        res.json({ message: `${usernameToCheck} is not following the channel` });
      }
    } else {
      res.status(404).json({ message: 'Channel not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.use((_, res) => res.sendStatus(404))

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})