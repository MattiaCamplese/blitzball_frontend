import { Trophy, Calendar, Star, Medal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useHallOfFame } from "./hall_of_fame.hook";
import AnimatedTitle from "@/components/ui/title";

export default function AlboOro() {
  const { data: halls, isLoading } = useHallOfFame();
  const navigate = useNavigate();

  const hallsOrdinati = halls
    ? [...halls].sort(
      (a, b) => new Date(b.victory_date).getTime() - new Date(a.victory_date).getTime()
    )
    : [];

  const handleClickVincitore = (tournamentId: number) => {
    navigate(`/tournaments/${tournamentId}/bracket`);
  };

  // Conta vittorie per squadra
  const vittoriePerSquadra = halls?.reduce((acc, v) => {
    const nome = v.winning_team_name || "Sconosciuto";
    acc[nome] = (acc[nome] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const topSquadre = Object.entries(vittoriePerSquadra)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center mb-6 relative">
          <Trophy className="h-20 w-20  text-[#FFD700]" />
          <Star className="absolute -top-2 -right-2 h-6 w-6 animate-pulse text-[#FFD700]" />
        </div>
        <AnimatedTitle parts={[{ text: "HALL", className: "text-white" }, { text: " of ", className: "text-white text-5xl" }, { text: "FAME", className: "text-yellow-300" },]} />
        <p className="text-lg text-gray-400 max-w-xl mx-auto">
          I campioni di tutti i tornei di calcetto
        </p>
      </div>

      {/* TOP SQUADRE */}
      {topSquadre.length > 0 && (
        <div className="mb-12">
          <h2 className="font-display text-2xl tracking-wide mb-6 text-center flex items-center justify-center gap-2 text-primary-foreground">
            <Star className="h-5 w-5 text-[#FFD700]" />
            TOP SQUADRE
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {topSquadre.map(([nome, vittorie], index) => (
              <div key={nome} className={`relative px-6 py-4 rounded-xl border ${index === 0 ? "bg-[#001a3d] border-[#FFD700]" : index === 1 ? "bg-[#001a3d] border-[#999B9B]" : index === 2 ? "bg-[#001a3d] border-[#CD7F32]" : "bg-[#001a3d] border-[#001a3d]"}`}>
                <div className="flex items-center gap-3">
                  <div className={`text-2xl font-display ${index === 0 ? "text-[#FFD700]" : index === 1 ? "text-[#999B9B]" : index === 2 ? "text-[#CD7F32]" : "text-white"}`} >
                    {index + 1}°
                  </div>
                  <div>
                    <p className="font-semibold text-white">{nome}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Trophy className="h-3 w-3 text-[#FFD700]" />
                      {vittorie} {vittorie === 1 ? "titolo" : "titoli"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LISTA COMPLETA VITTORIE */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse bg-card border-border">
              <CardContent className="p-6">
                <div className="h-16 bg-secondary rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : halls && halls.length > 0 ? (
        <div className="space-y-4">
          <h2 className="font-display text-2xl tracking-wide mb-6 flex items-center gap-2 text-primary-foreground">
            <Medal className="h-5 w-5 text-[#FFD700]" />
            TUTTI I CAMPIONI
          </h2>

          {hallsOrdinati.map((vincitore) => (
            <Card
              key={vincitore.id}
              className="border-border bg-[#001a3d] backdrop-blur-sm overflow-hidden cursor-pointer hover:shadow-lg transition"
              onClick={() => handleClickVincitore(vincitore.tournament_fk)}
            >
              <CardContent className="p-6 flex justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20">
                    <Trophy className="h-6 w-6 text-[#FFD700]" />
                  </div>
                  <div>
                    <h3 className="font-display text-white text-xl tracking-wide">
                      {vincitore.winning_team_name || "Squadra"}
                    </h3>
                    <p className="text-gray-400">
                      {vincitore.tournament_name || "Torneo"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 text-sm text-gray-400">
                  {vincitore.tournament_location && (
                    <span className="flex items-center gap-1">
                      📍 {vincitore.tournament_location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(vincitore.victory_date).toLocaleDateString("it-IT", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border bg-card">
          <CardContent className="py-16 text-center">
            <Trophy className="h-16 w-16 text-muted-foreground opacity-30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-card-foreground">
              L'Albo d'Oro è vuoto
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Completa un torneo per vedere apparire qui il primo campione! Il vincitore verrà automaticamente registrato quando la finale viene decisa.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
