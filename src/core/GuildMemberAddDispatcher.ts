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

import { GuildMember } from "discord.js";
import MemberVerificationManager from './MemberVerificationManager';
import ApiClient from './ApiClient';

class GuildMemberAddDispatcher {

  static async dispatch(guildMember: GuildMember) {
    try {
      await new GuildMemberAddDispatcher(guildMember).dispatch();
    } catch (e) {
      console.log(e);
    }
  }

  _guildMember: GuildMember;

  constructor(guildMember: GuildMember) {
    this._guildMember = guildMember;
  }

  private async dispatch() {
    await this._verify();
  }

  private _verify = async () => {
    const response = await ApiClient.validateDiscordId(this._guildMember.id);
    MemberVerificationManager.verify(response.registered, this._guildMember);
  }
}

export default GuildMemberAddDispatcher;