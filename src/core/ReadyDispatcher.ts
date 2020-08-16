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

import { Client, TextChannel, GuildChannel } from 'discord.js';
import { Repository, Connection } from 'typeorm';
import { container } from 'tsyringe';
import { ReactionRole } from '../db';
import { Logger } from '../utils';

class ReadyDispatcher {

  static async dispatch() {
    try {
      await new ReadyDispatcher().init();
    } catch (e) {
      console.log(e);
    }
  }

  _client: Client;
  _reactionRolesRepository: Repository<ReactionRole>;

  constructor() {
    this._client = container.resolve(Client);
    this._reactionRolesRepository = container.resolve(Connection).getRepository(ReactionRole);
  }

  private async init() {
    // cache reaction messages
    const roleReactions = await this._reactionRolesRepository.find();
    roleReactions.forEach(async roleReaction => {
      (<TextChannel>await this._client.channels.fetch(roleReaction.channelId)).messages.fetch(roleReaction.messageId);
    });
    Logger.info("Cached all needed messages !");

    // deny muted to talk in channels
    this._client.channels.cache.forEach(async (channel: GuildChannel) => {
      await channel.createOverwrite(process.env.MUTED_ROLE_ID, {
        SEND_MESSAGES: false,
        SPEAK: false
      }, `Deny muted role to speak / write in #${channel.name}.`);
    });
    Logger.info("Denied @Muted to talk in all channels.");
  }
}

export default ReadyDispatcher;