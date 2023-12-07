export interface Address {
    addressId: string | null;
    type: string;
    receiver: string;
    phone: string;
    location: string;
    city: string;
}

export interface Vehicle {
    vehicleId: string | null;
    vehicleModel: string;
    vehicleColor: string;
    vehicleFuelType: string;
    vehicleCarType: string;
}

export interface User {
  userId: string;
  name: string;
  email: string;
  addresses: Address[];
  vehicles: Vehicle[];
  paymentMethods: string[];
}




