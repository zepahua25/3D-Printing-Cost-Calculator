import React from 'react';
import type { CostResult } from '../types';
import { PieChart, TrendingUp, DollarSign, Package, Clock, ShieldAlert, Wrench, Box } from 'lucide-react';

interface Props {
    result: CostResult;
}

export const CostBreakdown: React.FC<Props> = ({ result }) => {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);
    };

    return (
        <div className="space-y-6">
            {/* Main Price Card */}
            <div className="bg-gradient-to-br from-brand-900 to-brand-950 rounded-2xl p-8 border border-brand-700 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <DollarSign className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                    <p className="text-brand-200 font-medium mb-1">Precio Final Sugerido</p>
                    <h2 className="text-5xl font-bold text-white tracking-tight mb-2">
                        {formatCurrency(result.finalPrice)}
                    </h2>
                    <div className="flex items-center gap-2 text-brand-200 bg-brand-900/50 w-fit px-3 py-1 rounded-full text-sm">
                        <TrendingUp className="w-4 h-4" />
                        <span>Ganancia neta: {formatCurrency(result.profit)}</span>
                    </div>
                </div>
            </div>

            {/* Breakdown Details */}
            <div className="card">
                <div className="flex items-center gap-2 mb-6">
                    <PieChart className="w-5 h-5 text-brand-500" />
                    <h3 className="text-xl font-bold text-white">Desglose de Costos</h3>
                </div>

                <div className="space-y-4">
                    {/* Material */}
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-md text-blue-400">
                                <Package className="w-4 h-4" />
                            </div>
                            <span className="text-slate-300">Material (Filamento)</span>
                        </div>
                        <span className="font-semibold text-white">{formatCurrency(result.materialCost)}</span>
                    </div>

                    {/* Time */}
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-md text-purple-400">
                                <Clock className="w-4 h-4" />
                            </div>
                            <span className="text-slate-300">Tiempo de Impresión</span>
                        </div>
                        <span className="font-semibold text-white">{formatCurrency(result.timeCost)}</span>
                    </div>

                    {/* Safety Margin */}
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-500/20 rounded-md text-yellow-400">
                                <ShieldAlert className="w-4 h-4" />
                            </div>
                            <span className="text-slate-300">Margen de Protección</span>
                        </div>
                        <span className="font-semibold text-white">{formatCurrency(result.safetyMarginCost)}</span>
                    </div>

                    {/* Post-Processing */}
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pink-500/20 rounded-md text-pink-400">
                                <Wrench className="w-4 h-4" />
                            </div>
                            <span className="text-slate-300">Post-Procesado</span>
                        </div>
                        <span className="font-semibold text-white">{formatCurrency(result.postProcessingCost)}</span>
                    </div>

                    {/* Packaging */}
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/20 rounded-md text-green-400">
                                <Box className="w-4 h-4" />
                            </div>
                            <span className="text-slate-300">Embalaje</span>
                        </div>
                        <span className="font-semibold text-white">{formatCurrency(result.packagingCost)}</span>
                    </div>

                    <div className="border-t border-slate-700 pt-3 mt-2">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-medium">Costo Total de Producción</span>
                            <span className="font-bold text-slate-200">{formatCurrency(result.totalManufactureCost)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
