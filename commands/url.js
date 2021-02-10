const Discord = require('discord.js');
const http = require('http');
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
			.then( status => {
				console.log(status);
				urlShortener.short(fullUrl, (e, shortUrl) => {
					embed.setDescription(message.content.split(regex).join(shortUrl));
					console.log(`Shortened ${message.author.username}\'s URL from ${fullUrl} to ${shortUrl}.`);

					//send the message with the shortened url/404 error
					console.log('URL function complete.');
					message.channel.send(embed)
						.then(() => message.delete())
						.catch(e => console.error('Message failed to send.', e));
				});
			}, e => { console.log('Failed to ping.', e); return; })
		.catch(() => embed.setDescription('ERROR 404\: Server not found.'));
	}
};