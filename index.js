const { Discord, Client, MessageEmbed } = require('discord.js');
const client = global.client = new Client({fetchAllMembers: true});
const ayarlar = require('./ayarlar.json');
const k = require('./idler.json');
const s = require('./koruma.json');
const fs = require('fs');
const express = require('express');
const http = require('http');

const ownerRol = "796256931806969916";
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping tamamdır.");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

/////////////////////////////////////////////ELLEME///////////////////////////////////////////
function guvenli(kisiID) {
  let uye = client.guilds.cache.get(k.guildID).members.cache.get(kisiID);
  let guvenliler = ayarlar.whitelist || [];
  if (!uye || uye.id === client.user.id || uye.id === "796726486383329328" || uye.id === ayarlar.owner || uye.id === "588003288817860628" || uye.id === "623167228140978218" || uye.id === uye.guild.owner.id || guvenliler.some(g => uye.id === g.slice(1) || uye.roles.cache.has(g.slice(1)))) return true
  else return false;
};

const yetkiPermleri = ["ADMINISTRATOR", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_NICKNAMES", "MANAGE_EMOJIS", "MANAGE_WEBHOOKS"];
function cezalandir(kisiID, tur) {
  let uye = client.guilds.cache.get(k.guildID).members.cache.get(kisiID);
  if (!uye) return;
  if (tur == "cezalandır") return uye.roles.cache.has(k.boosterRole) ? uye.roles.set([k.boosterRole, k.jailRole]) : uye.roles.set([k.jailRole]);
  if (tur == "ban") return uye.ban({ reason: null }).catch();
};
/////////////////////////////////////////////ELLEME///////////////////////////////////////////





//////////////////////////////////////////////////Sağ Tık Kick Koruması////////////////////////////////////////////////////
client.on("guildMemberRemove", async üyecik => {
  let yetkili = await üyecik.guild.fetchAuditLogs({type: 'MEMBER_KICK'}).then(audit => audit.entries.first());
  if (!yetkili || !yetkili.executor || Date.now()-yetkili.createdTimestamp > 5000 || guvenli(yetkili.executor.id) || !s.kickGuard) return;
  cezalandir(yetkili.executor.id, "cezalandır");
  let logKanali = client.channels.cache.get(k.logChannelID);
  if (logKanali) { logKanali.send(
    new MessageEmbed()
    .setColor("#00ffdd")
    .setDescription("**__Sağ Tık İle Kick Atıldı!__**")
    .addField(`Sunucudan Kicklenen Kullanıcı`,`${üyecik}`)
    .addField(`Sunucudan Kickleyen Yetkili`,`${yetkili.executor}`)
    .addField(`Yetkiliye Yapılan İşlem`,`Jaile Atılma`)
    .setFooter(`Bu Sunucu Benim Sayemde Korunuyor`)
  .setTimestamp())
   
    .catch(); };
});
//////////////////////////////////////////////////Sağ Tık Kick Koruması////////////////////////////////////////////////////







//////////////////////////////////////////////////Sağ Tık Ban Koruması////////////////////////////////////////////////////
client.on("guildBanAdd", async (guild, üyecik) => {
  let yetkili = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first());
  if (!yetkili || !yetkili.executor || guvenli(yetkili.executor.id) || !s.banGuard) return;
   cezalandir(yetkili.executor.id, "cezalandır");
  guild.members.unban(üyecik.id, "Sağ Tık İle Banlandığı İçin Geri Açıldı!").catch(console.error);
  let logKanali = client.channels.cache.get(k.logChannelID);
  if (logKanali) { logKanali.send(
    new MessageEmbed()
    .setColor("#00ffdd")
    .setDescription("**__Sağ Tık İle Ban Atıldı!__**")
    .addField(`Sunucudan Banlanan Kullanıcı`,`${üyecik}`)
    .addField(`Sunucudan Banlayan Yetkili`,`${yetkili.executor}`)
    .addField(`Yetkiliye Yapılan İşlem`,`Jaile Atılma`)
    .setFooter(`Bu Sunucu Benim Sayemde Korunuyor`)
    .setTimestamp()).catch();};
});
//////////////////////////////////////////////////Sağ Tık Ban Koruması////////////////////////////////////////////////////






