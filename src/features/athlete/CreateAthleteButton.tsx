import { useState } from "react";
import { Button } from "@base-ui/react/button";
import { useCreateAthlete } from "./athlete.hook";
import { Loader2, PlusIcon, User, Hash, MapPin, Calendar, Trophy } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const CreateAthleteButton = () => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateAthlete();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    fiscal_code: "",
    birth_place: "",
    birth_date: "",
    tournaments_won: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData, {
      onSuccess: () => {
        setOpen(false);
        setFormData({
          first_name: "",
          last_name: "",
          fiscal_code: "",
          birth_place: "",
          birth_date: "",
          tournaments_won: 0,
        });
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="flex items-center gap-2 text-grey-700">
          <PlusIcon className="h-4 w-4" />
          <span>Nuovo Atleta</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto [&>button]:text-black [&>button:hover]:text-red-700">
        <DialogHeader className=" text-gray-700 mb-2">
          <DialogTitle>Nuovo Atleta</DialogTitle>
          <DialogDescription>
            Compila i campi per creare un nuovo atleta
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome *
              </label>
              <InputGroup>
                <InputGroupInput type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Mario" required />
                <InputGroupAddon>
                  <User className="h-4 w-4" />
                </InputGroupAddon>
              </InputGroup>
            </div>

            {/* Cognome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cognome *
              </label>
              <InputGroup>
                <InputGroupInput type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Rossi" required />
                <InputGroupAddon>
                  <User className="h-4 w-4" />
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>

          {/* Codice Fiscale */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Codice Fiscale *
            </label>
            <InputGroup>
              <InputGroupInput type="text" name="fiscal_code" value={formData.fiscal_code} onChange={handleChange} placeholder="MRARSS80A01H501U" required maxLength={16} style={{ textTransform: 'uppercase' }} />
              <InputGroupAddon>
                <Hash className="h-4 w-4" />
              </InputGroupAddon>
            </InputGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Luogo di Nascita */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Luogo di Nascita
              </label>
              <InputGroup>
                <InputGroupInput type="text" name="birth_place" value={formData.birth_place} onChange={handleChange} placeholder="Roma" />
                <InputGroupAddon>
                  <MapPin className="h-4 w-4" />
                </InputGroupAddon>
              </InputGroup>
            </div>

            {/* Data di Nascita */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data di Nascita
              </label>
              <InputGroup>
                <InputGroupInput type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} />
                <InputGroupAddon>
                  <Calendar className="h-4 w-4" />
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>

          {/* Tornei Vinti */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tornei Vinti
            </label>
            <InputGroup>
              <InputGroupInput type="number" name="tournaments_won" value={formData.tournaments_won} onChange={handleChange} placeholder="0" min="0" />
              <InputGroupAddon>
                <Trophy className="h-4 w-4" />
              </InputGroupAddon>
            </InputGroup>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" onClick={() => setOpen(false)} className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300" >
              Annulla
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1 flex items-center justify-center gap-2 text-gray-700" >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creazione...</span>
                </>
              ) : (
                <>
                  <PlusIcon className="h-4 w-4" />
                  <span>Crea Atleta</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAthleteButton;



