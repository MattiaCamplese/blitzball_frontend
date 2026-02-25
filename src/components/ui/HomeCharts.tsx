import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Goal, Trophy } from 'lucide-react';
import type { Athlete } from '@/features/athlete/athlete.services';
import type { Team } from '@/features/team/team.type';

interface HomeChartsProps {
  athletes?: Athlete[];
  teams?: Team[];
}

const CustomTooltipGoals = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#001a3d] border border-[#FFD700]/40 rounded-lg px-3 py-2 text-xs text-white shadow-lg">
        <span className="font-bold">{payload[0].payload.name}</span>
        <br />
        <span className="text-[#FFD700]">{payload[0].value} gol</span>
      </div>
    );
  }
  return null;
};

const CustomTooltipTrophies = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#001a3d] border border-[#0055A4]/60 rounded-lg px-3 py-2 text-xs text-white shadow-lg">
        <span className="font-bold">{payload[0].payload.name}</span>
        <br />
        <span className="text-blue-300">{payload[0].value} {payload[0].value === 1 ? 'trofeo' : 'trofei'}</span>
      </div>
    );
  }
  return null;
};

const HomeCharts = ({ athletes, teams }: HomeChartsProps) => {
  const topScorers = [...(athletes ?? [])]
    .filter(a => (a.goals ?? 0) > 0)
    .sort((a, b) => (b.goals ?? 0) - (a.goals ?? 0))
    .slice(0, 5)
    .map(a => ({
      name: `${a.first_name} ${a.last_name}`,
      goals: a.goals ?? 0,
    }));

  const topTeams = [...(teams ?? [])]
    .filter(t => (t.tournaments_won ?? 0) > 0)
    .sort((a, b) => (b.tournaments_won ?? 0) - (a.tournaments_won ?? 0))
    .slice(0, 5)
    .map(t => ({
      name: t.name,
      trophies: t.tournaments_won ?? 0,
    }));

  const hasScorers = topScorers.length > 0;
  const hasTeams = topTeams.length > 0;

  if (!hasScorers && !hasTeams) return null;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {/* Top scorers */}
      {hasScorers && (
        <div className="bg-[#001a3d] rounded-xl p-4 sm:p-6 border border-gray-700">
          <h2 className="text-sm sm:text-base font-bold text-white mb-4 flex items-center gap-2">
            <Goal className="w-4 h-4 text-[#FFD700]" /> <span>Top Marcatori</span>
          </h2>
          <ResponsiveContainer width="100%" height={topScorers.length * 44 + 8}>
            <BarChart
              data={topScorers}
              layout="vertical"
              margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={110}
                tick={{ fill: '#e5e7eb', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltipGoals />} cursor={{ fill: '#ffffff0d' }} />
              <Bar dataKey="goals" radius={[0, 4, 4, 0]} maxBarSize={22}>
                {topScorers.map((_, i) => (
                  <Cell
                    key={i}
                    fill={i === 0 ? '#FFD700' : i === 1 ? '#e6c000' : '#b38f00'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top teams by trophies */}
      {hasTeams && (
        <div className="bg-[#001a3d] rounded-xl p-4 sm:p-6 border border-gray-700">
          <h2 className="text-sm sm:text-base font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#FFD700]" /> <span>Top Squadre</span>
          </h2>
          <ResponsiveContainer width="100%" height={topTeams.length * 44 + 8}>
            <BarChart
              data={topTeams}
              layout="vertical"
              margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={110}
                tick={{ fill: '#e5e7eb', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltipTrophies />} cursor={{ fill: '#ffffff0d' }} />
              <Bar dataKey="trophies" radius={[0, 4, 4, 0]} maxBarSize={22}>
                {topTeams.map((_, i) => (
                  <Cell
                    key={i}
                    fill={i === 0 ? '#0055A4' : i === 1 ? '#003d7a' : '#002f6c'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};

export default HomeCharts;
