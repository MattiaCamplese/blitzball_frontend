export type Game = {
    id:number;
    tournament_fk: number;
    match_number: number;
    round?: number;
    position_in_round?: number;
    home_team_fk?: number;
    away_team_fk?: number;
    home_score?: number;
    away_score?: number;
    match_date?: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
}