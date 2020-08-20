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
import * as moment from "moment";
import Command from '../Command';
import { VIPManager } from '../../core';

class AddVIPCommand extends Command {

  _vipManager: VIPManager;

  constructor(message: Message) {
    super(message, {
      command: "add-vip",
      args: [
        {
          key: "user",
          description: "The user to give the VIP role.",
          required: true
        },
        {
          key: "duration",
          description: "How much time? (minutes)",
        }
      ],
      allowedRoles: [process.env.COMMUNITY_MODERATOR_ROLE_ID],
      description: "Give a user the VIP role."
    });

    this._vipManager = new VIPManager();
  }

  handler = async () => {
    if (this.argument('duration').value && isNaN(parseInt(this.argument('duration').value))) throw new Error("Duration should be an integer !");

    let endDate = undefined;
    if (this.argument('duration').value) {
      endDate = moment().add(this.argument('duration').value, "m");
    }

    await this._vipManager.addVIP(this.message.mentions.members.first().id, endDate);

    await this.message.channel.send(new MessageEmbed({
      title: "Done !",
      description: `Successfully gave <@${this.message.mentions.members.first().id}> the VIP role. ${endDate ? `The role will be removed **${endDate.fromNow()}**` : `You will need to manually remove the role using the \`${process.env.BOT_PREFIX}remove-vip\` command`}.`
    }));
  }
}

export default AddVIPCommand;