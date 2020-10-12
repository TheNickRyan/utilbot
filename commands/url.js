const Discord = require('discord.js');
const ping = require('node-http-ping');
const urlShortener = require('node-url-shortener');

module.exports = {
	name: 'url',
	description: 'Shorten any given URL using TinyURL.',
	async execute(message, url, regex) {
		if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) return;

		console.log('Shortening Url...');
		console.log(regex.exec(url));
		const fullUrl = 'http\:\/\/' + regex.exec(url);
		const embed = new Discord.MessageEmbed().setTitle(message.author.username);

		//ping the url, set the message to the url or 404 is not found
		await ping(fullUrl)
		.then(urlShortener.short(fullUrl, (err, shortUrl) => { 
			embed.setDescription(message.content.split(regex).join(shortUrl));
			console.log(`Shortened ${message.author.username}\'s URL from ${fullUrl} to ${shortUrl}.`); 

			//send the message with the shortened url/404 error
			message.channel.send(embed)
				.then(() => { 
					message.delete();
					console.log('URL function complete.'); 
				})
				.catch(e => console.error('Message failed to send.', e));
		}))
		.catch(() => { embed.setDescription('ERROR 404\: Server not found.') });
	}
};