import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, ArrowLeft, Calendar, MapPin, Users, Edit2, Check, X, Crown } from 'lucide-react';
import { useState } from 'react';
import { useBracket, useTournament, useTournamentFinal, useUpdateGameResult } from '../tournament/tournament.hooks';
import { useTeams } from '../team/team.hooks';
import type { Game } from './game.type';

const BracketPage = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const navigate = useNavigate();

  const { data: tournament, isLoading: tournamentLoading } = useTournament(Number(tournamentId));
  const { data: games, isLoading: gamesLoading } = useBracket(Number(tournamentId));
  const { data: teams } = useTeams();
  const { data: final } = useTournamentFinal(
    Number(tournamentId),
    tournament?.is_active === false
  );
  const updateGame = useUpdateGameResult();

  const [editingGame, setEditingGame] = useState<number | null>(null);
  const [scores, setScores] = useState<{ home: number; away: number }>({ home: 0, away: 0 });

  const getTeamName = (teamId?: number) => {
    if (!teamId) return 'TBD';
    return teams?.find((t) => t.id === teamId)?.name || 'TBD';
  };

  const getTeamLogo = (teamId?: number) => {
    if (!teamId) return undefined;
    return teams?.find((t) => t.id === teamId)?.logo;
  };

  const handleEditGame = (game: Game) => {
    setEditingGame(game.id);
    setScores({
      home: game.home_score || 0,
      away: game.away_score || 0,
    });
  };

  const handleSaveScore = async (gameId: number) => {
    if (scores.home === scores.away) {
      alert('Non è consentito il pareggio');
      return;
    }

    if (!tournamentId) return;

    try {
      await updateGame.mutateAsync({
        gameId,
        tournamentId: Number(tournamentId),
        scores: {
          home_score: scores.home,
          away_score: scores.away,
        },
      });
      setEditingGame(null);
    } catch (error) {
      alert('Errore durante l\'aggiornamento del risultato');
    }
  };

  const handleCancelEdit = () => {
    setEditingGame(null);
    setScores({ home: 0, away: 0 });
  };

  // Organizza i giochi per round
  const gamesByRound = games?.reduce((acc, game) => {
    const round = game.round ?? 1;
    if (!acc[round]) {
      acc[round] = [];
    }
    acc[round].push(game);
    return acc;
  }, {} as Record<number, Game[]>);

  const rounds = gamesByRound ? Object.keys(gamesByRound).map(Number).sort((a, b) => a - b) : [];

  const getRoundName = (round: number, totalRounds: number) => {
    const remaining = totalRounds - round + 1;
    if (remaining === 1) return 'FINALE';
    if (remaining === 2) return 'Semifinali';
    if (remaining === 3) return 'Quarti';
    if (remaining === 4) return 'Ottavi';
    if (remaining === 5) return 'Sedicesimi';
    return `Round ${round}`;
  };

  const totalRounds = rounds.length;
  const finalRound = rounds[totalRounds - 1];
  const finalGame: Game | undefined =
    finalRound !== undefined
      ? gamesByRound?.[finalRound]?.[0]
      : undefined;

  // Split each round in half for left/right bracket sides
  const leftSideRounds: { round: number; games: Game[] }[] = [];
  const rightSideRounds: { round: number; games: Game[] }[] = [];

  rounds.slice(0, -1).forEach((round) => {
    const roundGames = gamesByRound?.[round] || [];
    const midpoint = Math.ceil(roundGames.length / 2);

    leftSideRounds.push({
      round,
      games: roundGames.slice(0, midpoint)
    });

    rightSideRounds.push({
      round,
      games: roundGames.slice(midpoint)
    });
  });

  // Reverse right side to mirror the bracket
  rightSideRounds.reverse();

  if (tournamentLoading || gamesLoading) {
    return (
      <div className="min-h-screen w-full px-4 py-8 flex items-center justify-center bg-[#0a1929]">
        <div className="text-white text-xl">Caricamento...</div>
      </div>
    );
  }

  if (!tournament || !games) {
    return (
      <div className="min-h-screen w-full px-4 py-8 flex items-center justify-center bg-[#0a1929]">
        <div className="text-white text-xl">Torneo non trovato</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0a1929] via-[#002F6C] to-[#0a1929]">
      <div className="relative z-10 py-8">
        {/* HEADER */}
        <div className="px-4 lg:px-8 mb-8">
          <button onClick={() => navigate('/tournaments')} className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors" >
            <ArrowLeft className="w-5 h-5" />
            <span>Torna ai tornei</span>
          </button>

          {/* TITLE SECTION */}
          <div className="bg-gradient-to-r from-[#002F6C] to-[#0055A4] rounded-2xl p-6 border border-[#FFD700]/30 shadow-2xl">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white flex items-center gap-3 flex-wrap">
                  {tournament.name}
                  {final && !tournament.is_active && (
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#002F6C] px-4 py-2 rounded-lg shadow-lg">
                      <Crown className="w-6 h-6" />
                      <span className="text-lg font-black">{getTeamName(final.winner_team_id)}</span>
                    </div>
                  )}
                </h1>
                <div className="flex items-center gap-6 text-gray-300 text-sm flex-wrap">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(tournament.start_date).toLocaleDateString('it-IT')}</span>
                  </div>
                  {tournament.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{tournament.location}</span>
                    </div>
                  )}
                  {tournament.number_of_teams && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{tournament.number_of_teams} squadre</span>
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`px-4 py-2 rounded-lg text-sm font-medium shadow-lg ${tournament.is_active
                    ? 'bg-green-600/90 text-white'
                    : 'bg-gray-600/90 text-white'
                  }`}
              >
                {tournament.is_active ? 'In corso' : 'Terminato'}
              </div>
            </div>
          </div>
        </div>

        {/* BRACKET LAYOUT - Desktop - NO PADDING */}
        <div className="hidden lg:block w-full overflow-x-auto pb-8">
          <div className="flex items-center justify-center gap-8 min-w-max px-4">
            {/* LEFT SIDE */}
            {leftSideRounds.map((roundData, roundIndex) => {
              const gapMultiplier = Math.pow(2, roundIndex);
              const baseGap = 3.5;
              const gap = baseGap * gapMultiplier;

              return (
                <div
                  key={`left-${roundData.round}`}
                  className="flex flex-col justify-around relative"
                  style={{ gap: `${gap}rem` }}
                >
                  <div className="text-center text-[#FFD700] font-semibold text-xs mb-3 tracking-wider uppercase">
                    {getRoundName(roundData.round, totalRounds)}
                  </div>
                  {roundData.games.map((game, gameIndex) => (
                    <MatchCard
                      key={game.id}
                      game={game}
                      getTeamName={getTeamName}
                      getTeamLogo={getTeamLogo}
                      editingGame={editingGame}
                      scores={scores}
                      setScores={setScores}
                      handleEditGame={handleEditGame}
                      handleSaveScore={handleSaveScore}
                      handleCancelEdit={handleCancelEdit}
                      updateGame={updateGame}
                      showConnector={roundIndex < leftSideRounds.length - 1}
                      connectorSide="right"
                      isWinnerGame={Boolean(
                        finalGame?.completed &&
                        final?.winner_team_id &&
                        (game.home_team_fk === final.winner_team_id ||
                          game.away_team_fk === final.winner_team_id)
                      )}
                      winnerId={final?.winner_team_id}
                      gameIndex={gameIndex}
                      totalGames={roundData.games.length}
                      gapRem={gap}
                    />
                  ))}
                </div>
              );
            })}

            {/* CENTER - FINAL */}
            <div className="flex flex-col items-center justify-center px-6">
              <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#002F6C] font-black text-sm px-6 py-2 rounded-lg mb-4 tracking-wider shadow-lg">
                FINALE
              </div>

              {/* Final Match Card */}
              {finalGame ? (
                <MatchCard
                  game={finalGame}
                  getTeamName={getTeamName}
                  getTeamLogo={getTeamLogo}
                  editingGame={editingGame}
                  scores={scores}
                  setScores={setScores}
                  handleEditGame={handleEditGame}
                  handleSaveScore={handleSaveScore}
                  handleCancelEdit={handleCancelEdit}
                  updateGame={updateGame}
                  showConnector={false}
                  isFinal={true}
                  isWinnerGame={true}
                  winnerId={final?.winner_team_id}
                  gameIndex={0}
                  totalGames={1}
                  gapRem={0}
                />
              ) : (
                <div className="text-gray-400 text-sm bg-[#001a3d] p-6 rounded-lg border border-gray-700">
                  In attesa della finale
                </div>
              )}
            </div>

            {/* RIGHT SIDE */}
            {rightSideRounds.map((roundData, roundIndex) => {
              const actualRoundIndex = leftSideRounds.length - 1 - roundIndex;
              const gapMultiplier = Math.pow(2, actualRoundIndex);
              const baseGap = 3.5;
              const gap = baseGap * gapMultiplier;

              return (
                <div
                  key={`right-${roundData.round}`}
                  className="flex flex-col justify-around relative"
                  style={{ gap: `${gap}rem` }}
                >
                  <div className="text-center text-[#FFD700] font-semibold text-xs mb-3 tracking-wider uppercase">
                    {getRoundName(roundData.round, totalRounds)}
                  </div>
                  {roundData.games.map((game, gameIndex) => (
                    <MatchCard
                      key={game.id}
                      game={game}
                      getTeamName={getTeamName}
                      getTeamLogo={getTeamLogo}
                      editingGame={editingGame}
                      scores={scores}
                      setScores={setScores}
                      handleEditGame={handleEditGame}
                      handleSaveScore={handleSaveScore}
                      handleCancelEdit={handleCancelEdit}
                      updateGame={updateGame}
                      showConnector={roundIndex < rightSideRounds.length - 1}
                      connectorSide="left"
                      isWinnerGame={Boolean(
                        finalGame?.completed &&
                        final?.winner_team_id &&
                        (game.home_team_fk === final.winner_team_id ||
                          game.away_team_fk === final.winner_team_id)
                      )}
                      winnerId={final?.winner_team_id}
                      gameIndex={gameIndex}
                      totalGames={roundData.games.length}
                      gapRem={gap}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* MOBILE LAYOUT */}
        <div className="lg:hidden space-y-8 px-4">
          {/* Rounds - Mobile */}
          {rounds.map((round) => (
            <div key={round}>
              <h2 className="text-2xl font-bold text-white mb-4 text-center tracking-wide">
                {getRoundName(round, rounds.length)}
              </h2>
              <div className="space-y-4">
                {gamesByRound?.[round]?.map((game) => (
                  <MatchCard
                    key={game.id}
                    game={game}
                    getTeamName={getTeamName}
                    getTeamLogo={getTeamLogo}
                    editingGame={editingGame}
                    scores={scores}
                    setScores={setScores}
                    handleEditGame={handleEditGame}
                    handleSaveScore={handleSaveScore}
                    handleCancelEdit={handleCancelEdit}
                    updateGame={updateGame}
                    showConnector={false}
                    isFinal={round === totalRounds}
                    isWinnerGame={Boolean(
                      finalGame?.completed &&
                      final?.winner_team_id &&
                      (game.home_team_fk === final.winner_team_id ||
                        game.away_team_fk === final.winner_team_id)
                    )}
                    winnerId={final?.winner_team_id}
                    gameIndex={0}
                    totalGames={1}
                    gapRem={0}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {rounds.length === 0 && (
          <div className="bg-[#001a3d] rounded-xl p-12 border border-gray-700 text-center max-w-2xl mx-auto">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 text-lg">
              Nessuna partita disponibile per questo torneo
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Match Card Component
interface MatchCardProps {
  game: Game;
  getTeamName: (teamId?: number) => string;
  getTeamLogo: (teamId?: number) => string | undefined;
  editingGame: number | null;
  scores: { home: number; away: number };
  setScores: React.Dispatch<React.SetStateAction<{ home: number; away: number }>>;
  handleEditGame: (game: Game) => void;
  handleSaveScore: (gameId: number) => void;
  handleCancelEdit: () => void;
  updateGame: any;
  showConnector?: boolean;
  connectorSide?: 'left' | 'right';
  isFinal?: boolean;
  isWinnerGame?: boolean;
  winnerId?: number;
  gameIndex: number;
  totalGames: number;
  gapRem: number;
}

const MatchCard = ({
  game,
  getTeamName,
  getTeamLogo,
  editingGame,
  scores,
  setScores,
  handleEditGame,
  handleSaveScore,
  handleCancelEdit,
  updateGame,
  showConnector = false,
  connectorSide = 'right',
  isFinal = false,
  isWinnerGame = false,
  winnerId,
  gameIndex,
  totalGames,
  gapRem
}: MatchCardProps) => {
  const isWinner = (isHome: boolean) => {
    if (!game.completed || game.home_score === undefined || game.away_score === undefined) {
      return false;
    }
    return isHome ? game.home_score > game.away_score : game.away_score > game.home_score;
  };

  const isChampion = (teamId?: number) => {
    return Boolean(winnerId && teamId === winnerId);
  };

  // Calcola le posizioni per le linee di connessione geometriche perfette
  const connectorLength = 48; // lunghezza orizzontale in px
  const verticalLineLength = (gapRem * 16) / 2; // metà dello spazio tra match (converti rem in px)

  return (
    <div className="relative">
      {/* SVG per connettori geometrici perfetti */}
      {showConnector && (
        <svg
          className="absolute top-1/2 pointer-events-none"
          style={{
            [connectorSide === 'right' ? 'left' : 'right']: '100%',
            width: `${connectorLength + verticalLineLength}px`,
            height: `${(gapRem * 16) + 150}px`,
            transform: 'translateY(-50%)',
          }}
          overflow="visible"
        >
          {gameIndex % 2 === 0 ? (
            // Match pari (superiore) - connettore va verso il basso
            <>
              {/* Linea orizzontale dal match */}
              <line
                x1={connectorSide === 'right' ? 0 : connectorLength + verticalLineLength}
                y1="50%"
                x2={connectorSide === 'right' ? connectorLength : verticalLineLength}
                y2="50%"
                stroke="rgba(255, 215, 0, 0.4)"
                strokeWidth="2"
              />
              {/* Linea verticale verso il basso */}
              <line
                x1={connectorSide === 'right' ? connectorLength : verticalLineLength}
                y1="50%"
                x2={connectorSide === 'right' ? connectorLength : verticalLineLength}
                y2={`calc(50% + ${verticalLineLength}px)`}
                stroke="rgba(255, 215, 0, 0.4)"
                strokeWidth="2"
              />
              {/* Linea orizzontale finale */}
              <line
                x1={connectorSide === 'right' ? connectorLength : verticalLineLength}
                y1={`calc(50% + ${verticalLineLength}px)`}
                x2={connectorSide === 'right' ? connectorLength + verticalLineLength : 0}
                y2={`calc(50% + ${verticalLineLength}px)`}
                stroke="rgba(255, 215, 0, 0.4)"
                strokeWidth="2"
              />
            </>
          ) : (
            // Match dispari (inferiore) - connettore va verso l'alto
            <>
              {/* Linea orizzontale dal match */}
              <line
                x1={connectorSide === 'right' ? 0 : connectorLength + verticalLineLength}
                y1="50%"
                x2={connectorSide === 'right' ? connectorLength : verticalLineLength}
                y2="50%"
                stroke="rgba(255, 215, 0, 0.4)"
                strokeWidth="2"
              />
              {/* Linea verticale verso l'alto */}
              <line
                x1={connectorSide === 'right' ? connectorLength : verticalLineLength}
                y1="50%"
                x2={connectorSide === 'right' ? connectorLength : verticalLineLength}
                y2={`calc(50% - ${verticalLineLength}px)`}
                stroke="rgba(255, 215, 0, 0.4)"
                strokeWidth="2"
              />
            </>
          )}
        </svg>
      )}

      <div
        className={`relative bg-gradient-to-br from-[#001a3d] to-[#002F6C] rounded-lg p-3 border transition-all w-48 shadow-lg hover:shadow-xl ${isFinal
            ? 'border-2 border-[#FFD700] shadow-[#FFD700]/20'
            : 'border-gray-700 hover:border-gray-600'
          }`}
      >
        {/* Edit button */}
        {!game.completed && game.home_team_fk && game.away_team_fk && (
          <button
            onClick={() => handleEditGame(game)}
            className="absolute top-2 right-2 p-1.5 bg-[#FFD700]/20 hover:bg-[#FFD700]/30 rounded transition-colors z-10"
            disabled={editingGame !== null && editingGame !== game.id}
          >
            <Edit2 className="w-3.5 h-3.5 text-[#FFD700]" />
          </button>
        )}

        {/* Match number */}
        <div className="text-center text-gray-400 text-[10px] mb-2 font-medium">
          Match #{game.match_number}
        </div>

        {/* Teams */}
        <div className="space-y-1.5">
          {/* Home Team */}
          <TeamRow
            teamId={game.home_team_fk}
            teamName={getTeamName(game.home_team_fk)}
            teamLogo={getTeamLogo(game.home_team_fk)}
            score={game.home_score}
            isWinner={isWinner(true)}
            isChampion={isChampion(game.home_team_fk)}
            isEditing={editingGame === game.id}
            editScore={scores.home}
            onScoreChange={(value) => setScores(prev => ({ ...prev, home: value }))}
          />

          {/* Away Team */}
          <TeamRow
            teamId={game.away_team_fk}
            teamName={getTeamName(game.away_team_fk)}
            teamLogo={getTeamLogo(game.away_team_fk)}
            score={game.away_score}
            isWinner={isWinner(false)}
            isChampion={isChampion(game.away_team_fk)}
            isEditing={editingGame === game.id}
            editScore={scores.away}
            onScoreChange={(value) => setScores(prev => ({ ...prev, away: value }))}
          />
        </div>

        {/* Edit Actions */}
        {editingGame === game.id && (
          <div className="flex gap-1.5 mt-3">
            <button
              onClick={() => handleSaveScore(game.id)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded text-xs flex items-center justify-center gap-1 font-medium transition-colors"
              disabled={updateGame.isPending}
            >
              <Check className="w-3.5 h-3.5" />
              Salva
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-1.5 rounded text-xs flex items-center justify-center gap-1 font-medium transition-colors"
              disabled={updateGame.isPending}
            >
              <X className="w-3.5 h-3.5" />
              Annulla
            </button>
          </div>
        )}

        {/* Completed badge */}
        {game.completed && (
          <div className="text-center text-emerald-400 text-[10px] mt-2 font-medium">
            ✓ Completata
          </div>
        )}
      </div>
    </div>
  );
};

// Team Row Component
interface TeamRowProps {
  teamId?: number;
  teamName: string;
  teamLogo?: string;
  score?: number;
  isWinner: boolean;
  isChampion: boolean;
  isEditing: boolean;
  editScore: number;
  onScoreChange: (value: number) => void;
}

const TeamRow = ({
  teamId,
  teamName,
  teamLogo,
  score,
  isWinner,
  isChampion,
  isEditing,
  editScore,
  onScoreChange
}: TeamRowProps) => {
  return (
    <div
      className={`flex items-center gap-2 p-2 rounded transition-all relative ${isWinner
          ? 'bg-gradient-to-r from-[#0055A4] to-[#003d7a] shadow-md'
          : 'bg-[#002F6C]/50'
        }`}
    >
      {/* Crown for champion */}
      {isChampion && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full p-1 shadow-lg z-10">
          <Crown className="w-4 h-4 text-[#002F6C]" />
        </div>
      )}

      {/* Logo */}
      <div className="flex-shrink-0">
        {teamId && teamLogo ? (
          <img
            src={teamLogo}
            alt={teamName}
            className="w-6 h-6 rounded-full object-cover border-2 border-white/30"
          />
        ) : (
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-700/50 border-2 border-white/20">
            <Users className="w-3.5 h-3.5 text-gray-300" />
          </div>
        )}
      </div>

      {/* Team Name */}
      <div className="flex-1 min-w-0">
        <div
          className={`text-xs font-semibold truncate ${teamId ? 'text-white' : 'text-gray-500 italic'
            }`}
        >
          {teamName}
        </div>
      </div>

      {/* Score */}
      <div className="flex-shrink-0">
        {isEditing ? (
          <input
            type="number"
            value={editScore}
            onChange={(e) => onScoreChange(parseInt(e.target.value) || 0)}
            className="w-12 px-2 py-1 bg-gray-900/70 text-white rounded text-center text-xs border border-white/30 focus:border-[#FFD700] focus:outline-none"
            min="0"
          />
        ) : (
          <span
            className={`text-base font-bold ${isWinner ? 'text-white' : 'text-gray-400'
              }`}
          >
            {score ?? '-'}
          </span>
        )}
      </div>
    </div>
  );
};

export default BracketPage;