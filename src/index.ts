import { error, info, success } from "./__shared/service/logger";

import { Client } from "discord.js";
import { readFileSync } from "fs";
import { onReady } from "./discord-events/ready.event";
import { onMessage } from "./discord-events/message.event";
import { messageReactionAdd } from "./discord-events/messageReactionAdd.event";
import { messageReactionRemove } from "./discord-events/messageReactionRemove.event";
import { Config } from "./__shared/models/config.model";
import { guildDelete } from "./discord-events/guildDelete.event";
success("Loading Dependencies Successfully!");

info("Loading config files...");
require('dotenv').config();
const config: Config = new Config(JSON.parse(readFileSync('./config.json', "utf-8").toString()));


info("Init Discord Client");
const client = new Client({
    partials: [
        'CHANNEL',
        'MESSAGE',
        'REACTION'
    ]
});
export {client, config};

info("Try to login to Discord.js..");
client.on('ready', () => {
    onReady(client);
});


/* Client events */
client.on('message', onMessage);

client.on("messageReactionAdd", messageReactionAdd);
client.on("messageReactionRemove", messageReactionRemove);

client.on("guildDelete", guildDelete);
/*
* END Client events
*/



// Client login
client.login(process.env.DISCORD_TOKEN).catch((err) => {
    if (err.code == "TOKEN_INVALID") {
        error(`Invalid Discord Token: ${process.env.DISCORD_TOKEN}`);
    } else {
        error(err);
    }
});