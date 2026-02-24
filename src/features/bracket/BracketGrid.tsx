import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Game } from '../game/game.type';
import type { BracketColumn } from './bracket.utils';
import MatchCard from './MatchCard';
import BracketConnector from './BracketConnector';


interface BracketGridProps {
  bracketLayout: BracketColumn[];
  winnerId?: number;
  getTeamName: (teamId?: number) => string;
  getTeamLogo: (teamId?: number) => string | undefined;
  onOpenResult: (game: Game) => void;
}

const BracketGrid = ({
  bracketLayout,
  winnerId,
  getTeamName,
  getTeamLogo,
  onOpenResult,
}: BracketGridProps) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  if (bracketLayout.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700 text-center max-w-2xl mx-auto">
        <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-300 text-lg mb-4">
          Nessuna partita disponibile per questo torneo
        </p>
        <Button variant="tertiary" onClick={() => navigate('/tournaments')} className="mt-2">
          Torna ai tornei
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-8 w-full">
      <div className="w-full px-4 lg:px-8">
        <div
          ref={containerRef}
          className={`relative flex items-center w-full ${
            bracketLayout.length <= 3 ? 'justify-center gap-16' :
            bracketLayout.length <= 5 ? 'justify-center gap-12' :
            'justify-between'
          }`}
        >
          <BracketConnector bracketLayout={bracketLayout} containerRef={containerRef} />
          {bracketLayout.map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col justify-center">
              <div className="text-center text-amber-400 font-bold text-xs tracking-wider mb-4">
                {column.name}
              </div>
              <div
                className="flex flex-col"
                style={{
                  gap: `${column.spacing}px`,
                  minHeight: `${column.containerHeight}px`,
                }}
              >
                {column.games.map((gameData) => (
                  <div
                    key={gameData.game.id}
                    data-game-id={gameData.game.id}
                    style={{
                      marginTop: gameData.topMargin ? `${gameData.topMargin}px` : undefined,
                    }}
                  >
                    <MatchCard
                      game={gameData.game}
                      getTeamName={getTeamName}
                      getTeamLogo={getTeamLogo}
                      onOpenResult={() => onOpenResult(gameData.game)}
                      isFinal={column.isFinal}
                      winnerId={winnerId}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BracketGrid;
