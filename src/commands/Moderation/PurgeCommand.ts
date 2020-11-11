/*
 *   Copyright (c) 2020 James Timms
 *   
 *   This is a simple purge command for the MyFests discord bot
 * 
 */

import { Message, MessageEmbed } from 'discord.js';
import * as moment from "moment";
import Command from '../Command';

class PurgeCommand extends Command {
    constructor(message: Message) {
        super(message, {
          command: "purge",
          args: [
            {
              key: "amount",
              description: "How many messages to delete (Max 100).",
              required: true
            },
          ],
          allowedRoles: [
            process.env.MANAGEMENT_ROLE_ID,
            process.env.DISCORD_MODERATOR_ROLE_ID,
            process.env.ADMINISTRATOR_ROLE_ID
          ],
          description: "Removes the last 1-100 messages."
        });
    }

    handler = async () => {
        if (this.argument('amount').value && isNaN(parseInt(this.argument('amount').value))) throw new Error("Amount should be an integer !");
        if (this.argument('amount').value > 100) throw new Error("Amount should be less than 100 !");
    
        await this.message.channel.bulkDelete(this.argument('amount');
        await this.message.channel.send(new MessageEmbed({
          title: "Done !",
          description: `Successfully deleted ${this.argument('amount')} messages from the channel !`
        }));
      }
    }
    
    export default PurgeCommand;