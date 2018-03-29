# Pokemon Management Tool
Overview

SlackとMySQLを使用したポケモン管理ツール．

pokemon.jsでは，ダイレクトメッセージで該当するメッセージを送信することで，ポケモン・トレーナーの追加方法とあなたが登録したポケモンの確認が行える．

pokeDevBot.jsでは，該当するメッセージを送ることで，育成論URLの追加，途中の育成論の閲覧，育成論の完了を行える．

## Description

botkitを使用したSlackのBotでポケモン関係のデータの閲覧・管理を行う事を主目的としている．

使用しているデータベース構成は以下の通り．

table: pokemon

Column: ID (primary key), level(varchar 4), name(varchar 11), trainer_id(varchar 4), item(varchar 20), move1(varchar 20), move2, move3, move4, effort_value(varchar 25)

table: trainer

Column: ID (primary key), name(varchar 11), trainer_id(varchar 11)

table: pokedex

Column: ID (primary key), name(varchar 7), type1(varchar 6), type2, ability1(varchar 10), ability2, hidden_ability, hp(varchar 4), attack, defense, special_attack, special_defense, speed, sum

table: users

column: id(primary key),name(varchar 10),slack_id(varchar 11)

table:development_theory

Column: id(primary key),pokemon_id(varchar 4),users_id(varchar 5),finished(varchar 2),url(text)

## Requirement
Slack's workspace

Slack's API token

PHPMyAdmin(xampp)

node.js v8.9.4

npm version 5.6.0

Botkit(npm i -S botkit)

mysql(npm install mysql –save)

## Author
Mizukichi0210

https://github.com/Mizukichi0210

Twitter(https://twitter.com/mizukichi_0210)

## Finally

あまり使えるようなものではありませんが，最後まで閲覧ありがとうございます．
iPhoneやAndroidのSlackアプリ，Windows for Slackと全て一緒に使えるのが利点かなーと思っています．

## References
@potato4d : Botkitを利用してSlack上の発言からGitHubのIssueを作成するBotを作る(https://qiita.com/potato4d/items/81e9e8aef6cd57c234af)

@chooser : SlackのBotkitをWindowsで実行する(https://qiita.com/chooser/items/ba6fa39b12102337c8b3)

Jay Raj : NoSQLじゃなくてMySQLを使いたい！Node.jsのmysqlモジュールの使い方(https://www.webprofessional.jp/using-node-mysql-javascript-client/)

イマジン (id:rikapoke) : ポケモンの種族値データシートの配布【第7世代】(http://rikapoke.hatenablog.jp/entry/pokemon_datasheet_gne7)
