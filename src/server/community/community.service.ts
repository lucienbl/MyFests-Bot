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
import { NewMediaDto, NewEventDto } from './community.dto';

@Injectable()
export class CommunityService {

  _client: Client;
  
  constructor() {
    this._client = container.resolve(Client);
  }

  async newMedia(newMediaDto: NewMediaDto): Promise<NewMediaDto> {
    const channel = <TextChannel>this._client.channels.resolve(process.env.COMMUNITY_UPDATES_CHANNEL_ID);
    await channel.send(new MessageEmbed({
      title: `NEW MEDIA: ${newMediaDto.parent} > ${newMediaDto.title}`,
      description: `By ${newMediaDto.author}\n\n${newMediaDto.link}`,
      color: "#fcc203"
    }).setThumbnail(newMediaDto.thumbnailUrl));

    return newMediaDto;
  } 

  async newEvent(newEventDto: NewEventDto): Promise<NewEventDto> {
    const channel = <TextChannel>this._client.channels.resolve(process.env.COMMUNITY_UPDATES_CHANNEL_ID);
    await channel.send(new MessageEmbed({
      title: `NEW EVENT: ${newEventDto.parent} > ${newEventDto.title}`,
      description: `By ${newEventDto.author}\n\n${newEventDto.link}`,
      color: "#fcc203"
    }).setThumbnail(newEventDto.thumbnailUrl));

    return newEventDto;
  } 
}
