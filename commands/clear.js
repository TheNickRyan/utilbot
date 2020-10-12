module.exports = {
	name: 'clear',
	description: 'Clears the last 100 messages in a channel.',
	async execute(message) {
		if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) return;
		await message.channel.messages.fetch({ limit: 100 }).then(messages => {
			message.channel.bulkDelete(messages);
		});
	}
};