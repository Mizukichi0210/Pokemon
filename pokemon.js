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
	bot.reply(message,">ポケモン追加\nレベル\nNN\nトレーナー名\n持ち物\n技1\n技2\n技3\n技4\n努力値\n>トレーナー追加\nトレーナー名\nトレーナーID\n>確認\nNN\n>素早さ\nポケモン名");
});

controller.hears(["(ポケモン追加)"], [ 'direct_message' ], (bot, message) => {
	var user_id = message.match[1];
	var slackId;
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
	
	controller.storage.users.get(message.user, function (err, user_info) {
		if (!user_info) {
			user_info = {
				id: message.user,
            };
        }
		controller.storage.users.save(user_info, function (err, id) {
			var searchUserid = "select * from users where slack_id = ?";
			con.query(searchUserid,[user_info.id],function(err,rows,fields){
				if(err) console.log('err : '+ err);
				slackId = rows[0].id;
		
				var searchTrainerSql = "select * from trainer where name = ?";
				con.query(searchTrainerSql, [trainer], function(err,result,fields){
					if(err) console.log('err: ' + err);
					trainer_id = result[0].ID;
		
					var insertSql = "insert into pokemon(users_id,level,nickname,trainer_id,item,move1,move2,move3,move4,effort_value) values (?,?,?,?,?,?,?,?,?,?)";
						con.query(insertSql,[slackId,level,nickname,trainer_id,item,move1,move2,move3,move4,effort_value], function(err,res){
						if(err) console.log(err);
						bot.reply(message,"登録しました！");
					});
				});
			});
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

controller.hears(["(確認)"], [ 'direct_message' ], (bot, message) => {
	var name = message.text.split("\n")[1];
	var trainer_id = "";
	var trainer_name = "";
	var slackId;
	
	controller.storage.users.get(message.user, function (err, user_info) {
        if (!user_info) {
            user_info = {
                id: message.user,
            };

        }
        controller.storage.users.save(user_info, function (err, id) {
			var searchUserid = "select * from users where slack_id = ?";
			con.query(searchUserid,[user_info.id],function(err,rows,fields){
				if(err) console.log('err0: '+ err);
				slackId = rows[0].id;
				
				var searchSql = 'select * from pokemon where nickname = ? and users_id = ?';
				con.query(searchSql,[name,slackId], function(err, rows, fields){
					if(err) {
					console.log('err1: ' + err); 
					}
					trainer_id = rows[0].trainer_id;
					var trainerSql = 'select * from trainer where ID = ?';
					con.query(trainerSql,[trainer_id], function(err,result,fields){
						if(err) {
							console.log('err2: ' + err);
						}
						trainer_name = result[0].name;
						bot.reply(message, 'レベル : *' + rows[0].level + '*\n トレーナー名 : *' + trainer_name + '*\n 持ち物 : *' + rows[0].item + '*\n 技1 : *' + rows[0].move1 + '*\n 技2 : *' + rows[0].move2 + '*\n 技3 : *' + rows[0].move3 + '*\n 技4 : *' + rows[0].move4 + '*\n 努力値 : *' + rows[0].effort_value + '*');
					});
				});
			});
		});
	});
});

controller.hears(["(素早さ)"], [ 'direct_message' ], (bot, message) => {
	var pokemon = message.text.split("\n")[1];
	var fastestScarf;
	var semiSpeedScarf;
	var fastSpeed;
	var semiSpeed;
	
	var sql = "select * from pokedex where name like '%' ? '%'";
	con.query(sql,[pokemon],function(err,rows,fields){
		fastestScarf = Math.floor(((Number(rows[0].speed) + 31/2 + 252/8) + 5) * 1.1 * 1.5);
		fastSpeed = Math.floor(((Number(rows[0].speed) + 31/2 + 252/8) + 5) * 1.1);
		semiSpeedScarf = Math.floor(((Number(rows[0].speed) +31/2 + 252/8) + 5) * 1.5);
		semiSpeed = Math.floor(((Number(rows[0].speed) +31/2 + 252/8) + 5));
		bot.reply(message, "*スカーフ最速* : " + fastestScarf + "\n*スカーフ準速* : " + semiSpeedScarf + "\n*性格S補正 最速* : " + fastSpeed + "\n*性格無補正 最速* : " + semiSpeed);
	}); 
});

controller.hears(["(.*)"], [ 'direct_message' ], (bot, message) => {
	bot.reply(message,"*help* 参照");
});