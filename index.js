const TelegramBot = require('node-telegram-bot-api');
const db = require('quick.db')
const axios = require('axios')
var request = require('request');
var cheerio = require('cheerio');
const token = 'token';
function generatePassword() {
  var length = 8,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });



let links1 = []
let episodes = 0 ;
bot.on('message', (msg) => {
  episodes = 0 ;
  request(msg.text.toString(), function (err, resp, body) {
    $ = cheerio.load(body);
    links = $('a'); //jquery get all hyperlinks
    $(links).each(function (i, link) {
      if($(link).attr('href').includes('ouo')){
        links1.push(`✅ ${msg.from.username} sarrast.com link bypassed \n🔗 Link : `+ $(link).attr('href').split('=')[1])
      }
    });
    console.log(links1)
  
    bot.sendMessage(msg.chat.id, links1[episodes + links1.length -1] + `\n👓 Episode : ${episodes +1} \n visit code : ${generatePassword()}`, {
      "reply_markup": {
        inline_keyboard: [
          [
            {
              text: 'قسمت بعدی',
              callback_data: 'ne'
            }
          ]
        ]
      },
  
  
    }).catch((error) => {
    
      console.log(error.response.body.description); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
    });
 
  });


  //        bot.sendMessage(msg.chat.id, )
 
});
bot.on("callback_query",async function onCallbackQuery(callbackQuery) {
  if(callbackQuery.data === 'ne'){
    if(!links1) return bot.editMessageText(`قسمت دیگری موجود نمیباشد لطفا یک لینک دیگر رو امتحان کنید`, {
      chat_id: callbackQuery.message.chat.id,
      message_id: callbackQuery.message.message_id,
    })
    if(episodes >= links1.length) return bot.editMessageText(`قسمت دیگری موجود نمیباشد لطفا یک لینک دیگر رو امتحان کنید`, {
      chat_id: callbackQuery.message.chat.id,
      message_id: callbackQuery.message.message_id,
    })
  episodes++
  console.log(callbackQuery.message.chat.id)
  console.log(links1.length - episodes)
  
  await console.log(links1[2])

   await   bot.editMessageText(links1[links1.length - episodes] + `\n👓 Episode : ${episodes} \n visit code : ${generatePassword()}`, {
    chat_id: callbackQuery.message.chat.id,
    message_id: callbackQuery.message.message_id,
    "reply_markup": {
      inline_keyboard: [
        [
          {
            text: 'قسمت بعدی',
            callback_data: 'ne'
          }
        ]
      ]
    },


  }).catch(err => {
    console.log(err.response.body)
  })
  }
})
