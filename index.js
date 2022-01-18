const {Client, Collection} = require('discord.js');
const config = require('./config.json');
const fs = require('fs');
const client = new Client({
    intents: [
		'GUILDS', 
		'GUILD_MEMBERS', 
		'GUILD_MESSAGES', 
		'GUILD_MESSAGE_REACTIONS', 
		'DIRECT_MESSAGES', 
		'DIRECT_MESSAGE_REACTIONS', 
		'DIRECT_MESSAGE_TYPING', 
		'GUILD_BANS', 
		'GUILD_INTEGRATIONS', 
		'GUILD_INVITES', 
		'GUILD_PRESENCES'
	]
})

client.commands = new Collection();
const commandsFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
/*commands*/
for(const file of commandsFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command)
}

/*events*/
for(const file of eventFiles) {
	const event = require(`./events/${file}`);
	if(event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

client.login(config.token)