const { Client, Message } = require('discord.js')
// Used as an extension of String.prototype
const {} = require('colors')
const axios = require('axios')
const cheerio = require('cheerio')
const commands = require('./command')
const config = require('./config')
const client = new Client({presence:{status:"online"}})
const baseurl = "https://dilbert.com/"
const searchTerms = ["base", "online", "Dilbert"]

client.on('ready', () => {
    console.log(`${client.user.username}`.green)
})

client.on('message', (msg = new Message) => {
    if (msg.author.bot) {
        return
    } else if (msg.content.startsWith(config.prefix)) {
        // With only 2 commands I see no reason to have a seperate method for parsing which command is called
        if (msg.content.substr(1).startsWith('dilbert')) {
            // Get a random search term
            const t = searchTerms[Math.floor(Math.random() * searchTerms.length)]
            // If the search term returns base then select from the homepage, if not append the search query
            const url = t === "base" ? baseurl :`${baseurl}search_results?terms=${t}`
            console.log(`${url}`.cyan)
            commands.dilbert(msg, url)
        } else if (msg.content.substr(1).startsWith('info')) {
            commands.info(msg)
        }
    }
})

client.login(config.token)