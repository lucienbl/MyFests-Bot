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
import { VIP } from '../db';

class VIPManager {
  static start() {
    new VIPManager().setup();
  }

  _client: Client;

  _vipRepository: Repository<VIP>;

  constructor() {
    this._client = container.resolve(Client);

    this._vipRepository = container.resolve(Connection).getRepository(VIP);
  }

  private setup = () => {
    setInterval(async () => {
      const vipMembers = await this._vipRepository.find();
      vipMembers.forEach(async vipMember => {
        if (!vipMember.untilDate) return;
        if (moment(vipMember.untilDate).isSameOrBefore(moment())) {
          await this.removeVIP(vipMember.discordUserId);
        }
      });
    }, 5000);
  }

  public removeVIP = async (discordUserId: string) => {
    const guild = this._client.guilds.resolve(process.env.MAIN_GUILD_ID);
    const member = guild.members.resolve(discordUserId);
    await member.roles.remove(process.env.VIP_ROLE_ID);
    const vipMember = await this._vipRepository.findOne({ where: { discordUserId } });
    await this._vipRepository.remove(vipMember);
  }

  public addVIP = async (discordUserId: string, untilDate?: Date) => {
    const guild = this._client.guilds.resolve(process.env.MAIN_GUILD_ID);
    const member = guild.members.resolve(discordUserId);
    await member.roles.add(process.env.VIP_ROLE_ID);
    const vipMember = new VIP();
    vipMember.discordUserId = discordUserId;
    vipMember.untilDate = untilDate;
    await this._vipRepository.save(vipMember);
  }

  public getVIP = async (): Promise<VIP[]> => {
    return this._vipRepository.find();
  }
}

export default VIPManager;