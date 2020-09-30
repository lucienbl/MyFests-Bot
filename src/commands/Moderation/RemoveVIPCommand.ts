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

import { Message, MessageEmbed } from 'discord.js';
import Command from '../Command';
import { VIPManager } from '../../core';

class RemoveVIPCommand extends Command {

  _vipManager: VIPManager;

  constructor(message: Message) {
    super(message, {
      command: "remove-vip",
      args: [
        {
          key: "user",
          description: "The user to remove the VIP role.",
          required: true
        },
      ],
      allowedRoles: [
        process.env.MANAGEMENT_ROLE_ID,
        process.env.DISCORD_MODERATOR_ROLE_ID,
        process.env.ADMINISTRATOR_ROLE_ID
      ],
      description: "Removes the VIP role from a user."
    });

    this._vipManager = new VIPManager();
  }

  handler = async () => {
    await this._vipManager.removeVIP(this.message.mentions.members.first().id);
    
    await this.message.channel.send(new MessageEmbed({
      title: "Done !",
      description: `Successfully removed the VIP role from <@${this.message.mentions.members.first().id}>.`
    }));
  }
}

export default RemoveVIPCommand;