const Discord = require('discord.js');

module.exports = {
	name: 'troll-ignite',
	description: 'Join Troll Bot to voice channel',
	args: false,
	async execute(message, args) {
        console.log('troll-ignite was called');

        let connection;

        // Join the same voice channel of the author of the message
        // Cannot join if message author is not in a voice channel
        if (message.member.voice.channel) {
            connection = await message.member.voice.channel.join();
            const dispatcher = connection.play('troll_audio.opus');
        }
	},
};

