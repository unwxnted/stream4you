import { PrismaClient } from "@prisma/client";
import { Client } from "@elastic/elasticsearch";

export const prisma = new PrismaClient();
export const esClient = new Client({node:process.env.ES_CLIENT});

