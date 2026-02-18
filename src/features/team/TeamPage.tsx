import { Search, Trash2, Trophy, Users, Pencil, Loader2, ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { useTeams, useDeleteTeam, useUpdateTeam } from './team.hooks';
import CreateTeamButton from './CreateTeamButton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import AnimatedTitle from '@/components/ui/title';
import TeamRoster from './TeamRoster';
import type { Team } from './team.type';

const TeamsPage = () => {
  const { data: teams, isLoading, error } = useTeams();
  const deleteTeam = useDeleteTeam();
  const updateTeam = useUpdateTeam();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [rosterOpen, setRosterOpen] = useState(false);

  // Modal edit
  const [editTeam, setEditTeam] = useState<Team | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', logo: '' });

  const openEdit = (e: React.MouseEvent, team: Team) => {
    e.stopPropagation();
    setEditTeam(team);
    setEditForm({
      name: team.name,
      logo: team.logo || '',
    });
    setEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTeam) return;
    updateTeam.mutate({
      id: editTeam.id,
      data: {
        ...editForm,
        logo: editForm.logo.trim() === '' ? undefined : editForm.logo,
      },
    }, {
      onSuccess: () => setEditOpen(false),
      onError: () => alert("Errore durante la modifica"),
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const filteredTeams =
    teams
      ?.filter((team) =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => (b.tournaments_won ?? 0) - (a.tournaments_won ?? 0) || b.id - a.id) || [];

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Sei sicuro di voler eliminare ${name}?`)) {
      try {
        await deleteTeam.mutateAsync(id);
      } catch (err: unknown) {
        const msg = (err as { message?: string })?.message;
        alert(msg ?? "Errore durante l'eliminazione");
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

                {/* EDIT + DELETE */}
                <div className="flex gap-1">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={(e) => openEdit(e, team)}
                    className="p-2 bg-[#0055A4]/50 rounded-lg hover:bg-[#0055A4] transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-black" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(team.id, team.name);
                    }}
                    className="p-2 bg-red-900/50 rounded-lg hover:bg-red-900 transition-colors"
                    disabled={deleteTeam.isPending}
                  >
                    <Trash2 className="w-4 h-4 text-black" />
                  </Button>
                </div>
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

      {/* EDIT DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto [&>button]:text-black [&>button:hover]:text-red-700">
          <DialogHeader className="text-gray-700 mb-2">
            <DialogTitle>Modifica Team</DialogTitle>
            <DialogDescription>Modifica i dati del team</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-6 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
              <InputGroup>
                <InputGroupInput type="text" name="name" value={editForm.name} onChange={handleEditChange} required />
                <InputGroupAddon><Users className="h-4 w-4" /></InputGroupAddon>
              </InputGroup>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
              <InputGroup>
                <InputGroupInput type="text" name="logo" value={editForm.logo} onChange={handleEditChange} placeholder="Link del logo" />
                <InputGroupAddon><ImageIcon className="h-4 w-4" /></InputGroupAddon>
              </InputGroup>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button type="button" onClick={() => setEditOpen(false)} className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300">
                Annulla
              </Button>
              <Button type="submit" disabled={updateTeam.isPending} className="flex-1 flex items-center justify-center gap-2 text-gray-700">
                {updateTeam.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Salvataggio...</span>
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4" />
                    <span>Salva Modifiche</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamsPage;
