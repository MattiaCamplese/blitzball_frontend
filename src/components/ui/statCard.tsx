import { Link } from "react-router";

type StatCardProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  value?: number;
};

const StatCard = ({ to, icon, label, value }: StatCardProps) => (
  <Link to={to}>
    <div className="bg-[#001a3d] p-6 rounded-xl border border-gray-700 hover:border-[#FFD700] transition-all">
      <div className="bg-[#0055A4] w-12 h-12 rounded-lg flex items-center justify-center mb-3 text-[#FFD700]">
        {icon}
      </div>
      <div className="text-5xl font-bold text-white mb-2">
        {value ?? "—"}
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  </Link>
);

export default StatCard;