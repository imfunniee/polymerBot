const Discord = require('discord.js');
const bot = new Discord.Client();
const ytdl = require('ytdl-core');
const getJSON = require('get-json');
const got = require('got');
const emojifyText = require('emojify-text');
const antispam = require("discord-anti-spam");
const ffmpeg = require('ffmpeg-binaries');
const screenshotPromise = require('screenshot-promise');
const PREFIX = "-poly ";
var colorsHex = ["#A15CFD","#FD5C68","#FD5CB8","#FDA15C","#FDF15C","#78F35A","#5A78F3"];
var servers = {};
var playing = false;
var month,currentdate = new Date();switch(currentdate.getMonth()){case 0:month="January";break;case 1:month="February";break;case 2:month="March";break;case 3:month="April";break;case 4:month="May";break;case 5:month="June";break;case 6:month="July";break;case 7:month="August";break;case 8:month="September";break;case 9:month="October";break;case 10:month="November";break;case 11:month="December"}var hours = currentdate.getHours(); hours = Number(hours)-6; var minutes = currentdate.getMinutes();minutes = Number(minutes)+30;
var thedate= month+" "+currentdate.getDate()+", "+currentdate.getFullYear();

function displayMessageOutside(text,message){
    var embed = new Discord.RichEmbed()
        .setTitle(text)
        .setColor(colorsHex[Math.floor(Math.random() * colorsHex.length)])
        .setFooter(thedate);
        message.channel.send(embed);
    return embed;
    }

function play(connection, message){
    var server = servers[message.guild.id];
    server.dispatcher = connection.playStream(ytdl(server.queue[0],{filter: "audioonly"}));
    server.queue.shift();
    server.dispatcher.on("end", function(){
        if(server.queue[0]) {play(connection, message);}
        else {
            connection.disconnect();
            displayMessageOutside("disconnected",message);
        }
    });

    playing = true;
}

bot.on('ready', () => {
 console.log(`Logged in as ${bot.user.tag}!`);
 bot.user.setPresence({
  game: {
      name: '-poly help, for help',
  }});
});

antispam(bot, {
  warnBuffer: 3, //Maximum amount of messages allowed to send in the interval time before getting warned.
  maxBuffer: 5, // Maximum amount of messages allowed to send in the interval time before getting banned.
  interval: 1400, // Amount of time in ms users can send a maximum of the maxBuffer variable before getting banned.
  warningMessage: "stop spamming or you'll be banned.", // Warning message send to the user indicating they are going to fast.
  banMessage: "has been banned for spamming.", // Ban message, always tags the banned user in front of it.
  maxDuplicatesWarning: 3,// Maximum amount of duplicate messages a user can send in a timespan before getting warned
  maxDuplicatesBan: 5, // Maximum amount of duplicate messages a user can send in a timespan before getting banned
  deleteMessagesAfterBanForPastDays: 7 // Delete the spammed messages after banning for the past x days.
});

