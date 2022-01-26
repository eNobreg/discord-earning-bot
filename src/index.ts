require ('dotenv').config();

import 'reflect-metadata';

import { registerCommands, registerEvents } from './utils/registry';
import config from '../slappey.json';
import DiscordClient from './client/client';
import { Intents, Guild, Collection } from 'discord.js';
import { createConnection, getRepository } from 'typeorm';
import { GuildConfiguration } from './typeorm/entities/GuildConfiguration';


const client = new DiscordClient({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ] });

(async () => {

	await createConnection({
		type: 'mysql',
		host: process.env.DB_HOST,
		port: 3306,
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		synchronize: true,
		entities: [GuildConfiguration],
	});


	//client.prefix = config.prefix || client.prefix;

	const configRepo = getRepository(GuildConfiguration);
	const guildConfigs = await configRepo.find();
	const configs = new Collection<string, GuildConfiguration>();
	guildConfigs.forEach((config) => configs.set(config.guildID, config));


	client.configs = configs;
	console.log(client.configs);


	await registerCommands(client, '../commands');
	await registerEvents(client, '../events');
	await client.login(process.env.DJS_BOT_TOKEN);


})();

