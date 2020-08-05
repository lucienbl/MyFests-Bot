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

import { MessageReaction, User } from 'discord.js';
import { Repository, Connection } from "typeorm";
import { container } from 'tsyringe';
import { ReactionRole } from '../db';

class ReactionRoleManager {

  _messageReaction: MessageReaction;
  _user: User;

  _reactionRolesRepository: Repository<ReactionRole>;

  constructor(messageReaction: MessageReaction, user: User) {
    this._messageReaction = messageReaction;
    this._user = user;

    this._reactionRolesRepository = container.resolve(Connection).getRepository(ReactionRole);
  }

  handle = async (reactionRole: ReactionRole, add?: boolean) => {
    if (add) {
      await this._messageReaction.message.guild.members.resolve(this._user.id).roles.add(reactionRole.reactionRoleId);
    } else {
      await this._messageReaction.message.guild.members.resolve(this._user.id).roles.remove(reactionRole.reactionRoleId);
    }
  }

  filter = async (add: boolean = true) => {
    if (this._user.bot) return;

    const roleReactions = await this._reactionRolesRepository.find({ messageId: this._messageReaction.message.id });

    if (roleReactions.length > 0) {
      let reactionRole = roleReactions.find(rr => rr.reactionEmoji === this._messageReaction.emoji.name);
      if (!reactionRole) {
        reactionRole = roleReactions.find(rr => rr.reactionEmoji === `<:${this._messageReaction.emoji.identifier}>`);
      }
      if (reactionRole) {
        await this.handle(reactionRole, add);
      }
    }
  }
}

export default ReactionRoleManager;