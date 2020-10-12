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
import { MuteManager } from '../../core';

class MuteCommand extends Command {

  _muteManager: MuteManager;

  constructor(message: Message) {
    super(message, {
      command: "mute",
      args: [
        {
          key: "user",
          description: "The user to mute",
          required: true
        },
        {
          key: "reason",
          description: "The reason of the mute (in seconds).",
        },
        {
          key: "duration",
          description: "How much time? (minutes)",
        }
      ],
      allowedRoles: [
        process.env.MANAGEMENT_ROLE_ID,
        process.env.DISCORD_MODERATOR_ROLE_ID,
        process.env.ADMINISTRATOR_ROLE_ID
      ],
      description: "Mute a user."
    });

    this._muteManager = new MuteManager();
  }

  handler = async () => {
    if (this.argument('duration').value && isNaN(parseInt(this.argument('duration').value))) throw new Error("Duration should be an integer !");

    let endDate = undefined;
    if (this.argument('duration').value) {
      endDate = moment().add(this.argument('duration').value, "m");
    }

    await this._muteManager.mute(this.message.mentions.members.first().id, this.argument('reason').value, endDate);

    await this.message.channel.send(new MessageEmbed({
      title: "Done !",
      description: `Successfully muted <@${this.message.mentions.members.first().id}>. ${endDate ? `They will be unmuted **${endDate.fromNow()}**` : `You will need to manually unmute him using the \`${process.env.BOT_PREFIX}unmute\` command`}.\n\n__Reason :__\`\`\`${this.argument('reason').value || "No reason"}\`\`\``
    }));
  }
}

export default MuteCommand;
