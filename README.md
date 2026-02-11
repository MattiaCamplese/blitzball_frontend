# Blitzball Tournament Manager - Frontend

Applicazione web per la gestione completa di tornei di calcetto (futsal) con sistema ad eliminazione diretta. Supporta tornei da 4, 8, 16 e 32 squadre con gestione atleti, squadre, bracket visuale e Hall of Fame.

## Tecnologie Utilizzate

- **React 19** - Libreria UI moderna con performance ottimizzate
- **TypeScript** - Tipizzazione statica per maggiore affidabilità
- **Vite** - Build tool velocissimo per sviluppo e produzione
- **TanStack Query (React Query)** - Gestione stato server, caching intelligente e sincronizzazione automatica
- **React Hook Form** - Gestione form performante con validazione
- **Tailwind CSS** - Framework CSS utility-first per styling rapido
- **shadcn/ui** - Componenti UI accessibili e personalizzabili
- **Lucide React** - Libreria di icone moderne
- **React Router** - Routing client-side

## Funzionalità Principali

### 🏆 Gestione Tornei
- Creazione tornei con configurazione automatica bracket (4, 8, 16, 32 squadre)
- Iscrizione squadre ai tornei
- Generazione automatica tabellone ad eliminazione diretta
- Visualizzazione stato torneo (In Corso / Completato)
- Statistiche tornei sulla dashboard

### ⚽ Gestione Squadre
- Creazione e modifica squadre
- Assegnazione logo e tracciamento tornei vinti
- Visualizzazione composizione attuale e storico atleti
- Statistiche squadre (tornei giocati, vittorie, atleti attivi)

### 👥 Gestione Atleti
- Anagrafica completa (nome, cognome, data di nascita, nazionalità)
- Assegnazione atleti a squadre con:
  - Data inizio collaborazione
  - Ruolo (Portiere / Giocatore)
  - Numero maglia
- Storico completo delle squadre di appartenenza
- Gestione composizioni attive e terminate
- **Performance ottimizzate** con lazy loading e memoizzazione

### 🎯 Bracket Visualizzazione
- Interfaccia grafica interattiva del tabellone torneo
- Algoritmo a specchio per disposizione equilibrata
- Inserimento punteggi partita
- Avanzamento automatico vincitori al round successivo
- Validazione no-pareggi (eliminazione diretta)
- Connettori visivi tra round
- Creazione automatica Hall of Fame alla vittoria finale

### 🏅 Hall of Fame
- Archivio storico vincitori tornei
- Visualizzazione cronologica con dettagli torneo
- Badge e premi visuali
- Statistiche globali

### 📊 Dashboard
- Statistiche aggregate (tornei totali, squadre, atleti)
- Tornei attivi e completati
- Card informative con icone
- Navigazione rapida alle sezioni

## Struttura del Progetto