//////////////////////////////////////////////////Bot Ekleme Koruması////////////////////////////////////////////////////
client.on("guildMemberAdd", async eklenenbotsunsen => {
  let yetkili = await eklenenbotsunsen.guild.fetchAuditLogs({type: 'BOT_ADD'}).then(audit => audit.entries.first());
  if (!eklenenbotsunsen.user.bot || !yetkili || !yetkili.executor || Date.now()-yetkili.createdTimestamp > 5000 || guvenli(yetkili.executor.id) || !s.botGuard) return;
  cezalandir(yetkili.executor.id, "cezalandır");
  cezalandir(eklenenbotsunsen.id, "ban");
  let logKanali = client.channels.cache.get(k.logChannelID);
  if (logKanali) { logKanali.send(
  new Discord.MessageEmbed()
    .setColor("#00ffdd")
    .setDescription("**__Sunucuya Bir Bot Eklendi!__**")
    .addField(`Eklenen Bot Adı`,`${eklenenbotsunsen}`)
    .addField(`Ekleyen Yetkili`,`${yetkili.executor}`)
    .addField(`Yetkiliye Yapılan İşlem`,`Jaile Atılma`)
    .addField(`Bota Yapılan İşlem`,`Banlanma`)
    .setFooter(`Bu Sunucu Benim Sayemde Korunuyor`)
    .setTimestamp()).catch();};
});
//////////////////////////////////////////////////Bot Ekleme Koruması////////////////////////////////////////////////////







//////////////////////////////////////////////////Sunucu Ayar Koruması////////////////////////////////////////////////////
client.on("guildUpdate", async (oldGuild, newGuild) => {
  let yetkili = await newGuild.fetchAuditLogs({type: 'GUILD_UPDATE'}).then(audit => audit.entries.first());
  if (!yetkili || !yetkili.executor || Date.now()-yetkili.createdTimestamp > 5000 || guvenli(yetkili.executor.id) || !s.serverGuard) return;
  cezalandir(yetkili.executor.id, "cezalandır");
  if (newGuild.name !== oldGuild.name) newGuild.setName(oldGuild.name);
  if (newGuild.iconURL({dynamic: true, size: 2048}) !== oldGuild.iconURL({dynamic: true, size: 2048})) newGuild.setIcon(oldGuild.iconURL({dynamic: true, size: 2048}));
  let logKanali = client.channels.cache.get(k.logChannelID);
  if (logKanali) { logKanali.send(
    new MessageEmbed()
    .setDescription("**__Sunucunun Ayarlarıyla Oynandı!__**")
    .addField(`Sunucu Ayarlarını Değiştiren Yetkili`,`${yetkili.executor}`)
    .addField(`Yetkiliye Yapılan İşlem`,`Jaile Atılma`)
    .addField(`Sunucuya Yapılan İşlem`,`Eski Haline Getirilme`)
    .setFooter(`Bu Sunucu Benim Sayemde Korunuyor`)
    .setColor("#00ffdd")
    .setTimestamp()).catch();};
});
//////////////////////////////////////////////////Sunucu Ayar Koruması////////////////////////////////////////////////////





