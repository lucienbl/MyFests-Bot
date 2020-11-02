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
import { NewMediaDto, NewEventDto, NewRadioDto, NewFurniDto } from './community.dto';

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
      color: newMediaDto.color
    }).setThumbnail(newMediaDto.thumbnailUrl));

    return newMediaDto;
  } 

  async newEvent(newEventDto: NewEventDto): Promise<NewEventDto> {
    const channel = <TextChannel>this._client.channels.resolve(process.env.COMMUNITY_UPDATES_CHANNEL_ID);
    await channel.send("@here");
    await channel.send(new MessageEmbed({
      title: `NEW EVENT: ${newEventDto.parent} > ${newEventDto.title}`,
      description: `By ${newEventDto.author}\n\n${newEventDto.link}`,
      color: newEventDto.color
    }).setThumbnail(newEventDto.thumbnailUrl));

    return newEventDto;
  } 

  async newRadio(newRadioDto: NewRadioDto): Promise<NewRadioDto> {
    const channel = <TextChannel>this._client.channels.resolve(process.env.COMMUNITY_UPDATES_CHANNEL_ID);
    await channel.send(new MessageEmbed({
      title: `NEW RADIO SLOT: ${newRadioDto.title}`,
      description: `By ${newRadioDto.author}\n\n${newRadioDto.link}`,
      color: newRadioDto.color
    }).setThumbnail(newRadioDto.thumbnailUrl));

    return newRadioDto;
  } 
  
   async newFurni(newFurniDto: NewFurniDto): Promise<NewFurniDto> {
    const channel = <TextChannel>this._client.channels.resolve(process.env.MARKETPLACE_CHANNEL_ID);
    await channel.send(new MessageEmbed({
      title: `NEW MARKETPLACE TRADE: ${newFurniDto.furni}`,
      description: `Value ${newFurniDto.value}\n\n${newFurniDto.link}`
    }).setThumbnail(newRadioDto.thumbnailUrl));

    return newFurniDto;
  } 
}
