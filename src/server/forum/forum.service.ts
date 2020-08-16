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

import { Injectable } from '@nestjs/common';
import { Client, TextChannel, MessageEmbed } from 'discord.js';
import { container } from 'tsyringe';
import { NewThreadDto, NewLogDto } from './forum.dto';

@Injectable()
export class ForumService {
  
  _client: Client;
  
  constructor() {
    this._client = container.resolve(Client);
  }

  async newThread(newThreadDto: NewThreadDto): Promise<NewThreadDto> {
    const channel = <TextChannel>this._client.channels.resolve(process.env.FORUM_UPDATES_CHANNEL_ID);
    await channel.send(new MessageEmbed({
      title: `NEW THREAD: ${newThreadDto.parent} > ${newThreadDto.title}`,
      description: `By ${newThreadDto.author}\n\n${newThreadDto.link}`,
      color: newThreadDto.color
    }).setThumbnail(newThreadDto.thumbnailUrl));

    return newThreadDto;
  } 

  async newLog(newLogDto: NewLogDto): Promise<NewLogDto> {
    const channel = <TextChannel>this._client.channels.resolve(process.env.FORUM_LOGS_CHANNEL_ID);
    const user = this._client.users.resolve(newLogDto.discordId);

    await channel.send(new MessageEmbed({
      author: {
        name: user.tag,
        iconURL: user.displayAvatarURL(),
      },
      title: newLogDto.action,
      description: newLogDto.description,
      color: "#f52222"
    }));

    return newLogDto;
  } 

  async newAdminLog(newLogDto: NewLogDto): Promise<NewLogDto> {
    const channel = <TextChannel>this._client.channels.resolve(process.env.FORUM_ADMIN_LOGS_CHANNEL_ID);
    const user = this._client.users.resolve(newLogDto.discordId);

    await channel.send(new MessageEmbed({
      author: {
        name: user.tag,
        iconURL: user.displayAvatarURL(),
      },
      title: newLogDto.action,
      description: newLogDto.description,
      color: "#f52222"
    }));

    return newLogDto;
  } 
}
