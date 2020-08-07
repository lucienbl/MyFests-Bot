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

import { Client, Message, GuildMember, MessageEmbed, TextChannel, Role, Channel, User, Guild } from "discord.js";
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
  }

  private _send = async (embed: MessageEmbed) => (<TextChannel>await this._client.channels.fetch(process.env.LOG_CHANNEL_ID)).send(embed);

  private _onGuildMemberAdd = (member: GuildMember) => {
    return this._send(new MessageEmbed({
      title: "Guild Member Add",
      description: `${member.user.username} joined the guild !`,
      timestamp: Date.now()
    }));
  };

  private _onGuildMemberRemove = (member: GuildMember) => {
    return this._send(new MessageEmbed({
      title: "Guild Member Remove",
      description: `${member.user.username} left the guild !`,
      timestamp: Date.now()
    }));
  };

  private _onGuildMemberUpdate = (previousGuildMember: GuildMember, currentGuildMember: GuildMember) => {
    return this._send(new MessageEmbed({
      title: "Guild Member Update",
      fields: [
        {
          name: 'Now',
          value: currentGuildMember.toString()
        },
        {
          name: 'Previous',
          value: previousGuildMember.toString()
        }
      ],
      timestamp: Date.now()
    }));
  };

  private _onMessageUpdate = (previousMessage: Message, currentMessage: Message) => {
    if (!currentMessage.toString() || !previousMessage.toString()) return null;
    return this._send(new MessageEmbed({
      title: "Message Update",
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
    return this._send(new MessageEmbed({
      title: "Message Delete",
      description: `\`\`\`${message.toString()}\`\`\``,
      timestamp: Date.now()
    }));
  };

  private _onMessageDeleteBulk = () => {
    return;
  };

  private _onRoleCreate = (role: Role) => {
    return this._send(new MessageEmbed({
      title: "Role Create",
      description: role.toString(),
      timestamp: Date.now()
    }));
  };

  private _onRoleDelete = (role: Role) => {
    return this._send(new MessageEmbed({
      title: "Role Delete",
      description: role.toString(),
      timestamp: Date.now()
    }));
  };

  private _onRoleUpdate = (previousRole: Role, currentRole: Role) => {
    return this._send(new MessageEmbed({
      title: "Role Update",
      fields: [
        {
          name: 'Now',
          value: previousRole.toString()
        },
        {
          name: 'Previous',
          value: currentRole.toString()
        }
      ],
      timestamp: Date.now()
    }));
  };

  private _onChannelCreate = (channel: Channel) => {
    return this._send(new MessageEmbed({
      title: "Channel Create",
      description: channel.toString(),
      timestamp: Date.now()
    }));
  };

  private _onChannelDelete = (channel: Channel) => {
    return this._send(new MessageEmbed({
      title: "Channel Delete",
      description: channel.toString(),
      timestamp: Date.now()
    }));
  };

  private _onGuildBanAdd = (_guild: Guild, user: User) => {
    return this._send(new MessageEmbed({
      title: "Guild Ban Add",
      description: user.toString(),
      timestamp: Date.now()
    }));
  };
}

export default LogManager;