const winston = require('winston');
const { PrismaWinstonTransporter } = require("winston-prisma-transporter");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const levels = {
  critical: 0,
  warning: 1,
  error: 2,
  info: 3,
  debug: 4,
}

const colors = {
  error: 'blue',
  warning: 'yellow',
  info: 'green',
  critical: 'red',
  debug: 'white',
}

winston.addColors(colors)

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
)

const transports = [
  new PrismaWinstonTransporter({
    prisma,
    tableName: "AccessLogs"
  }),
]

const potatoLogger = winston.createLogger({
  levels,
  format,
  transports,
})

module.exports = potatoLogger