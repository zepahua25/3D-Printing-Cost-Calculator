import React from 'react';
import type { CalculatorState, FilamentProfile } from '../types';
import { Calculator, Clock, Package, DollarSign, Percent, Box, Wrench, Lock } from 'lucide-react';

interface Props {
    values: CalculatorState;
    onChange: (field: keyof CalculatorState, value: any) => void;
    profiles: FilamentProfile[];
}

export const CalculatorForm: React.FC<Props> = ({ values, onChange, profiles }) => {
    const handleNumberChange = (field: keyof CalculatorState) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value) || 0;

        if (field === 'spoolCost') {
            onChange('selectedProfileId', null); // Setting custom profile
        }
        onChange(field, val);
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const profileId = e.target.value;
        onChange('selectedProfileId', profileId === 'custom' ? null : profileId);

        if (profileId !== 'custom') {
            const profile = profiles.find(p => p.id === profileId);
            if (profile) {
                onChange('spoolCost', profile.price);
            }
        }
    };

    return (
        <div className="card space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-5 h-5 text-brand-500" />
                <h2 className="text-xl font-bold text-white">Configuración de Impresión</h2>
            </div>

            <div className="space-y-6">
                {/* Material Section */}
                <div className="space-y-4 pt-2">
                    <h3 className="text-sm uppercase tracking-wider text-brand-500 font-semibold flex items-center gap-2">
                        <Package className="w-4 h-4" /> Material y Tiempo
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label-text">Peso del Modelo (g)</label>
                            <input
                                type="number"
                                className="input-field"
                                value={values.filamentWeight}
                                onChange={handleNumberChange('filamentWeight')}
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="label-text">Perfil de Filamento</label>
                            <select
                                className="input-field appearance-none bg-slate-800 border border-slate-700 text-slate-200"
                                value={values.selectedProfileId || 'custom'}
                                onChange={handleProfileChange}
                            >
                                {profiles.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} ({p.brand})
                                    </option>
                                ))}
                                <option value="custom">Personalizado</option>
                            </select>
                        </div>
                        <div>
                            <label className="label-text">Costo Bobina 1kg ($)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <input
                                    type="number"
                                    className="input-field !pl-10"
                                    value={values.spoolCost}
                                    onChange={handleNumberChange('spoolCost')}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="label-text">Tiempo de Impresión (horas)</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <input
                                    type="number"
                                    className="input-field !pl-10"
                                    value={values.printTime}
                                    onChange={handleNumberChange('printTime')}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="label-text flex items-center gap-1">
                                Costo por Hora ($)
                                <span className="text-xs text-brand-400 font-medium">(Auto)</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-4 h-4 text-yellow-500/50" />
                                <input
                                    type="number"
                                    className="input-field !pl-10 bg-slate-800/50 text-slate-400 border-slate-700/50"
                                    value={values.hourlyCost}
                                    readOnly
                                    title="Configura esto en el botón de Configuración"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800"></div>

                {/* Post-Processing & Extras Section */}
                <div className="space-y-4">
                    <h3 className="text-sm uppercase tracking-wider text-brand-500 font-semibold flex items-center gap-2">
                        <Wrench className="w-4 h-4" /> Post-Procesado y Extras
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label-text">Costo Post-Procesado ($)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <input
                                    type="number"
                                    className="input-field !pl-10"
                                    value={values.postProcessingCost}
                                    onChange={handleNumberChange('postProcessingCost')}
                                    placeholder="0"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Lijado, pintura, acabados</p>
                        </div>
                        <div>
                            <label className="label-text">Costo Embalaje ($)</label>
                            <div className="relative">
                                <Box className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <input
                                    type="number"
                                    className="input-field !pl-10"
                                    value={values.packagingCost}
                                    onChange={handleNumberChange('packagingCost')}
                                    placeholder="0"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Caja, bolsa, protección</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800"></div>

                {/* Margins Section */}
                <div>
                    <h3 className="text-sm uppercase tracking-wider text-brand-500 font-semibold flex items-center gap-2 mb-4">
                        <Percent className="w-4 h-4" /> Márgenes
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label-text">Margen de Ganancia (%)</label>
                            <input
                                type="number"
                                className="input-field"
                                value={values.margin}
                                onChange={handleNumberChange('margin')}
                                placeholder="30"
                            />
                        </div>
                        <div>
                            <label className="label-text flex items-center gap-1">
                                Margen de Protección (%)
                                <span className="text-xs text-slate-500" title="Protección ante fallos">(Riesgo)</span>
                            </label>
                            <input
                                type="number"
                                className="input-field"
                                value={values.riskMargin}
                                onChange={handleNumberChange('riskMargin')}
                                placeholder="10"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
