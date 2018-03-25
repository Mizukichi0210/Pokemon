# Pokemon Management Tool
Overview

It is Japanese only.

Pokemon management tool using Slack and PHPMyAdmin.

SlackとPHPMyadminを使用したポケモン管理ツール．

By sending help with a direct message, you can check how to add Pokemon Trainer and Pokemon you registered.

ダイレクトメッセージでhelpと送信することで，ポケモン・トレーナーの追加方法とあなたが登録したポケモンの確認が行える．

## Description
Use botkit to manage Pokemon used in network play.

ネット対戦で使用するポケモンの管理をBotkitを使って行う．

The database structure is as follows.

データベース構成は以下の通り．

table: pokemon

Column: ID (primary key), level(varchar 4), name(varchar 11), trainer_id(varchar 4), item(varchar 20), move1(varchar 20), move2, move3, move4, effort_value(varchar 25)

table: trainer

Column: ID (primary key), name(varchar 11), trainer_id(varchar 11)

## Requirement
Slack's workspace

Slack API

PHPMyAdmin(xampp)

Botkit

mysql

## Usage
Slack's Bot using Botkit.

Just send the nickname of Pokemon registered in mysql with a direct message.

## Author
Mizukichi0210

https://github.com/Mizukichi0210


## Finally
Sorry for my poor English.

Thank you for viewing!

日本語が書けることを知ったので，日本語を追加しました．あまり使えるようなものではありませんが，最後まで閲覧ありがとうございます．
