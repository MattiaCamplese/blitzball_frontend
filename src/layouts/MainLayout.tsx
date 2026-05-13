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

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Mobile backdrop */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed left-0 top-0 h-full bg-[#001F4D] border-r-2 border-[#FFD700] transition-all duration-300 z-50 flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
                "w-64",
                mobileOpen ? "translate-x-0" : "-translate-x-full",
                collapsed ? "md:translate-x-0 md:w-16" : "md:translate-x-0 md:w-64"
            )}>
                {/* Logo Header */}
                <div className="h-16 md:h-20 flex items-center justify-between px-4">
                    <Link
                        to="/"
                        className={cn("flex items-center gap-3 transition-all", collapsed && "md:justify-center md:w-full")}
                    >
                        <div className="shrink-0">
                            <img
                                src="/Palla.png"
                                alt="Logo"
                                className="aspect-square object-contain rounded-full shrink-0 w-9 h-9 md:w-10 md:h-10 lg:w-11 lg:h-11"
                            />
                        </div>
                        <div className={cn("flex items-baseline gap-1", collapsed && "md:hidden")}>
                            <span className="font-bold text-2xl text-[#FFD700]">BLITZ</span>
                            <span className="font-bold text-2xl text-white">BALL</span>
                        </div>
                    </Link>

                    {/* X button on mobile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileOpen(false)}
                        className="text-white/70 hover:text-white transition-colors md:hidden"
                    >
                        <X className="w-5 h-5" />
                    </Button>

                    {/* Collapse button on desktop (only when expanded) */}
                    {!collapsed && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCollapsed(true)}
                            className="hidden md:flex text-white/70 hover:text-white transition-colors"
                        >
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
                            <Link
                                key={item.to}
                                to={item.to}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative",
                                    isActive ? "bg-[#0055A4] text-white" : "text-white hover:bg-[#002F6C]",
                                    collapsed && "md:justify-center md:px-0"
                                )}
                            >
                                <Icon className="w-5 h-5 shrink-0 text-white" />
                                <span className={cn("font-medium text-white", collapsed && "md:hidden")}>
                                    {item.label}
                                </span>

                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FFD700] rounded-r-full" />
                                )}

                                {collapsed && (
                                    <div className="hidden md:block absolute left-full ml-6 px-3 py-2 bg-[#001F4D] border border-[#FFD700] rounded-lg text-white text-sm font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Expand button when collapsed (desktop only) */}
                {collapsed && (
                    <div className="hidden md:block p-4">
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

                {/* Page content */}
                <main className="flex-1 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default MainLayout
