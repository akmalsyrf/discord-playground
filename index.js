const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once('ready', () => {
  console.log(`Bot ${client.user.tag} telah aktif`);
});

client.on('guildMembersChunk', (members) => {
    // Do something with the list of members, e.g., filter by channel
    const channelId = 'your_channel_id';
    const followers = members.filter(member => member.voice.channel?.id === channelId);
  
    // Log the names of followers
    for (const follower of followers) {
      console.log(follower.user.tag);
    }
  });

client.login(process.env.BOT_TOKEN);