//////////////////////////////////////////////////Kanal Oluşturma Koruması////////////////////////////////////////////////////
client.on("channelCreate", async channel => {
  let yetkili = await channel.guild.fetchAuditLogs({type: 'CHANNEL_CREATE'}).then(audit => audit.entries.first());
  if (!yetkili || !yetkili.executor || Date.now()-yetkili.createdTimestamp > 5000 || guvenli(yetkili.executor.id) || !s.channelGuard) return;
  channel.delete({reason: null});
  cezalandir(yetkili.executor.id, "cezalandır");
  let logKanali = client.channels.cache.get(k.logChannelID);
  if (logKanali) { logKanali.send(
    new MessageEmbed()
    .setColor("#00ffdd")
    .setDescription("**__Bir Kanal Oluşturuldu!__**")
    .addField(`Kanalı Oluşturan Yetkili`,`${yetkili.executor}`)
    .addField(`Yetkiliye Yapılan İşlem`,`Jaile Atılma`)
    .addField(`Açılan Kanala Yapılan İşlem`,`Silinme`) 
    .setFooter(`Bu Sunucu Benim Sayemde Korunuyor`)
    .setTimestamp()).catch(); };
});
//////////////////////////////////////////////////Kanal Oluşturma Koruması////////////////////////////////////////////////////





//////////////////////////////////////////////////Kanal Ayar Koruması////////////////////////////////////////////////////
client.on("channelUpdate", async (oldChannel, newChannel) => {
  let yetkili = await newChannel.guild.fetchAuditLogs({type: 'CHANNEL_UPDATE'}).then(audit => audit.entries.first());
  if (!yetkili || !yetkili.executor || !newChannel.guild.channels.cache.has(newChannel.id) || Date.now()-yetkili.createdTimestamp > 5000 || guvenli(yetkili.executor.id) || !s.channelGuard) return;
  cezalandir(yetkili.executor.id, "cezalandır");
  if (newChannel.type !== "category" && newChannel.parentID !== oldChannel.parentID) newChannel.setParent(oldChannel.parentID);
  if (newChannel.type === "category") {
    newChannel.edit({
      name: oldChannel.name,
    });
  } else if (newChannel.type === "text") {
    newChannel.edit({
      name: oldChannel.name,
      topic: oldChannel.topic,
      nsfw: oldChannel.nsfw,
      rateLimitPerUser: oldChannel.rateLimitPerUser
    });
  } else if (newChannel.type === "voice") {
    newChannel.edit({
      name: oldChannel.name,
      bitrate: oldChannel.bitrate,
      userLimit: oldChannel.userLimit,
    });
  };
  oldChannel.permissionOverwrites.forEach(perm => {
    let thisPermOverwrites = {};
    perm.allow.toArray().forEach(p => {
      thisPermOverwrites[p] = true;
    });
    perm.deny.toArray().forEach(p => {
      thisPermOverwrites[p] = false;
    });
    newChannel.createOverwrite(perm.id, thisPermOverwrites);
  });
  let logKanali = client.channels.cache.get(k.logChannelID);
  if (logKanali) { logKanali.send(
    new MessageEmbed()
    .setColor("#00ffdd")
    .setDescription("**__Kanal Ayarlarıyla Oynandı!__**")
    .addField(`Kanalı Güncelleyen Yetkili`,`${yetkili.executor}`)
    .addField(`Yetkiliye Yapılan İşlem`,`Jaile Atılma`)
    .addField(`Düzenlenen Kanala Yapılan İşlem`,`Eski Haline Getirildi`)    
    .setFooter(`Bu Sunucu Benim Sayemde Korunuyor`)
    .setTimestamp()).catch();};
});
//////////////////////////////////////////////////Kanal Ayar Koruması////////////////////////////////////////////////////




