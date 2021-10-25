const { prefix } = require('../../config/botConfig.json');
const Discord = require('discord.js')
const fs = require('fs');

function isHexColor (hex) {
    return  hex.length === 7
        && hex.startsWith("#")
  }

module.exports = {
	name: 'embed',
	description: 'Permet d\'envoyer un embed à partir de son code JSON',
	aliases: [],
	usage: '[Paramètre] {info}',
	args: true,
	guildOnly : false,
	hide: false,
	cooldown: 3,
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
				},
                embed : {}
			}
			fs.writeFileSync(`./data/${message.guild.id}.json`, JSON.stringify(data))
		}

		const config = JSON.parse(fs.readFileSync(`./data/${message.guild.id}.json`))
        const param = args.shift()

        if(!config.embed) {
            config.embed = {}
            console.log(config)
        }
        else if(param === "reset") {
            config.embed = {}
            console.log(config)
            message.channel.send("L'embed a été réinitialisé.")
        }
        else if(param === "titre") {
            config.embed.title = args.join(" ")
        }
        else if(param === "description") {
            config.embed.description = args.join(" ")
        }
        else if(param === "couleur") {
            if(!isHexColor(args.join(" "))) return message.channel.send('Mauvais format. Utilisez de l\'héxadécimal.')
            config.embed.color = args.join(" ")
        }
        else if(param === "author") {
            if(!message.mentions.users.first()) {
                config.embed.author = {name : message.author.username, iconURL : message.author.avatarURL()}
            } else {
                const user = message.mentions.users.first()
                config.embed.author = {name : user.username, iconURL : user.avatarURL()}

            }
        }
        else if(param === "addField") {
            let nArgs = args.join(' ').split('::')
            if(!config.embed.fields) {
                config.embed.fields = []
            }
            config.embed.fields.push({name : nArgs[0], value : nArgs[1]})
        }
        else if(param === "send") {
            if(!config.embed.title && !config.embed.description) return message.channel.send('Un titre et une description sont obligatoire pour envoyer un embed.')
            const embed = new Discord.MessageEmbed(config.embed)
            message.channel.send({embeds : [embed]})
        }
        else if (param == 'thumbnail') {
            console.log(message.attachments)
            const image = message.attachments.first()
            console.log(image)
                if(!image) return message.channel.send("Aucune image jointe. Veuillez joindre une image.")
                if(!image.contentType.startsWith('image/')) return message.channel.send('Erreur de fichier, veuillez joindre une image.')
            config.embed.thumbnail = {url : image.url, proxyURL : image.proxyURL, height : image.heght, width : image.width}
        }
        else if (param == 'image') {
            console.log(message.attachments)
            const image = message.attachments.first()
            console.log(image)
                if(!image) return message.channel.send("Aucune image jointe. Veuillez joindre une image.")
                if(!image.contentType.startsWith('image/')) return message.channel.send('Erreur de fichier, veuillez joindre une image.')
            config.embed.image = {url : image.url, proxyURL : image.proxyURL, height : image.heght, width : image.width}
        }
        else if(param === "help" || param === "aide") {
            const embed = new Discord.MessageEmbed()
                .setTitle("Aide - Création d'Embed.")
                .setDescription('Liste des options de cette commande :')
                .setColor('DARK_ORANGE')
                .addFields([
                    {name : "reset", value : "`+embed reset`\nRéinitialisez l'embed actuellement paramétré"},
                    {name : "titre", value : "`+embed titre Le titre de votre embed`\nDéfinissez le titre de l'embed."},
                    {name : "description", value : "`+embed description La description de votre embed`\nDéfinissez la description de votre embed"},
                    {name : "couleur", value : "`+embed couleur #ffffff`\nDéfinissez la couleur de l'embed (au format héxadécimal)"},
                    {name : "author", value : "`+embed author {@utilisateur}`\nDéfinissez l'author de l'embed (ne pas mentionner pour se mettre en author)"},
                    {name : "addField", value : "`+embed addField Le titre :: le contenu`\n Ajoutez un field à votre embed."},
                    {name : "send", value : "Envoyez l'embed que vous paramétrez."},
                    {name : "thumbnail", value : "`+embed thumbnail` Ajouter la pièce jointe (image) en tant que thumbnail."},
                    {name : "image", value : "`+embed image` Ajouter la pièce jointe (image) en tant qu'image'."},
                    {name : '\u200b', value : "\u200b"},
                ])
                .setFooter('©Sotoamino Dev - MIT Licensed')
            message.channel.send({embeds : [embed]})
        }
        else return message.channel.send(`Le paramètre ${param} est invalide. Regardez via la commande \`+embed help\`.`)
        console.log(config)
        fs.writeFileSync(`./data/${message.guild.id}.json`, JSON.stringify(config))
	},
};