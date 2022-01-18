const Discord = require('discord.js');
const config = require('../config.json');
const PREFIX = config.prefix;
const DATE = new Date();
module.exports = {
    name: 'send',
    description: "send a message or ads at all players who are in the server",
    exemple: `${PREFIX}send`,
    async execute(message, args) {

        const member = message.member;
        let countOfBlock = 0;
        let countOfSend  = 0;
        let countOfBot   = 0;
        let countTotal   = 0;

        //try to send message
        try{

            //check if the members has permission for execute this command & if there are ads
            if(!member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return message.channel.send(`You don't have the permission.`)
            if(!args[0]) return message.channel.send(`You have not defined a message.`)

            //wait for validation
            const msg = message.content.toLowerCase().replace(`${PREFIX}send`, '').trim();

            e = new Discord.MessageEmbed()
            .setTitle(`✔ Validation`)
            .setColor(`#ff8800`)
            .addField(
                `use ✔ or ❌ to send your message.`,
                `${msg}`,
                true
            )
            let waitMessage = await message.channel.send({embeds: [e] })
            waitMessage.react('✔')
            .then(waitMessage.react('❌'))

            //start collector of react
            const collector = waitMessage.createReactionCollector({time: 5 * 60 * 1000});
            collector.on('collect', async(reaction, user) => {

                if(member.id === user.id){
                    if(reaction.emoji.name === '✔'){
                        e = new Discord.MessageEmbed()
                        .setColor(`#068c04`)
                        .addField(
                            `✔ Your message has been validated and is being sent.`,
                            `** **`
                        )
                        await waitMessage.edit({ embeds: [e] })
                        await reaction.message.reactions.removeAll()

                        //send loading message -> futur stats message
                        e = new Discord.MessageEmbed()
                        .setColor(`#ff8800`)
                        .setTitle(`💤  order in progress`)
                        let m = await message.channel.send({ embeds: [e] })

                        //send ads/message
                        const members = await message.guild.members.fetch();
                        try{
                            members.forEach(async(member) => {

                                countTotal++
                                try{

                                    if(member.user.bot == true) countOfBot++
                                    else {
                                        await message.guild.members.cache.get(member.id).send(msg)
                                        .then(countOfSend++)
                                    }
                                
                                } catch(err){
                                    countOfBlock++
                                }

                            });
                        } catch(err){
                            console.log(err)
                        }

                        //edit message with stats
                        e = new Discord.MessageEmbed()
                        .setColor(`#068c04`)
                        .addField(
                            `❕ Stats of **${member.user.username}**'s message`,
                            `🌐 Total Members: ${countTotal}\n🚀 Sent message: ${countOfSend}\n🤖 Bot: ${countOfBot}\n🛑 Blocked messages: ${countOfBlock}`,
                            true
                        )
                        m.edit({ embeds: [e] })

                        } else if(reaction.emoji.name === '❌'){
                            e = new Discord.MessageEmbed()
                            .setColor(`#ff0015`)
                            .addField(
                                `❌ Your message has been canceled.`,
                                `** **`
                            )
                            await waitMessage.edit({ embeds: [e] })
                            await reaction.message.reactions.removeAll()
                        }
                    }

                })
            
        } catch(err){
            console.log(`\x1b[31m`, `≫ error on command test`)
            console.log(err)
        }

    }
}