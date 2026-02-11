import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './index.css'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePages';
import AthletesPage from './features/athlete/AthletesPage';
import TeamsPage from './features/team/TeamPage';
import TournamentsPage from './features/tournament/TournamentsPage';
import BracketPage from './features/bracket/BracketPage';
import HallOfFamePage from './features/hall_of_fame/HallOfFamePage';




const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'athletes',
        element: <AthletesPage />
      },
      {
        path: "teams",
        element: <TeamsPage />
      },
      {
        path: "tournaments",
        element: <TournamentsPage />
      },
      {
        path: "/tournaments/:tournamentId/bracket",
        element: <BracketPage />
      },
      {
        path:"/halls_of_fame",
        element: <HallOfFamePage/>
      }
    ]
  }
])

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
  }
}

window.__TANSTACK_QUERY_CLIENT__ = queryClient;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)