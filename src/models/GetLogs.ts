import { VehicleType } from './VehicleType';

interface GetLogs {
  vehicleType?: VehicleType
  minEnterDate?: Date
  maxEnterDate?: Date
  minPrice?: number
  maxPrice?: number 
}

export default GetLogs;
