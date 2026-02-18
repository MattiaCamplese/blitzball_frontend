import { Search, Trash2, Trophy, Users, Pencil, Loader2, ImageIcon, MapPin, Calendar, PencilLine } from 'lucide-react';
import { useState } from 'react';
import { useAthletes, useDeleteAthlete, useUpdateAthlete } from './athlete.hook';
import type { Athlete } from './athlete.services';
import CreateAthleteButton from './CreateAthleteButton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

import AnimatedTitle from '@/components/ui/title';
import AthleteDetailModal from './AthleteSchedeSimple';

const AthletesPage = () => {
  const { data: athletes, isLoading, error } = useAthletes();
  const deleteAthlete = useDeleteAthlete();
  const updateAthlete = useUpdateAthlete();
  const [searchTerm, setSearchTerm] = useState('');

  // Modal detail
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Modal edit
  const [editAthlete, setEditAthlete] = useState<Athlete | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ first_name: '', last_name: '', fiscal_code: '', birth_place: '', birth_date: '', img: '' });

  const openDetail = (athlete: Athlete) => {
    setSelectedAthlete(athlete);
    setModalOpen(true);
  };

  const openEdit = (e: React.MouseEvent, athlete: Athlete) => {
    e.stopPropagation();
    setEditAthlete(athlete);
    setEditForm({
      first_name: athlete.first_name,
      last_name: athlete.last_name,
      fiscal_code: athlete.fiscal_code,
      birth_place: athlete.birth_place || '',
      birth_date: athlete.birth_date || '',
      img: athlete.img || '',
    });
    setEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAthlete) return;
    updateAthlete.mutate({
      id: editAthlete.id,
      data: {
        ...editForm,
        img: editForm.img.trim() === '' ? null : editForm.img,
        birth_place: editForm.birth_place.trim() === '' ? null : editForm.birth_place,
        birth_date: editForm.birth_date === '' ? null : editForm.birth_date,
      },
    }, {
      onSuccess: () => setEditOpen(false),
      onError: () => alert("Errore durante la modifica"),
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const filteredAthletes = athletes?.filter(athlete =>
    `${athlete.first_name} ${athlete.last_name} ${athlete.fiscal_code}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  ).sort((a, b) => (b.tournaments_won ?? 0) - (a.tournaments_won ?? 0) || b.id - a.id) || [];

  const handleDelete = async (e: React.MouseEvent, id: number, name: string) => {
    e.stopPropagation();
    if (window.confirm(`Sei sicuro di voler eliminare ${name}?`)) {
      try {
        await deleteAthlete.mutateAsync(id);
      } catch {
        alert('Errore durante l\'eliminazione');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full px-4 py-8 bg-transparent flex items-center justify-center">
        <div className="text-white text-xl">Caricamento...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full px-4 py-8 bg-transparent flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-500 rounded-xl p-6">
          <div className="text-red-500 text-xl mb-2">Errore nel caricamento</div>
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

        {/* HERO */}
        <div className="bg-[#002F6C] rounded-2xl p-6 md:p-8 mb-8 border-2 border-[#FFD700]/30 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
            <div className="flex-1">
              <AnimatedTitle parts={[
                { text: "ATH", className: "text-white" },
                { text: "LETES", className: "text-yellow-300" },
              ]} />
              <p className="text-gray-300 text-sm sm:text-base">
                Gestisci tutti i giocatori registrati
              </p>
            </div>
            <div className="flex-shrink-0">
              <CreateAthleteButton />
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-[#001a3d] rounded-xl p-4 mb-6 border border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca atleti per nome, cognome o codice fiscale..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#002F6C] text-white pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:border-[#FFD700] focus:outline-none transition"
            />
          </div>
        </div>

        {/* INFO */}
        <div className="bg-[#001a3d] rounded-xl p-4 mb-6 border border-gray-700 text-gray-400 text-sm flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
          <span>Totale atleti: <span className="text-white font-bold">{athletes?.length || 0}</span></span>
          {searchTerm && (
            <span>Filtrati: <span className="text-[#FFD700] font-bold">{filteredAthletes.length}</span></span>
          )}
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAthletes.map((athlete) => (
            <div
              key={athlete.id}
              onClick={() => openDetail(athlete)}
              className="bg-[#001a3d] p-6 rounded-xl border border-gray-700 hover:border-[#FFD700] transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-[#0055A4] flex items-center justify-center flex-shrink-0">
                    {athlete.img ? (
                      <img
                        src={athlete.img}
                        alt={`${athlete.first_name} ${athlete.last_name}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                          e.currentTarget.parentElement!.classList.add('fallback-icon');
                        }}
                      />
                    ) : (
                      <Users className="w-6 h-6 text-[#FFD700]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-medium text-lg truncate">
                      {athlete.first_name} {athlete.last_name}
                    </div>
                    <div className="text-gray-400 text-xs truncate">{athlete.fiscal_code}</div>
                  </div>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button variant="destructive" size="icon" onClick={(e) => openEdit(e, athlete)} className="p-2 bg-[#0055A4]/50 rounded-lg hover:bg-[#0055A4] transition-colors">
                    <Pencil className="w-4 h-4 text-black" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={(e) => handleDelete(e, athlete.id, `${athlete.first_name} ${athlete.last_name}`)} disabled={deleteAthlete.isPending} className="p-2 bg-red-900/50 rounded-lg hover:bg-red-900 transition-colors">
                    <Trash2 className="w-4 h-4 text-black" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                {athlete.birth_date && (
                  <div className="text-gray-500">
                    Nato il: <span className="text-gray-400">
                      {new Date(athlete.birth_date).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                )}
                {athlete.birth_place && (
                  <div className="text-gray-500">
                    Luogo: <span className="text-gray-400">{athlete.birth_place}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-[#FFD700] pt-2 border-t border-gray-700">
                  <Trophy className="w-4 h-4" />
                  <span className="font-medium">
                    {athlete.tournaments_won}{' '}
                    {athlete.tournaments_won === 1 ? 'torneo vinto' : 'tornei vinti'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-600 group-hover:text-gray-400 transition-colors mt-3 text-right">
                Clicca per gestire squadre →
              </p>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredAthletes.length === 0 && (
          <div className="bg-[#001a3d] rounded-xl p-12 border border-gray-700 text-center mt-4">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              {searchTerm ? 'Nessun atleta trovato con questi criteri' : 'Nessun atleta registrato'}
            </p>
          </div>
        )}
      </div>

      <AthleteDetailModal athlete={selectedAthlete} open={modalOpen} onOpenChange={setModalOpen} />

      {/* EDIT DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto [&>button]:text-black [&>button:hover]:text-red-700">
          <DialogHeader className="text-gray-700 mb-2">
            <DialogTitle>Modifica Atleta</DialogTitle>
            <DialogDescription>Modifica i dati dell'atleta</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                <InputGroup>
                  <InputGroupInput type="text" name="first_name" value={editForm.first_name} onChange={handleEditChange} required />
                  <InputGroupAddon><Users className="h-4 w-4" /></InputGroupAddon>
                </InputGroup>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cognome *</label>
                <InputGroup>
                  <InputGroupInput type="text" name="last_name" value={editForm.last_name} onChange={handleEditChange} required />
                  <InputGroupAddon><Users className="h-4 w-4" /></InputGroupAddon>
                </InputGroup>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Codice Fiscale *</label>
              <InputGroup>
                <InputGroupInput type="text" name="fiscal_code" value={editForm.fiscal_code} onChange={handleEditChange} required maxLength={16} style={{ textTransform: 'uppercase' }} />
                <InputGroupAddon><Search className="h-4 w-4" /></InputGroupAddon>
              </InputGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Luogo di Nascita</label>
                <InputGroup>
                  <InputGroupInput type="text" name="birth_place" value={editForm.birth_place} onChange={handleEditChange} />
                  <InputGroupAddon><MapPin className="h-4 w-4" /></InputGroupAddon>
                </InputGroup>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data di Nascita</label>
                <InputGroup>
                  <InputGroupInput type="date" name="birth_date" value={editForm.birth_date} onChange={handleEditChange} />
                  <InputGroupAddon><Calendar className="h-4 w-4" /></InputGroupAddon>
                </InputGroup>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Immagine</label>
              <InputGroup>
                <InputGroupInput type="text" name="img" value={editForm.img} onChange={handleEditChange} placeholder="Link dell'immagine" />
                <InputGroupAddon><ImageIcon className="h-4 w-4" /></InputGroupAddon>
              </InputGroup>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button type="button" onClick={() => setEditOpen(false)} className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300">
                Annulla
              </Button>
              <Button type="submit" disabled={updateAthlete.isPending} className="flex-1 flex items-center justify-center gap-2 text-gray-700">
                {updateAthlete.isPending ? (
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

export default AthletesPage;