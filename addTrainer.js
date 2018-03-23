var Botkit = require("botkit");
var mysql = require('mysql');

var con = mysql.createConnection({
  host     : 'localhost',
  user     : 'test',
  password : 'test',
  database : 'pokemon'
});

var controller = Botkit.slackbot({
  debug: false       
})

controller.spawn({
    token : process.env.token
}).startRTM();

controller.hears(["(help)"], ['direct_message'], (bot,message) =>{
	bot.reply(message,"トレーナー名\nトレーナーID");
});

controller.hears(["(.*)"], [ 'direct_message' ], (bot, message) => {
	var name = message.text.split("\n")[0];
	var trainer_id = message.text.split("\n")[1];
	var insertSql = "insert into trainer(name,trainer_id) values (?,?)";
	con.query(insertSql,[name,trainer_id], function(err,res){
		bot.reply(message,"登録しました！");
	});

});