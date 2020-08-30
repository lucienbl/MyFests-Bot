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

class MutedCommand extends Command {

  _muteManager: MuteManager;

  constructor(message: Message) {
    super(message, {
      command: "muted",
      allowedRoles: [process.env.MANAGEMENT_ROLE_ID],
      description: "List the muted users."
    });

    this._muteManager = new MuteManager();
  }

  handler = async () => {
    const mutedMembers = await this._muteManager.getMuted();
    this.message.channel.send(new MessageEmbed({
      title: "Muted Users",
      description: mutedMembers.length > 0 ? mutedMembers.map(mutedMember => `• <@${mutedMember.discordUserId}> : ${mutedMember.reason || "No reason"} **(Until ${mutedMember.untilDate ? moment(mutedMember.untilDate).fromNow() : "∞"})**`).join('\n') : "None"
    }));
  }
}

export default MutedCommand;