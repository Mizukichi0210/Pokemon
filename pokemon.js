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
	bot.reply(message,">ポケモン追加\nレベル\nNN\nトレーナー名\n持ち物\n技1\n技2\n技3\n技4\n努力値\n>トレーナー追加\nトレーナー名\nトレーナーID\n>ポケモン確認\nNN\n>防御 or 特防\nポケモン名\n>素早さ\nポケモン名");
});

// 育成完了したポケモンの保存

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
	
	controller.storage.users.get(message.user, function (err, user_info) {
		if (!user_info) {
			user_info = {
				id: message.user,
            };
        }
		
		controller.storage.users.save(user_info, function (err, id) {
			slackId = user_info.id;
		});
	});
		
	// ↓　ユーザデータが登録されているかチェック
		
	var searchUserid = "select *,count(*) as cnt from users where slack_id = ?";
	con.query(searchUserid,[slackId],function(err,rows,fields){
		if(rows[0].cnt) bot.reply(message,"ユーザデータが登録されていません!");
		
		// ↓　
		
		var searchTrainerSql = "select *,count(*) as cnt from trainer where name = ?";
		con.query(searchTrainerSql, [trainer], function(err,result,fields){
			if(result[0].cnt) {
				bot.reply(message,"トレーナー名が間違っています!");
				return;
			}
			var insertSql = "insert into pokemon(users_id,level,nickname,trainer_id,item,move1,move2,move3,move4,effort_value) values (?,?,?,?,?,?,?,?,?,?)";
				con.query(insertSql,[rows[0].id,level,nickname,result[0].ID,item,move1,move2,move3,move4,effort_value], function(err,res){
				if(err) console.log(err);
				bot.reply(message,"登録しました！");
			});
		});
	});
});

// ポケモンのトレーナーIDとトレーナー名を保存

controller.hears(["(トレーナー追加)"], [ 'direct_message' ], (bot, message) => {
	var name = message.text.split("\n")[1];
	var trainer_id = message.text.split("\n")[2];
	
	// トレーナー名とトレーナーIDが入力されているかチェック
	
	if(name == undefined || trainer_id == undefined || isNaN(trainer_id)){
		bot.reply(message,"トレーナー名が入力されていないか、トレーナーIDが数字ではありません");
		return;
	}
	
	// データをtrainerテーブルへinsert
	
	var insertSql = "insert into trainer(name,trainer_id) values (?,?)";
	con.query(insertSql,[name,trainer_id], function(err,res){
		bot.reply(message,"登録しました！");
	});

});

// 育成完了したポケモンの確認

controller.hears(["(ポケモン確認)"], [ 'direct_message' ], (bot, message) => {
	var name = message.text.split("\n")[1];
	var slackId;
	
	// ポケモン名が入力されているかチェック
	
	if(name == undefined){
		bot.reply(message,"ポケモン名が追加されていません!");
		return;
	}
	
	controller.storage.users.get(message.user, function (err, user_info) {
        if (!user_info) {
            user_info = {
                id: message.user,
            };

        }
		
        controller.storage.users.save(user_info, function (err, id) {
			slackId = user_info.id;
		});
	});
	
	// ↓　ユーザデータが登録されているかチェック　=>　usersテーブルから主キーを取得
	
	var searchUserid = "select *,count(*) as cntUserId from users where slack_id = ?";
	con.query(searchUserid,[slackId],function(err,rows,fields){
		if(rows[0].cntUserId == 0){
			bot.reply(message,"ユーザデータが登録されていません!");
			return;
		}
		
		// ↓ ポケモンが登録されているかチェック　=>　pokemonテーブルからトレーナーidを取得
		
		var searchSql = 'select *,count(*) as cntPoke from pokemon where nickname = ? and users_id = ?';
		con.query(searchSql,[name,rows[0].id], function(err, rows, fields){
			if(rows[0].cntPoke == 0) {
				bot.reply(message,"該当ニックネームのポケモンは未登録です!");
				return;
			}

			// トレーナー名が登録されているかチェック　=> trainerテーブルに登録されているトレーナー名を取得
			
			var trainerSql = 'select *,count(*) as cntTrainer from trainer where ID = ?';
			con.query(trainerSql,[rows[0].trainer_id], function(err,result,fields){
				if(cntTrainer == 0) {
					bot.reply(message,"トレーナー名が未登録です");
					return;
				}

			bot.reply(message, 'レベル : *' + rows[0].level + '*\n トレーナー名 : *' + result[0].name + '*\n 持ち物 : *' + rows[0].item + '*\n 技1 : *' + rows[0].move1 + '*\n 技2 : *' + rows[0].move2 + '*\n 技3 : *' + rows[0].move3 + '*\n 技4 : *' + rows[0].move4 + '*\n 努力値 : *' + rows[0].effort_value + '*');
			});
		});
	});
});

//防御・特防の種族値確認

controller.hears(["(防御)","(特防)"], [ 'direct_message' ], (bot, message) => {
	var pokemon = message.text.split("\n")[1];
	if(pokemon == undefined){
		bot.reply(message,"2行目にポケモン名を入力してください!");
		return;
	}
	
	var sql = "select *,count(*) as cntPoke from pokedex where name like '%' ? '%'";
	con.query(sql,[pokemon],function(err,rows,fields){
		if(rows[0].cntPoke == 0){
			bot.reply(message,"ポケモン名が登録されていません!");
			return;
		}
		bot.reply(message,"防御種族値 : *" + rows[0].defense + "*\n特防種族値 : *" + rows[0].special_defense + "*");
	});
});

// 素早さ実数値の確認

controller.hears(["(素早さ)"], [ 'direct_message' ], (bot, message) => {
	var pokemon = message.text.split("\n")[1];
	var fastestScarf;
	var semiSpeedScarf;
	var fastSpeed;
	var semiSpeed;
	
	if(pokemon == undefined){
		bot.reply(message,"2行目にポケモン名を入力してください!");
		return;
	}
	
	var sql = "select *,count(*) as cntPoke from pokedex where name like '%' ? '%'";
	con.query(sql,[pokemon],function(err,rows,fields){
		if(rows[0].cntPoke == 0){
			bot.reply(message,"ポケモン名が登録されていません!");
			return;
		}
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