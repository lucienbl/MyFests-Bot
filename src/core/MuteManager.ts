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

import { Client } from "discord.js";
import { container } from 'tsyringe';
import { Repository, Connection } from 'typeorm';
import * as moment from "moment";
import { Mute } from '../db';

class MuteManager {
  static start() {
    new MuteManager().setup();
  }

  _client: Client;

  _muteRepository: Repository<Mute>;

  constructor() {
    this._client = container.resolve(Client);

    this._muteRepository = container.resolve(Connection).getRepository(Mute);
  }

  private setup = () => {
    setInterval(async () => {
      const mutedMembers = await this._muteRepository.find();
      mutedMembers.forEach(async mutedMember => {
        if (!mutedMember.untilDate) return;
        if (moment(mutedMember.untilDate).isSameOrBefore(moment())) {
          await this.unmute(mutedMember.discordUserId);
        }
      });
    }, 5000);
  }

  public unmute = async (discordUserId: string) => {
    const guild = this._client.guilds.resolve(process.env.MAIN_GUILD_ID);
    const member = guild.members.resolve(discordUserId);
    await member.roles.remove(process.env.MUTED_ROLE_ID);
    const mutedMember = await this._muteRepository.findOne({ where: { discordUserId } });
    await this._muteRepository.remove(mutedMember);
  }

  public mute = async (discordUserId: string, reason?: string, untilDate?: Date) => {
    const guild = this._client.guilds.resolve(process.env.MAIN_GUILD_ID);
    const member = guild.members.resolve(discordUserId);
    await member.roles.add(process.env.MUTED_ROLE_ID);
    const mutedMember = new Mute();
    mutedMember.discordUserId = discordUserId;
    mutedMember.reason = reason;
    mutedMember.untilDate = untilDate;
    await this._muteRepository.save(mutedMember);
  }

  public getMuted = async (): Promise<Mute[]> => {
    return this._muteRepository.find();
  }
}

export default MuteManager;