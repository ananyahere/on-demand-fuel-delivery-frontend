import { FuelItem, FuelItemDetail } from "./fuel.model";
import { Address } from "./user.model";

export interface Order {
  orderId: string;
  userId: string;
  deliveryLoc: Address;
  deliveryOtp: string | null;
  orderStatus: string;
  totalAmount: number;
  orderTime: string;
  scheduledTime: string | null;
  orderItems: FuelItem[] | null;
  orderItemsWithDetails: FuelItemDetail[] | null;
  immediate: boolean
}
