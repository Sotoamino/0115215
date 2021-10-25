const { prefix } = require('../../config/botConfig.json');
const Discord = require('discord.js')
const fs = require('fs')

module.exports = {
	name: 'poll',
	description: 'Permet de créer des sondages.',
	aliases: [],
	usage: '`[setChannel]` => définir le salon des sondages. \n`[create] [Nom Du Sondage] :: [contenu du sondage]` => Créer un sondage.',
	args: true,
	guildOnly : true,
	hide: false,
	cooldown: 5,
	execute(message, args) {
		if(!message.guild.members.cache.find(user => user.id === message.author.id).permissions.has('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'éxecuter cette commande.")
		if(!fs.existsSync(`./data/${message.guild.id}.json`)) {
			console.log("ok")
			let data = {
				poll : {
					channel : ""
				},
				suggestion : {
					channel : ""
				}
			}
			fs.writeFileSync(`./data/${message.guild.id}.json`, JSON.stringify(data))
		}
		const config = JSON.parse(fs.readFileSync(`./data/${message.guild.id}.json`))

		if(args[0] === "create") {
			if(!config.poll.channel) return message.channel.send('Erreur, vous devez d\'abord définir un salon pour les sondages `+poll setChannel` dans le salon en question.')
			args.shift()
			let nArgs = args.join(' ').split('::')
			const embed = new Discord.MessageEmbed()
				.setTitle('SONDAGE - '+nArgs[0])
				if(nArgs[1]) {
					embed.setDescription(nArgs[1])
				}
				embed.setColor('#ffa300')
				.setFooter('©Sotoamino Dev - MIT Licensed')


			const channel = message.guild.channels.cache.find(ch => ch.id === config.poll.channel)
			if(!channel) return message.channel.send('Erreur, le salon n\'a pas été trouvé.')
			channel.send({ embeds: [embed] }).then(msg => {
				msg.react('✅')
				msg.react('❎')
			})
		}

		if(args[0] === "setChannel") {
			const config = JSON.parse(fs.readFileSync(`./data/${message.guild.id}.json`))
			config.poll.channel = message.channel.id
			console.log(config)
			message.channel.send(`Sondages définis dans le salon <#${message.channel.id}> (${message.channel.id}).`)
			fs.writeFileSync(`./data/${message.guild.id}.json`, JSON.stringify(config))

		}
	},
};