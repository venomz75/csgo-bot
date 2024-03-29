//bot variables
const discord = require ('discord.js');
const config = require("./config.js");
const got = require ('got');
const fs = require('fs');
const token = config.token;
var client = new discord.Client();
var json = fs.readFileSync("./csgo/data.json");
var data = JSON.parse(json);


//initialise bot
client.on ("ready", () => {
	console.log("ready!");
	client.user.setActivity("@nadeBot");
	client.user.setUsername("nadeBot");
});

//main program
client.on ("message", (message) => {
	//requires bot to be mentioned
	if (message.mentions.users == null) return;
	//ignore messages from bots
	if (message.author.bot) return;
	//ignore DMs
	if (message.guild === null) {
		message.reply("This bot doesn't work in DMs, please use within a server.");
		return;
	}

	if (message.isMemberMentioned(client.user)) {
		message.delete()
		const embedOne = new discord.RichEmbed()
			.addField("Pick a map!", "<:cache:"+data.emoji.map[0]+">` - Cache`\n<:dust2:"+data.emoji.map[1]+">` - Dust II`\n<:inferno:"+data.emoji.map[2]+">` - Inferno`\n<:mirage:"+data.emoji.map[3]+">` - Mirage`")

		var userID = message.author.id;
		var mapSelected = -1;
		message.reply(embedOne).then(async function (sentEmbed) {
				for (i = 0; i < data.misc.mapcount; i++) {
								await sentEmbed.react(data.emoji.map[i])
				} await sentEmbed.react(data.emoji.option[26])
		});

		client.on('messageReactionAdd', (reaction, user) => {
			if (user.id === userID && mapSelected === -1) {
				for (i = 0; i < data.misc.mapcount; i++) {
					if (reaction.emoji.name == data.emoji.option[26]) {reaction.message.delete(); mapSelected = -2; return;}
					if (reaction.emoji.id == data.emoji.map[i]) {
						reaction.message.delete();
						mapSelected = i;
						const embedTwo = new discord.RichEmbed()
							.addField(data.map[mapSelected].mapname, ":boom:` - Flashes: "+data.map[mapSelected].nade[0].count+"`\n:cloud:` - Smokes: "+data.map[mapSelected].nade[1].count+"`\n:fire:` - Molotovs: "+data.map[mapSelected].nade[2].count+"`")

						var nadeSelected = -1;
						message.reply(embedTwo).then(async function (sentEmbed) {
								for (i = 0; i < data.misc.nadecount; i++) {
									await sentEmbed.react(data.emoji.nade[i])
								} await sentEmbed.react(data.emoji.option[26])
						});

						client.on('messageReactionAdd', (reaction, user) => {
							if (user.id === userID && nadeSelected === -1 && mapSelected != -1) {
								for (i = 0; i < data.misc.nadecount; i++) {
									if (reaction.emoji.name == data.emoji.option[26]) {reaction.message.delete(); nadeSelected = -2; return; mapSelected = -1;}
									if (reaction.emoji.name == data.emoji.nade[i]) {
										reaction.message.delete();
										nadeSelected = i;
										var a = "";
										var b = "";
										var mid = "";
										var oneWay = "";

										for (i = 0; i < data.map[mapSelected].nade[nadeSelected].boundary[0]; i++) {
											a += (data.map[mapSelected].nade[nadeSelected].string[i]+"\n");
										}
										for (i = data.map[mapSelected].nade[nadeSelected].boundary[0]; i < data.map[mapSelected].nade[nadeSelected].boundary[1]; i++) {
											b += (data.map[mapSelected].nade[nadeSelected].string[i]+"\n");
										}
										for (i = data.map[mapSelected].nade[nadeSelected].boundary[1]; i < data.map[mapSelected].nade[nadeSelected].boundary[2]; i++) {
											mid += (data.map[mapSelected].nade[nadeSelected].string[i]+"\n");
										}
										for (i = data.map[mapSelected].nade[nadeSelected].boundary[2]; i < data.map[mapSelected].nade[nadeSelected].count; i++) {
											oneWay += (data.map[mapSelected].nade[nadeSelected].string[i]+"\n");
										}

										if (a == "") {a = "No A Site nades."}
										if (b == "") {b = "No B Site nades."}
										if (mid == "") {mid = "No Middle nades."}
										if (oneWay == "") {oneWay = "No One-way nades."}

										const embedThree = new discord.RichEmbed()
											.setTitle(data.map[mapSelected].mapname+" - "+data.misc.nadestring[nadeSelected])
											.addField("A Site", a)
											.addField("B Site", b)
											.addField("Middle", mid)
											.addField("One-ways", oneWay)

										var optionSelected = -1;
										message.reply(embedThree).then(async function (sentEmbed) {
												for (i = 0; i < data.map[mapSelected].nade[nadeSelected].count; i++) {
													await sentEmbed.react(data.emoji.option[i])
												} await sentEmbed.react(data.emoji.option[26])
										});

										client.on('messageReactionAdd', (reaction, user) => {
											if (user.id === userID && optionSelected === -1 && nadeSelected != -1 && mapSelected != -1) {
												for (i = 0; i < data.map[mapSelected].nade[nadeSelected].count; i++) {
													if (reaction.emoji.name == data.emoji.option[26]) {reaction.message.delete(); optionSelected = -2; return; nadeSelected = -1; mapSelected = -1;}
													if (reaction.emoji.name == data.emoji.option[i]) {
														reaction.message.delete();
														optionSelected = i;
														message.reply(data.map[mapSelected].nade[nadeSelected].string[optionSelected], {files:["csgo/"+data.misc.mapfilepath[mapSelected]+"/"+data.misc.nadefilepath[nadeSelected]+"/"+data.emoji.option[optionSelected]+".png"]}).then(async function (sentMessage) {
															await sentMessage.react(data.emoji.option[26])
														});

														client.on('messageReactionAdd', (reaction, user) => {
															if (user.id === userID) {
																if (reaction.emoji.name == data.emoji.option[26]) {reaction.message.delete();  return; optionSelected = -1; nadeSelected = -1; mapSelected = -1;}
															}
														});
													}
												}
											}
										});
									}
								}
							}
						});
					}
				}
			}
		});
	}
});

client.login (token);