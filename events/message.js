const config = require('../config.json');
const fs = require('fs');
module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        
        const PREFIX = config.prefix;
 
        //check if it's a bot
        if(message.author.bot) return

        //check if it's a command
        if(!message.content.toLowerCase().startsWith(PREFIX)) return
        const cmds = await fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        let cmdVerif = false;
        for (let file of cmds) {
            file = file.substring(0, file.length - 3)
            let cmd = message.content.toLowerCase();
            cmd = cmd.replace(PREFIX, '').trim().split(' ')
            if(cmd[0] === file) cmdVerif = true
        }
        if(!cmdVerif) return

        /*command start*/
        const args = message.content.slice(PREFIX.length).split(/ +/);
        const command = args.shift().toLowerCase();
        if(!client.commands.has(command)) return;
        client.commands.get(command).execute(message, args)
    }
}