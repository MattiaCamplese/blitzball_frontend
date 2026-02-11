import type { Game } from "../game/game.type";


export interface BracketColumn {
  name: string;
  games: Array<{ game: Game; topMargin?: number }>;
  spacing: number;
  containerHeight: number;
  isFinal: boolean;
}

// Dimensioni base - saranno scalate dinamicamente
export const BASE_CARD_HEIGHT = 140;
export const BASE_FINAL_CARD_HEIGHT = 180;

// Funzione per calcolare le dimensioni scalate
export function getScaledDimensions(totalColumns: number) {
  // Scala specifica per bracket piccoli (4, 8, 16 squadre)
  // totalColumns: 3 = 4 squadre, 5 = 8 squadre, 7 = 16 squadre, 11 = 32 squadre
  let scaleFactor: number;
  
  if (totalColumns <= 3) {
    // 4 squadre - riduciamo molto per avvicinare
    scaleFactor = 0.5;
  } else if (totalColumns <= 5) {
    // 8 squadre - riduciamo moderatamente
    scaleFactor = 0.55;
  } else if (totalColumns <= 7) {
    // 16 squadre - riduciamo leggermente
    scaleFactor = 0.6;
  } else {
    // 32+ squadre - manteniamo originale o scala automatica
    scaleFactor = Math.max(0.6, Math.min(1, 10 / totalColumns));
  }
  
  return {
    cardHeight: BASE_CARD_HEIGHT * scaleFactor,
    finalCardHeight: BASE_FINAL_CARD_HEIGHT * scaleFactor,
  };
}

export function getRoundName(round: number, totalRounds: number): string {
  const remaining = totalRounds - round + 1;
  if (remaining === 1) return 'FINALE';
  if (remaining === 2) return 'Semifinali';
  if (remaining === 3) return 'Quarti';
  if (remaining === 4) return 'Ottavi';
  if (remaining === 5) return 'Sedicesimi';
  return `Round ${round}`;
}

export function createBracketLayout(
  gamesByRound: Record<number, Game[]> | undefined,
  rounds: number[]
): BracketColumn[] {
  if (!gamesByRound || rounds.length === 0) return [];

  const totalRounds = rounds.length;
  const lastRound = rounds[totalRounds - 1];
  const hasFinal = gamesByRound[lastRound]?.length === 1;

  // Calcola il numero totale di colonne per determinare la scala
  const totalColumns = hasFinal ? (totalRounds - 1) * 2 + 1 : totalRounds;
  const { cardHeight, finalCardHeight } = getScaledDimensions(totalColumns);

  // Fattore di compressione per avvicinare le card nei bracket piccoli
  const compressionFactor = totalColumns <= 3 ? 0.6 : totalColumns <= 5 ? 0.75 : 1;

  if (!hasFinal) {
    return rounds.map((round, roundIndex) => {
      const roundGames = gamesByRound[round] || [];
      const spacing = cardHeight * Math.pow(2, roundIndex);
      return {
        name: getRoundName(round, totalRounds),
        games: roundGames.map((game) => ({ game, topMargin: undefined })),
        spacing: spacing - cardHeight,
        containerHeight: 0,
        isFinal: false,
      };
    });
  }

  const layout: BracketColumn[] = [];
  const preFinaleRounds = rounds.slice(0, -1);

  // LATO SINISTRO
  preFinaleRounds.forEach((round, roundIndex) => {
    const roundGames = gamesByRound[round] || [];
    const midpoint = Math.ceil(roundGames.length / 2);
    const leftGames = roundGames.slice(0, midpoint);
    const baseSpacing = cardHeight * Math.pow(2, roundIndex);
    const spacing = baseSpacing * compressionFactor;

    layout.push({
      name: getRoundName(round, totalRounds),
      games: leftGames.map((game) => ({
        game,
        topMargin: undefined, // Nessun margine, solo spacing naturale
      })),
      spacing: spacing - cardHeight,
      containerHeight: 0,
      isFinal: false,
    });
  });

  // FINALE AL CENTRO
  const finalGame = gamesByRound[lastRound]?.[0];
  if (finalGame) {
    // Entrambe le semifinali (sinistra e destra) partono da Y=0
    // quindi il centro tra di loro è semplicemente a cardHeight/2
    const finalMargin = (cardHeight - finalCardHeight) / 2;

    layout.push({
      name: '',
      games: [{ game: finalGame, topMargin: finalMargin }],
      spacing: 0,
      containerHeight: 0,
      isFinal: true,
    });
  }

  // LATO DESTRO (ordine inverso)
  // Sul lato destro NON applichiamo margini - le card sono già centrate grazie allo spacing
  for (let i = preFinaleRounds.length - 1; i >= 0; i--) {
    const round = preFinaleRounds[i];
    const roundGames = gamesByRound[round] || [];
    const midpoint = Math.ceil(roundGames.length / 2);
    const rightGames = roundGames.slice(midpoint);
    const baseSpacing = cardHeight * Math.pow(2, i);
    const spacing = baseSpacing * compressionFactor;

    layout.push({
      name: getRoundName(round, totalRounds),
      games: rightGames.map((game) => ({
        game,
        topMargin: undefined, // Nessun margine sul lato destro
      })),
      spacing: spacing - cardHeight,
      containerHeight: 0,
      isFinal: false,
    });
  }

  return layout;
}

export function groupGamesByRound(games: Game[]): Record<number, Game[]> {
  const gamesByRound = games.reduce((acc, game) => {
    const round = game.round ?? 1;
    if (!acc[round]) acc[round] = [];
    acc[round].push(game);
    return acc;
  }, {} as Record<number, Game[]>);

  Object.keys(gamesByRound).forEach((round) => {
    gamesByRound[Number(round)].sort(
      (a, b) => (a.position_in_round ?? 0) - (b.position_in_round ?? 0)
    );
  });

  return gamesByRound;
}