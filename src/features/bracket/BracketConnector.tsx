import { useEffect, useRef, useState } from 'react';
import type { Game } from '../game/game.type';
import type { BracketColumn } from './bracket.utils';

interface Connection {
  fromGameId: number;
  toGameId: number;
  isHome: boolean; // true se va al home_team, false se va al away_team
}

interface BracketConnectorProps {
  bracketLayout: BracketColumn[];
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const BracketConnector = ({ bracketLayout, containerRef }: BracketConnectorProps) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

  // Calcola le connessioni tra le partite
  useEffect(() => {
    const allGames: Game[] = [];
    bracketLayout.forEach((column) => {
      column.games.forEach((gameData) => {
        allGames.push(gameData.game);
      });
    });

    const newConnections: Connection[] = [];

    // Per ogni partita, trova la prossima partita nel round successivo
    allGames.forEach((game) => {
      if (!game.round || !game.position_in_round) return;

      const nextRound = game.round + 1;
      const nextPosition = Math.ceil(game.position_in_round / 2);
      const isHome = game.position_in_round % 2 === 1;

      // Trova la partita successiva
      const nextGame = allGames.find(
        (g) => g.round === nextRound && g.position_in_round === nextPosition
      );

      if (nextGame) {
        newConnections.push({
          fromGameId: game.id,
          toGameId: nextGame.id,
          isHome,
        });
      }
    });

    setConnections(newConnections);
  }, [bracketLayout]);

  // Aggiorna le dimensioni dell'SVG quando il container cambia
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setSvgDimensions({
          width: containerRef.current.scrollWidth,
          height: containerRef.current.scrollHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [containerRef, bracketLayout]);

  // Funzione per ottenere la posizione di una card
  const getCardPosition = (
    gameId: number,
    isTarget: boolean,
    isHome?: boolean,
    isRightSide?: boolean
  ) => {
    const element = document.querySelector(`[data-game-id="${gameId}"]`) as HTMLElement;
    if (!element || !containerRef.current) return null;

    const containerRect = containerRef.current.getBoundingClientRect();
    const cardRect = element.getBoundingClientRect();

    const x = cardRect.left - containerRect.left + containerRef.current.scrollLeft;
    const y = cardRect.top - containerRect.top + containerRef.current.scrollTop;

    if (isTarget) {
      // Punto di arrivo
      // Sul lato sinistro: linea entra da sinistra
      // Sul lato destro: linea entra da destra
      const targetX = isRightSide ? x + cardRect.width : x;
      const targetY = isHome
        ? y + cardRect.height * 0.35  // 35% dall'alto per home
        : y + cardRect.height * 0.65; // 65% dall'alto per away

      return { x: targetX, y: targetY };
    } else {
      // Punto di partenza (al centro verticalmente)
      // Sul lato sinistro: linea esce da destra
      // Sul lato destro: linea esce da sinistra
      const startX = isRightSide ? x : x + cardRect.width;
      return { x: startX, y: y + cardRect.height / 2 };
    }
  };

  // Disegna una linea con curve (bezier) tra due punti
  const drawConnection = (conn: Connection) => {
    // Determina se siamo sul lato destro del bracket
    // Troviamo le colonne di from e to
    let fromColumnIndex = -1;
    let toColumnIndex = -1;

    bracketLayout.forEach((col, idx) => {
      if (col.games.some((g) => g.game.id === conn.fromGameId)) fromColumnIndex = idx;
      if (col.games.some((g) => g.game.id === conn.toGameId)) toColumnIndex = idx;
    });

    // Se il fromColumn è dopo il toColumn, siamo sul lato destro
    const isRightSide = fromColumnIndex > toColumnIndex;

    const from = getCardPosition(conn.fromGameId, false, undefined, isRightSide);
    const to = getCardPosition(conn.toGameId, true, conn.isHome, isRightSide);

    if (!from || !to) return null;

    // Calcola i punti di controllo per la curva di Bezier
    const midX = (from.x + to.x) / 2;
    const cornerRadius = 20; // Raggio delle curve agli angoli

    // Path SVG con linee e curve smooth agli angoli
    // Invertiamo la direzione orizzontale se siamo sul lato destro
    const path = isRightSide
      ? `
        M ${from.x} ${from.y}
        H ${midX + cornerRadius}
        Q ${midX} ${from.y} ${midX} ${from.y + (to.y > from.y ? cornerRadius : -cornerRadius)}
        V ${to.y - (to.y > from.y ? cornerRadius : -cornerRadius)}
        Q ${midX} ${to.y} ${midX - cornerRadius} ${to.y}
        H ${to.x}
      `
      : `
        M ${from.x} ${from.y}
        H ${midX - cornerRadius}
        Q ${midX} ${from.y} ${midX} ${from.y + (to.y > from.y ? cornerRadius : -cornerRadius)}
        V ${to.y - (to.y > from.y ? cornerRadius : -cornerRadius)}
        Q ${midX} ${to.y} ${midX + cornerRadius} ${to.y}
        H ${to.x}
      `;

    return (
      <path
        key={`${conn.fromGameId}-${conn.toGameId}`}
        d={path}
        fill="none"
        stroke="rgba(251, 191, 36, 0.3)" // amber-400 con opacità
        strokeWidth="2"
        className="transition-all duration-300 hover:stroke-amber-400 hover:stroke-[3px]"
      />
    );
  };

  if (connections.length === 0 || svgDimensions.width === 0) return null;

  return (
    <svg
      className="absolute top-0 left-0 pointer-events-none"
      style={{
        width: svgDimensions.width,
        height: svgDimensions.height,
      }}
    >
      {connections.map(drawConnection)}
    </svg>
  );
};

export default BracketConnector;