```
Frontend/
├── public/                    # Asset statici
│   └── audio/                # File audio (musica di sottofondo)
│
├── src/
│   ├── audio/                # Gestione audio globale
│   │   └── globalAudio.ts   # Controller audio applicazione
│   │
│   ├── components/           # Componenti UI riutilizzabili
│   │   └── ui/              # Componenti shadcn/ui personalizzati
│   │       ├── badge.tsx    # Badge e tag
│   │       ├── button.tsx   # Pulsanti
│   │       ├── card.tsx     # Card container
│   │       ├── dialog.tsx   # Modal e dialog
│   │       ├── input.tsx    # Input text
│   │       ├── input-group.tsx  # Input con addon (icone)
│   │       ├── statCard.tsx # Card statistiche
│   │       ├── textarea.tsx # Textarea multiline
│   │       ├── title.tsx    # Titoli sezioni
│   │       └── globalAudio.tsx  # Componente audio player
│   │
│   ├── features/             # Moduli funzionalità (feature-based architecture)
│   │   │
│   │   ├── athlete/          # 👥 Gestione Atleti
│   │   │   ├── athlete.type.ts          # Tipi TypeScript
│   │   │   ├── athlete.services.tsx     # API calls
│   │   │   ├── athlete.hook.tsx         # React Query hooks
│   │   │   ├── AthletesPage.tsx         # Pagina lista atleti
│   │   │   ├── CreateAthleteButton.tsx  # Modal creazione
│   │   │   └── AthleteSchedeSimple.tsx  # Modal dettaglio atleta
│   │   │                                 # (ottimizzato con lazy loading)
│   │   │
│   │   ├── team/             # ⚽ Gestione Squadre
│   │   │   ├── team.type.ts             # Tipi TypeScript
│   │   │   ├── team.services.tsx        # API calls
│   │   │   ├── team.hooks.tsx           # React Query hooks
│   │   │   ├── TeamPage.tsx             # Pagina lista squadre
│   │   │   └── CreateTeamButton.tsx     # Modal creazione
│   │   │
│   │   ├── tournament/       # 🏆 Gestione Tornei
│   │   │   ├── tournament.type.ts           # Tipi TypeScript
│   │   │   ├── tournament.services.tsx      # API calls
│   │   │   ├── tournament.hooks.tsx         # React Query hooks
│   │   │   ├── TournamentsPage.tsx          # Pagina lista tornei
│   │   │   └── CreateTournamentButton.tsx   # Modal creazione
│   │   │
│   │   ├── composition/      # 🔗 Relazioni Atleta-Squadra
│   │   │   ├── composition.type.ts      # Tipi TypeScript
│   │   │   ├── composition.service.tsx  # API calls
│   │   │   └── composition.hook.tsx     # React Query hooks
│   │   │                                # (con lazy loading)
│   │   │
│   │   ├── registration/     # 📝 Iscrizioni Torneo
│   │   │   └── registration.type.ts     # Tipi TypeScript
│   │   │
│   │   ├── game/             # 🎮 Partite
│   │   │   ├── game.type.ts             # Tipi TypeScript
│   │   │   └── BracketPage.tsx          # (Deprecato - usa bracket/)
│   │   │
│   │   ├── bracket/          # 🎯 Visualizzazione Tabellone
│   │   │   ├── BracketPage.tsx          # Pagina principale bracket
│   │   │   ├── BracketGrid.tsx          # Griglia responsive rounds
│   │   │   ├── BracketHeader.tsx        # Header torneo
│   │   │   ├── MatchCard.tsx            # Card singola partita
│   │   │   ├── TeamRow.tsx              # Riga squadra in partita
│   │   │   ├── BracketConnector.tsx     # Connettori SVG tra match
│   │   │   └── bracket.utils.ts         # Utility calcoli layout
│   │   │
│   │   └── hall_of_fame/     # 🏅 Hall of Fame
│   │       ├── hall_of_fame.type.ts     # Tipi TypeScript
│   │       ├── hall_of_fame.services.tsx # API calls
│   │       ├── hall_of_fame.hook.tsx    # React Query hooks
│   │       └── HallOfFamePage.tsx       # Pagina vincitori
│   │
│   ├── layouts/              # Layout applicazione
│   │   └── MainLayout.tsx   # Layout principale con navbar
│   │
│   ├── pages/                # Pagine routing
│   │   └── HomePages.tsx    # Dashboard homepage
│   │
│   ├── lib/                  # Utility e configurazioni
│   │   ├── beckend.ts       # Client API Axios
│   │   ├── env.ts           # Gestione variabili ambiente
│   │   └── utils.ts         # Utility generiche (cn, clsx)
│   │
│   ├── main.tsx              # Entry point app + routing
│   ├── index.css             # Stili globali Tailwind
│   └── vite-env.d.ts         # Definizioni TypeScript Vite
│
├── .env                       # Variabili ambiente (VITE_BACKEND_URL)
├── package.json              # Dipendenze e script npm
├── tsconfig.json             # Configurazione TypeScript
├── tailwind.config.js        # Configurazione Tailwind CSS
├── vite.config.ts            # Configurazione Vite
├── postcss.config.js         # Configurazione PostCSS
├── components.json           # Configurazione shadcn/ui
└── README.md                 # Questo file
```

## Architettura Features

Ogni feature segue una struttura modulare:

- **`.type.ts`** - Interfacce TypeScript per tipizzazione
- **`.services.tsx`** - Chiamate API con Axios
- **`.hook(s).tsx`** - React Query hooks per caching e sincronizzazione
- **`Page.tsx`** - Componente pagina principale
- **`Create*.tsx`** - Modal/form di creazione
- **Altri componenti** - Componenti specifici della feature

## Installazione e Setup

### Prerequisiti
- Node.js >= 18
- npm o yarn
- Backend Blitzball API attivo

### 1. Installa dipendenze
```bash
npm install
```

### 2. Configura ambiente
Crea file `.env` nella root del progetto:
```env
VITE_BACKEND_URL=http://localhost:8000/api
```

### 3. Avvia sviluppo
```bash
npm run dev
```
L'app sarà disponibile su `http://localhost:5173`

## Configurazione Tailwind

Il progetto usa una palette colori personalizzata:
- **Primary**: Blu navy (`#002F6C`)
- **Secondary**: Giallo oro (`#FFD700`)
- **Accent**: Arancione (`#FF6B35`)
- **Success**: Verde (`#10B981`)
- **Error**: Rosso (`#EF4444`)

Classi utility custom:
- `text-balance` - Bilanciamento testo
- `animate-in`, `fade-in`, `slide-in-from-*` - Animazioni entrata

## Routing

```typescript
// main.tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePages /> },        // Dashboard
      { path: 'teams', element: <TeamPage /> },       // Squadre
      { path: 'athletes', element: <AthletesPage /> }, // Atleti
      { path: 'tournaments', element: <TournamentsPage /> }, // Tornei
      { path: 'bracket/:id', element: <BracketPage /> },    // Tabellone
      { path: 'hall-of-fame', element: <HallOfFamePage /> }, // Hall of Fame
    ],
  },
]);
```

## Convenzioni Codice

### Naming
- **Componenti**: PascalCase (`AthleteSchedeSimple.tsx`)
- **Hook**: camelCase con prefisso `use` (`useAthletes`)
- **Servizi**: PascalCase con suffisso `Service` (`AthleteService`)
- **Tipi**: PascalCase (`Athlete`, `Tournament`)
- **File tipi**: `*.type.ts`

### Errori CORS
- Verifica backend CORS configurato correttamente
- Controlla `VITE_BACKEND_URL` in `.env`
- Backend deve accettare origin frontend

### Errori build
```bash
# Pulisci cache e reinstalla
rm -rf node_modules dist
npm install
npm run build
```

## Browser Supportati

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## Licenza

Progetto didattico - Uso educativo

---

**Sviluppato con ❤️ per la gestione tornei di calcetto**
