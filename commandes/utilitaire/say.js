const { prefix } = require('../../config/botConfig.json');
const Discord = require('discord.js')

module.exports = {
	name: 'say',
	description: 'Permet de faire envoyer au bot un certains messages.',
	aliases: ['dit'],
	usage: '[message]',
	args: true,
	guildOnly : false,
	hide: false,
	cooldown: 5,
	execute(message, args) {

		message.channel.send(args.join(' '))
	},
};