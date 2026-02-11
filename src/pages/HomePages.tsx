import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Handshake, Trophy, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAthletes } from "@/features/athlete/athlete.hook";
import { useTeams } from "@/features/team/team.hooks";
import { useTournaments } from "@/features/tournament/tournament.hooks";
import { useHallOfFame } from "@/features/hall_of_fame/hall_of_fame.hook";
import StatCard from "@/components/ui/statCard";
import AnimatedTitle from "@/components/ui/title";
import audio from "@/audio/globalAudio";

const HomePage = () => {
  const { data: athletes } = useAthletes();
  const { data: teams } = useTeams();
  const { data: tournaments } = useTournaments();
  const { data: halls } = useHallOfFame();

  const lastChampion = halls?.at(-1);
  const [isPlaying, setIsPlaying] = useState(!audio.paused);

  // Sincronizza stato se audio viene controllato altrove
  useEffect(() => {
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  const togglePlay = async () => {
    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (e) {
      console.error("Errore audio:", e);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">

        {/* HERO */}
        <section className="bg-[#002F6C] rounded-2xl p-6 sm:p-8 lg:p-12 mb-8 border-2 border-[#FFD700]/30 shadow-2xl">
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1">
              <AnimatedTitle
                parts={[
                  { text: "BLITZ", className: "text-white" },
                  { text: "BALL", className: "text-yellow-300" }
                ]}
              />
              <p className="text-gray-300 mb-8 max-w-2xl text-sm sm:text-base">
                Manage tournaments, teams and athletes in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/tournaments">
                  <button className="bg-[#0055A4] hover:bg-[#0066CC] text-black flex items-center gap-2 px-4 py-2 rounded">
                    <Calendar className="w-5 h-5" /> New Tournament
                  </button>
                </Link>
                <Link to="/halls_of_fame">
                  <button className="border border-black flex items-center gap-2 px-4 py-2 rounded text-black">
                    <Trophy className="w-5 h-5 text-black" /> Hall of Fame
                  </button>
                </Link>
              </div>
            </div>

            {/* ICONA DELLA PALLA SOLO QUI */}
            <motion.div
              onClick={togglePlay}
              className="hidden sm:flex cursor-pointer"
              animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={isPlaying ? { repeat: Infinity, duration: 2, ease: "linear" } : { duration: 0.3 }}
              style={{ originX: 0.5, originY: 0.5 }}
            >
              <img
                src="/Palla.png"
                alt="Play music"
                className="w-32 h-32 sm:w-40 sm:h-40 lg:w-52 lg:h-52 object-contain rounded-full drop-shadow-2xl"
              />
            </motion.div>
          </div>
        </section>

        {/* STAT CARDS */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard to="/tournaments" icon={<Calendar />} label="Tournaments" value={tournaments?.length} />
          <StatCard to="/teams" icon={<Handshake />} label="Teams" value={teams?.length} />
          <StatCard to="/athletes" icon={<Users />} label="Athletes" value={athletes?.length} />
          <StatCard to="/halls_of_fame" icon={<Trophy />} label="Champions" value={halls?.length} />
        </section>

        {/* LAST CHAMPION */}
        <section className="bg-[#001a3d] rounded-xl p-4 sm:p-6 border border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFD700]" /> Last Champion
          </h2>

          {lastChampion ? (
            <Link to={`/tournaments/${lastChampion.tournament_fk}/bracket`}>
              <div className="bg-[#002F6C] rounded-lg p-4 flex items-center gap-4 hover:bg-[#003580] transition">
                <div className="bg-[#FFD700] w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5 text-[#001F4D]" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold truncate">{lastChampion.winning_team_name}</p>
                  <p className="text-gray-400 text-sm truncate">{lastChampion.tournament_name}</p>
                </div>
              </div>
            </Link>
          ) : (
            <p className="text-gray-400 text-sm">Nessun vincitore registrato.</p>
          )}
        </section>

      </div>
    </div>
  );
};

export default HomePage;