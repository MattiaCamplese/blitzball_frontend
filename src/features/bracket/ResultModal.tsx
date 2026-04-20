import { useState, useEffect } from 'react';
import { Loader2, Goal, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAthletes } from '../athlete/athlete.hook';
import type { Game } from '../game/game.type';
import type { ScorerInput } from '../tournament/tournament.type';

interface ResultModalProps {
  game: Game | null;
  open: boolean;
  onClose: () => void;
  onSaveResult: (gameId: number, homeScore: number, awayScore: number, scorers: ScorerInput[]) => void;
  onSaveScorers: (gameId: number, scorers: ScorerInput[]) => void;
  isSaving: boolean;
  getTeamName: (teamId?: number) => string;
}

interface ScorerRow {
  athlete_fk: number;
  team_fk: number;
  goals: number;
}

const ResultModal = ({
  game,
  open,
  onClose,
  onSaveResult,
  onSaveScorers,
  isSaving,
  getTeamName,
}: ResultModalProps) => {
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [scorerRows, setScorerRows] = useState<ScorerRow[]>([]);

  const { data: athletes = [], isLoading: loadingAthletes } = useAthletes();

  useEffect(() => {
    if (!open || !game) return;

    if (game.completed) {
      setHomeScore(game.home_score ?? 0);
      setAwayScore(game.away_score ?? 0);
      const existing: ScorerRow[] = (game.scorers ?? []).map(s => ({
        athlete_fk: s.athlete_id,
        team_fk: s.team_fk,
        goals: s.goals,
      }));
      setScorerRows(existing);
    } else {
      setHomeScore(0);
      setAwayScore(0);
      setScorerRows([]);
    }
  }, [open, game]);

  if (!game) return null;

  const isEdit = game.completed;
  const homeName = getTeamName(game.home_team_fk);
  const awayName = getTeamName(game.away_team_fk);

  const addScorerRow = (teamFk: number) => {
    setScorerRows(prev => [...prev, { athlete_fk: 0, team_fk: teamFk, goals: 1 }]);
  };

  const updateRow = (index: number, field: keyof ScorerRow, value: number) => {
    setScorerRows(prev => prev.map((row, i) => i === index ? { ...row, [field]: value } : row));
  };

  const removeRow = (index: number) => {
    setScorerRows(prev => prev.filter((_, i) => i !== index));
  };

  const buildScorers = (): ScorerInput[] => {
    return scorerRows
      .filter(r => r.athlete_fk > 0 && r.goals > 0)
      .map(r => ({ athlete_fk: r.athlete_fk, team_fk: r.team_fk, goals: r.goals }));
  };

  const handleSave = () => {
    if (!isEdit && homeScore === awayScore) {
      alert('Non è consentito il pareggio');
      return;
    }

    const scorers = buildScorers();
    const hs = isEdit ? (game.home_score ?? 0) : homeScore;
    const as_ = isEdit ? (game.away_score ?? 0) : awayScore;

    const homeGoals = scorers.filter(s => s.team_fk === game.home_team_fk).reduce((sum, s) => sum + s.goals, 0);
    const awayGoals = scorers.filter(s => s.team_fk === game.away_team_fk).reduce((sum, s) => sum + s.goals, 0);

    if (homeGoals > hs) {
      alert(`I gol dei marcatori del ${homeName} (${homeGoals}) superano il punteggio (${hs})`);
      return;
    }
    if (awayGoals > as_) {
      alert(`I gol dei marcatori del ${awayName} (${awayGoals}) superano il punteggio (${as_})`);
      return;
    }

    if (isEdit) {
      onSaveScorers(game.id, scorers);
    } else {
      onSaveResult(game.id, homeScore, awayScore, scorers);
    }
  };

  const renderScorerRows = (teamFk: number, teamName: string) => {
    const rows = scorerRows
      .map((row, globalIndex) => ({ row, globalIndex }))
      .filter(({ row }) => row.team_fk === teamFk);

    return (
      <div>
        <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          <Goal className="w-3 h-3 shrink-0" />
          <span className="truncate">{teamName}</span>
        </div>

        {rows.length === 0 && (
          <p className="text-xs text-gray-400 italic mb-2">Nessun marcatore</p>
        )}

        <div className="space-y-1.5 mb-2">
          {rows.map(({ row, globalIndex }) => (
            <div key={globalIndex} className="flex items-center gap-1">
              <select
                value={row.athlete_fk}
                onChange={e => updateRow(globalIndex, 'athlete_fk', parseInt(e.target.value))}
                className="flex-1 text-xs border border-gray-300 focus:border-blue-500 rounded py-0.5 px-1 outline-none bg-white min-w-0"
              >
                <option value={0}>— Seleziona atleta —</option>
                {athletes.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.first_name} {a.last_name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={row.goals}
                onChange={e => updateRow(globalIndex, 'goals', Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                max={20}
                className="w-10 text-center text-sm font-bold border border-gray-300 focus:border-blue-500 rounded py-0.5 outline-none"
              />
              <button
                onClick={() => removeRow(globalIndex)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => addScorerRow(teamFk)}
          className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Aggiungi marcatore
        </button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto [&>button]:text-gray-700">
        <DialogHeader className="text-gray-700 mb-2">
          <DialogTitle className="flex items-center gap-2">
            <Goal className="w-5 h-5" />
            {isEdit ? 'Modifica Marcatori' : 'Inserisci Risultato'} — M#{game.match_number}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {isEdit
              ? 'Modifica i marcatori. Il punteggio non può essere cambiato.'
              : 'Inserisci il punteggio e i marcatori della partita.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Punteggio */}
          <div className="bg-gray-50 rounded-xl p-4 border">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Punteggio</p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex-1 text-center">
                <p className="text-sm font-semibold text-gray-700 mb-1 truncate">{homeName}</p>
                {isEdit ? (
                  <span className="text-3xl font-black text-gray-800">{homeScore}</span>
                ) : (
                  <input
                    type="number"
                    value={homeScore}
                    onChange={e => setHomeScore(Math.max(0, parseInt(e.target.value) || 0))}
                    min={0}
                    className="w-16 text-center text-2xl font-black border-2 border-gray-300 focus:border-blue-500 rounded-lg py-1 outline-none"
                  />
                )}
              </div>
              <span className="text-2xl font-black text-gray-400">–</span>
              <div className="flex-1 text-center">
                <p className="text-sm font-semibold text-gray-700 mb-1 truncate">{awayName}</p>
                {isEdit ? (
                  <span className="text-3xl font-black text-gray-800">{awayScore}</span>
                ) : (
                  <input
                    type="number"
                    value={awayScore}
                    onChange={e => setAwayScore(Math.max(0, parseInt(e.target.value) || 0))}
                    min={0}
                    className="w-16 text-center text-2xl font-black border-2 border-gray-300 focus:border-blue-500 rounded-lg py-1 outline-none"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Marcatori */}
          {loadingAthletes ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              <span className="ml-2 text-sm text-gray-500">Caricamento atleti...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {renderScorerRows(game.home_team_fk!, homeName)}
              {renderScorerRows(game.away_team_fk!, awayName)}
            </div>
          )}

          {/* Footer */}
          <div className="flex gap-3 pt-3 border-t">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Annulla
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSave}
              disabled={isSaving || loadingAthletes}
              className="flex-1"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvataggio...
                </span>
              ) : isEdit ? 'Salva Marcatori' : 'Salva Risultato'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultModal;