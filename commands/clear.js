module.exports = {
	name: 'clear',
	description: 'Clears all messages in channel.',
	async execute(message, args) {
		if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) return;
		await message.channel.messages.fetch({ limit: 100 }).then(messages => {
			message.channel.bulkDelete(messages);
		});
	}
};