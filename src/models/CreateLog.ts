import { VehicleType } from './VehicleType';

interface CreateLog {
  vehicleType: VehicleType
  enteredAt: Date
  exitedAt: Date
}

export default CreateLog;