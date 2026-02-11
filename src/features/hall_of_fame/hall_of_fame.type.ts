export type HallOfFame = {
  id: number;
  tournament_fk: number;
  winning_team_fk: number | null;
  victory_date: string;
  winning_team_name?: string; 
  tournament_name?: string; 
  tournament_location?: string;
}

