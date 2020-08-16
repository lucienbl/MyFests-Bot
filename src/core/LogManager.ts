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

import { Client, Message, GuildMember, MessageEmbed, TextChannel, Role, Channel, User, Guild, VoiceState } from "discord.js";
import { container } from 'tsyringe';

class LogManager {
  static start() {
    new LogManager().setup();
  }

  _client: Client;

  constructor() {
    this._client = container.resolve(Client);
  }

  private setup = () => {
    this._client.on('guildMemberAdd', this._onGuildMemberAdd);
    this._client.on('guildMemberRemove', this._onGuildMemberRemove);
    this._client.on('guildMemberUpdate', this._onGuildMemberUpdate);
    this._client.on('messageUpdate', this._onMessageUpdate);
    this._client.on('messageDelete', this._onMessageDelete);
    this._client.on('messageDeleteBulk', this._onMessageDeleteBulk);
    this._client.on('roleCreate', this._onRoleCreate);
    this._client.on('roleDelete', this._onRoleDelete);
    this._client.on('roleUpdate', this._onRoleUpdate);
    this._client.on('channelCreate', this._onChannelCreate);
    this._client.on('channelDelete', this._onChannelDelete);
    this._client.on('guildBanAdd', this._onGuildBanAdd);
    this._client.on('voiceStateUpdate', this._onVoiceStateUpdate);
  }

  private _send = async (embed: MessageEmbed) => (<TextChannel>await this._client.channels.fetch(process.env.LOG_CHANNEL_ID)).send(embed);

  private _onGuildMemberAdd = (member: GuildMember) => {
    return this._send(new MessageEmbed({
      author: {
        name: member.user.tag,
        iconURL: member.user.displayAvatarURL(),
      },
      description: `${member.user.username} joined the guild !`,
      timestamp: Date.now()
    }));
  };

  private _onGuildMemberRemove = (member: GuildMember) => {
    return this._send(new MessageEmbed({
      author: {
        name: member.user.tag,
        iconURL: member.user.displayAvatarURL(),
      },
      description: `${member.user.username} left the guild !`,
      timestamp: Date.now()
    }));
  };

  private _onGuildMemberUpdate = (previousGuildMember: GuildMember, currentGuildMember: GuildMember) => {
    const roleDiff = previousGuildMember.roles.cache.difference(currentGuildMember.roles.cache).first();
    let description: string;
    if (roleDiff) {
      if (previousGuildMember.roles.cache.array().includes(roleDiff)) description = `Role <@&${roleDiff.id}> removed from <@!${previousGuildMember.id}>!`;
      if (currentGuildMember.roles.cache.array().includes(roleDiff)) description = `Role <@&${roleDiff.id}> added to <@!${previousGuildMember.id}>!`;

      return this._send(new MessageEmbed({
        author: {
          name: previousGuildMember.user.tag,
          iconURL: previousGuildMember.user.displayAvatarURL(),
        },
        description,
        timestamp: Date.now()
      }));
    }
  };

  private _onMessageUpdate = (previousMessage: Message, currentMessage: Message) => {
    if (!currentMessage.toString() || !previousMessage.toString() || (currentMessage.toString() && previousMessage.toString())) return null;
    return this._send(new MessageEmbed({
      author: {
        name: currentMessage.member.user.tag,
        iconURL: currentMessage.member.user.displayAvatarURL(),
      },
      description: "Message Edited",
      fields: [
        {
          name: 'Now',
          value: `\`\`\`${currentMessage.toString()}\`\`\``
        },
        {
          name: 'Previous',
          value: `\`\`\`${previousMessage.toString()}\`\`\``
        }
      ],
      timestamp: Date.now()
    }));
  }

  private _onMessageDelete = (message: Message) => {
    if (!message.toString()) return null;
    return this._send(new MessageEmbed({
      author: {
        name: message.member.user.tag,
        iconURL: message.member.user.displayAvatarURL(),
      },
      description: `\`\`\`${message.toString()}\`\`\``,
      timestamp: Date.now()
    }));
  };

  private _onMessageDeleteBulk = () => {
    return;
  };

  private _onRoleCreate = (role: Role) => {
    return this._send(new MessageEmbed({
      title: "Role Created",
      description: role.toString(),
      timestamp: Date.now()
    }));
  };

  private _onRoleDelete = (role: Role) => {
    return this._send(new MessageEmbed({
      title: "Role Deleted",
      description: role.toString(),
      timestamp: Date.now()
    }));
  };

  private _onRoleUpdate = (previousRole: Role, currentRole: Role) => {
    return this._send(new MessageEmbed({
      title: "Role Updated",
      fields: [
        {
          name: 'Now',
          value: '```json\n' + JSON.stringify(previousRole.toJSON(), null, 2) + '```'
        },
        {
          name: 'Previous',
          value: '```json\n' + JSON.stringify(currentRole.toJSON(), null, 2) + '```'
        }
      ],
      timestamp: Date.now()
    }));
  };

  private _onChannelCreate = (channel: Channel) => {
    return this._send(new MessageEmbed({
      title: "Channel Created",
      description: channel.toString(),
      timestamp: Date.now()
    }));
  };

  private _onChannelDelete = (channel: Channel) => {
    return this._send(new MessageEmbed({
      title: "Channel Deleted",
      description: channel.toString(),
      timestamp: Date.now()
    }));
  };

  private _onGuildBanAdd = (_guild: Guild, user: User) => {
    return this._send(new MessageEmbed({
      author: {
        name: user.tag,
        iconURL: user.displayAvatarURL(),
      },
      description: `<@!${user.id}> banned from the server !`,
      timestamp: Date.now()
    }));
  };

  private _onVoiceStateUpdate = (previousVoiceState: VoiceState, currentVoiceState: VoiceState) => {
    let description: string;
    if (previousVoiceState.channelID && !currentVoiceState.channelID) description = `<@!${currentVoiceState.member.id}> left the voice channel ${previousVoiceState.channel.name} !`;
    if (!previousVoiceState.channelID && currentVoiceState.channelID) description = `<@!${currentVoiceState.member.id}> joined the voice channel ${previousVoiceState.channel.name} !`;
    if (!description) return null;
    
    return this._send(new MessageEmbed({
      author: {
        name: currentVoiceState.member.user.tag,
        iconURL: currentVoiceState.member.user.displayAvatarURL(),
      },
      description,
      timestamp: Date.now()
    }));
  };
}

export default LogManager;