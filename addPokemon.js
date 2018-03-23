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
  // include "log: false" to disable logging
  // or a "logLevel" integer from 0 to 7 to adjust logging verbosity
})

controller.spawn({
    token : process.env.token
}).startRTM();

controller.hears(["(help)"], ['direct_message'], (bot,message) =>{
	bot.reply(message,"レベル\nNN\nトレーナー名\n持ち物\n技1\n技2\n技3\n技4\n努力値");
});

controller.hears(["(.*)"], [ 'direct_message' ], (bot, message) => {
	var level = message.text.split("\n")[0];
	var nickname = message.text.split("\n")[1];
	var trainer = message.text.split("\n")[2];
	var item = message.text.split("\n")[3];
	var move1 = message.text.split("\n")[4];
	var move2 = message.text.split("\n")[5];
	var move3 = message.text.split("\n")[6];
	var move4 = message.text.split("\n")[7];
	var effort_value = message.text.split("\n")[8];
	var trainer_id;
	
	var searchTrainerSql = "select * from trainer where name = ?";
	con.query(searchTrainerSql, [trainer], function(err,result,fields){
		if(err) console.log('err: ' + err);
		trainer_id = result[0].ID;
		
		var insertSql = "insert into pokemon(level,name,trainer_id,item,move1,move2,move3,move4,effort_value) values (?,?,?,?,?,?,?,?,?)";
		con.query(insertSql,[level,nickname,trainer_id,item,move1,move2,move3,move4,effort_value], function(err,res){
			bot.reply(message,"登録しました！");
		});
	});

});