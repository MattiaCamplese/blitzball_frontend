import { useParams, useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useBracket, useTournament, useTournamentFinal, useUpdateGameResult, useUpdateScorers } from '../tournament/tournament.hooks';
import { useTeams } from '../team/team.hooks';
import type { Game } from '../game/game.type';
import type { ScorerInput } from '../tournament/tournament.type';
import { createBracketLayout, groupGamesByRound } from './bracket.utils';
import BracketHeader from './BracketHeader';
import BracketGrid from './BracketGrid';
import ResultModal from './ResultModal';


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
  const updateScorers = useUpdateScorers();

  const [modalGame, setModalGame] = useState<Game | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const getTeamName = (teamId?: number) => {
    if (!teamId) return 'TBD';
    return teams?.find((t) => t.id === teamId)?.name || 'TBD';
  };

  const getTeamLogo = (teamId?: number) => {
    if (!teamId) return undefined;
    return teams?.find((t) => t.id === teamId)?.logo;
  };

  const handleOpenResult = (game: Game) => {
    setModalGame(game);
    setModalOpen(true);
  };

  const handleCloseResult = () => {
    setModalOpen(false);
    setModalGame(null);
  };

  const handleSaveResult = async (
    gameId: number,
    homeScore: number,
    awayScore: number,
    scorers: ScorerInput[]
  ) => {
    if (!tournamentId) return;
    try {
      await updateGame.mutateAsync({
        gameId,
        tournamentId: Number(tournamentId),
        scores: { home_score: homeScore, away_score: awayScore, scorers },
      });
      handleCloseResult();
    } catch {
      alert("Errore durante l'aggiornamento del risultato");
    }
  };

  const handleSaveScorers = async (gameId: number, scorers: ScorerInput[]) => {
    if (!tournamentId) return;
    try {
      await updateScorers.mutateAsync({
        gameId,
        tournamentId: Number(tournamentId),
        scorers,
      });
      handleCloseResult();
    } catch {
      alert("Errore durante l'aggiornamento dei marcatori");
    }
  };

  const isSaving = updateGame.isPending || updateScorers.isPending;

  const gamesByRound = games ? groupGamesByRound(games) : undefined;
  const rounds = gamesByRound
    ? Object.keys(gamesByRound).map(Number).sort((a, b) => a - b)
    : [];
  const bracketLayout = createBracketLayout(gamesByRound, rounds);

  // --- Loading ---
  if (tournamentLoading || gamesLoading) {
    return (
      <div className="min-h-screen w-full px-4 py-8 flex items-center justify-center bg-linear-to-br from-slate-900 via-blue-950 to-slate-900">
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
      <div className="min-h-screen w-full px-4 py-8 flex items-center justify-center bg-linear-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="text-center">
          <Trophy className="w-20 h-20 text-gray-700 mx-auto mb-4" />
          <div className="text-white text-xl mb-2">Torneo non trovato</div>
          <Button variant="tertiary" onClick={() => navigate('/tournaments')} className="mt-2">
            Torna ai tornei
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/tornei.png')" }}
      />
      <div className="absolute inset-0 bg-slate-900/30" />

      <div className="relative z-10 py-8">
        <BracketHeader
          tournament={tournament}
          final={final}
          gamesCount={games.length}
          getTeamName={getTeamName}
        />
        <BracketGrid
          bracketLayout={bracketLayout}
          winnerId={final?.winner_team_id}
          getTeamName={getTeamName}
          getTeamLogo={getTeamLogo}
          onOpenResult={handleOpenResult}
        />
      </div>

      <ResultModal
        game={modalGame}
        open={modalOpen}
        onClose={handleCloseResult}
        onSaveResult={handleSaveResult}
        onSaveScorers={handleSaveScorers}
        isSaving={isSaving}
        getTeamName={getTeamName}
      />
    </div>
  );
};

export default BracketPage;
