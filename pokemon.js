var Botkit = require("botkit");
var mysql = require('mysql');

var con = mysql.createConnection({
  host     : 'localhost',
  user     : 'test',
  password : 'test',
  database : 'pokemon'
});

var controller = Botkit.slackbot({
  debug: false       // デバッグしない
  //stats_optout: true  // 統計情報を送信しない
  // include "log: false" to disable logging
  // or a "logLevel" integer from 0 to 7 to adjust logging verbosity
})

controller.spawn({
    token : process.env.token
}).startRTM();

controller.hears(["(help)"], ['direct_message'], (bot,message) =>{
	bot.reply(message,"戦闘に使用するポケモンのNNを入力することで，ポケモンのデータが表示されます．");
});

controller.hears(["(.*)"], [ 'direct_message' ], (bot, message) => {
	var name = message.match[1];
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