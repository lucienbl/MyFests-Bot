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

class ReactionRoleAddCommand extends Command {

  _reactionRolesRepository: Repository<ReactionRole>;

  constructor(message: Message) {
    super(message, {
      command: "reaction-role-add",
      args: [
        {
          key: "messageId",
          description: "The ID of the message the reaction should be added to.",
          required: true
        },
        {
          key: "emoji",
          description: "The emoji to react.",
          required: true
        },
        {
          key: "roleId",
          description: "The ID of the role to add if someone reacts.",
          required: true
        }
      ],
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
    const message = (await this.message.channel.messages.fetch()).find(msg => msg.id === this.argument("messageId").value);
    const role = await this.message.guild.roles.fetch(this.argument('roleId').value);
    let emoji: any = this.message.guild.emojis.resolve("emoji") || this.argument("emoji").value;

    if (!message) throw new Error(`We didn't find any message corresponding to the ID ${this.argument("messageId").value} in this channel. Please try again !`);
    if (!role) throw new Error(`We didn't find any role corresponding to the ID ${this.argument("roleId").value} on this guild. Please try again !`);

    const reactionRole = new ReactionRole();
    reactionRole.messageId = message.id;
    reactionRole.reactionRoleId = role.id;
    reactionRole.reactionEmoji = emoji.name || emoji;
    reactionRole.channelId = message.channel.id;

    await this._reactionRolesRepository.save(reactionRole);

    await this.message.delete();

    await message.react(reactionRole.reactionEmoji.split(">")[0]);

    await this.message.channel.send("Done !").then(msg => msg.delete({ timeout: 1500 }));
  }
}

export default ReactionRoleAddCommand;