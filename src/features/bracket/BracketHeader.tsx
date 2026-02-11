import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Crown } from 'lucide-react';
import type { Tournament } from '../tournament/tournament.type';


interface TournamentFinal {
  winner_team_id?: number;
}

interface BracketHeaderProps {
  tournament: Tournament;
  final?: TournamentFinal;
  gamesCount: number;
  getTeamName: (teamId?: number) => string;
}

const BracketHeader = ({ tournament, final, gamesCount, getTeamName }: BracketHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="px-4 lg:px-8 mb-8">
      <button onClick={() => navigate('/tournaments')} className="flex items-center gap-2 text-black hover:text-gray-600 mb-6 transition-colors group" >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>Torna ai tornei</span>
      </button>

      <div className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 backdrop-blur-sm rounded-2xl p-6 border border-amber-400/30 shadow-2xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                {tournament.name}
              </h1>
              {final && !tournament.is_active && final.winner_team_id && (
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 px-4 py-2 rounded-lg shadow-lg animate-pulse">
                  <Crown className="w-6 h-6" />
                  <span className="text-lg font-black">{getTeamName(final.winner_team_id)}</span>
                </div>
              )}
            </div>

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
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{gamesCount} partite</span>
              </div>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg font-bold text-sm ${ tournament.is_active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/50': 'bg-gray-500/20 text-gray-400 border border-gray-400/50' }`} >
            {tournament.is_active ? '● In corso' : '○ Concluso'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BracketHeader;