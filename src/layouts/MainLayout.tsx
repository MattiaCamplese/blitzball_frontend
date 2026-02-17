import { Outlet, Link, useLocation } from "react-router-dom"
import { Trophy, Calendar, Users, Award, Handshake, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false)
    const location = useLocation()

    const navItems = [
        { to: "/", icon: Calendar, label: "Home" },
        { to: "/athletes", icon: Users, label: "Athletes" },
        { to: "/teams", icon: Handshake, label: "Teams" },
        { to: "/tournaments", icon: Trophy, label: "Tournaments" },
        { to: "/halls_of_fame", icon: Award, label: "Hall of Fame", highlight: true },
    ]

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <aside className={cn("fixed left-0 top-0 h-full bg-[#001F4D] border-r-2 border-[#FFD700] transition-all duration-300 z-50 flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]", collapsed ? "w-16" : "w-64")} >
                {/* Logo Header */}
                <div className="h-20 flex items-center justify-between px-4">
                    <Link to="/" className={cn("flex items-center gap-3 transition-all", collapsed && "justify-center w-full")} >
                        <div className="shrink-0">
                            <img src="/Palla.png" alt="Logo" className=" aspect-square object-contain rounded-full shrink-0 w-10 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 " />
                        </div>
                        {!collapsed && (
                            <div className="flex items-baseline gap-1">
                                <span className="font-bold text-2xl text-[#FFD700]">
                                    BLITZ
                                </span>
                                <span className="font-bold text-2xl text-white">
                                    BALL
                                </span>
                            </div>
                        )}
                    </Link>
                    {!collapsed && (
                        <Button variant="ghost" size="icon" onClick={() => setCollapsed(true)} className="text-white/70 hover:text-white transition-colors" >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.to
                        return (
                            <Link key={item.to} to={item.to} className={cn("flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative", isActive
                                ? item.highlight ? "bg-[#FFD700] text-[#001F4D]" : "bg-[#0055A4] text-white" : "text-white hover:bg-[#002F6C]", collapsed && "justify-center px-0")} >
                                <Icon className={cn("w-5 h-5 flex-shrink-0", item.highlight && isActive ? "text-[#001F4D]" : "text-white")} />
                                {!collapsed && (
                                    <span className="font-medium text-white">
                                        {item.label}
                                    </span>
                                )}

                                {/* Active indicator */}
                                {isActive && (<div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FFD700] rounded-r-full" />)}

                                {/* Tooltip on hover when collapsed */}
                                {collapsed && (
                                    <div className="absolute left-full ml-6 px-3 py-2 bg-[#001F4D] border border-[#FFD700] rounded-lg text-white text-sm font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Expand button at bottom when collapsed */}
                {collapsed && (
                    <div className="p-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCollapsed(false)}
                            className="mb-4 mx-auto p-3 text-white/70 hover:text-white hover:bg-[#002F6C] rounded-lg transition-all" >
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main className={cn("flex-1 overflow-auto transition-all duration-300", collapsed ? "ml-16" : "ml-64")} >
                <Outlet />
            </main>
        </div >
    )
}

export default MainLayout































































