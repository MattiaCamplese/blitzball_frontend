import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { House, SearchX } from "lucide-react";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-[#002F6C] rounded-full p-6 border-2 border-[#FFD700]/30">
            <SearchX className="w-16 h-16 text-[#FFD700]" />
          </div>
        </div>

        <h1 className="text-7xl font-black text-[#FFD700] mb-2">404</h1>
        <h2 className="text-xl font-bold text-white mb-3">Pagina non trovata</h2>
        <p className="text-gray-400 text-sm mb-8">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>

        <Button
          variant="primary"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mx-auto px-6 py-2"
        >
          <House className="w-4 h-4" />
          Torna alla Home
        </Button>
      </div>
    </div>
  );
}
