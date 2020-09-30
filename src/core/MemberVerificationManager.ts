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

import { Client, GuildMember, MessageEmbed, TextChannel } from "discord.js";
import { container } from 'tsyringe';

class MemberVerificationManager {
  static verify(isVerified: boolean = true, member: GuildMember) {
    new MemberVerificationManager()._verify(isVerified, member);
  }

  _client: Client;

  constructor() {
    this._client = container.resolve(Client);
  }

  private _send = async (embed: MessageEmbed) => (<TextChannel>await this._client.channels.fetch(process.env.VERIFIED_UPDATES_CHANNEL_ID)).send(embed);

  private _verify = async (isVerified: boolean, member: GuildMember) => {
    if (isVerified) {
      await member.roles.remove(process.env.UNVERIFIED_ROLE_ID);
      this._send(new MessageEmbed({
        title: "New Rise To Fame!",
        description: `Please congratulate <@${member.id}> on verifying their discord! 💖`,
        color: "#FF8800"
      }).setFooter('Want to join the staff team? Check out #job-rallying!').setThumbnail(member.user.displayAvatarURL()));
    } else {
      await member.roles.add(process.env.UNVERIFIED_ROLE_ID);
    }
  }
}

export default MemberVerificationManager;