//////////////////////////////////////////////////Kanal Silme Koruması////////////////////////////////////////////////////
client.on("channelDelete", async channel => {
  let yetkili = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'}).then(audit => audit.entries.first());
  if (!yetkili || !yetkili.executor || Date.now()-yetkili.createdTimestamp > 5000 || guvenli(yetkili.executor.id) || !s.channelGuard) return;
  cezalandir(yetkili.executor.id, "cezalandır");
  await channel.clone({ reason: "Kanal Koruma Sistemi" }).then(async kanal => {
    if (channel.parentID != null) await kanal.setParent(channel.parentID);
    await kanal.setPosition(channel.position);
    if (channel.type == "category") await channel.guild.channels.cache.filter(k => k.parentID == channel.id).forEach(x => x.setParent(kanal.id));
  });
  let logKanali = client.channels.cache.get(k.logChannelID);
  if (logKanali) { logKanali.send(
    new MessageEmbed()
    .setColor("#00ffdd")
    .setDescription("**__Bir Kanalı Silindi!__**")
    .addField(`Kanalı Silen Yetkili`,`${yetkili.executor}`)
    .addField(`Yetkiliye Yapılan İşlem`,`Jaile Atılma`)
    .addField(`Silinen Kanala Yapılan İşlem`,`Kanal Geri Açılıp İzinler Düzenlendi.`)    
    .setFooter(`Bu Sunucu Benim Sayemde Korunuyor`)
    .setTimestamp()).catch(); };
});
//////////////////////////////////////////////////Kanal Silme Koruması////////////////////////////////////////////////////




//////////////////////////////////////////////////Rol Silme Koruması////////////////////////////////////////////////////
client.on("roleDelete", async role => {
  let yetkili = await role.guild.fetchAuditLogs({type: 'ROLE_DELETE'}).then(audit => audit.entries.first());
  if (!yetkili || !yetkili.executor || Date.now()-yetkili.createdTimestamp > 5000 || guvenli(yetkili.executor.id) || !s.roleGuard) return;
  cezalandir(yetkili.executor.id, "cezalandır");
  
  let logKanali = client.channels.cache.get(k.logChannelID);
  if (logKanali) { logKanali.send(
    new MessageEmbed()
    .setColor("#00ffdd")
    .setDescription("**__Bir Rol Silindi__**")
    .addField(`Rolü Silen Yetkili`,`${yetkili.executor}`)
    .addField(`Yetkiliye Yapılan İşlem`,`Jaile Atılma`)
    .setFooter(`Bu Sunucu Benim Sayemde Korunuyor`)
    .setTimestamp()).catch(); };
});
//////////////////////////////////////////////////Rol Silme Koruması////////////////////////////////////////////////////



////////////////////////////////////////////////////Sağ Tık Yt Verme/////////////////////////////////////////////////////

client.on("guildMemberUpdate", async (oldMember, newMember) => {
  if (newMember.roles.cache.size > oldMember.roles.cache.size) {
    let yetkili = await newMember.guild.fetchAuditLogs({type: 'MEMBER_ROLE_UPDATE'}).then(audit => audit.entries.first());
    if (!yetkili || !yetkili.executor || Date.now()-yetkili.createdTimestamp > 5000 || guvenli(yetkili.executor.id) || !s.roleGuard) return;
    if (yetkiPermleri.some(p => !oldMember.hasPermission(p) && newMember.hasPermission(p))) {
      cezalandir(yetkili.executor.id, "cezalandır");
      newMember.roles.set(oldMember.roles.cache.map(r => r.id));
      let logKanali = client.channels.cache.get(k.logChannelID);
      if (logKanali) { logKanali.send(
        new MessageEmbed()
         .setColor("#00ffdd")
    .setDescription("**__Sağ Tık İle Yönetici Verildi__**")
         .addField(`Rol Verilen Kullanıcı`,`${newMember} `)
         .addField(`Rolü Veren Yetkili`,`${yetkili.executor}`)         
         .addField(`Yetkiliye Yapılan İşlem`,`Jaile Atılma`)
         .addField(`Kullanıcıya Yapılan İşlem`,`Verilen Rol Geri Alınma`)
         .setFooter(`Bu Sunucu Benim Sayemde Korunuyor`)
         .setTimestamp()).catch(); };
    };
  };
});
////////////////////////////////////////////////////Sağ Tık Yt Verme/////////////////////////////////////////////////////



