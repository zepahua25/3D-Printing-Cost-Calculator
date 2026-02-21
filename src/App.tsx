import { useState, useMemo, useEffect } from 'react';
import { CalculatorForm } from './components/CalculatorForm';
import { CostBreakdown } from './components/CostBreakdown';
import { SettingsForm } from './components/SettingsForm';
import type { CalculatorState, CostResult, GlobalSettings } from './types';
import { Settings } from 'lucide-react';

function App() {
  const [showSettings, setShowSettings] = useState(false);

  // Default settings from Excel
  const [settings, setSettings] = useState<GlobalSettings>({
    monthlyPowerCost: 120,
    monthlyInternet: 200,
    monthlyRentAndExtras: 3700, // 3500 + 200 ads
    monthlyMaintenance: 400,
    machineCost: 8500, // Adjusted to A1 price, Excel was 12000
    machineAmortizationMonths: 24,
    workDaysPerMonth: 24,
    workHoursPerDay: 10,
    filamentProfiles: [
      { id: 'default-pla', name: 'PLA Genérico', material: 'PLA', brand: 'Genérica', price: 350 }
    ]
  });

  // Calculate hourly rate based on settings
  const calculatedHourlyRate = useMemo(() => {
    const totalMonthlyHours = settings.workDaysPerMonth * settings.workHoursPerDay;
    if (totalMonthlyHours === 0) return 0;

    const hourlyOperational = (settings.monthlyPowerCost + settings.monthlyInternet + settings.monthlyRentAndExtras + settings.monthlyMaintenance) / totalMonthlyHours;
    const hourlyMachine = settings.machineCost / (totalMonthlyHours * settings.machineAmortizationMonths);

    return hourlyOperational + hourlyMachine;
  }, [settings]);

  const [values, setValues] = useState<CalculatorState>({
    filamentWeight: 0,
    spoolCost: 350,
    selectedProfileId: 'default-pla',
    printTime: 0,
    hourlyCost: 20.50, // Will be updated by effect
    postProcessingCost: 0,
    packagingCost: 0,
    margin: 30,
    riskMargin: 10,
  });

  // Update hourly cost when settings change
  useEffect(() => {
    setValues(prev => ({ ...prev, hourlyCost: parseFloat(calculatedHourlyRate.toFixed(2)) }));
  }, [calculatedHourlyRate]);

  const handleChange = (field: keyof CalculatorState, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const results: CostResult = useMemo(() => {
    // 1. Material Cost
    const materialCost = (values.filamentWeight / 1000) * values.spoolCost;

    // 2. Time Cost (Hourly Rate * Hours)
    const timeCost = values.printTime * values.hourlyCost;

    // 3. Base Manufacture Cost
    const baseManufactureCost = materialCost + timeCost;

    // 4. Safety Margin Calculation (Cost / (1 - margin))
    const costWithSafetyMargin = baseManufactureCost / (1 - (values.riskMargin / 100));
    const safetyMarginCost = costWithSafetyMargin - baseManufactureCost;

    // 5. Total Manufacture Cost
    const postProcessingCost = values.postProcessingCost;
    const packagingCost = values.packagingCost;
    const totalManufactureCost = costWithSafetyMargin + postProcessingCost + packagingCost;

    // 6. Final Price
    const finalPrice = totalManufactureCost / (1 - (values.margin / 100));

    // 7. Profit
    const profit = finalPrice - totalManufactureCost;

    return {
      materialCost,
      timeCost,
      baseManufactureCost,
      safetyMarginCost,
      postProcessingCost,
      packagingCost,
      totalManufactureCost,
      finalPrice,
      profit
    };
  }, [values]);

  return (
    <div className="min-h-screen bg-dark-bg text-slate-200 py-12 px-4 selection:bg-brand-500 selection:text-white">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <header className="flex items-center justify-between mb-12 border-b border-slate-800 pb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-900/30 rounded-xl border border-brand-800 text-brand-500 overflow-hidden">
              <img src="../public/INFILLStudio3D_dark.png" alt="Infill Studio 3D" className="w-12 h-12 object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Infill Studio 3D</h1>
              <p className="text-slate-400">Calculadora de Costos Profesional &bull; Bambu Lab A1</p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
          >
            <Settings className="w-5 h-5" />
            <span className="hidden sm:inline">Configuración</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <CalculatorForm values={values} onChange={handleChange} profiles={settings.filamentProfiles} />
          </div>
          <div className="lg:col-span-5">
            <div className="sticky top-8">
              <CostBreakdown result={results} />

              <div className="mt-6 p-4 bg-brand-900/20 border border-brand-900/30 rounded-lg text-sm text-brand-200/80">
                <p>Costo por Hora actual: <strong>${values.hourlyCost.toFixed(2)}</strong> (Basado en configuración)</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {showSettings && (
        <SettingsForm
          settings={settings}
          onSave={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
