const { prefix } = require('../../config/botConfig.json');
const Discord = require('discord.js')
const fs = require('fs')

module.exports = {
	name: 'suggestion',
	description: 'Permet de proposer une suggestion.',
	aliases: ["su"],
	usage: '`[setChannel]` => définir le salon des sondages. \n`[votre suggestion]` => Créez une suggestion.',
	args: true,
	guildOnly : true,
	hide: false,
	cooldown: 5,
	execute(message, args) {
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

		

		if(args[0] === "setChannel") {
            if(!message.guild.members.cache.find(user => user.id === message.author.id).permissions.has('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'éxecuter cette commande.")
			const config = JSON.parse(fs.readFileSync(`./data/${message.guild.id}.json`))
			config.suggestion.channel = message.channel.id
			console.log(config)
			message.channel.send(`Suggestions définis dans le salon <#${message.channel.id}> (${message.channel.id}).`)
			fs.writeFileSync(`./data/${message.guild.id}.json`, JSON.stringify(config))
		}
        else {
			if(!config.suggestion.channel) return message.channel.send('Erreur, l\'administrateur du serveur doit définir un salon => `+suggestion setChannel` dans le salon en question.')
			const embed = new Discord.MessageEmbed()
				.setTitle(`Suggestion de ${message.author.username}`)
                embed.setDescription("Participez, votez ci-dessous avec les réactions \n\n"+args.join(" "))
				embed.setColor('#ffa300')
				.setFooter('©Sotoamino Dev - MIT Licensed')


			const channel = message.guild.channels.cache.find(ch => ch.id === config.suggestion.channel)
			if(!channel) return message.channel.send('Erreur, le salon n\'a pas été trouvé.')
			channel.send({ embeds: [embed] }).then(msg => {
				msg.react('✅')
				msg.react('❎')
			})
		}
	},
};