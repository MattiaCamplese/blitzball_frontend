import { useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { X, Plus, User, Calendar, Hash, Shield, Trash2, StopCircle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Button } from '@base-ui/react/button';
import type { Athlete } from './athlete.services';
import { useTeams } from '../team/team.hooks';
import { useCompositionsByAthlete, useCreateComposition, useDeleteComposition, useTerminateComposition } from '../composition/composition.hook';
import type { CompositionCreate } from '../composition/composition.service';

interface AthleteDetailModalProps {
    athlete: Athlete | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type FormValues = Omit<CompositionCreate, 'athlete_fk'> & { team_fk: number };

const today = () => new Date().toISOString().split('T')[0];
const fmt = (dateStr: string) => new Date(dateStr).toLocaleDateString('it-IT');

const AthleteDetailModalSimple = ({ athlete, open, onOpenChange }: AthleteDetailModalProps) => {
    const [showForm, setShowForm] = useState(false);

    // 🚀 OTTIMIZZAZIONE: Query attivate solo quando il modal è aperto
    const { data: teams = [], isLoading: loadingTeams } = useTeams({ enabled: open });
    const { data: compositions = [], isLoading: loadingComps } = useCompositionsByAthlete(
        athlete?.id ?? 0,
        { enabled: open && !!athlete?.id }
    );

    const createComposition = useCreateComposition();
    const terminateComposition = useTerminateComposition(athlete?.id);
    const deleteComposition = useDeleteComposition(athlete?.id);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            team_fk: 0,
            start_date: today(),
            role: '',
            jersey_number: undefined,
        },
    });

    // 🚀 OTTIMIZZAZIONE: Memoizzazione delle composizioni filtrate
    const activeComps = useMemo(
        () => compositions.filter(c => !c.end_date),
        [compositions]
    );

    const pastComps = useMemo(
        () => compositions.filter(c => !!c.end_date),
        [compositions]
    );

    // 🚀 OTTIMIZZAZIONE: Memoizzazione handlers
    const onSubmit = useCallback((values: FormValues) => {
        if (!values.team_fk || !athlete) return;
        createComposition.mutate(
            {
                athlete_fk: athlete.id,
                team_fk: Number(values.team_fk),
                start_date: values.start_date,
                jersey_number: values.jersey_number ? Number(values.jersey_number) : undefined,
                role: values.role || undefined,
            },
            {
                onSuccess: () => {
                    reset();
                    setShowForm(false);
                },
            }
        );
    }, [athlete, createComposition, reset]);

    const handleTerminate = useCallback((id: number) => {
        if (window.confirm('Terminare questa composizione?')) {
            terminateComposition.mutate(id);
        }
    }, [terminateComposition]);

    const handleDelete = useCallback((id: number) => {
        if (window.confirm('Eliminare dallo storico?')) {
            deleteComposition.mutate(id);
        }
    }, [deleteComposition]);

    const handleClose = useCallback(() => {
        onOpenChange(false);
        setShowForm(false);
        reset();
    }, [onOpenChange, reset]);

    if (!athlete) return null;

    const isLoading = loadingTeams || loadingComps;
    const isPending = createComposition.isPending || terminateComposition.isPending || deleteComposition.isPending;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto [&>button]:text-gray-700">
                <DialogHeader className="text-gray-700 mb-2">
                    <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <User className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="truncate">{athlete.first_name} {athlete.last_name}</span>
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm">
                        Gestisci le squadre e lo storico dell'atleta
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Header con bottone Aggiungi */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b pb-3">
                        <h3 className="text-sm font-semibold text-gray-700">Composizioni Squadre</h3>
                        <Button onClick={() => setShowForm(v => !v)} disabled={activeComps.length > 0 && !showForm} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-50" >
                            {showForm ? (
                                <span className="flex items-center justify-center gap-2 text-sm text-black">
                                    <X className="h-4 w-4" />
                                    Chiudi
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2 text-sm text-black">
                                    <Plus className="h-4 w-4" />
                                    <span className="hidden sm:inline">Aggiungi Squadra</span>
                                    <span className="sm:hidden">Aggiungi</span>
                                </span>
                            )}
                        </Button>
                    </div>

                    {/* Form di creazione */}
                    {showForm && (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-gray-50 p-3 sm:p-4 rounded-lg border">
                            {/* Squadra - Full width */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Squadra *
                                </label>
                                <select
                                    {...register('team_fk', {
                                        validate: v => Number(v) > 0 || 'Seleziona una squadra'
                                    })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" >
                                    <option value={0}>— Seleziona Squadra —</option>
                                    {teams.map(t => (
                                        <option key={t.id} value={t.id}>
                                            {t.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.team_fk && (
                                    <p className="text-xs text-red-500 mt-1">{errors.team_fk.message}</p>
                                )}
                            </div>

                            {/* Data e Numero Maglia - 2 colonne responsive */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Data Inizio */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Data Inizio *
                                    </label>
                                    <InputGroup>
                                        <InputGroupInput
                                            type="date"
                                            {...register('start_date', { required: 'Data obbligatoria' })}
                                        />
                                        <InputGroupAddon>
                                            <Calendar className="h-4 w-4" />
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {errors.start_date && (
                                        <p className="text-xs text-red-500 mt-1">{errors.start_date.message}</p>
                                    )}
                                </div>

                                {/* Numero Maglia */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Numero Maglia
                                    </label>
                                    <InputGroup>
                                        <InputGroupInput
                                            type="number"
                                            {...register('jersey_number', { min: 1, max: 99 })}
                                            placeholder="1-99"
                                        />
                                        <InputGroupAddon>
                                            <Hash className="h-4 w-4" />
                                        </InputGroupAddon>
                                    </InputGroup>
                                </div>
                            </div>

                            {/* Ruolo - Full width con layout responsive */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ruolo
                                </label>
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-2.5 hover:bg-gray-50 transition-colors">
                                        <input
                                            type="radio"
                                            value="Portiere"
                                            {...register('role')}
                                            className="text-blue-600"
                                        />
                                        <Shield className="h-4 w-4 text-gray-600" />
                                        <span className="text-sm font-medium text-gray-700">Portiere</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-2.5 hover:bg-gray-50 transition-colors">
                                        <input type="radio" value="Giocatore" {...register('role')} className="text-blue-600" />
                                        <User className="h-4 w-4 text-gray-600" />
                                        <span className="text-sm font-medium text-gray-700">Giocatore</span>
                                    </label>
                                </div>
                            </div>

                            {/* Bottoni form */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                                <Button type="button" onClick={() => { reset(); setShowForm(false); }} className="w-full sm:flex-1 bg-gray-200 hover:bg-gray-300" >
                                    <span className="text-gray-700 font-medium">Annulla</span>
                                </Button>
                                <Button type="submit" disabled={isPending} className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50" >
                                    {createComposition.isPending ? (
                                        <span className="flex items-center justify-center gap-2 text-white">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Assegnazione...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2 text-black font-medium">
                                            <Plus className="h-4 w-4" />
                                            Assegna Squadra
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Loading state */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                            <span className="ml-2 text-sm text-gray-500">Caricamento...</span>
                        </div>
                    )}

                    {/* Composizioni Attive */}
                    {!isLoading && activeComps.length > 0 && (
                        <div>
                            <h4 className="text-xs sm:text-sm font-semibold mb-3 text-green-600 flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                Attive ({activeComps.length})
                            </h4>
                            <div className="space-y-2">
                                {activeComps.map(c => (
                                    <div  key={c.id} className="bg-green-50 border border-green-200 rounded-lg p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 hover:shadow-md transition-shadow" >
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-gray-800 text-sm sm:text-base truncate">{c.team_name}</div>
                                            <div className="text-xs text-gray-600 flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                                                <span className="flex items-center gap-1 whitespace-nowrap">
                                                    <Calendar className="h-3 w-3 shrink-0" />
                                                    {fmt(c.start_date)}
                                                </span>
                                                {c.role && (
                                                    <span className="flex items-center gap-1 whitespace-nowrap">
                                                        <Shield className="h-3 w-3 shrink-0" />
                                                        {c.role}
                                                    </span>
                                                )}
                                                {c.jersey_number && (
                                                    <span className="flex items-center gap-1 whitespace-nowrap">
                                                        <Hash className="h-3 w-3 shrink-0" />
                                                        {c.jersey_number}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <Button onClick={() => handleTerminate(c.id)} disabled={isPending} className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 w-full sm:w-auto shrink-0" >
                                            <span className="flex items-center justify-center gap-1 text-black text-xs font-medium">
                                                <StopCircle className="h-3 w-3" />
                                                Termina
                                            </span>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Storico */}
                    {!isLoading && pastComps.length > 0 && (
                        <div>
                            <h4 className="text-xs sm:text-sm font-semibold mb-3 text-gray-500">
                                Storico ({pastComps.length})
                            </h4>
                            <div className="space-y-2">
                                {pastComps.map(c => (
                                    <div key={c.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 opacity-70 hover:opacity-100 transition-opacity" >
                                           <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-gray-700 text-sm sm:text-base truncate">{c.team_name}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                                <Calendar className="h-3 w-3 shrink-0" />
                                                <span className="truncate">{fmt(c.start_date)} → {c.end_date && fmt(c.end_date)}</span>
                                            </div>
                                        </div>
                                        <Button onClick={() => handleDelete(c.id)} disabled={isPending} className="bg-red-100 hover:bg-red-200 disabled:opacity-50 w-full sm:w-auto shrink-0" >
                                            <span className="flex items-center justify-center gap-1 text-black text-xs font-medium">
                                                <Trash2 className="h-3 w-3" />
                                                Elimina
                                            </span>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty state */}
                    {!isLoading && compositions.length === 0 && !showForm && (
                        <div className="text-center py-12 text-gray-400">
                            <User className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">Nessuna squadra assegnata</p>
                            <p className="text-xs mt-1">Clicca su "Aggiungi Squadra" per iniziare</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AthleteDetailModalSimple;
