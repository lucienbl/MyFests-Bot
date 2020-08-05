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

import { Message } from 'discord.js';

interface Argument {
  key: string;
  value?: string;
  description: string;
  required?: boolean;
}

interface Options {
  command: string;
  args?: Argument[];
  description: string;
}

class Command {

  private _message: Message;
  private _options: Options;

  constructor(message: Message, options: Options) {
    this._message = message;
    this._options = options;
  }

  get message(): Message {
    return this._message;
  }

  get command(): string {
    return this._options.command;
  }

  get payload(): Argument[] {
    const { content } = this._message;

    return this._options.args.map(((arg, index) => {
      const parsedArgs = content.replace(process.env.BOT_PREFIX, "").split(" ").slice(1);
      arg.value = this._options.args.length === index + 1 ? parsedArgs.slice(index).join(" ") : parsedArgs[index];
      return arg;
    }));
  }

  argument = (key: string): Argument => {
    return this.payload.find(arg => arg.key === key);
  }

  get usage(): string {
    return `${process.env.BOT_PREFIX}${this._options.command} ${this._options.args.map(arg => !arg.required ? `[${arg.key}]` : arg.key).join(' ')}`;
  }

  handle = async () => {
    // Check if all the required arguments exists
    if (this._options.args) {
      for (const [index, arg] of this._options.args.entries()) {
        if (!this.payload[index].value && this.payload[index].required) {
          throw new Error(`Missing required argument : \`${arg.key}\` (${arg.description})\n\nUsage : \`${this.usage}\``);
        }
      }
    }
  
    return this.handler();
  }

  handler = async () => {
    // nothing
  }
}

export default Command;