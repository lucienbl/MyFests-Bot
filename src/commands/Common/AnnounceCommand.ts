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

import { Message, TextChannel } from 'discord.js';
import Command from '../Command';

class AnnounceCommand extends Command {
  constructor(message: Message) {
    super(message, {
      command: "announce",
      args: [
        {
          key: "channel",
          description: "The channel where the announcement should be.",
          required: true
        },
        {
          key: "message",
          description: "The message to send.",
          required: true
        }
      ],
      description: "Announces a message in a specified channel."
    })
  }

  handler = async () => {
    const channel: TextChannel = <TextChannel>this.message.guild.channels.resolve(this.argument("channel").value.match(/[0-9]+/g)[0]);
    if (!channel) throw new Error("Unrecognized channel !");

    await this.message.delete();
    await channel.send(this.argument("message").value);

    await this.message.channel.send("Done !").then(msg => msg.delete({ timeout: 1500 }));
  }
}

export default AnnounceCommand;