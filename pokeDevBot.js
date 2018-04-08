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
	bot.reply(message,"\n>育成論保存\nポケモン名\n該当URL\n>育成論確認\nポケモン名\n>育成完了\nポケモン名\n該当URL\n>育成論一覧");
});

// 気になる育成論の保存．

controller.hears(["(育成論保存)"], [ 'direct_message' ], (bot, message) => {
	var pokemon = message.text.split("\n")[1];
	var url = message.text.split("\n")[2];
	var slackId;
	var finished = 0;
	
	if(pokemon == undefined || url == undefined){
		bot.reply(message,"2行目にポケモン名、3行目に該当urlを入力してください");
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
	var searchUserid = "select *,count(*) as cntUsersId from users where slack_id = ?";
	con.query(searchUserid,[slackId],function(err,rows,fields){
		if(rows[0].cntUsersId == 0){
				bot.reply(message,"ユーザデータが登録されていません!");
				return;
		}
		
		// ↓ pokedexテーブルに入力ポケモン名が追加されているかチェック => pokedexの主キー取得
		
		var searchPokemonId = "select *,count(*) as cntPoke from pokedex where name = ?";
		con.query(searchPokemonId,[pokemon],function(err, result){
			if(result[0].cntPoke == 0){
				bot.reply(message,"ポケモン名が間違っているか登録されていません!");
				return;
			}
			var insertDevelopmentTheory = "insert into development_theory(pokemon_id,users_id,finished,url) values (?,?,?,?)";
			con.query(insertDevelopmentTheory,[result[0].id,rows[0].id,finished,url],function(err,res){
				bot.reply(message,"登録完了しました．");
			});
		});
	});
});

// 保存した育成論で，未作成のものを表示.

controller.hears(["(育成論確認)"], [ 'direct_message' ], (bot, message) => {
	var pokemon = message.text.split("\n")[1];
	var slackId;
	var pokemonId;
	var finished = 0;
	
	if(pokemon == undefined){
		bot.reply(message,"2行目にポケモン名を入力してください");
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
	var searchUserid = "select *,count(*) as cntUsersId from users where slack_id = ?";
	con.query(searchUserid,[slackId],function(err,rows,fields){
		if(rows[0].cntUsersId == 0){
			bot.reply(message,"ユーザデータが登録されていません!");
			return;
		}
			
		var searchPokemonId = "select *,count(*) as cntPoke from pokedex where name = ?";
			con.query(searchPokemonId,[pokemon],function(err, result){
			if(result[0].cntPoke == 0){
				bot.reply(message,"ポケモン名が間違っているか登録されていません!");
				return;
			}
			
			var searchDev = "select count(*) as cnt from development_theory where pokemon_id = ? and users_id = ? and finished = ?";
			con.query(searchDev,[result[0].id,rows[0].id,finished],function(err,rows){
				if(rows[0].cnt == 0){
					bot.reply(message,"該当する育成途中の育成論はありません.");
					return;
				}

				var searchDev = "select *,count(*) as cntTheory from development_theory where pokemon_id = ? and users_id = ? and finished = ?";
				con.query(searchDev,[result[0].id,rows[0].id,finished],function(err,res){
					if(res[0].cntTheory == 0){
						bot.reply(message,"該当育成論はありません!");
						return;
					}
					for(var i in res){
						bot.reply(message,res[i].url);
					}
				});
			});
		});
	});
});

// 保存し，未作成の育成論チェック

controller.hears(["(育成論一覧)"], [ 'direct_message' ], (bot, message) => {
	var slackId;
	var finished = 0;
	
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
	var searchUserid = "select *,count(*) as cntUsersId from users where slack_id = ?";
	con.query(searchUserid,[slackId],function(err,rows,fields){
		if(rows[0].cntUsersId == 0){
			bot.reply(message,"ユーザデータが登録されていません!");
			return;
		}
			
		var searchDev = "select *,count(*) as cntpokeTheory from development_theory where users_id = ? and finished = ?";
		con.query(searchDev,[rows[0].id,finished],function(err,result){
			if(result[0].cntpokeTheory == 0){
				bot.reply(message,"育成論はありません");
				return;
			}
			for(var i in result){
				bot.reply(message,result[i].url + "\n");
			}
		});
	});
});

// 育成完了した育成論の記録．

controller.hears(["(育成完了)"], [ 'direct_message' ], (bot, message) => {
	var pokemon = message.text.split("\n")[1];
	var url = message.text.split("\n")[2];
	var slackId;
	var finished = 1;
	
	if(pokemon == undefined || url == undefined){
		bot.reply(message,"2行目にポケモン名、3行目に該当urlを入力してください!");
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
	var searchUserid = "select *,count(*) as cntUsersId from users where slack_id = ?";
	con.query(searchUserid,[user_info.id],function(err,rows,fields){
		if(rows[0].cntUsersId == 0){
			bot.reply(message,"ユーザデータが登録されていません!");
			return;
		}
			
		var searchPokemonId = "select *,count(*) as cntPoke from pokedex where name = ?";
		con.query(searchPokemonId,[pokemon],function(err, result){
			if(result[0].cntPoke == 0){
				bot.reply(message,"該当ポケモンがpokedexに登録されていません");
				return;
			}
				
			var updateDev = "update development_theory set finished = ? where users_id = ? and pokemon_id = ? and url = ?";
			con.query(updateDev,[finished,rows[0].id,result[0].id,url],function(err,rows){
				if(err) console.log('err :' + err);
				bot.reply(message,"変更完了しました!");
			});
		});
	});
});

controller.hears(["(.*)"], [ 'direct_message' ], (bot, message) => {
	bot.reply(message,"*help* 参照");
});