import { Search, Trophy, Calendar, MapPin, Users, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTournaments, useDeleteTournament } from './tournament.hooks';
import CreateTournamentButton from './CreateTournamentButton';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedTitle from '@/components/ui/title';

const TournamentsPage = () => {
  const { data: tournaments, isLoading, error } = useTournaments();
  const deleteTournament = useDeleteTournament();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTournaments =
    tournaments?.filter((tournament) =>
      tournament.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Sei sicuro di voler eliminare il torneo "${name}"?`)) {
      try {
        await deleteTournament.mutateAsync(id);
      } catch {
        alert("Errore durante l'eliminazione del torneo");
      }
    }
  };

  const handleViewBracket = (tournamentId: number) => {
    navigate(`/tournaments/${tournamentId}/bracket`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full px-4 py-8 flex items-center justify-center">
        <div className="text-white text-xl">Caricamento...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full px-4 py-8 flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-500 rounded-xl p-6">
          <div className="text-red-500 text-xl mb-2">
            Errore nel caricamento
          </div>
          <div className="text-red-300 text-sm">
            {error instanceof Error ? error.message : 'Errore sconosciuto'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 py-8 bg-transparent">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="bg-[#002F6C] rounded-2xl p-6 md:p-8 mb-8 border-2 border-[#FFD700]/30 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
            <div className="flex-1">
              <AnimatedTitle parts={[{ text: "TOURNA", className: "text-white" }, { text: "MENTS", className: "text-yellow-300" },]} />
              <p className="text-gray-300 text-sm sm:text-base">
                Gestisci tutti i tornei registrati
              </p>
            </div>
            <div className="flex-shrink-0">
              <CreateTournamentButton />
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-[#001a3d] rounded-xl p-4 mb-6 border border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Cerca torneo tramite nome" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#002F6C] text-white pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none transition" />
          </div>
        </div>

        {/* COUNTER */}
        <div className="bg-[#001a3d] rounded-xl p-4 mb-6 border border-gray-700 text-gray-400 text-sm flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
          <span>
            Totale tornei:{' '}
            <span className="text-white font-bold">{tournaments?.length || 0}</span>
          </span>
          {searchTerm && (
            <span>
              Filtrati:{' '}
              <span className="text-[#FFD700] font-bold">{filteredTournaments.length}</span>
            </span>
          )}
        </div>

        {/* GRID TOURNAMENTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="bg-[#001a3d] p-6 rounded-xl border border-gray-700 hover:border-[#FFD700] transition-all flex flex-col"
            >
              {/* CARD HEADER */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-[#0055A4] flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-[#FFD700]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-medium text-lg truncate">
                      {tournament.name}
                    </div>
                    <div className={`text-xs mt-1 ${tournament.is_active ? 'text-green-400' : 'text-gray-400'}`} >
                      {tournament.is_active ? 'In corso' : 'Terminato'}
                    </div>
                  </div>
                </div>

                {/* DELETE */}
                <Button variant="destructive" size="icon" onClick={() => handleDelete(tournament.id, tournament.name)} className="p-2 text-black-700 rounded-lg " disabled={deleteTournament.isPending} >
                  <Trash2 className="w-4 h-4 text-black-700" />
                </Button>
              </div>

              {/* DIVIDER */}
              <div className="border-t border-gray-700 my-3" />

              {/* INFO */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(tournament.start_date).toLocaleDateString('it-IT')}</span>
                </div>
                {tournament.location && (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{tournament.location}</span>
                  </div>
                )}
                {tournament.number_of_teams && (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Users className="w-4 h-4" />
                    <span>{tournament.number_of_teams} team</span>
                  </div>
                )}
              </div>

              {/* BUTTON */}
              <Button
                onClick={() => handleViewBracket(tournament.id)}
                className="w-full bg-[#0055A4] hover:bg-[#FFD700] text-black hover:text-black py-2 rounded-lg transition-colors font-medium" >
                Visualizza Bracket
              </Button>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredTournaments.length === 0 && (
          <div className="bg-[#001a3d] rounded-xl p-12 border border-gray-700 text-center mt-6">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              {searchTerm
                ? 'Nessun torneo trovato con questi criteri'
                : 'Nessun torneo registrato'}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default TournamentsPage;