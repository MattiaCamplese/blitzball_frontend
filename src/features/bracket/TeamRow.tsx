import { Crown, Users } from 'lucide-react';

export interface TeamRowProps {
  teamId?: number;
  teamName: string;
  teamLogo?: string;
  score?: number;
  isWinner: boolean;
  isChampion: boolean;
  canEdit: boolean;
  onScoreChange: (value: string) => void;
  isFinal?: boolean;
}

const TeamRow = ({
  teamId,
  teamName,
  teamLogo,
  score,
  isWinner,
  isChampion,
  canEdit,
  onScoreChange,
  isFinal = false,
}: TeamRowProps) => {
  return (
    <div
      className={`flex items-center rounded-lg transition-all relative ${
        isFinal ? 'gap-3 p-3' : 'gap-2 p-2'
      } ${
        isWinner
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg ring-2 ring-amber-400/50'
          : 'bg-slate-700/60 hover:bg-slate-700/80'
      }`}
    >
      {isChampion && (
        <div
          className={`absolute bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-xl z-10 animate-bounce ${
            isFinal ? '-top-3 -right-3 p-2' : '-top-2 -right-2 p-1'
          }`}
        >
          <Crown className={isFinal ? 'w-5 h-5 text-slate-900' : 'w-3 h-3 text-slate-900'} />
        </div>
      )}

      <div className="flex-shrink-0">
        {teamId && teamLogo ? (
          <img
            src={teamLogo}
            alt={teamName}
            className={`rounded-full object-cover border-2 border-white/50 shadow-md ${
              isFinal ? 'w-10 h-10' : 'w-6 h-6'
            }`}
          />
        ) : (
          <div
            className={`rounded-full flex items-center justify-center bg-gray-700/70 border-2 border-white/30 ${
              isFinal ? 'w-10 h-10' : 'w-6 h-6'
            }`}
          >
            <Users className={isFinal ? 'w-5 h-5 text-gray-300' : 'w-3 h-3 text-gray-300'} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div
          className={`font-bold truncate ${
            teamId ? 'text-white' : 'text-gray-500 italic'
          } ${isFinal ? 'text-base' : 'text-xs'}`}
        >
          {teamName}
        </div>
      </div>

      <div className="flex-shrink-0">
        {canEdit ? (
          <input
            type="number"
            value={score ?? 0}
            onChange={(e) => onScoreChange(e.target.value)}
            className={`bg-slate-900/80 text-white rounded-md text-center font-bold border-2 border-amber-400/50 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
              isFinal ? 'w-16 px-2 py-2 text-sm' : 'w-12 px-1.5 py-1 text-xs'
            }`}
            min="0"
          />
        ) : (
          <span
            className={`font-black inline-block text-center ${
              isWinner ? 'text-amber-400' : 'text-gray-400'
            } ${isFinal ? 'text-xl min-w-[2.5rem]' : 'text-base min-w-[1.5rem]'}`}
          >
            {score ?? '-'}
          </span>
        )}
      </div>
    </div>
  );
};

export default TeamRow;