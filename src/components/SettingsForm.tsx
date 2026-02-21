import React from 'react';
import type { GlobalSettings, FilamentProfile, MaterialType } from '../types';
import { X, Save, Zap, Home, Wrench, Printer, Calendar, Plus, Trash2, Package } from 'lucide-react';

interface Props {
    settings: GlobalSettings;
    onSave: (newSettings: GlobalSettings) => void;
    onClose: () => void;
}

export const SettingsForm: React.FC<Props> = ({ settings, onSave, onClose }) => {
    const [localSettings, setLocalSettings] = React.useState<GlobalSettings>(settings);

    // Default form values for new profile
    const [newProfile, setNewProfile] = React.useState<Partial<FilamentProfile>>({
        material: 'PLA',
        brand: '',
        name: '',
        price: 350
    });

    const handleChange = (field: keyof GlobalSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value) || 0;
        setLocalSettings(prev => ({ ...prev, [field]: val }));
    };

    const handleSave = () => {
        onSave(localSettings);
        onClose();
    };

    const handleAddProfile = () => {
        if (!newProfile.name || !newProfile.brand || !newProfile.price) return;

        const profile: FilamentProfile = {
            id: crypto.randomUUID(),
            name: newProfile.name,
            material: newProfile.material as MaterialType,
            brand: newProfile.brand,
            price: newProfile.price,
        };

        setLocalSettings(prev => ({
            ...prev,
            filamentProfiles: [...(prev.filamentProfiles || []), profile]
        }));

        setNewProfile({ material: 'PLA', brand: '', name: '', price: 350 });
    };

    const handleRemoveProfile = (id: string) => {
        setLocalSettings(prev => ({
            ...prev,
            filamentProfiles: (prev.filamentProfiles || []).filter(p => p.id !== id)
        }));
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50 sticky top-0 backdrop-blur-md">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-brand-500" />
                        Configuración de Costos
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-8">

                    {/* Monthly Operations */}
                    <div className="space-y-4">
                        <h3 className="text-sm uppercase tracking-wider text-brand-500 font-semibold flex items-center gap-2">
                            <Home className="w-4 h-4" /> Gastos Fijos Mensuales
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label-text">Renta y Extras ($/mes)</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={localSettings.monthlyRentAndExtras}
                                    onChange={handleChange('monthlyRentAndExtras')}
                                />
                                <p className="text-xs text-slate-500 mt-1">Local, agua, empleados, etc.</p>
                            </div>
                            <div>
                                <label className="label-text">Luz Mensual ($/mes)</label>
                                <div className="relative">
                                    <Zap className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                                    <input
                                        type="number"
                                        className="input-field pl-14"
                                        value={localSettings.monthlyPowerCost}
                                        onChange={handleChange('monthlyPowerCost')}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="label-text">Internet ($/mes)</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={localSettings.monthlyInternet}
                                    onChange={handleChange('monthlyInternet')}
                                />
                            </div>
                            <div>
                                <label className="label-text">Mantenimiento ($/mes)</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={localSettings.monthlyMaintenance}
                                    onChange={handleChange('monthlyMaintenance')}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-800"></div>

                    {/* Machine & Work */}
                    <div className="space-y-4">
                        <h3 className="text-sm uppercase tracking-wider text-brand-500 font-semibold flex items-center gap-2">
                            <Printer className="w-4 h-4" /> Maquinaria y Trabajo
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label-text">Costo de la Máquina ($)</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={localSettings.machineCost}
                                    onChange={handleChange('machineCost')}
                                />
                            </div>
                            <div>
                                <label className="label-text">Retorno Inversión (Meses)</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                                    <input
                                        type="number"
                                        className="input-field pl-14"
                                        value={localSettings.machineAmortizationMonths}
                                        onChange={handleChange('machineAmortizationMonths')}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="label-text">Días Laborales (al mes)</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={localSettings.workDaysPerMonth}
                                    onChange={handleChange('workDaysPerMonth')}
                                />
                            </div>
                            <div>
                                <label className="label-text">Horas Diarias (Promedio)</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={localSettings.workHoursPerDay}
                                    onChange={handleChange('workHoursPerDay')}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-800"></div>

                    {/* Filament Profiles */}
                    <div className="space-y-4">
                        <h3 className="text-sm uppercase tracking-wider text-brand-500 font-semibold flex items-center gap-2">
                            <Package className="w-4 h-4" /> Perfiles de Filamento
                        </h3>

                        {/* List of profiles */}
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {(localSettings.filamentProfiles || []).map(profile => (
                                <div key={profile.id} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                    <div>
                                        <p className="text-sm font-medium text-white">{profile.name} <span className="text-xs text-brand-400 bg-brand-900/30 px-2 py-0.5 rounded ml-2">{profile.material}</span></p>
                                        <p className="text-xs text-slate-400">{profile.brand} &bull; ${profile.price}/kg</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveProfile(profile.id)}
                                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {(!localSettings.filamentProfiles || localSettings.filamentProfiles.length === 0) && (
                                <p className="text-sm text-slate-500 text-center py-4">No hay perfiles guardados.</p>
                            )}
                        </div>

                        {/* Add new profile */}
                        <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50 space-y-3">
                            <h4 className="text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">Añadir Nuevo Perfil</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div>
                                    <label className="label-text">Material</label>
                                    <select
                                        className="input-field appearance-none"
                                        value={newProfile.material}
                                        onChange={e => setNewProfile(prev => ({ ...prev, material: e.target.value as MaterialType }))}
                                    >
                                        <option value="PLA">PLA</option>
                                        <option value="PETG">PETG</option>
                                        <option value="TPU">TPU</option>
                                        <option value="ABS">ABS</option>
                                        <option value="ASA">ASA</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label-text">Marca</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Ej. Bambu Lab"
                                        value={newProfile.brand}
                                        onChange={e => setNewProfile(prev => ({ ...prev, brand: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="label-text">Nombre</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Ej. PLA Basic"
                                        value={newProfile.name}
                                        onChange={e => setNewProfile(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="label-text">Precio/kg ($)</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        placeholder="0"
                                        value={newProfile.price}
                                        onChange={e => setNewProfile(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={handleAddProfile}
                                    disabled={!newProfile.name || !newProfile.brand || !newProfile.price}
                                    className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg flex items-center gap-1.5 transition-colors"
                                >
                                    <Plus className="w-4 h-4" /> Agregar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3 sticky bottom-0 backdrop-blur-md">
                    <button onClick={onClose} className="btn-secondary">
                        Cancelar
                    </button>
                    <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Guardar Configuración
                    </button>
                </div>
            </div>
        </div>
    );
};
