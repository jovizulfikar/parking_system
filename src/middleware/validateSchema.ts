import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import { OptionalObjectSchema } from 'yup/lib/object';
import { AnyObject } from 'yup/lib/types';

function validateSchema(schema: OptionalObjectSchema<AnyObject>) {
  return async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    try {
      schema.validateSync(req);
    } catch (e: any) {
      const { message } = e;
      return res.status(400).json({ message });
    }

    return next();
  }
}

export default validateSchema;
