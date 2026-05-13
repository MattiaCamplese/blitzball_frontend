import { Outlet, Link, useLocation } from "react-router-dom"
import { Trophy, Calendar, Users, Award, Handshake, ChevronLeft, ChevronRight, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        setMobileOpen(false)
    }, [location.pathname])

    const navItems = [
        { to: "/", icon: Calendar, label: "Home" },
        { to: "/athletes", icon: Users, label: "Athletes" },
        { to: "/teams", icon: Handshake, label: "Teams" },
        { to: "/tournaments", icon: Trophy, label: "Tournaments" },
        { to: "/halls_of_fame", icon: Award, label: "Hall of Fame" },
    ]

    const NavItems = ({ isCollapsed }: { isCollapsed: boolean }) => (
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.to
                return (
                    <Link
                        key={item.to}
                        to={item.to}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative",
                            isActive ? "bg-[#0055A4] text-white" : "text-white hover:bg-[#002F6C]",
                            isCollapsed && "justify-center px-0"
                        )}
                    >
                        <Icon className="w-5 h-5 shrink-0 text-white" />
                        {!isCollapsed && (
                            <span className="font-medium text-white">{item.label}</span>
                        )}
                        {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FFD700] rounded-r-full" />
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-6 px-3 py-2 bg-[#001F4D] border border-[#FFD700] rounded-lg text-white text-sm font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                                {item.label}
                            </div>
                        )}
                    </Link>
                )
            })}
        </nav>
    )

    return (
        <div className="flex h-dvh overflow-hidden">
            {/* Mobile backdrop — only rendered when sidebar is open */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile sidebar — conditionally rendered (no CSS transform tricks) */}
            {mobileOpen && (
                <aside className="fixed left-0 top-0 h-full w-64 bg-[#001F4D] border-r-2 border-[#FFD700] z-50 flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] md:hidden">
                    <div className="h-16 flex items-center justify-between px-4">
                        <Link to="/" className="flex items-center gap-3">
                            <img src="/Palla.png" alt="Logo" className="w-9 h-9 rounded-full object-contain shrink-0" />
                            <div className="flex items-baseline gap-1">
                                <span className="font-bold text-2xl text-[#FFD700]">BLITZ</span>
                                <span className="font-bold text-2xl text-white">BALL</span>
                            </div>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileOpen(false)}
                            className="text-white/70 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                    <NavItems isCollapsed={false} />
                </aside>
            )}

            {/* Desktop sidebar — always mounted, hidden on mobile via CSS */}
            <aside className={cn(
                "hidden md:flex fixed left-0 top-0 h-full bg-[#001F4D] border-r-2 border-[#FFD700] transition-all duration-300 z-50 flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
                collapsed ? "w-16" : "w-64"
            )}>
                <div className="h-20 flex items-center justify-between px-4">
                    <Link
                        to="/"
                        className={cn("flex items-center gap-3 transition-all", collapsed && "justify-center w-full")}
                    >
                        <img src="/Palla.png" alt="Logo" className="w-10 h-10 lg:w-11 lg:h-11 rounded-full object-contain shrink-0" />
                        {!collapsed && (
                            <div className="flex items-baseline gap-1">
                                <span className="font-bold text-2xl text-[#FFD700]">BLITZ</span>
                                <span className="font-bold text-2xl text-white">BALL</span>
                            </div>
                        )}
                    </Link>
                    {!collapsed && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCollapsed(true)}
                            className="text-white/70 hover:text-white transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                <NavItems isCollapsed={collapsed} />

                {collapsed && (
                    <div className="p-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCollapsed(false)}
                            className="mb-4 mx-auto p-3 text-white/70 hover:text-white hover:bg-[#002F6C] rounded-lg transition-all"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>
                )}
            </aside>

            {/* Main content wrapper */}
            <div className={cn(
                "flex flex-col flex-1 overflow-hidden transition-all duration-300",
                collapsed ? "md:ml-16" : "md:ml-64"
            )}>
                {/* Mobile top bar */}
                <div className="md:hidden flex items-center gap-3 px-4 h-14 bg-[#001F4D] border-b-2 border-[#FFD700] shrink-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileOpen(true)}
                        className="text-white/70 hover:text-white"
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/Palla.png" alt="Logo" className="w-8 h-8 rounded-full object-contain" />
                        <div className="flex items-baseline gap-1">
                            <span className="font-bold text-lg text-[#FFD700]">BLITZ</span>
                            <span className="font-bold text-lg text-white">BALL</span>
                        </div>
                    </Link>
                </div>

                <main className="flex-1 overflow-y-auto overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default MainLayout
