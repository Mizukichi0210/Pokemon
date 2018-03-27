# Pokemon Management Tool
Overview

It is Japanese only.

Pokemon management tool using Slack and MySQL.

SlackとMySQLを使用したポケモン管理ツール．

By sending help with a direct message, you can check how to add Pokemon Trainer and Pokemon you registered.

ダイレクトメッセージでhelpと送信することで，ポケモン・トレーナーの追加方法とあなたが登録したポケモンの確認が行える．

## Description
As a main objective,use botkit to manage Pokemon used in network play.

主目的として，ネット対戦で使用するポケモンの管理をBotkitを使って行う．

The database structure is as follows.

データベース構成は以下の通り．

table: pokemon

Column: ID (primary key), level(varchar 4), name(varchar 11), trainer_id(varchar 4), item(varchar 20), move1(varchar 20), move2, move3, move4, effort_value(varchar 25)

table: trainer

Column: ID (primary key), name(varchar 11), trainer_id(varchar 11)

table: pokedex

Column: ID (primary key), name(varchar 7), type1(varchar 6), type2, ability1(varchar 10), ability2, hidden_ability, hp(varchar 4), attack, defense, special_attack, special_defense, speed, sum

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
Sorry for my poor English.

Thank you for viewing!

日本語が書けることを知ったので，日本語を追加しました．

あまり使えるようなものではありませんが，最後まで閲覧ありがとうございます．

## References
@potato4d : Botkitを利用してSlack上の発言からGitHubのIssueを作成するBotを作る(https://qiita.com/potato4d/items/81e9e8aef6cd57c234af)

@chooser : SlackのBotkitをWindowsで実行する(https://qiita.com/chooser/items/ba6fa39b12102337c8b3)

Jay Raj : NoSQLじゃなくてMySQLを使いたい！Node.jsのmysqlモジュールの使い方(https://www.webprofessional.jp/using-node-mysql-javascript-client/)

イマジン (id:rikapoke) : ポケモンの種族値データシートの配布【第7世代】(http://rikapoke.hatenablog.jp/entry/pokemon_datasheet_gne7)
