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

import { GuildChannel } from "discord.js";

class ChannelCreateDispatcher {

  static async dispatch(guildChannel: GuildChannel) {
    try {
      await new ChannelCreateDispatcher(guildChannel).dispatch();
    } catch (e) {
      console.log(e);
    }
  }

  _guildChannel: GuildChannel;

  constructor(guildChannel: GuildChannel) {
    this._guildChannel = guildChannel;
  }

  private async dispatch() {
    await this._guildChannel.overwritePermissions([{ id: process.env.MUTED_ROLE_ID, deny: ["SEND_MESSAGES", "SPEAK"] }], `Deny muted role to speak / write in #${this._guildChannel.name}.`);
  }
}

export default ChannelCreateDispatcher;