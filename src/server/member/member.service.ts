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

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Client } from 'discord.js';
import { container } from 'tsyringe';
import { VerifiedMemberDto } from './member.dto';

@Injectable()
export class MemberService {

  _client: Client;
  
  constructor() {
    this._client = container.resolve(Client);
  }

  async verifiedMember(verifiedMemberDto: VerifiedMemberDto): Promise<VerifiedMemberDto> {
    const guild = this._client.guilds.resolve(process.env.MAIN_GUILD_ID);
    const member = guild.members.resolve(verifiedMemberDto.discordUserId);

    if (!member) throw new InternalServerErrorException(`Unknown member for ID ${verifiedMemberDto.discordUserId} !`);

    if (verifiedMemberDto.isVerified) {
      await member.roles.remove(process.env.UNVERIFIED_ROLE_ID);
    } else {
      await member.roles.add(process.env.UNVERIFIED_ROLE_ID);
    }

    return verifiedMemberDto;
  } 
}
