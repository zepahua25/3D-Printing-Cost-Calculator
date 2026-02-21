export interface CalculatorState {
    filamentWeight: number; // grams
    spoolCost: number; // Cost for 1kg
    selectedProfileId: string | null; // null means custom
    printTime: number; // hours
    hourlyCost: number; // Total hourly rate (Machine + Ops + Maintenance)
    postProcessingCost: number; // $/unit
    packagingCost: number; // $/unit
    margin: number; // Profit margin percentage (e.g., 30 for 30%)
    riskMargin: number; // Safety/Risk margin percentage (e.g., 10 for 10%)
}

export type MaterialType = 'PLA' | 'PETG' | 'TPU' | 'ABS' | 'ASA' | 'Otro';

export interface FilamentProfile {
    id: string;
    name: string;
    material: MaterialType;
    brand: string;
    price: number; // Cost for 1kg
}

export interface GlobalSettings {
    // Monthly Operational Costs
    monthlyPowerCost: number; // Total monthly electricity bill
    monthlyInternet: number;
    monthlyRentAndExtras: number; // Rent, water, employees, etc.
    monthlyMaintenance: number; // Maintenance budget

    // Machine Parameters
    machineCost: number; // Cost of one printer
    machineAmortizationMonths: number; // Months to return investment

    // Work Parameters
    workDaysPerMonth: number;
    workHoursPerDay: number; // Expected print hours per day (sum of all printers if applicable, but per machine for unit calc)

    // Filament Profiles
    filamentProfiles: FilamentProfile[];
}

export interface CostResult {
    materialCost: number;
    timeCost: number;
    baseManufactureCost: number;
    safetyMarginCost: number;
    postProcessingCost: number;
    packagingCost: number;
    totalManufactureCost: number;
    finalPrice: number;
    profit: number;
}
