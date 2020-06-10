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
            const t = searchTerms[Math.floor(Math.random() * searchTerms.length)]
            const url = t === "base" ? baseurl :`${baseurl}search_results?terms=${t}`
            console.log(`${url}`.cyan)
            commands.dilbert(msg, url)
        } else if (msg.content.substr(1).startsWith('info')) {
            commands.info(msg)
        }
    } else if (msg.mentions.users.has(client.user.username)) {
        console.log(`${msg.author.username} => ${msg.content}`.magenta)
    }
})

client.login(config.token)