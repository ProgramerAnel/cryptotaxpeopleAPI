if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser:true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to database !'))

app.use(express.json())
app.set('port', (process.env.PORT || 5000));


const logRouter = require('./routes/logs')
const licenceRouter = require('./routes/licences')
app.use('/logs', logRouter)
app.use(process.env.APP_MASTER_ROUTE_PATH + '/licence', licenceRouter)

app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, private server is listening on port ', app.get('port'));
});



// This runs discord bot 
const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })
  


var tools = require('./discord/listener');
client.on('message', tools.listener)
client.login(process.env.BOT_TOKEN)
// client.on('ready', () => {
//     console.log('Bot online !')
//     }
// )

client.on('ready', () => {
    console.log('Bot online !')
    client.channels.fetch("955718125083557938").then((channel) => {
        // const helpMessage = new MessageEmbed({
        //     title: "ONLINE!",
        //     color: "GREEN",
        //     description: `If I appear to be offline, visit [my page]('https://cryptotaxpeople.herokuapp.com/') to wake me up`
        // });
        (channel).send(`If I appear to be offline, visit 'https://cryptotaxpeople.herokuapp.com/' to wake me up`).catch((err) => {
            console.log("ERROR ON READY", err)
        })
    })
})
