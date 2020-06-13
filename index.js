const { Client, Message } = require('discord.js')
// Used as an extension of String.prototype
require('colors')
const axios = require('axios')
const cheerio = require('cheerio')
const commands = require('./command')
const config = require('./config')
const client = new Client({presence:{status:"online"}})
const baseurl = "https://dilbert.com/"
const searchTerms = [
    "base", "online", "Dilbert", "Catbert", "Wally",
    "Alice", "Asok", "Carol", "Ratbert", "Ted", "Tina",
    "Phil", "Topper", "Boss", "Garbageman", "Bob%20Dinosaur"
]

client.on('ready', () => {
    console.log(`${client.user.username}`.green)
})
/**
 * @param {Message} msg
 */
client.on('message', (msg) => {
    if (msg.author.bot) {
        return
    } else if (msg.content.startsWith(config.prefix)) {
        // With only 2 commands I see no reason to have a seperate method for parsing which command is called
        if (msg.content.substr(config.prefix.length).startsWith('dilbert')) {
            // Was a specific keyword used
            let terms = ""
            for (i in msg.content.substr(config.prefix.length+7).trim().split(" ")) {
                terms += `${msg.content.substr(config.prefix.length+7).trim().split(" ")[i]}+`
            }
            // If no keywords were specified, select a random one
            terms.length === 0 ? terms = searchTerms[Math.floor(Math.random() * searchTerms.length)] : null
            // If the search term returns base then select from the homepage, if not append the search query
            const url = terms === "base" ? baseurl :`${baseurl}search_results?terms=${terms}`
            console.log(`${url}`.cyan)
            commands.dilbert(msg, url)
        } else if (msg.content.substr(1).startsWith('info')) {
            commands.info(msg)
        }
    }
})

client.login(config.token)