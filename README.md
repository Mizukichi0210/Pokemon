# Pokemon Management Tool
Overview

It is Japanese only.

Pokemon management tool using Slack and PHPMyAdmin.

Pokemon.js is the main Bot.

addPokemon.js and addTrainer.js are Bot for registering data for using Pokemon.js.

## Description
Use botkit to manage Pokemon used in network play.

By sending the nickname of Pokemon in a direct message, this Bot responds with detailed data of the corresponding Pokemon.

In addPokemon and addTrainer, if you send help as a direct message, the data input method will be answered in Japanese.

The database structure is as follows.

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
