// fs is Node's native file system module
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('../config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();


client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	// Don't accept messages from bots
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	// Strip prefix from command. Store command and args in array
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const argsString = message.content.slice(prefix.length);
	console.log(typeof(args));
	// Pop the command off of the front of the array
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);

	// Must have arguments if command expects args, I think
	if (command.args && !args.length) {
		return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	// Logic to timegate command calls by users
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	// if you don't supply in command file, it'll default to 3
	const cooldownAmount = (command.cooldown || 3) * 1000;

	// User has already called command too recently
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	// User is allowed to run command. Added to timestamps so they can't run again till cooldown has passed
	timestamps.set(message.author.id, now);
	// Remove user from timestamps after cooldown has passed
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		// Execute the command
		command.execute(message, argsString);
	}
	catch (error) {
		console.log(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(token);