import { useMemo } from 'react';
import { Users, User, Shield, Hash, Trophy, Loader2 } from 'lucide-react';
import { useCompositionsByTeam } from '../composition/composition.hook';
import type { Team } from './team.type';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface TeamRosterProps {
  team: Team | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TeamRoster = ({ team, open, onOpenChange }: TeamRosterProps) => {
  // Lazy loading: query eseguita solo se modal aperto
  const { data: compositions, isLoading } = useCompositionsByTeam(team?.id ?? 0, { enabled: open });

  // Filtra solo giocatori attivi
  const activeComps = useMemo(() => {
    if (!compositions) return [];
    return compositions.filter((c) => !c.end_date);
  }, [compositions]);

  if (!team) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto [&>button]:text-gray-700">
        <DialogHeader className="text-gray-700 mb-2">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="truncate">{team.name} - Rosa</span>
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Lista giocatori della squadra
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              <span className="ml-2 text-sm text-gray-500">Caricamento...</span>
            </div>
          )}

          {/* Rosa */}
          {!isLoading && activeComps.length > 0 && (
            <div className="space-y-2">
              {activeComps.map((c) => (
                <div
                  key={c.id}
                  className="bg-green-50 border border-green-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                        {c.athlete_first_name} {c.athlete_last_name}
                      </div>
                      <div className="text-xs text-gray-600 flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
                        {c.role && (
                          <span className="flex items-center gap-1 whitespace-nowrap">
                            <Shield className="h-3 w-3 shrink-0" />
                            {c.role}
                          </span>
                        )}
                        {c.jersey_number && (
                          <span className="flex items-center gap-1 whitespace-nowrap">
                            <Hash className="h-3 w-3 shrink-0" />
                            {c.jersey_number}
                          </span>
                        )}
                        <span className="flex items-center gap-1 whitespace-nowrap text-amber-600 font-medium">
                          <Trophy className="h-3 w-3 shrink-0" />
                          {c.athlete_tournaments_won ?? 0} {(c.athlete_tournaments_won ?? 0) === 1 ? 'trofeo' : 'trofei'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && activeComps.length === 0 && (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                Nessun giocatore attivo in questa squadra
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamRoster;
