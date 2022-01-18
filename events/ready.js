const config = require('../config.json');
module.exports = {
    name: 'ready',
    async execute(client){

        //console.log stats
        console.log(`≫ ${client.user.username}`)
        console.log(`≫ Prefix: ${config.prefix}`)
        console.log(`≫ ${client.guilds.cache.size} servers`)

    }
}