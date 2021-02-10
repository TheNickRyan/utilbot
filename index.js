/* Bot Requirements */
const { commandPrefix, token } = require('./config.json');
const { domainWhitelist } = require('./config.json');
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

//build urlEXP regexp out of whitelisted domains from config.json
let urlExp = '(\?\:[a-zA-Z0-9]+\\.(\?\:';
Object.values(domainWhitelist).forEach(domain => {
	if (domain === '-') {
		urlExp = new RegExp(`${urlExp}xyz)\\S*)`);
		return;
	}
	urlExp += `${domain}|`;
});

/* Client Ready */
client.on('ready', () => {

	//log what servers the bot is on
	console.log('UtiliT has been initialized.');

});

/* Message Handler */
client.on('message', message => {

	console.log(`Reading message from ${message.author.username}...`);

	//return if bot is message author
	if (message.author.bot) return; 

	//handle message that is a link for url shortener
	const reg = new RegExp(urlExp);
	if (reg.test(message.content.toLowerCase())) {
		console.log('Found URL - Executing command:', 'url');
		client.commands.get('url').execute(message, reg.exec(message.content.toLowerCase()), reg);
	}

	//return if message has no command prefix
	if (!message.content.startsWith(commandPrefix)) return;
	
	//retrieve command from message
	const command = message.content.slice(commandPrefix.length)
		.trim()
		.split(/ +/)
		.shift()
		.toLowerCase();

	//return if command does not exist
	if (!client.commands.has(command)) return;

	//try-catch to execute command
	try { 
		console.log(`${message.author.username} - Executing command:`, command);
		client.commands.get(command).execute(message);
	} catch (err) {
		console.error(err);
		message.reply('There was an error executing that command.');
	}
});

/* Client Login */
client.login(token);