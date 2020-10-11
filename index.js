/* Bot Requirements */
const { commandPrefix, token } = require('./config.json');
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

//create commands collection from ./commands folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.commands = new Discord.Collection();


for (const file of commandFiles) {

	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);

}

/* Client Ready */
client.once('ready', () => {

	//log what servers the bot is on
	console.log('Listening to ' + client.guilds); 

});

/* Message Handler */
client.on('message', message => {

	//return if message has no prefix or if bot is message author
	if (!message.content.startsWith(commandPrefix) || message.author.bot) return; 
	
	//retrieve command from message
	const command = message.content.slice(commandPrefix.length)
		.trim()
		.split(/ +/)
		.shift()
		.toLowerCase();

	//return if command does not exist
	if (!client.commands.has(command)) return;

	//try-catch to execute command
	try { client.commands.get(command).execute(message, args); } catch (err) {
		console.error(err);
		message.reply('There was an error executing that command.');
	}
});

/* Client Login */
client.login(token);