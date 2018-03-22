# Pokemon Management Tool
Overview
Pokemon management tool using Slack and PHPMyAdmin.

## Description
Use botkit to manage Pokemon used in network play.

By sending the nickname of Pokemon in a direct message, this Bot responds with detailed data of the corresponding Pokemon.

I did not create an app to register.
It will be created in the future.

The database structure is as follows.

table: pokemon

Column: ID (primary key), level(varchar 4), name(varchar 11), trainer_id(varchar 4), item(varchar 20), move1(varchar 20), move2, move3, move4, effort_value(varchar 25)

table: trainer

Column: ID (primary key), name(varchar 11), trainer_id(varchar 11)

## Requirement
Botkit

mysql

## Usage
Slack's Bot using Botkit.

## Author
Mizukichi0210

https://github.com/Mizukichi0210
