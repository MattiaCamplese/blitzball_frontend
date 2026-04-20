export type Athlete = {
    id: number;
    fiscal_code: string;
    first_name: string;
    last_name: string;
    birth_place?: string;
    birth_date?: string;
    img?: string | null;
    tournaments_won: number;
    goals?: number;
    created_at: string;
    updated_at: string;
}
