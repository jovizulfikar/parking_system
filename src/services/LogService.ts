import { PrismaClient } from '@prisma/client';
import prisma from '../lib/prisma';
import CreateLog from '../models/CreateLog';
import GetLogs from '../models/GetLogs';
import { VehicleType } from '../models/VehicleType';

export default class LogService {
  private db: PrismaClient;

  constructor() {
    this.db = prisma;
  }

  async createLog(params: CreateLog) {
    const { vehicleType, enteredAt, exitedAt } = params;
    const basePrice = vehicleType === VehicleType.Car ? 5000 : 2000;
    const perDayRate = vehicleType === VehicleType.Car ? 80000 : 40000;
    const timeDiff = exitedAt.getTime() - enteredAt.getTime();
    const timeDiffInHours = Math.floor(timeDiff / 3600000);
    const timeDiffInDays = Math.floor(timeDiffInHours / 24);
    const timeMod = timeDiff % 3600000;

    let price = timeDiffInHours * basePrice
    if (timeMod >= 60000) {
      price += basePrice
    }

    price -= timeDiffInDays * (basePrice * 24 - perDayRate);

    const log = await this.db.log.create({ data: { ...params, price } });
    return log;
  }

  async getLogs(params?: GetLogs) {
    const { vehicleType, minEnterDate, maxEnterDate, minPrice, maxPrice } = params || {};

    const logs = await this.db.log.findMany({
      where: {
        vehicleType,
        enteredAt: {
          gte: minEnterDate,
          lte: maxEnterDate,
        },
        price: {
          gte: minPrice,
          lte: maxPrice
        }
      }
    });

    return logs;
  }
}