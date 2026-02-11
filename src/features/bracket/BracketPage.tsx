import { useParams, useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useBracket, useTournament, useTournamentFinal, useUpdateGameResult } from '../tournament/tournament.hooks';
import { useTeams } from '../team/team.hooks';
import type { Game } from '../game/game.type';
import { createBracketLayout, groupGamesByRound } from './bracket.utils';
import BracketHeader from './BracketHeader';
import BracketGrid from './BracketGrid';


const BracketPage = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const navigate = useNavigate();

  const { data: tournament, isLoading: tournamentLoading } = useTournament(Number(tournamentId));
  const { data: games, isLoading: gamesLoading } = useBracket(Number(tournamentId));
  const { data: teams } = useTeams();
  const { data: final } = useTournamentFinal(
    Number(tournamentId),
    Boolean(tournament && !tournament.is_active)
  );
  const updateGame = useUpdateGameResult();

  const [localScores, setLocalScores] = useState<Record<number, { home: number; away: number }>>({});
  const [savingGames, setSavingGames] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (games) {
      const scores: Record<number, { home: number; away: number }> = {};
      games.forEach((game) => {
        scores[game.id] = { home: game.home_score ?? 0, away: game.away_score ?? 0 };
      });
      setLocalScores(scores);
    }
  }, [games]);

  const getTeamName = (teamId?: number) => {
    if (!teamId) return 'TBD';
    return teams?.find((t) => t.id === teamId)?.name || 'TBD';
  };

  const getTeamLogo = (teamId?: number) => {
    if (!teamId) return undefined;
    return teams?.find((t) => t.id === teamId)?.logo;
  };

  const handleScoreChange = (gameId: number, isHome: boolean, value: string) => {
    setLocalScores((prev) => ({
      ...prev,
      [gameId]: { ...prev[gameId], [isHome ? 'home' : 'away']: parseInt(value) || 0 },
    }));
  };

  const handleSaveScore = async (game: Game) => {
    const scores = localScores[game.id];
    if (!scores || !tournamentId) return;
    if (scores.home === scores.away) {
      alert('Non è consentito il pareggio');
      return;
    }

    setSavingGames((prev) => new Set(prev).add(game.id));
    try {
      await updateGame.mutateAsync({
        gameId: game.id,
        tournamentId: Number(tournamentId),
        scores: { home_score: scores.home, away_score: scores.away },
      });
    } catch {
      alert("Errore durante l'aggiornamento del risultato");
    } finally {
      setSavingGames((prev) => {
        const next = new Set(prev);
        next.delete(game.id);
        return next;
      });
    }
  };

  const hasScoresChanged = (gameId: number, game: Game) => {
    const local = localScores[gameId];
    if (!local) return false;
    return local.home !== (game.home_score ?? 0) || local.away !== (game.away_score ?? 0);
  };

  const gamesByRound = games ? groupGamesByRound(games) : undefined;
  const rounds = gamesByRound
    ? Object.keys(gamesByRound).map(Number).sort((a, b) => a - b)
    : [];
  const bracketLayout = createBracketLayout(gamesByRound, rounds);

  // --- Loading ---
  if (tournamentLoading || gamesLoading) {
    return (
      <div className="min-h-screen w-full px-4 py-8 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <div className="text-white text-xl font-semibold">Caricamento bracket...</div>
        </div>
      </div>
    );
  }

  // --- Not found ---
  if (!tournament || !games) {
    return (
      <div className="min-h-screen w-full px-4 py-8 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="text-center">
          <Trophy className="w-20 h-20 text-gray-700 mx-auto mb-4" />
          <div className="text-white text-xl mb-2">Torneo non trovato</div>
          <button onClick={() => navigate('/tournaments')} className="text-amber-400 hover:text-amber-300 transition-colors underline" >
            Torna ai tornei
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className="relative z-10 py-8">
        <BracketHeader
          tournament={tournament}
          final={final}
          gamesCount={games.length}
          getTeamName={getTeamName}
        />
        <BracketGrid
          bracketLayout={bracketLayout}
          localScores={localScores}
          savingGames={savingGames}
          winnerId={final?.winner_team_id}
          getTeamName={getTeamName}
          getTeamLogo={getTeamLogo}
          onScoreChange={handleScoreChange}
          onSaveScore={handleSaveScore}
          hasScoresChanged={hasScoresChanged}
        />
      </div>
    </div>
  );
};

export default BracketPage;