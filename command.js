const { Message, MessageEmbed, MessageAttachment } = require('discord.js')
const colors = require('colors')
const axios = require('axios')
const parser = require('cheerio')
const config = require('./config')

module.exports = {
    parseHTMLData: (html) => {
        data = []
        const $ = parser.load(html) 
        // Via the cherrio API, get every comic that loads on the page
        $('img.img-comic').each((i, elem) => {
            data.push({
                image: "https:" + $(elem).attr("src"), //.substr(2).trim()
                title: $(elem).attr("alt").split("-")[0].trim()
            })
        })
        return data
    },
    dilbert: function (msg = new Message, url = new String) {
        axios.get(url)
        .then( async response => {
            let imgData = await this.parseHTMLData(response.data)
            // From all the images scraped, get a random one
            let e = imgData[Math.floor(Math.random() * imgData.length)]
            console.log(e.image)
            // Create an message embed with the comic
            let embed = new MessageEmbed()
                .setAuthor("Scott Adams")
                .setColor("#cc0921")
                .setImage(e.image)
                .setFooter(e.title)
            msg.channel.send(embed)
        })
        .catch(err => {
            msg.reply("There was an error fetching request data")
            console.error(`${err}`.red)
        })
    },
    info: function (msg = new Message) {
        msg.channel.send(`Use ${config.prefix}dilbert to view a random Dilbert comic.`)
    }
}