bot.on('message', async (message) =>{
  if(message.author.equals(bot.user)) return;
  if(!message.content.startsWith(PREFIX)) return;
  var args = message.content.substring(PREFIX.length).split(" ");
  var playString = message.content.substring(PREFIX.length).slice("5");
  var lmgtfyString = message.content.substring(PREFIX.length).slice("7");
  var clearNumber = message.content.substring(PREFIX.length).slice("6");
  var captureString = message.content.substring(PREFIX.length).slice("8");
  var gituser = message.content.substring(PREFIX.length).slice("8");
  var watchuser = message.content.substring(PREFIX.length).slice("9");
  var emoji = message.content.substring(PREFIX.length).slice("8");
  var banText = message.content.substring(PREFIX.length).slice("4");
  banText = banText.split(' ');
  var kickText = message.content.substring(PREFIX.length).slice("5");
  kickText = kickText.split(' ');

  function displayMessage(text){
    var embed = new Discord.RichEmbed()
        .setTitle(text)
        .setColor(colorsHex[Math.floor(Math.random() * colorsHex.length)])
        .setFooter(thedate);
        message.channel.send(embed);
    return embed;
    }
  
  switch(args[0].toLowerCase()){

      case "help" :
      var embed = new Discord.RichEmbed()
      .setTitle("Commands for Polymer")
      .setDescription("-poly <command>")
      .addField("Moderation","ban <username> <ban reason>, kick <username> <kick reason>, mute <username>, unmute <username>, clear <number of messages to clear>, stats")
      .addField("Music","play <youtube url>, skip, stop, queue")
      .addField("Fun","lmgtfy <lmgtfy string>, birb, catto, doggo, capture <website url to capture>, emojify <emojify string>")
      .addField("Github","gituser <github username>, gitstalk <github username>")
      .setColor(colorsHex[Math.floor(Math.random() * colorsHex.length)])
      .setFooter(thedate);
      message.channel.send(embed);
      break;

      case "play" :
      const voiceChannel = message.member.voiceChannel;
      if(!voiceChannel){ 
      displayMessage("you need to be in a voice channel to use this command");
      return;
      }
        if(!playString){
            displayMessage("please provide a link to play");
            return;
        }

        if(!servers[message.guild.id]) servers[message.guild.id] = {
            queue: []
        };
        var server = servers[message.guild.id];
        server.queue.push(playString);
        if(playing == true){
            displayMessage("song added to queue");
            return;
        }
        if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
            play(connection, message);
        });

      break;

      case "queue" :
      var server = servers[message.guild.id];
      if(!server.queue || !server){
        displayMessage("queue empty!!");
        return;
      }else{
          for(i = 0; i < server.queue.length; i++){
            ytdl.getBasicInfo(server.queue[i], (err, info) => {
             if(err){
              displayMessage("there was an error loading queue");
              return;
             }
             displayMessage(info.player_response.videoDetails.title);
            });
          }
      }
      break;

      case "skip" : 
      var server = servers[message.guild.id];
      if(server.dispatcher) server.dispatcher.end();
      break;

      case "stop" :
      var server = servers[message.guild.id];
      if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
      break;

      case "kick":
      if(!kickText[1]){
        kickText = "they were bad :p";
      }else {
        kickText = kickText[1];
      }
      if(!message.member.roles.find(roleFind => roleFind.name === "moderator") || !message.member.roles.find(roleFind => roleFind.name === "server-manager")){
        displayMessage("you need a moderator or above roles to use this command");
        return;
      }
        const user = message.mentions.users.first();
        if (user){
          const member = message.guild.member(user);
          if (member) {
            member.kick(kickText).then(() => {
              message.reply(`successfully kicked ${user.tag}`);
            }).catch(err => {
              displayMessage('unable to kick the member');
              console.error(err);
            });
          } else {
            displayMessage('the user isn\'t in this server!');
          }
        } else {
         displayMessage('mention a user to kick!');
        }
      break;

      case "ban" :
      if(!banText[1]){
        banText = "they were bad :p";
      }else {
        banText = banText[1];
      }
      if(!message.member.roles.find(roleFind => roleFind.name === "moderator") || !message.member.roles.find(roleFind => roleFind.name === "server-manager")){
        displayMessage("you need a moderator or above roles to use this command");
        return;
      }
      const userBan = message.mentions.users.first();
      if (userBan) {
        const member = message.guild.member(userBan);
        if (member) {
          member.ban({
            reason: banText,
          }).then(() => {
            message.reply(`successfully banned ${userBan.tag}`);
          }).catch(err => {
            displayMessage('unable to ban the member');
            console.error(err);
          });
        } else {
          displayMessage('the user isn\'t in this server!');
        }
      } else {
        displayMessage('mention a user to ban!');
      }
      break;

      case "mute" :
      if(!message.member.roles.find(roleFind => roleFind.name === "moderator") || !message.member.roles.find(roleFind => roleFind.name === "server-manager")){
        displayMessage("you need a moderator or above roles to use this command");
        return;
      }
      const userMute= message.mentions.users.first();
      if (userMute) {
        const member = message.guild.member(userMute);
        if (member) {
          const roleMuted = message.member.roles.find(roleFind => roleFind.name === "muted");
          await member.addRole(roleMuted).then(() => {
            message.reply(`successfully muted ${userMute.tag}`);
          }).catch(err => {
            displayMessage('unable to mute the member');
            console.error(err);
          });
        } else {
          displayMessage('thruser isn\'t in this server!');
        }
      } else {
        displayMessage('mention a user to mute!');
      }
      break;

      case "unmute" :
      if(!message.member.roles.find(roleFind => roleFind.name === "moderator") || !message.member.roles.find(roleFind => roleFind.name === "server-manager")){
        displayMessage("you need a moderator or above roles to use this command");
        return;
      }
      const userunMute= message.mentions.users.first();
      if (userunMute) {
        const member = message.guild.member(userunMute);
        if (member) {
          const roleUnMuted = message.member.roles.find(roleFind => roleFind.name === "muted");
          await member.removeRole(roleUnMuted).then(() => {
            message.reply(`successfully unmuted ${userunMute.tag}`);
          }).catch(err => {
            displayMessage('unable to unmute the member');
            console.error(err);
          });
        } else {
          displayMessage('the user isn\'t in this server!');
        }
      } else {
        displayMessage('mention a user to unmute!');
      }
      break;

      case "clear" :
      message.delete();
      if(!message.member.roles.find(roleFind => roleFind.name === "moderator") || !message.member.roles.find(roleFind => roleFind.name === "server-manager")){
        displayMessage("you need a moderator or above roles to use this command");
        return;
      }
      if(!clearNumber || typeof clearNumber == 'number'){
       displayMessage("please provide a number as your argument");
       return;
      }
      if(clearNumber > 100){
        displayMessage("clear argument should be less than or equal to 100");
        return;
       }
      const fetched = await message.channel.fetchMessages({limit: clearNumber});
      message.channel.bulkDelete(fetched).then(
        function(){
          displayMessage(`deleted ${clearNumber} messages`);
        }).catch(function(){
          displayMessage("error deleting messages");
      });
      break;

      case "stats" :
      const guild = message.guild;
      var embed = new Discord.RichEmbed()
        .setThumbnail(guild.iconURL)
        .addField("server name",guild.name,true)
        .addField("server owner",guild.owner,true)
        .addField("number of channels",guild.channels.array()
        .filter(channel => channel.type !== 'category').length)
        .addField("number of members",guild.memberCount)
        .addField("region",guild.region)
        .setColor(colorsHex[Math.floor(Math.random() * colorsHex.length)])
        .setFooter(thedate);
        message.channel.send(embed);
      break;

      case "lmgtfy" :
      if(!lmgtfyString){displayMessage("provide a text"); return;}
      var embed = new Discord.RichEmbed()
        .setTitle("LMGTFY")
        .setURL('https://lmgtfy.com/?q='+lmgtfyString.replace(/\s/g, '+'))
        .setDescription('here lul')
        .setColor(colorsHex[Math.floor(Math.random() * colorsHex.length)])
        .setFooter(thedate);
        message.channel.send(embed);
      break;

      case "birb" :
      getJSON("https://shibe.online/api/birds", function(error,response){
        if(error){console.log(error);return;}
        var image = response[0];
        message.channel.send("birb!!",{file: image});
        });   
      break;

      case "catto" :
        getJSON("https://shibe.online/api/cats", function(error,response){
        if(error){console.log(error);return;}
        var image = response[0];
        message.channel.send("catto!!",{file: image});
        });   
      break;

      case "doggo" :
      getJSON("https://random.dog/woof.json", function(error,response){
        if(error){console.log(error);return;}
        var image = response.url;
        message.channel.send("doggo!!",{file: image});
        }); 
      break;

      case "capture" :
      if(!captureString) {
        displayMessage("please provide a url to capture");
        return;
      }
      screenshotPromise(captureString, '1366x768', {crop: true}).then(image => {
        message.channel.send({file: image});
      }).catch(err => {
        displayMessage("error capturing webpage");
      });
      break;

      case "gituser" :
      if(!gituser){
        displayMessage("please provide a github user");
        return;
      }
      (async () => {
        try {
            const response = await got(`https://api.github.com/users/${gituser}`);
            var data = JSON.parse(response.body);
            var embed = new Discord.RichEmbed()
            .setTitle(data.login)
            .setThumbnail(data.avatar_url)
            .addField("repos",data.public_repos,true)
            .addField("followers",data.followers,true)
            .addField("following",data.following,true)
            .setColor(colorsHex[Math.floor(Math.random() * colorsHex.length)])
            .setFooter(thedate);
            if(data.bio != null){
              embed.setDescription(data.bio);
            }
            message.channel.send(embed);
        } catch (error) {
            displayMessage("error getting user info");
        }
      })();
      break;

      case "gitstalk" :
      if(!watchuser){
        displayMessage("please provide a github user");
        return;
      }
      (async () => {
        try {
            const response = await got(`https://api.github.com/users/${watchuser}/events`);
            var data = JSON.parse(response.body);
            if(data.length < 10){
              displayMessage("not enough data to show");
              return;
            }
            var embed = new Discord.RichEmbed()
            .setTitle(data[0].actor.login)
            .setThumbnail(data[0].actor.avatar_url)
            .setColor(colorsHex[Math.floor(Math.random() * colorsHex.length)])
            .setFooter(thedate);
            for(i=0;i <= 10;i++){
              embed.addField(data[i].type,data[i].repo.name);
            }
            message.channel.send(embed);
        } catch (error) {
          console.log(error);
            displayMessage("error getting user info");
        }
      })();
      break;

      case "emojify" :
      if(!emoji){
        displayMessage("please provide argument to this command <background emoji> <foreground emoji> <text>");
        return;
      }
      emoji = emoji.split(' ');
      if(!emoji[0]){
        displayMessage("please provide a background emoji");
        return;
      }
      if(!emoji[1]){
        displayMessage("please provide a foreground emoji");
        return;
      }
      if(!emoji[2]){
        displayMessage("please provide a text");
        return;
      }
      var converted = emojifyText({ bg: emoji[0], fg: emoji[1], row: true}, emoji[2]);
      message.channel.send(converted);
      break;

      default :
      displayMessage("that's an invalid command my guy");
      break;
  }

});

bot.login('your thing here');