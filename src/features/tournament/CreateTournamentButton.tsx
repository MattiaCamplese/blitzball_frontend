import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog';
import { InputGroup, InputGroupAddon, InputGroupInput,} from '@/components/ui/input-group';
import { Button } from '@base-ui/react/button';
import { Loader2, PlusIcon, Trophy, Calendar, MapPin, Users } from 'lucide-react';
import { useState } from 'react';
import { useCreateTournament, useGenerateBracket } from './tournament.hooks';
import { useTeams } from '../team/team.hooks';
import type { BracketGenerate } from './tournament.type';

const CreateTournamentButton = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'info' | 'teams'>('info');
  const { mutate: createTournament, isPending: isCreating } = useCreateTournament();
  const { mutate: generateBracket, isPending: isGenerating } = useGenerateBracket();
  const { data: teams } = useTeams();

  const [formData, setFormData] = useState({
    name: '',
    start_date: new Date().toISOString().split('T')[0],
    location: '',
    number_of_teams: 4,
  });

  const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const toggleTeamSelection = (teamId: number) => {
    setSelectedTeamIds((prev) => {
      if (prev.includes(teamId)) {
        return prev.filter((id) => id !== teamId);
      } else {
        if (prev.length < formData.number_of_teams) {
          return [...prev, teamId];
        }
        return prev;
      }
    });
  };

  const handleNext = () => {
    if (step === 'info') {
      setStep('teams');
    }
  };

  const handleBack = () => {
    if (step === 'teams') {
      setStep('info');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedTeamIds.length !== formData.number_of_teams) {
      alert(`Seleziona esattamente ${formData.number_of_teams} team`);
      return;
    }

    // Validazione numero team ammessi dal backend
    const validTeamNumbers = [4, 8, 16, 32];
    if (!validTeamNumbers.includes(formData.number_of_teams)) {
      alert(`Il numero di team deve essere 4, 8, 16 o 32.`);
      return;
    }
    // Prepara il payload rimuovendo campi vuoti
    const payload: BracketGenerate = {
      name: formData.name,
      start_date: formData.start_date,
      is_active: true,
      number_of_teams: formData.number_of_teams, // ← USA IL VALORE DA formData
      team_ids: selectedTeamIds,
    };
    // Aggiungi location solo se non è vuota
    if (formData.location && formData.location.trim() !== '') {
      payload.location = formData.location;
    }

    console.log('Payload inviato al backend:', payload);
    console.log('Numero di team richiesti:', formData.number_of_teams);
    console.log('Numero di team selezionati:', selectedTeamIds.length);

    // Genera il bracket direttamente con i dati del torneo
    generateBracket(payload, {
      onSuccess: () => {
        setOpen(false);
        setStep('info');
        setFormData({
          name: '',
          start_date: new Date().toISOString().split('T')[0],
          location: '',
          number_of_teams: 4,
        });
        setSelectedTeamIds([]);
      },
      onError: (error: any) => {
        console.error('Errore completo:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Errore sconosciuto';
        const errorDetails = error?.response?.data?.errors
          ? JSON.stringify(error.response.data.errors, null, 2)
          : '';

        alert(`Errore durante la creazione del torneo:\n${errorMessage}\n${errorDetails}`);
      },
    });
  };

  const availableTeams = teams?.filter((team) => !selectedTeamIds.includes(team.id)) || [];
  const selectedTeams = teams?.filter((team) => selectedTeamIds.includes(team.id)) || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="flex items-center gap-2 text-black-700">
          <PlusIcon className="h-4 w-4" />
          <span>Nuovo Torneo</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto text-gray-700">
        <DialogHeader className="text-gray-700 mb-2">
          <DialogTitle>
            {step === 'info' ? 'Nuovo Torneo' : 'Seleziona Team'}
          </DialogTitle>
          <DialogDescription>
            {step === 'info'
              ? 'Compila i campi per creare un nuovo torneo'
              : `Seleziona ${formData.number_of_teams} team per il torneo`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {step === 'info' && (
            <>
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Torneo *
                </label>
                <InputGroup>
                  <InputGroupInput type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Coppa Italia 2024" required />
                  <InputGroupAddon>
                    <Trophy className="h-4 w-4" />
                  </InputGroupAddon>
                </InputGroup>
              </div>

              {/* Data Inizio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Inizio *
                </label>
                <InputGroup>
                  <InputGroupInput
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                  <InputGroupAddon>
                    <Calendar className="h-4 w-4" />
                  </InputGroupAddon>
                </InputGroup>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Località
                </label>
                <InputGroup>
                  <InputGroupInput
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Roma, Italia"
                  />
                  <InputGroupAddon>
                    <MapPin className="h-4 w-4" />
                  </InputGroupAddon>
                </InputGroup>
              </div>

              {/* Numero Team */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numero di Team *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[4, 8, 16, 32].map((num) => (
                    <label
                      key={num}
                      className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-colors ${formData.number_of_teams === num
                        ? 'bg-[#0055A4] text-white border-2 border-[#0055A4]'
                        : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-[#0055A4] hover:bg-gray-50'
                        }`}
                    >
                      <input type="radio" name="number_of_teams" value={num} checked={formData.number_of_teams === num} onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          number_of_teams: num,
                        }));
                        // Reset team selection when changing number
                        setSelectedTeamIds([]);
                      }}
                        className="sr-only"
                      />
                      <span className="font-medium">{num} Team</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 'teams' && (
            <div className="space-y-4">
              {/* Selected Teams */}
              {selectedTeams.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Team Selezionati ({selectedTeams.length}/{formData.number_of_teams})
                  </h3>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {selectedTeams.map((team) => (
                      <div key={team.id} onClick={() => toggleTeamSelection(team.id)} className="flex items-center gap-2 p-3 bg-[#0055A4] text-white rounded-lg cursor-pointer hover:bg-[#003d7a]" >
                        {team.logo ? (<img src={team.logo} alt={team.name} className="w-8 h-8 rounded-full object-cover" />) : (<Users className="w-8 h-8" />)}
                        <span className="font-medium text-sm truncate">
                          {team.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Teams */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Team Disponibili
                </h3>
                <div className="max-h-[300px] overflow-y-auto space-y-2">
                  {availableTeams.map((team) => (
                    <div key={team.id} onClick={() => toggleTeamSelection(team.id)} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${selectedTeamIds.length >= formData.number_of_teams
                      ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}>
                      {team.logo ? (<img src={team.logo} alt={team.name} className="w-8 h-8 rounded-full object-cover" />) : (<Users className="w-8 h-8" />)}
                      <span className="font-medium text-sm truncate">
                        {team.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex gap-2 mt-6">
            {step === 'teams' && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Indietro
              </button>
            )}

            {step === 'info' ? (
              <>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annulla
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!formData.name || !formData.start_date}
                  className="flex-1 px-4 py-2 bg-[#0055A4] text-gray-700 rounded-lg hover:bg-[#003d7a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Avanti
                </button>
              </>
            ) : (
              <button
                type="submit"
                disabled={
                  isCreating ||
                  isGenerating ||
                  selectedTeamIds.length !== formData.number_of_teams
                }
                className="flex-1 px-4 py-2 bg-[#0055A4] text-gray-700 rounded-lg hover:bg-[#003d7a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isCreating || isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creazione...
                  </>
                ) : (
                  <>
                    <Trophy className="h-4 w-4" />
                    Crea Torneo
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTournamentButton;


























































