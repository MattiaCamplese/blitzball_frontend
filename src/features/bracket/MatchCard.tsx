import { Trophy, Save, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Game } from '../game/game.type';
import TeamRow from './TeamRow';



export interface MatchCardProps {
  game: Game;
  getTeamName: (teamId?: number) => string;
  getTeamLogo: (teamId?: number) => string | undefined;
  localScores?: { home: number; away: number };
  onScoreChange: (isHome: boolean, value: string) => void;
  onSave: () => void;
  isSaving: boolean;
  hasChanges: boolean;
  isFinal?: boolean;
  winnerId?: number;
}

const MatchCard = ({
  game,
  getTeamName,
  getTeamLogo,
  localScores,
  onScoreChange,
  onSave,
  isSaving,
  hasChanges,
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

  return (
    <div
      className={`relative bg-gradient-to-br from-slate-800/90 to-blue-900/90 backdrop-blur-sm rounded-lg border-2 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 ${
        isFinal
          ? 'w-full max-w-[16rem] p-5 border-amber-400 shadow-amber-400/50 ring-4 ring-amber-400/20'
          : 'w-full max-w-[11rem] p-3 border-slate-600 hover:border-amber-400/50'
      } ${game.completed && !isFinal ? 'border-emerald-500/50' : ''}`}
    >
      {isFinal && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-slate-900 px-4 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-1.5 animate-pulse">
          <Sparkles className="w-3 h-3" />
          FINALE
          <Sparkles className="w-3 h-3" />
        </div>
      )}

      <div
        className={`text-center text-gray-400 font-semibold tracking-wider ${
          isFinal ? 'text-sm mb-3 mt-2' : 'text-xs mb-2'
        }`}
      >
        {isFinal ? `MATCH #${game.match_number}` : `M#${game.match_number}`}
      </div>

      <div className={isFinal ? 'space-y-3' : 'space-y-2'}>
        <TeamRow
          teamId={game.home_team_fk}
          teamName={getTeamName(game.home_team_fk)}
          teamLogo={getTeamLogo(game.home_team_fk)}
          score={localScores?.home ?? game.home_score}
          isWinner={isWinner(true)}
          isChampion={isChampion(game.home_team_fk)}
          canEdit={canEdit}
          onScoreChange={(value) => onScoreChange(true, value)}
          isFinal={isFinal}
        />
        <TeamRow
          teamId={game.away_team_fk}
          teamName={getTeamName(game.away_team_fk)}
          teamLogo={getTeamLogo(game.away_team_fk)}
          score={localScores?.away ?? game.away_score}
          isWinner={isWinner(false)}
          isChampion={isChampion(game.away_team_fk)}
          canEdit={canEdit}
          onScoreChange={(value) => onScoreChange(false, value)}
          isFinal={isFinal}
        />
      </div>

      {canEdit && hasChanges && (
        <Button
          onClick={onSave}
          disabled={isSaving}
          className={`w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg flex items-center justify-center gap-1.5 font-semibold transition-all shadow-lg hover:shadow-xl ${
            isFinal ? 'mt-3 py-2.5 text-sm' : 'mt-2 py-1.5 text-xs'
          }`}
        >
          {isSaving ? (
            <>
              <div
                className={`border-2 border-white border-t-transparent rounded-full animate-spin ${
                  isFinal ? 'w-4 h-4' : 'w-3 h-3'
                }`}
              />
              {isFinal ? 'Salvando...' : 'Salvo...'}
            </>
          ) : (
            <>
              <Save className={isFinal ? 'w-4 h-4' : 'w-3 h-3'} />
              {isFinal ? 'Salva Risultato' : 'Salva'}
            </>
          )}
        </Button>
      )}

      {game.completed && (
        <div
          className={`text-center text-emerald-400 font-bold flex items-center justify-center gap-1 ${
            isFinal ? 'text-sm mt-3' : 'text-xs mt-2'
          }`}
        >
          <div
            className={`bg-emerald-400 rounded-full animate-pulse ${
              isFinal ? 'w-2 h-2' : 'w-1.5 h-1.5'
            }`}
          />
          {isFinal ? 'COMPLETATA' : 'OK'}
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