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

import { Message } from 'discord.js';
import { container } from 'tsyringe';
import { Repository, Connection } from 'typeorm';
import Command from '../Command';
import { ReactionRole } from '../../db';

class ReactionRoleListCommand extends Command {

  _reactionRolesRepository: Repository<ReactionRole>;

  constructor(message: Message) {
    super(message, {
      command: "reaction-role-list",
      allowedRoles: [
        process.env.MANAGEMENT_ROLE_ID,
        process.env.DISCORD_MODERATOR_ROLE_ID,
        process.env.ADMINISTRATOR_ROLE_ID
      ],
      description: "Adds a reaction role entry."
    });

    this._reactionRolesRepository = container.resolve(Connection).getRepository(ReactionRole);
  }

  handler = async () => {
    await this.message.delete();

    const reactionRoles = await this._reactionRolesRepository.find();

    await this.message.channel.send(reactionRoles.map(reactionRole => `• ${reactionRole.reactionEmoji} : ${reactionRole.messageId} (<@&${reactionRole.reactionRoleId}>)`).join("\n"));
  }
}

export default ReactionRoleListCommand;