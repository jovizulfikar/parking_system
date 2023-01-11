import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import middleware, { ExtendedRequest } from '../../middleware';
import validateSchema from '../../middleware/validateSchema';
import { VehicleType } from '../../models/VehicleType';
import { getLogsSchema, postLogSchema } from '../../validators/logs';

const router = nextConnect<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Something went wrong." });
  }
});

router.use(middleware);

router.post<ExtendedRequest>(validateSchema(postLogSchema), async (req, res) => {
  const { logService, body } = req;
  const { vehicleType, enteredAt, exitedAt } = body;
  const result = await logService.createLog({
    vehicleType,
    enteredAt: new Date(enteredAt),
    exitedAt: new Date(exitedAt)
  });
  res.status(200).json(result);
})

router.get<ExtendedRequest>(validateSchema(getLogsSchema), async (req, res) => {
  const { logService, query } = req;
  const { vehicleType, minEnterDate, maxEnterDate, minPrice, maxPrice } = query;
  const result = await logService.getLogs({
    vehicleType: vehicleType ? vehicleType as VehicleType : undefined,
    minEnterDate: minEnterDate ? new Date(minEnterDate as string) : undefined,
    maxEnterDate: maxEnterDate ? new Date(maxEnterDate as string) : undefined,
    minPrice: minPrice ? +minPrice : undefined,
    maxPrice: maxPrice ? +maxPrice : undefined
  });
  res.status(200).json(result);
})

export default router;

