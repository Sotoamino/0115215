const discord = require('discord.js');
const fs = require('fs')
console.log('librairies chargés')

const client = new discord.Client({ intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES] })
const Bdata = JSON.parse(fs.readFileSync('./config/botConfig.json'))

client.login(Bdata.token);

client.commands = new discord.Collection();
client.cooldowns = new discord.Collection();

const commandFolders = fs.readdirSync('./commandes');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commandes/${folder}`).filter(file => file.endsWith('.js'));
	console.log(`commandes de ${folder}`)
	for (const file of commandFiles) {
		const command = require(`./commandes/${folder}/${file}`);
		console.log(`- ${command.name} chargée.`)
		client.commands.set(command.name, command);
		console.log(`- ${command.name} initialisée.`)
	}
}
console.log("!! fin du préchargement")
client.on('ready', () => {
    console.log("!! fin du chargement")
	console.log(`Bot lancé sur ${client.user.username} [${client.user.id}]`)
})

const prefix = Bdata.prefix

client.on('messageCreate', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('Je ne peux pas éxecuter cette commande dans les MP');
	}

	if (command.permissions) {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms || !authorPerms.has(command.permissions)) {
			return message.reply('Vous n\'avez pas la permission de faire ça.');
		}
	}

	if (command.args && !args.length) {
		let reply = `Vous n'avez pas fourni d'arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nLe bon usage est : \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	const { cooldowns } = client;

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`Veuillez attendre ${timeLeft.toFixed(1)} secondes avant de faire la commande \`${command.name}\`.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
		message.delete()
	} catch (error) {
		console.error(error);
		message.reply('Une erreur est survenue');
	}
});