////////////////////////////////////////////////////Rol Açma Koruması/////////////////////////////////////////////////////
client.on("roleCreate", async role => {
  let yetkili = await role.guild.fetchAuditLogs({type: 'ROLE_CREATE'}).then(audit => audit.entries.first());
  if (!yetkili || !yetkili.executor || Date.now()-yetkili.createdTimestamp > 5000 || guvenli(yetkili.executor.id) || !s.roleGuard) return;
  role.delete({ reason: "Rol Koruma" });
  cezalandir(yetkili.executor.id, "cezalandır");
  let logKanali = client.channels.cache.get(k.logChannelID);
  if (logKanali) { logKanali.send(
    new MessageEmbed()
    .setColor("#00ffdd")
    .setDescription("**__Rol Oluşturuldu__**")
    .addField(`Rolü Açan Yetkili`,`${yetkili.executor}`) 
    .addField(`Yetkiliye Yapılan İşlem`,`Jaile Atılma`) 
    .addField(`Role Yapılan İşlem`,`Silinme`) 
    .setFooter(`Bu Sunucu Benim Sayemde Korunuyor`)
    .setTimestamp()).catch();};
});
////////////////////////////////////////////////////Rol Açma Koruması/////////////////////////////////////////////////////
client.on("ready",  () => {
  let gir = k.botVoiceChannelID
  
  client.channels.cache.get(gir).join();
  
  
  
})

/////////////////////////////////////////////////////DURUM///////////////////////////////////////////////////
client.on("ready", async () => {
  let durum = ayarlar.durum
  client.user.setPresence({ activity: { name: durum }, status: "idle" })
  ;})
/////////////////////////////////////////////////////DURUM///////////////////////////////////////////////////

///////////////////////////////////////////////EVAL//////////////////////////7
//Eval
client.on('message', async message => {
  const Discord = require('discord.js')
  
   const args = message.content.slice("!").trim().split(/ +/g);
  const command = args.shift().toLowerCase();
 if (command === "!eval") {
   if(args[0] === "client.token") return message.channel.send(`Al Sana Token https://listelist.com/wp-content/uploads/2013/06/harry-potter-nah-cekiyor.jpg`)
     if(!message.member.roles.cache.get(ownerRol)) return message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription(`**:no_entry: Bu Komutu Sadece <@&796256931806969916> Rolüne Sahip Kişiler Kullanabilir!**`))  
   try {  let codein = args.join(" ");

        let code = eval(codein);

      if (codein.length < 1) return message.channel.send(new Discord.MessageEmbed().setDescription("💻 **Bir Kod Girmelisin !**").setColor("RED"))

      

        if (typeof code !== 'string')

            code = require('util').inspect(code, { depth: 0 });

        let embed = new Discord.MessageEmbed()

        .setColor('GREEN')

        .addField(':inbox_tray: Giriş:', `\`\`\`js\n${codein}\`\`\``)

        .addField(':outbox_tray: Çıkış:', `\`\`\`js\n${code}\n\`\`\``)

        message.channel.send(embed)

 } catch(e) {

      let embed2 = new Discord.MessageEmbed()

      .setColor('RED')

      .addField(':hammer_pick: Hata:', "\`\`\`js\n"+e+"\n\`\`\`")

        message.channel.send(embed2);

    }

}

 })
client.on('message', async message => {
  const Discord = require('discord.js')
   const args = message.content.slice("!").trim().split(/ +/g);
  const command = args.shift().toLowerCase();
 if (command === "!ping") {
   if(!message.member.roles.cache.get(ownerRol)) return message.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription(`**:no_entry: Bu Komutu Sadece <@&796256931806969916> Rolüne Sahip Kişiler Kullanabilir!**`))
   message.channel.send(new Discord.MessageEmbed().setColor("GREEN").setDescription(`**:satellite: Marvel Guard Gecikmesi: ${client.ws.ping}**`))
 } 
})
client.on('voiceStateUpdate', async (___, newState) => {
if (
newState.member.user.bot &&
newState.channelID &&
newState.member.user.id == client.user.id &&
!newState.selfDeaf
) {
newState.setSelfDeaf(true);
}
});
client.login(ayarlar.token)