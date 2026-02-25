import { Sparkles, Trophy, Goal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Game } from '../game/game.type';
import TeamRow from './TeamRow';

export interface MatchCardProps {
  game: Game;
  getTeamName: (teamId?: number) => string;
  getTeamLogo: (teamId?: number) => string | undefined;
  onOpenResult: () => void;
  isFinal?: boolean;
  winnerId?: number;
}

const MatchCard = ({
  game,
  getTeamName,
  getTeamLogo,
  onOpenResult,
  isFinal = false,
  winnerId,
}: MatchCardProps) => {
  const isWinner = (isHome: boolean) => {
    if (!game.completed || game.home_score === undefined || game.away_score === undefined)
      return false;
    return isHome ? game.home_score > game.away_score : game.away_score > game.home_score;
  };

  const isChampion = (teamId?: number) => Boolean(winnerId && teamId === winnerId);
  const canEdit = Boolean(!game.completed && game.home_team_fk && game.away_team_fk);

  const homeScorers = game.scorers?.filter(s => s.team_fk === game.home_team_fk) ?? [];
  const awayScorers = game.scorers?.filter(s => s.team_fk === game.away_team_fk) ?? [];

  return (
    <div
      className={`relative bg-linear-to-br from-slate-800/90 to-blue-900/90 backdrop-blur-sm rounded-lg border-2 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 ${
        isFinal
          ? 'w-full max-w-[16rem] p-5 border-amber-400 shadow-amber-400/50 ring-4 ring-amber-400/20'
          : 'w-full max-w-44 p-3 border-slate-600 hover:border-amber-400/50'
      } ${game.completed && !isFinal ? 'border-emerald-500/50' : ''}`}
    >
      {isFinal && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-amber-400 via-yellow-300 to-amber-400 text-slate-900 px-4 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-1.5 animate-pulse">
          <Sparkles className="w-3 h-3" />
          FINALE
          <Sparkles className="w-3 h-3" />
        </div>
      )}

      {/* Bottone Risultato / Modifica — sostituisce il vecchio M# label */}
      <div className={isFinal ? 'mb-3 mt-2' : 'mb-2'}>
        {canEdit && (
          <Button
            variant="tertiary"
            size="sm"
            onClick={onOpenResult}
            className={`w-full ${isFinal ? 'text-sm py-1' : 'text-xs py-0.5'}`}
          >
            Risultato
          </Button>
        )}
        {game.completed && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenResult}
            className={`w-full ${isFinal ? 'text-sm py-1' : 'text-xs py-0.5'}`}
          >
            Modifica
          </Button>
        )}
        {!canEdit && !game.completed && (
          <div className={`text-center text-gray-500 font-semibold tracking-wider ${isFinal ? 'text-sm' : 'text-xs'}`}>
            M#{game.match_number}
          </div>
        )}
      </div>

      <div className={isFinal ? 'space-y-3' : 'space-y-2'}>
        <TeamRow
          teamId={game.home_team_fk}
          teamName={getTeamName(game.home_team_fk)}
          teamLogo={getTeamLogo(game.home_team_fk)}
          score={game.home_score}
          isWinner={isWinner(true)}
          isChampion={isChampion(game.home_team_fk)}
          isFinal={isFinal}
        />
        <TeamRow
          teamId={game.away_team_fk}
          teamName={getTeamName(game.away_team_fk)}
          teamLogo={getTeamLogo(game.away_team_fk)}
          score={game.away_score}
          isWinner={isWinner(false)}
          isChampion={isChampion(game.away_team_fk)}
          isFinal={isFinal}
        />
      </div>

      {/* Marcatori */}
      {game.completed && (homeScorers.length > 0 || awayScorers.length > 0) && (
        <div className={`mt-2 space-y-0.5 border-t border-slate-600/50 pt-1.5 ${isFinal ? 'text-xs' : 'text-[10px]'} text-gray-400`}>
          {homeScorers.map(s => (
            <div key={s.athlete_id} className="flex items-center gap-1">
              <Goal className="w-3 h-3 shrink-0" />
              <span className="truncate">{s.athlete_name} ({s.goals})</span>
            </div>
          ))}
          {awayScorers.map(s => (
            <div key={s.athlete_id} className="flex items-center gap-1 justify-end">
              <span className="truncate">{s.athlete_name} ({s.goals})</span>
              <Goal className="w-3 h-3 shrink-0" />
            </div>
          ))}
        </div>
      )}

      {(!game.home_team_fk || !game.away_team_fk) && (
        <div
          className={`text-center text-gray-500 font-medium flex items-center justify-center gap-1 ${
            isFinal ? 'text-sm mt-3' : 'text-xs mt-2'
          }`}
        >
          <Trophy className={isFinal ? 'w-4 h-4' : 'w-3 h-3'} />
          TBD
        </div>
      )}
    </div>
  );
};

export default MatchCard;
