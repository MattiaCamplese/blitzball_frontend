import { Search, Trash2, Trophy, Users } from 'lucide-react';
import { useState } from 'react';
import { useTeams, useDeleteTeam } from './team.hooks';
import CreateTeamButton from './CreateTeamButton';
import AnimatedTitle from '@/components/ui/title';
import TeamRoster from './TeamRoster';
import type { Team } from './team.type';

const TeamsPage = () => {
  const { data: teams, isLoading, error } = useTeams();
  const deleteTeam = useDeleteTeam();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [rosterOpen, setRosterOpen] = useState(false);

  const filteredTeams =
    teams?.filter((team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Sei sicuro di voler eliminare ${name}?`)) {
      try {
        await deleteTeam.mutateAsync(id);
      } catch {
        alert("Errore durante l'eliminazione");
      }
    }
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
              <AnimatedTitle parts={[ { text: "TEA", className: "text-white" }, { text: "MS", className: "text-yellow-300" }, ]}/>
              <p className="text-gray-300 text-sm sm:text-base">
                Gestisci tutti i team registrati
              </p>
            </div>
            <div className="flex-shrink-0">
              <CreateTeamButton />
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-[#001a3d] rounded-xl p-4 mb-6 border border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca Team tramite Nome"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#002F6C] text-white pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none transition"
            />
          </div>
        </div>

        {/* COUNTER */}
        <div className="bg-[#001a3d] rounded-xl p-4 mb-6 border border-gray-700 text-gray-400 text-sm flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
          <span>
            Totale team:{' '}
            <span className="text-white font-bold">{teams?.length || 0}</span>
          </span>
          {searchTerm && (
            <span>
              Filtrati:{' '}
              <span className="text-[#FFD700] font-bold">
                {filteredTeams.length}
              </span>
            </span>
          )}
        </div>

        {/* GRID TEAMS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeams.map((team) => (
            <div
              key={team.id}
              onClick={() => {
                setSelectedTeam(team);
                setRosterOpen(true);
              }}
              className="bg-[#001a3d] p-6 rounded-xl border border-gray-700 hover:border-[#FFD700] transition-all flex flex-col cursor-pointer hover:shadow-xl"
            >
              {/* CARD HEADER */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-[#0055A4] flex items-center justify-center">
                    {team.logo ? (
                      <img
                        src={team.logo}
                        alt={team.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/fallback-logo.png";
                        }}
                      />
                    ) : (
                      <Users className="w-6 h-6 text-[#FFD700]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-medium text-lg truncate">
                      {team.name}
                    </div>
                  </div>
                </div>

                {/* DELETE */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(team.id, team.name);
                  }}
                  className="p-2 bg-red-900/50 rounded-lg hover:bg-red-900 transition-colors"
                  disabled={deleteTeam.isPending}
                >
                  <Trash2 className="w-4 h-4 text-black" />
                </button>
              </div>

              {/* DIVIDER */}
              <div className="border-t border-gray-700 my-3" />

              {/* TROPHIES */}
              <div className="flex items-center justify-center gap-2 text-[#FFD700]">
                <Trophy className="w-4 h-4" />
                <span className="font-medium">
                  {team.tournaments_won}{' '}
                  {team.tournaments_won === 1
                    ? 'torneo vinto'
                    : 'tornei vinti'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredTeams.length === 0 && (
          <div className="bg-[#001a3d] rounded-xl p-12 border border-gray-700 text-center mt-6">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              {searchTerm
                ? 'Nessun team trovato con questi criteri'
                : 'Nessun team registrato'}
            </p>
          </div>
        )}

      </div>

      {/* TEAM ROSTER MODAL */}
      <TeamRoster
        team={selectedTeam}
        open={rosterOpen}
        onOpenChange={setRosterOpen}
      />
    </div>
  );
};

export default TeamsPage;
