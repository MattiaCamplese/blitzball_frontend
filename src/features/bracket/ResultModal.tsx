import { useState, useEffect } from 'react';
import { Loader2, Goal } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCompositionsByTeam } from '../composition/composition.hook';
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
  // goalInputs: { [athlete_fk]: goals }
  const [goalInputs, setGoalInputs] = useState<Record<number, number>>({});

  const { data: homeComps = [], isLoading: loadingHome } = useCompositionsByTeam(
    game?.home_team_fk ?? 0,
    { enabled: open && !!game?.home_team_fk }
  );
  const { data: awayComps = [], isLoading: loadingAway } = useCompositionsByTeam(
    game?.away_team_fk ?? 0,
    { enabled: open && !!game?.away_team_fk }
  );

  // Precarica dati esistenti quando si apre in modalità "Modifica"
  useEffect(() => {
    if (!open || !game) return;

    if (game.completed) {
      setHomeScore(game.home_score ?? 0);
      setAwayScore(game.away_score ?? 0);
      const existing: Record<number, number> = {};
      game.scorers?.forEach(s => { existing[s.athlete_id] = s.goals; });
      setGoalInputs(existing);
    } else {
      setHomeScore(0);
      setAwayScore(0);
      setGoalInputs({});
    }
  }, [open, game]);

  if (!game) return null;

  const isEdit = game.completed;
  const loading = loadingHome || loadingAway;

  const buildScorers = (): ScorerInput[] => {
    const scorers: ScorerInput[] = [];
    homeComps.forEach(c => {
      const g = goalInputs[c.athlete_fk] ?? 0;
      if (g > 0) scorers.push({ athlete_fk: c.athlete_fk, team_fk: game.home_team_fk!, goals: g });
    });
    awayComps.forEach(c => {
      const g = goalInputs[c.athlete_fk] ?? 0;
      if (g > 0) scorers.push({ athlete_fk: c.athlete_fk, team_fk: game.away_team_fk!, goals: g });
    });
    return scorers;
  };

  const handleSave = () => {
    if (!isEdit && homeScore === awayScore) {
      alert('Non è consentito il pareggio');
      return;
    }
    const scorers = buildScorers();
    if (isEdit) {
      onSaveScorers(game.id, scorers);
    } else {
      onSaveResult(game.id, homeScore, awayScore, scorers);
    }
  };

  const setGoal = (athleteFk: number, value: string) => {
    const n = Math.max(0, parseInt(value) || 0);
    setGoalInputs(prev => ({ ...prev, [athleteFk]: n }));
  };

  const homeName = getTeamName(game.home_team_fk);
  const awayName = getTeamName(game.away_team_fk);

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
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              <span className="ml-2 text-sm text-gray-500">Caricamento giocatori...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {/* Home team */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 truncate">
                  ⚽ {homeName}
                </p>
                {homeComps.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">Nessun giocatore</p>
                ) : (
                  <div className="space-y-1.5">
                    {homeComps.map(c => (
                      <div key={c.athlete_fk} className="flex items-center justify-between gap-2">
                        <span className="text-xs text-gray-700 truncate flex-1">
                          {c.athlete_first_name} {c.athlete_last_name}
                        </span>
                        <input
                          type="number"
                          value={goalInputs[c.athlete_fk] ?? 0}
                          onChange={e => setGoal(c.athlete_fk, e.target.value)}
                          min={0}
                          max={20}
                          className="w-10 text-center text-sm font-bold border border-gray-300 focus:border-blue-500 rounded py-0.5 outline-none"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Away team */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 truncate">
                  ⚽ {awayName}
                </p>
                {awayComps.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">Nessun giocatore</p>
                ) : (
                  <div className="space-y-1.5">
                    {awayComps.map(c => (
                      <div key={c.athlete_fk} className="flex items-center justify-between gap-2">
                        <span className="text-xs text-gray-700 truncate flex-1">
                          {c.athlete_first_name} {c.athlete_last_name}
                        </span>
                        <input
                          type="number"
                          value={goalInputs[c.athlete_fk] ?? 0}
                          onChange={e => setGoal(c.athlete_fk, e.target.value)}
                          min={0}
                          max={20}
                          className="w-10 text-center text-sm font-bold border border-gray-300 focus:border-blue-500 rounded py-0.5 outline-none"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
              disabled={isSaving || loading}
              className="flex-1"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvataggio...
                </span>
              ) : isEdit ? (
                'Salva Marcatori'
              ) : (
                'Salva Risultato'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultModal;
