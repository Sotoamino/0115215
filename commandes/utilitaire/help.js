const { prefix } = require('../../config/botConfig.json');
const Discord = require('discord.js')

module.exports = {
	name: 'help',
	description: 'Liste de toutes les commandes ou information sur une commande spécifique.',
	aliases: ['aide'],
	usage: '{commande}',
	args: false,
	guildOnly : false,
	hide: false,
	cooldown: 5,
	execute(message, args) {
		const data = [];
		const { commands } = message.client;
		let commandList = new Discord.Collection();
		for (const commande of commands) {
			if (!commande[1].hide) {
				if (commande[1].permissions) {
					if(message.channel.type !== "dm") {
						const authorPerms = message.channel.permissionsFor(message.author);
						if (authorPerms && authorPerms.has(commande[1].permissions)) {
							commandList.set(commande[1].name, commande[1])
						}
					}
				} else {
					commandList.set(commande[1].name, commande[1])
				}
			}
		}
        let listCommande = []
        commandList.forEach(element => {
            listCommande.push(`**${element.name}**\n${element.description}`)
        });
		if (!args.length) {
			const embed = new Discord.MessageEmbed()
				.setTitle('Liste des commandes :')
				.setColor('#ff0000')
				.setDescription(`${listCommande.join('\n\n')}\n\nVous pouvez faire \`${prefix}help [commande]\` pour récupérer des informations sur une commande spécifique!`)
                .setFooter('©Sotoamino Dev - MIT Licensed')

			return message.channel.send({ embeds: [embed] })
			.then(msg => {
				setTimeout(() => {  
					msg.delete()
				},60000)
			})
				.catch(error => {
					console.error(`Impossible d'envoyer un DM à ${message.author.tag}.\n`, error);
					message.channel.send('Il semblerait que je ne puisse vous envoyer de messages privés!');
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('Cette commande n\'est pas valide!');
		}
		const embed = new Discord.MessageEmbed()
		.setTitle(`**Commande:** ${command.name}`)
		.setColor('#ff0000')
		.setFooter('©Sotoamino Dev - MIT Licensed')
		if (command.aliases) embed.addField(`**Alias:**`,`${command.aliases.join(', ')}`);
		if (command.description)embed.addField(`**Description:**`,`${command.description}`);
		if (command.usage) embed.addField(`**Usage:**`,`${prefix}${command.name} ${command.usage}`);

		embed.addField(`**Cooldown:**`,`${command.cooldown || 3} seconde(s)`);

		message.channel.send({ embeds: [embed] }).then(msg => {
			setTimeout(() => {  
				msg.delete()
			},60000)
		});
	},
};