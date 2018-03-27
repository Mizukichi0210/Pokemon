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
	bot.reply(message,">ポケモン追加\nレベル\nNN\nトレーナー名\n持ち物\n技1\n技2\n技3\n技4\n努力値\n>トレーナー追加\nトレーナー名\nトレーナーID\n>ポケモン確認\nNN");
});

controller.hears(["(ポケモン追加)"], [ 'direct_message' ], (bot, message) => {
	var level = message.text.split("\n")[1];
	var nickname = message.text.split("\n")[2];
	var trainer = message.text.split("\n")[3];
	var item = message.text.split("\n")[4];
	var move1 = message.text.split("\n")[5];
	var move2 = message.text.split("\n")[6];
	var move3 = message.text.split("\n")[7];
	var move4 = message.text.split("\n")[8];
	var effort_value = message.text.split("\n")[9];
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

controller.hears(["(トレーナー追加)"], [ 'direct_message' ], (bot, message) => {
	var name = message.text.split("\n")[1];
	var trainer_id = message.text.split("\n")[2];
	var insertSql = "insert into trainer(name,trainer_id) values (?,?)";
	con.query(insertSql,[name,trainer_id], function(err,res){
		bot.reply(message,"登録しました！");
	});

});

controller.hears(["(ポケモン確認)"], [ 'direct_message' ], (bot, message) => {
	var name = message.text.split("\n")[1];
	var trainer_id = "";
	var trainer_name = "";
	var searchSql = 'select * from pokemon where name = ?';
	con.query(searchSql,[name], function(err, rows, fields){
		if(err) {
			 console.log('err: ' + err); 
		}
		trainer_id = rows[0].trainer_id;
		var trainerSql = 'select * from trainer where ID = ?';
		con.query(trainerSql,[trainer_id], function(err,result,fields){
			if(err) {
				console.log('err: ' + err);
			}
			trainer_name = result[0].name;
;
			bot.reply(message, 'レベル : ' + rows[0].level + '\n トレーナー名 : ' + trainer_name + '\n 持ち物 : ' + rows[0].item + '\n 技1 : ' + rows[0].move1 + '\n 技2 : ' + rows[0].move2 + '\n 技3 : ' + rows[0].move3 + '\n 技4 : ' + rows[0].move4 + '\n 努力値 : ' + rows[0].effort_value);
		});
	});
});

controller.hears(["(素早さ)"], [ 'direct_message' ], (bot, message) => {
	
});

controller.hears(["(.*)"], [ 'direct_message' ], (bot, message) => {
	bot.reply(message,"*help* 参照");
});