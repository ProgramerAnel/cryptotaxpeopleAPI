const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })
const sql = require("mssql");
const { MessageEmbed } = require('discord.js');

const config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER,
    port: process.env.SQL_PORT,
    database: process.env.SQL_DATABASE_NAME,
    options: {
        encrypt: false,
        instanceName: process.env.SQL_INSTANCENAME
    }
};

const PREFIX_COMMAND = "!"

// CODE FOR DISCORD BOT 
async function listener(msg){
    if (msg.content.includes(PREFIX_COMMAND)) {
        value = msg.content.split(PREFIX_COMMAND)[1]
        console.log('Validating request:', value)
        msg.reply('Validating for ' + value);
        (async function () {
            try {

                let pool = await sql.connect(config)
                let result1 = await pool.request()
                    .input('input_parameter', sql.NVarChar, value)
                    .query('select Mercari_price,POSHMARK_PRICE,Title,Price,isnull(Active,0) Active,ActiveEtsy,ActivePoshmark,activemercari,POSHMARK_LINK,MERCARI_LINK,SPECIFICS_JSON,ebay_id,(select top 1 PICTURE_PATH from ACTIVE_ITEMS_PICTURES where ACTIVE_ITEMS_PICTURES.ACTIVE_ITEMS_ID = ACTIVE_ITEMS.ID) IMG from Active_Items where SKU = @input_parameter')


                if (result1.recordset[0] != undefined) {
                    var specifics = result1.recordset[0].SPECIFICS_JSON.replace("|}", '').replace('{', ''), i
                    specifics = specifics.split('|')
                    output = ''

                    for (i = 0; i < specifics.length; i++) {
                        output += specifics[i].split(':')[0] + ":" + specifics[i].split(':')[1] + '\n'
                    }

                    if (result1.recordset[0].Active == 1) {
                        _state = "@AVAILABLE"
                        _img = 'https://vwoccasion.co.uk/wp-content/uploads/2017/01/bright-green-square-300x300.jpg'
                    } else {
                        _state = "@UNAVAILABLE"
                        _img = 'https://m.media-amazon.com/images/I/21TPpHn1xRL.jpg'
                    }

                    const exampleEmbed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(result1.recordset[0].Title)
                        .setURL('https://www.ebay.com/itm/' + result1.recordset[0].ebay_id)
                        .setAuthor(_state, _img, 'https://discord.js.org')
                        .setDescription(output)
                        .setThumbnail(result1.recordset[0].IMG)
                        .addFields(
                            { name: 'Price [Ebay]', value: result1.recordset[0].Price, inline: true },
                            { name: 'Price [Poshmark]', value: result1.recordset[0].POSHMARK_PRICE, inline: true },
                            { name: 'Price [Mercari]', value: result1.recordset[0].Mercari_price, inline: true }
                        )
                        .setTimestamp()
                        .setFooter('Bot by programerAnel@gmail.com', 'https://i.imgur.com/wSTFkRM.png');

                    msg.reply(exampleEmbed)
                }
                else {
                    msg.reply("Item not found.")
                }
            } catch (err) {
                console.log(err)
            }
        })()

        sql.on('error', err => {
            console.log(err)
        })
    }
}

module.exports = {
    listener:listener
}