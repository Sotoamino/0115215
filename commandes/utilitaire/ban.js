const { prefix } = require('../../config/botConfig.json');
const Discord = require('discord.js')

module.exports = {
	name: 'ban',
	description: 'Permet de faire envoyer au bot un certains messages.',
	aliases: [],
	usage: '[utilisateur] [raison]',
	args: true,
	guildOnly : false,
	hide: false,
	cooldown: 5,
	execute(message, args) {
        if(!message.guild.members.cache.find(user => user.id === message.author.id).permissions.has('BAN_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'éxecuter cette commande.")

        const user = message.mentions.users.first()
        args.shift()
        let reason = args.join(" ")
        
        if(reason === "") {
            reason = "Pas de raison spécifié"
        }

        const embed2 = new Discord.MessageEmbed()
            .setTitle('Banissement')
            .setDescription(`Vous avez été banni par ${message.author.username} du serveur ${message.guild.name} pour la raison suivante : \n\n${reason}`)
            .setColor('#ff0000')
            .setFooter('©Sotoamino Dev - MIT Licensed')


        const embed1 = new Discord.MessageEmbed()
            .setTitle('Banissement')
            .setDescription(`${user.username} a été banni par ${message.author.username} du serveur ${message.guild.name} pour la raison suivante : \n\n${reason}`)
            .setColor('#ff0000')
            .setFooter('©Sotoamino Dev - MIT Licensed')
  

            message.channel.send({embeds : [embed1]})

            user.send({embeds : [embed2]})
	},
};