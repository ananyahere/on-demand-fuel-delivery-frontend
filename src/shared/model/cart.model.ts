import { FuelItem, FuelItemDetail } from "./fuel.model";

export interface Cart {
    cartId: string;
    userId: string;
    fuelsInCart: FuelItem[] | null;
    fuelDetailsInCart: FuelItemDetail[] | null;
}


