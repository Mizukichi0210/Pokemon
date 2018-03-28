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
	bot.reply(message,"\n>育成論保存\nポケモン名\n該当URL\n>育成論確認\nポケモン名\n>育成論完了\nポケモン名");
});

// 気になる育成論の保存．ポケモン1体につき1つまで．

controller.hears(["(育成論保存)"], [ 'direct_message' ], (bot, message) => {
	var pokemon = message.text.split("\n")[1];
	var url = message.text.split("\n")[2];
	var slackId;
	var pokemonId;
	var finished = 0;
	
	controller.storage.users.get(message.user, function (err, user_info) {
        if (!user_info) {
            user_info = {
                id: message.user,
            };

        }
        controller.storage.users.save(user_info, function (err, id) {
		});
		var searchUserid = "select * from users where slack_id = ?";
		con.query(searchUserid,[user_info.id],function(err,rows,fields){
			if(err) console.log('err : '+ err);
			slackId = rows[0].id;
			
			var searchPokemonId = "select * from pokedex where name = ?";
			con.query(searchPokemonId,[pokemon],function(err, result){
				pokemonId = result[0].id;
				
				var insertDevelopmentTheory = "insert into development_theory(pokemon_id,users_id,finished,url) values (?,?,?,?)";
				con.query(insertDevelopmentTheory,[pokemonId,slackId,finished,url],function(err,res){
					bot.reply(message,"登録完了しました．");
				});
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
	
	controller.storage.users.get(message.user, function (err, user_info) {
        if (!user_info) {
            user_info = {
                id: message.user,
            };

        }
        controller.storage.users.save(user_info, function (err, id) {
		});
		var searchUserid = "select * from users where slack_id = ?";
		con.query(searchUserid,[user_info.id],function(err,rows,fields){
			if(err) console.log('err : '+ err);
			slackId = rows[0].id;
			
			var searchPokemonId = "select * from pokedex where name = ?";
			con.query(searchPokemonId,[pokemon],function(err, result){
				pokemonId = result[0].id;
				var searchDev = "select count(*) as cnt from development_theory where pokemon_id = ? and users_id = ? and finished = ?";
				con.query(searchDev,[pokemonId,slackId,finished],function(err,rows){
					if(rows[0].cnt == 0) bot.reply(message,"該当する育成途中の育成論はありません.");
					else {
						var searchDev = "select * from development_theory where pokemon_id = ? and users_id = ? and finished = ?";
						con.query(searchDev,[pokemonId,slackId,finished],function(err,res){
						bot.reply(message,res[0].url);
						});
					}
				});
			});
		});
	});
});

// 育成完了した育成論の記録．

controller.hears(["(育成論完了)"], [ 'direct_message' ], (bot, message) => {
	var pokemon = message.text.split("\n")[1];
	var slackId;
	var pokemonId;
	var finished = 1;
	
	controller.storage.users.get(message.user, function (err, user_info) {
        if (!user_info) {
            user_info = {
                id: message.user,
            };

        }
        controller.storage.users.save(user_info, function (err, id) {
		});
		var searchUserid = "select * from users where slack_id = ?";
		con.query(searchUserid,[user_info.id],function(err,rows,fields){
			if(err) console.log('err : '+ err);
			slackId = rows[0].id;
			
			var searchPokemonId = "select * from pokedex where name = ?";
			con.query(searchPokemonId,[pokemon],function(err, result){
				pokemonId = result[0].id;
				
				var updateDev = "update development_theory set finished = ? where users_id = ? and pokemon_id = ?";
				con.query(updateDev,[finished,slackId,pokemonId],function(err,rows){
					if(err) console.log('err :' + err);
					bot.reply(message,"変更完了しました!");
				});
			});
		});
	});
});

controller.hears(["(.*)"], [ 'direct_message' ], (bot, message) => {
	bot.reply(message,"*help* 参照");
});