// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildCreate
import { Guild } from 'discord.js';
import BaseEvent from '../utils/structures/BaseEvent';
import DiscordClient from '../client/client';
import { getRepository } from 'typeorm';
import { GuildConfiguration } from '../typeorm/entities/GuildConfiguration';

export default class GuildCreateEvent extends BaseEvent {
	constructor
	(
		private readonly guildConfigRepository = getRepository(GuildConfiguration)
	)
	{
		super('guildCreate');
	}

	async run(client: DiscordClient, guild: Guild) {
		console.log('Hello World');

		const config = await this.guildConfigRepository.findOne({
			guildID: guild.id,
		});

		if (config) 
		{
			console.log("A configuration was found!");
			client.configs.set(guild.id, config);
		} 
		else
		{
			console.log("A configuration was NOT found. Creating one");
			const newConfig = this.guildConfigRepository.create({
				guildID: guild.id,
			});
			const savedConfig = await this.guildConfigRepository.save(newConfig);
			client.configs.set(guild.id, savedConfig);
			console.log(client.configs);
		}
	}
}