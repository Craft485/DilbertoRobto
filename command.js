const { Message, MessageEmbed } = require('discord.js')
require('colors')
const axios = require('axios')
const parser = require('cheerio')
const config = require('./config')

module.exports = {
    /**
     * @param {String} html
     */
    parseHTMLData: (html) => {
        let data = []
        const $ = parser.load(html)
        // Via the cherrio API, get every comic that loads on the page
        $('img.img-comic').each((i, elem) => {
            data.push({
                image: "https:" + $(elem).attr("src"),
                title: $(elem).attr("alt").split("-")[0].trim()
            })
        })
        return data
    },
    /**
     * @param {Message} msg 
     * @param {String} url 
     */
    dilbert: function (msg, url) {
        axios.get(url, { headers: { 'User-Agent': config.userAgent } })
        .then( async response => {
            let imgData = await this.parseHTMLData(response.data)
            // From all the images scraped, get a random one
            let e = imgData[Math.floor(Math.random() * imgData.length)]
            // If there is no image
            if (!e.image) {
                msg.channel.send("Could not find any comics with the giving list of search terms")
                console.log(`Image undefined`.yellow)
                return
            }
            console.log(`${e.image}`.blue)
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
    /**
     * @param {Message} msg 
     */
    info: function (msg) {
        msg.channel.send(`Use ${config.prefix}dilbert to view a random Dilbert comic.`)
    }
}