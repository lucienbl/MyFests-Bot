/*
 *   Copyright (c) 2020 Lucien Blunk-Lallet

 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.

 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.

 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Client } from "discord.js";
import "reflect-metadata";
import { container } from 'tsyringe';
import { createConnection, Connection } from "typeorm";
import { Logger } from "./utils";
import { MessageDispatcher, MessageReactionAddDispatcher, MessageReactionRemoveDispatcher, ReadyDispatcher, LogManager, GuildMemberAddDispatcher, MuteManager } from './core';
import { Server } from "./server";
import { ReactionRole, Mute } from './db';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

process.env.TZ = "UTC";

createConnection({
  type: "sqlite",
  database: `./data/db.sqlite`,
  entities: [
    ReactionRole,
    Mute
  ],
  synchronize: true,
  logging: true
}).then(async (connection: Connection) => {
  // setup client
  const client = new Client();

  // setup client listeners
  client.on('message', MessageDispatcher.dispatch);
  client.on('messageReactionAdd', MessageReactionAddDispatcher.dispatch);
  client.on('messageReactionRemove', MessageReactionRemoveDispatcher.dispatch);
  client.on('ready', ReadyDispatcher.dispatch);
  client.on('guildMemberAdd', GuildMemberAddDispatcher.dispatch);

  // login client
  client.login(process.env.BOT_TOKEN).then(() => Logger.info(`Logged in as ${client.user.tag} !`));

  // setup client & db DIs
  container.registerInstance<Client>(Client, client);
  container.registerInstance<Connection>(Connection, connection);

  // start managers
  LogManager.start();
  MuteManager.start();

  // start rest server
  await Server.start();
}).catch(error => Logger.error(error));
