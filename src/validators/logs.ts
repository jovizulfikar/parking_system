import moment from 'moment';
import * as yup from 'yup';
import { VehicleType } from '../models/VehicleType';

export const postLogSchema = yup.object().shape({
  body: yup.object().shape({
    vehicleType: yup.string().oneOf(Object.values(VehicleType)).required(),
    enteredAt: yup.date().required(),
    exitedAt: yup.date().required(),
  }),
});

export const getLogsSchema = yup.object().shape({
  query: yup.object().shape({
    vehicleType: yup.string().oneOf([...Object.values(VehicleType), ""]),
    minEnterDate: yup.lazy((value) => (value === '' ? yup.string() : yup.date())),
    maxEnterDate: yup.lazy((value) => (value === '' ? yup.string() : yup.date())),
    minPrice: yup.lazy((value) => (value === '' ? yup.string() : yup.number())),
    maxPrice: yup.lazy((value) => (value === '' ? yup.string() : yup.number())),
  })
})