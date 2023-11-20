export interface Fuel {
  fuelId: string;
  fuelType: string;
  fuelStock: number;
  fuelStockUnit: string;
  fuelSuppliers: FuelSupplier[] | null;
  basePriceHyd: number;
  basePriceBlr: number;
  basePriceBhu: number;
}

export interface FuelItem {
  fuelItemId: string; // random UUID
  fuelTypeId: string; // mongo-object id
  fuelQuantity: number;
  fuelUnit: string
}

export interface FuelItemDetail {
  fuelItemId: string; 
  fuelTypeId: string; // mongo-object id
  fuelQuantity: number;
  fuelUnit: string
  fuelDetail: FuelDetail;
}

export interface FuelDetail {
  fuelId: string; // mongo-object id
  fuelType: string;
  fuelStock: number;
  fuelStockUnit: string;
  fuelSuppliers: FuelSupplier[];
  basePriceHyd: number;
  basePriceBlr: number;
  basePriceBhu: number;
}

export interface FuelSupplier {
  supplierName: string;
  supplierContactNo: string;
}
