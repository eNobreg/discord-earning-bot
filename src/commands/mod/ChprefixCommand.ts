import { Message } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';
import { getRepository } from 'typeorm';
import { GuildConfiguration } from '../../typeorm/entities/GuildConfiguration';

export default class ChprefixCommand extends BaseCommand {
  constructor (
	private readonly guildConfigRepository = getRepository(GuildConfiguration)
  ) {
    super('chprefix', 'mod', []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
	if (!args.length) {
		message.channel.send("Please provide an argument!");
		return;
	}

	const [newPrefix] = args;
	try {
		await this.guildConfigRepository.update
		(
			{ guildID: message.guildId! }, 
			{prefix: newPrefix}
		);
		message.channel.send("Updated prefix!");

	} catch (err) {
		console.log(err);
		message.channel.send("Something went wrong.");
	}
  }
}