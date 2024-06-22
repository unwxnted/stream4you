import { PrismaClient } from "@prisma/client";
import { Client } from "@elastic/elasticsearch";
import { createClient } from "redis";

const redisClient = createClient();

redisClient.on('error', (err) => console.log('Redis Client Error', err));

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

connectRedis().catch(console.error);

export const prisma = new PrismaClient();
export const esClient = new Client({node:process.env.ES_CLIENT});
export const redis = redisClient;
