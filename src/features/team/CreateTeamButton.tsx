import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InputGroup, InputGroupAddon, InputGroupInput, } from "@/components/ui/input-group";
import { Button } from "@base-ui/react/button";
import { Loader2, PlusIcon, Trophy, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useCreateTeam } from "./team.hooks";

const CreateTeamButton = () => {
    const [open, setOpen] = useState(false);
    const { mutate, isPending } = useCreateTeam();

    const [formData, setFormData] = useState({
        name: "",
        logo: "",
        tournaments_won: 0,
    });

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        mutate(
            {
                ...formData,
                logo: formData.logo.trim() === "" ? null : formData.logo,
            },
            {
                onSuccess: () => {
                    setOpen(false);
                    setFormData({
                        name: "",
                        logo: "",
                        tournaments_won: 0,
                    });
                    setError(null);
                },
                onError: (err: any) => {
                    const message =
                        err?.response?.data?.message ||
                        "Esiste già una squadra con questo nome";
                    setError(message);
                },
            }
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        if (name === "name") {
            setError(null);
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === "number" ? parseInt(value) || 0 : value,
        }));
    };

    // Auto-hide errore dopo 3s
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button className="flex items-center gap-2 text-black-700">
                    <PlusIcon className="h-4 w-4" />
                    <span>Nuovo Team</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto [&>button]:text-gray-700">
                <DialogHeader className="text-gray-700 mb-2">
                    <DialogTitle>Nuovo Team</DialogTitle>
                    <DialogDescription>
                        Compila i campi per creare un nuovo team
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 mt-4 relative"
                >
                    {/* ERRORE POP-UP */}
                    {error && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded-lg shadow-md text-sm
                               animate-in fade-in slide-in-from-top-2" >
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nome */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nome *
                            </label>
                            <InputGroup>
                                <InputGroupInput
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Juve"
                                    required
                                />
                                <InputGroupAddon>
                                    <User className="h-4 w-4" />
                                </InputGroupAddon>
                            </InputGroup>
                        </div>

                        {/* Tornei Vinti */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tornei Vinti
                            </label>
                            <InputGroup>
                                <InputGroupInput type="number" name="tournaments_won" value={formData.tournaments_won} onChange={handleChange} min="0" />
                                <InputGroupAddon>
                                    <Trophy className="h-4 w-4" />
                                </InputGroupAddon>
                            </InputGroup>
                        </div>

                        {/* Logo */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Logo
                            </label>
                            <InputGroup>
                                <InputGroupInput
                                    type="text"
                                    name="logo"
                                    value={formData.logo}
                                    onChange={handleChange}
                                    placeholder="Link del Logo"
                                />
                                <InputGroupAddon>
                                    <User className="h-4 w-4" />
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
                        >
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
                                    <span>Crea Team</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateTeamButton;




