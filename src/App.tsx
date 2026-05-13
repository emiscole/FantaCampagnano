import * as XLSX from 'xlsx';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Layout, Calculator, BookOpen, Trophy, Shield, User, Star, Minus, Plus, RefreshCw, Info, ArrowLeftRight, ArrowUp, ArrowDown, Users as UsersIcon, Shirt, Calendar, Repeat, UserCheck, UserPlus, LayoutGrid, Target, CircleDot, ShieldCheck, Ban, RotateCcw, Square, Home, CircleX, ShieldX, Save, History, ListOrdered, Trash2, FileUp, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Player, Team, Role, TeamCalculations, HistoricalMatch, Standing, UpcomingMatch, Matchday, SquadPlayer, Squad } from './types';
import { calculateMatch, calculatePlayerTotal, calculateGKBonus, calculateFWBonus, FORMATION_ROLES } from './constants';
import { SERIE_A_PLAYER_DATABASE } from './data/playerDatabase';

const INITIAL_TEAM_1: Team = {
  name: "Team A",
  isHome: true,
  formation: '4-3-3',
  players: [
    { id: '1', name: 'Nome Giocatore', role: 'POR', vote: 6, goals: 0, goalsConceded: 0, ownGoals: 0, penaltiesMissed: 0, penaltiesSaved: 0, yellowCard: false, redCard: false, isCaptain: false },
    { id: '2', name: 'Nome Giocatore', role: 'DIF', vote: 6, goals: 0, goalsConceded: 0, ownGoals: 0, penaltiesMissed: 0, penaltiesSaved: 0, yellowCard: false, redCard: false, isCaptain: true },
    { id: '3', name: 'Nome Giocatore', role: 'DIF', vote: 6, goals: 0, goalsConceded: 0, ownGoals: 0, penaltiesMissed: 0, penaltiesSaved: 0, yellowCard: false, redCard: false, isCaptain: false },
    { id: '4', name: 'Nome Giocatore', role: 'DIF', vote: 6, goals: 0, goalsConceded: 0, ownGoals: 0, penaltiesMissed: 0, penaltiesSaved: 0, yellowCard: false, redCard: false, isCaptain: false },
    { id: '5', name: 'Nome Giocatore', role: 'DIF', vote: 6, goals: 0, goalsConceded: 0, ownGoals: 0, penaltiesMissed: 0, penaltiesSaved: 0, yellowCard: false, redCard: false, isCaptain: false },
    { id: '6', name: 'Nome Giocatore', role: 'CC', vote: 6, goals: 0, goalsConceded: 0, ownGoals: 0, penaltiesMissed: 0, penaltiesSaved: 0, yellowCard: false, redCard: false, isCaptain: false },
    { id: '7', name: 'Nome Giocatore', role: 'CC', vote: 6, goals: 0, goalsConceded: 0, ownGoals: 0, penaltiesMissed: 0, penaltiesSaved: 0, yellowCard: false, redCard: false, isCaptain: false },
    { id: '8', name: 'Nome Giocatore', role: 'CC', vote: 6, goals: 0, goalsConceded: 0, ownGoals: 0, penaltiesMissed: 0, penaltiesSaved: 0, yellowCard: false, redCard: false, isCaptain: false },
    { id: '9', name: 'Nome Giocatore', role: 'ATT', vote: 6, goals: 0, goalsConceded: 0, ownGoals: 0, penaltiesMissed: 0, penaltiesSaved: 0, yellowCard: false, redCard: false, isCaptain: false },
    { id: '10', name: 'Nome Giocatore', role: 'ATT', vote: 6, goals: 0, goalsConceded: 0, ownGoals: 0, penaltiesMissed: 0, penaltiesSaved: 0, yellowCard: false, redCard: false, isCaptain: false },
    { id: '11', name: 'Nome Giocatore', role: 'ATT', vote: 6, goals: 0, goalsConceded: 0, ownGoals: 0, penaltiesMissed: 0, penaltiesSaved: 0, yellowCard: false, redCard: false, isCaptain: false },
  ]
};

const INITIAL_TEAM_2: Team = {
  name: "Team B",
  isHome: false,
  formation: '4-4-2',
  players: [
    { id: '12', name: 'Nome Giocatore', role: 'POR', vote: 6, goals: 0, goalsConceded: 0, ownGoals: 0, penaltiesMissed: 0, penaltiesSaved: 0, yellowCard: false, redCard: false, isCaptain: false },
    { id: '13', name: 'Nome Giocatore', role: 'DIF', vote: 6, goals: 0, goalsConceded: 0, ownGoals: 0, penaltiesMissed: 0, penaltiesSaved: 0, yellowCard: false, redCard: false, isCaptain: false },
    { id: '14', name: 'Nome Giocatore', role: 'DIF', vote: 6, goals: 0, goalsConceded: 0, ownGoals: 0, penaltiesMissed: 0, penaltiesSaved: 0, yellowCard: false, redCard: false, isCaptain: false },
    { id: '15', name: 'Nome Giocatore', role: 'DIF', vote: 6, goals: 0, goalsConceded: 0, ownGoals: 0, penaltiesMissed: 0, penaltiesSaved: 0, yellowCard: false, redCard: false, isCaptain: false },
    { id: '16', name: 'Nome Giocatore', role: 'DIF', vote: 6, goals: 0, goalsConceded: 0, ownGoals: 0, penaltiesMissed: 0, penaltiesSaved: 0, yellowCard: false, redCard: false, isCaptain: false },
    { id: '17', name: 'Nome Giocatore', role: 'CC', vote: 6, goals: 0, goalsConceded: 0, ownGoals: 0, penaltiesMissed: 0, penaltiesSaved: 0, yellowCard: false, redCard: false, isCaptain: true },
    { id: '18', name: 'Nome Giocatore', role: 'CC', vote: 6, goals: 0, goalsConceded: 0, ownGoals: 0, penaltiesMissed: 0, penaltiesSaved: 0, yellowCard: false, redCard: false, isCaptain: false },
    { id: '19', name: 'Nome Giocatore', role: 'CC', vote: 6, goals: 0, goalsConceded: 0, ownGoals: 0, penaltiesMissed: 0, penaltiesSaved: 0, yellowCard: false, redCard: false, isCaptain: false },
    { id: '20', name: 'Nome Giocatore', role: 'CC', vote: 6, goals: 0, goalsConceded: 0, ownGoals: 0, penaltiesMissed: 0, penaltiesSaved: 0, yellowCard: false, redCard: false, isCaptain: false },
    { id: '21', name: 'Nome Giocatore', role: 'ATT', vote: 6, goals: 0, goalsConceded: 0, ownGoals: 0, penaltiesMissed: 0, penaltiesSaved: 0, yellowCard: false, redCard: false, isCaptain: false },
    { id: '22', name: 'Nome Giocatore', role: 'ATT', vote: 6, goals: 0, goalsConceded: 0, ownGoals: 0, penaltiesMissed: 0, penaltiesSaved: 0, yellowCard: false, redCard: false, isCaptain: false },
  ]
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'match' | 'rules' | 'championship' | 'history'>('dashboard');
  const [team1, setTeam1] = useState<Team>(INITIAL_TEAM_1);
  const [team2, setTeam2] = useState<Team>(INITIAL_TEAM_2);
  const [matches, setMatches] = useState<HistoricalMatch[]>(() => {
    const saved = localStorage.getItem('fanta_matches');
    return saved ? JSON.parse(saved) : [];
  });
  const [squads, setSquads] = useState<{ [key: string]: { players: SquadPlayer[], spentCredits: number } }>(() => {
    const saved = localStorage.getItem('fanta_squads');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migration: if it's the old format Record<string, string[]>
      const keys = Object.keys(parsed);
      if (keys.length > 0 && Array.isArray(parsed[keys[0]])) {
        const migrated: { [key: string]: { players: SquadPlayer[], spentCredits: number } } = {};
        keys.forEach(k => {
          migrated[k] = {
            spentCredits: 0,
            players: (parsed[k] as any[]).map(p => {
              if (typeof p === 'string') {
                return { id: crypto.randomUUID(), name: p, role: 'DIF' as Role, cost: 0 };
              }
              return p;
            })
          };
        });
        return migrated;
      }
      return parsed;
    }
    
    // Initial 10 empty squads
    const initial: { [key: string]: { players: SquadPlayer[], spentCredits: number } } = {};
    for (let i = 1; i <= 10; i++) {
        initial[`Squadra ${i}`] = { players: [], spentCredits: 0 };
    }
    return initial;
  });

  const [calendar, setCalendar] = useState<Matchday[]>(() => {
    const saved = localStorage.getItem('fanta_calendar');
    if (saved) return JSON.parse(saved);

    const initial: Matchday[] = [];
    for (let i = 1; i <= 35; i++) {
      initial.push({
        id: i,
        label: `${i}° Giornata`,
        matches: Array.from({ length: 5 }, (_, idx) => ({
          id: `m-${i}-${idx}`,
          team1Name: '',
          team2Name: '',
          time: '15:00'
        }))
      });
    }
    return initial;
  });

  const [currentMatchdayId, setCurrentMatchdayId] = useState<number>(() => {
    const saved = localStorage.getItem('fanta_current_matchday');
    return saved ? parseInt(saved) : 1;
  });

  useEffect(() => {
    localStorage.setItem('fanta_calendar', JSON.stringify(calendar));
  }, [calendar]);

  useEffect(() => {
    localStorage.setItem('fanta_current_matchday', currentMatchdayId.toString());
  }, [currentMatchdayId]);

  useEffect(() => {
    localStorage.setItem('fanta_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('fanta_squads', JSON.stringify(squads));
  }, [squads]);

  const onUpdateMatch = (matchdayId: number, matchId: string, updates: Partial<UpcomingMatch>) => {
    setCalendar(prev => prev.map(day => {
      if (day.id !== matchdayId) return day;
      return {
        ...day,
        matches: day.matches.map(m => m.id === matchId ? { ...m, ...updates } : m)
      };
    }));
  };

  const onStartMatch = (u: UpcomingMatch) => {
    setTeam1(prev => ({ ...prev, name: u.team1Name || 'Team Home' }));
    setTeam2(prev => ({ ...prev, name: u.team2Name || 'Team Away' }));
    setActiveTab('match');
  };

  const standings = useMemo(() => {
    const stats: Record<string, Standing> = {};
    matches.forEach(m => {
      [
        { name: m.team1Name, goals: m.team1Goals, opponentGoals: m.team2Goals, pts: m.winner === m.team1Name ? 3 : m.winner === 'Pareggio' ? 1 : 0 },
        { name: m.team2Name, goals: m.team2Goals, opponentGoals: m.team1Goals, pts: m.winner === m.team2Name ? 3 : m.winner === 'Pareggio' ? 1 : 0 }
      ].forEach(team => {
        if (!stats[team.name]) {
          stats[team.name] = { teamName: team.name, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 };
        }
        const s = stats[team.name];
        s.played += 1;
        s.goalsFor += team.goals;
        s.goalsAgainst += team.opponentGoals;
        s.points += team.pts;
        if (team.pts === 3) s.won += 1;
        else if (team.pts === 1) s.drawn += 1;
        else s.lost += 1;
      });
    });
    return Object.values(stats).sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst));
  }, [matches]);

  const saveMatch = () => {
    const newMatch: HistoricalMatch = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      team1Name: team1.name,
      team2Name: team2.name,
      team1Goals: results.team1.goals,
      team2Goals: results.team2.goals,
      team1Score: results.team1.totalScore,
      team2Score: results.team2.totalScore,
      winner: results.winner
    };
    setMatches(prev => [newMatch, ...prev]);
    alert("Incontro salvato con successo!");
  };

  const deleteMatch = (id: string) => {
    if (confirm("Sei sicuro di voler eliminare questo incontro dallo storico?")) {
      setMatches(prev => prev.filter(m => m.id !== id));
    }
  };

  const toggleHome = () => {
    setTeam1(prev => ({ ...prev, isHome: !prev.isHome }));
    setTeam2(prev => ({ ...prev, isHome: !prev.isHome }));
  };

  const results = calculateMatch(team1, team2);

  const updateTeamName = (teamId: 1 | 2, name: string) => {
    const setter = teamId === 1 ? setTeam1 : setTeam2;
    setter(prev => ({ ...prev, name }));
  };

  const updateFormation = (teamId: 1 | 2, formation: string) => {
    const roles = FORMATION_ROLES[formation];
    if (!roles) return;

    const updateTeam = (prev: Team): Team => {
      const newPlayers = prev.players.map((p, index) => {
        if (index < 11 && roles[index]) {
          return { ...p, role: roles[index] };
        }
        return p;
      });
      return { ...prev, formation, players: newPlayers };
    };

    if (teamId === 1) setTeam1(updateTeam);
    else setTeam2(updateTeam);
  };

  const updatePlayer = (teamId: 1 | 2, playerId: string, field: keyof Player, value: any) => {
    const setter = teamId === 1 ? setTeam1 : setTeam2;
    setter(prev => ({
      ...prev,
      players: prev.players.map(p => p.id === playerId ? { ...p, [field]: value } : p)
    }));
  };

  const getWinnerString = () => {
    return results.winner;
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-emerald-500/30 transition-colors duration-500 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b px-4 py-3 transition-colors duration-500 ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/20">
              <Shield className={`w-5 h-5 ${isDarkMode ? 'text-slate-950' : 'text-white'}`} />
            </div>
            <div className="flex items-baseline gap-2">
              <h1 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>FantaCampagnano</h1>
              <span className="text-[10px] font-black text-emerald-500/80 uppercase tracking-widest hidden sm:block">15° Edizione</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flex gap-1 p-1 rounded-xl overflow-x-auto max-w-full no-scrollbar transition-colors ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                  activeTab === 'dashboard' 
                    ? (isDarkMode ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-slate-900 shadow-md') 
                    : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900')
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="text-xs font-medium">Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('match')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                  activeTab === 'match' 
                    ? (isDarkMode ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-slate-900 shadow-md') 
                    : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900')
                }`}
              >
                <Calculator className="w-4 h-4" />
                <span className="text-xs font-medium">Registro</span>
              </button>
              <button
                onClick={() => setActiveTab('championship')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                  activeTab === 'championship' 
                    ? (isDarkMode ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-slate-900 shadow-md') 
                    : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900')
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span className="text-xs font-medium">Campionato</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                  activeTab === 'history' 
                    ? (isDarkMode ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-slate-900 shadow-md') 
                    : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900')
                }`}
              >
                <History className="w-4 h-4" />
                <span className="text-xs font-medium">Storico</span>
              </button>
              <button
                onClick={() => setActiveTab('rules')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                  activeTab === 'rules' 
                    ? (isDarkMode ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-slate-900 shadow-md') 
                    : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900')
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-xs font-medium">Regolamento</span>
              </button>
            </div>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl border transition-all ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' 
                  : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'match' ? (
            <motion.div
              key="match"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Main App Title */}
              <div className="flex flex-col items-start mb-4 px-2 sm:flex-row sm:items-center sm:justify-between w-full">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight drop-shadow-2xl">
                  Registro Incontro Digitale
                </h1>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                        if (confirm("Sei sicuro di voler resettare tutti i calcoli?")) {
                            setTeam1(INITIAL_TEAM_1);
                            setTeam2(INITIAL_TEAM_2);
                        }
                    }}
                    className={`mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 border ${
                      isDarkMode 
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700' 
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 shadow-slate-200/50'
                    }`}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                  <button 
                    onClick={saveMatch}
                    className="mt-4 sm:mt-0 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    Salva Risultato
                  </button>
                </div>
              </div>

              {/* Unified Header & Scoreboard */}
              <div className={`rounded-[2.5rem] border shadow-2xl relative overflow-hidden group transition-colors ${
                isDarkMode ? 'bg-slate-900 border-slate-800 shadow-slate-950/50' : 'bg-slate-800 border-slate-700'
              }`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50" />
                
                <div className="px-6 py-8 md:px-12 md:py-10">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-8 md:gap-12">
                    
                    {/* Team 1 Side */}
                    <div className="flex flex-col md:flex-row items-center justify-end gap-6 md:gap-10">
                      <div className="flex flex-col items-center md:items-end order-2 md:order-1">
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight mb-3">
                          {team1.name}
                        </h2>
                        <div className="flex flex-col items-center md:items-end gap-1">
                          <div className="flex items-center gap-3 px-4 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-md">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest translate-y-[1px]">Punti Totali</span>
                            <span className="text-xl font-black text-white tabular-nums drop-shadow-sm">{results.team1.totalScore.toFixed(1)}</span>
                          </div>
                          {results.team1.isUnder60 && (
                            <span className="text-[8px] font-black text-red-400 uppercase tracking-widest mr-2">Sotto 60 (-1 Gol)</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 order-1 md:order-2">
                        <div className={`w-16 h-16 md:w-24 md:h-24 rounded-[2rem] border-2 flex items-center justify-center shadow-2xl transition-colors ${
                          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-700/50 border-slate-600'
                        }`}>
                          <Shield className="w-10 h-10 md:w-14 md:h-14 text-emerald-500" />
                        </div>
                        <div className="text-7xl md:text-8xl font-black text-emerald-400 leading-none tracking-tighter drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                          {results.team1.goals}
                        </div>
                      </div>
                    </div>

                    {/* Simple Vertical Divider for Desktop */}
                    <div className="hidden md:flex flex-col items-center justify-center gap-3 px-6 relative">
                      <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full" />
                      <div className="w-1 md:w-1.5 h-16 bg-gradient-to-b from-transparent via-emerald-500/40 to-transparent rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                      <div className="w-px h-16 bg-emerald-500/60 absolute z-10" />
                    </div>

                    {/* Team 2 Side */}
                    <div className="flex flex-col md:flex-row items-center justify-start gap-6 md:gap-10">
                      <div className="flex items-center gap-6">
                        <div className="text-7xl md:text-8xl font-black text-emerald-400 leading-none tracking-tighter drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                          {results.team2.goals}
                        </div>
                        <div className={`w-16 h-16 md:w-24 md:h-24 rounded-[2rem] border-2 flex items-center justify-center shadow-2xl transition-colors ${
                          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-700/50 border-slate-600'
                        }`}>
                          <Shield className="w-10 h-10 md:w-14 md:h-14 text-emerald-500" />
                        </div>
                      </div>

                      <div className="flex flex-col items-center md:items-start">
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight mb-3">
                          {team2.name}
                        </h2>
                        <div className="flex flex-col items-center md:items-start gap-1">
                          <div className="flex items-center gap-3 px-4 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-md">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest translate-y-[1px]">Punti Totali</span>
                            <span className="text-xl font-black text-white tabular-nums drop-shadow-sm">{results.team2.totalScore.toFixed(1)}</span>
                          </div>
                          {results.team2.isUnder60 && (
                            <span className="text-[8px] font-black text-red-400 uppercase tracking-widest ml-2">Sotto 60 (-1 Gol)</span>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Calculations Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TeamDetails 
                  team={team1} 
                  calc={results.team1} 
                  opponentCalc={results.team2} 
                  onUpdatePlayer={(id, field, val) => updatePlayer(1, id, field, val)} 
                  onUpdateTeamName={(name) => updateTeamName(1, name)}
                  onUpdateFormation={(form) => updateFormation(1, form)}
                  isDarkMode={isDarkMode}
                />

                <TeamDetails 
                  team={team2} 
                  calc={results.team2} 
                  opponentCalc={results.team1} 
                  onUpdatePlayer={(id, field, val) => updatePlayer(2, id, field, val)} 
                  onUpdateTeamName={(name) => updateTeamName(2, name)}
                  onUpdateFormation={(form) => updateFormation(2, form)}
                  isDarkMode={isDarkMode}
                />
              </div>

              {/* Bottom Statistics Legend */}
              <div className={`backdrop-blur-sm border rounded-[2.5rem] p-6 lg:p-8 transition-colors ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <Info className="w-4 h-4 text-sky-400" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Legenda Statistiche</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Icone e abbreviazioni utilizzate nella riga calciatore</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-3">
                    <MiniLegend label="G" desc="Gol" color="text-emerald-500" />
                    <MiniLegend label="GS" desc="Subiti" color="text-red-500" />
                    <MiniLegend label="RS" desc="Sbagliati" color="text-orange-500" />
                    <MiniLegend label="A" desc="Autogol" color="text-orange-500" />
                    <MiniLegend label="RP" desc="Parati" color="text-sky-500" />
                    <div className="w-px h-6 bg-slate-800 mx-1 hidden sm:block" />
                    <MiniLegend label="A" desc="Amm." color="text-amber-400" isCard />
                    <MiniLegend label="E" desc="Esp." color="text-red-500" isCard />
                    <MiniLegend label="C" desc="Cap" color="text-amber-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === 'dashboard' ? (
            <DashboardView 
              lastMatches={matches.slice(0, 5)} 
              currentMatchday={calendar.find(d => d.id === currentMatchdayId) || calendar[0]}
              onStartMatch={onStartMatch}
              onChangeMatchday={(id) => setCurrentMatchdayId(id)}
              totalMatchdays={calendar.length}
              isDarkMode={isDarkMode}
              standings={standings}
            />
          ) : activeTab === 'championship' ? (
            <ChampionshipView 
              calendar={calendar}
              onUpdateMatch={onUpdateMatch}
              onBulkUpdate={(newCal) => setCalendar(newCal)}
              squads={squads}
              setSquads={setSquads}
              currentMatchdayId={currentMatchdayId}
              standings={standings}
              isDarkMode={isDarkMode}
            />
          ) : activeTab === 'history' ? (
            <HistoryView matches={matches} onDelete={deleteMatch} isDarkMode={isDarkMode} />
          ) : (
            <RulesView isDarkMode={isDarkMode} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}


const MatchPlayerRow: React.FC<{ 
  p: Player, 
  onUpdatePlayer: (id: string, field: keyof Player, val: any) => void,
  isDarkMode: boolean
}> = ({ p, onUpdatePlayer, isDarkMode }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Auto-fill logic
  useEffect(() => {
    const searchName = p.name.trim();
    if (searchName.length < 2) {
      setSuggestions([]);
      return;
    }

    const matches = Object.keys(SERIE_A_PLAYER_DATABASE).filter(playerName => 
      playerName.toLowerCase().includes(searchName.toLowerCase())
    );

    setSuggestions(matches.slice(0, 5));

    const exactMatch = Object.keys(SERIE_A_PLAYER_DATABASE).find(playerName => 
      playerName.toLowerCase() === searchName.toLowerCase()
    );

    if (exactMatch) {
      const data = SERIE_A_PLAYER_DATABASE[exactMatch];
      if (p.club !== data.club) {
        onUpdatePlayer(p.id, 'club', data.club);
      }
      if (p.role !== data.role) {
        onUpdatePlayer(p.id, 'role', data.role);
      }
    }
  }, [p.name, p.id]);

  const selectSuggestion = (playerName: string) => {
    const data = SERIE_A_PLAYER_DATABASE[playerName];
    onUpdatePlayer(p.id, 'name', playerName);
    onUpdatePlayer(p.id, 'club', data.club);
    onUpdatePlayer(p.id, 'role', data.role);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className={`flex items-center gap-1.5 p-1.5 rounded-xl border transition-all ${
      p.isDNP 
        ? 'opacity-40 grayscale border-slate-200 dark:border-slate-900 bg-slate-100 dark:bg-slate-900/10' 
        : p.isCaptain 
          ? 'border-amber-500/30 bg-amber-500/5' 
          : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 shadow-sm dark:shadow-none'
    }`}>
      {/* 0. DNP Toggle */}
      <button 
        onClick={() => onUpdatePlayer(p.id, 'isDNP', !p.isDNP)}
        className={`p-1 rounded transition-all border ${
          p.isDNP 
            ? 'bg-slate-200 dark:bg-slate-800 border-red-500 text-red-500' 
            : (isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-500 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-900')
        }`}
        title="Assente / Non entrato"
      >
        <Minus className="w-3 h-3" />
      </button>

      {/* 1. Role & Bonus Overlay */}
      <div className="relative shrink-0">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black border shadow-sm transition-colors ${
          p.isDNP 
            ? 'bg-slate-800 text-slate-600 border-slate-700/50' 
            : p.role === 'POR' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
              p.role === 'DIF' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
              p.role === 'CC'  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                 'bg-red-500/10 text-red-400 border-red-500/20'
        }`}>
          {p.role}
        </div>
        
        {!p.isDNP && (
          <>
            {p.role === 'POR' && calculateGKBonus(p) > 0 && (
              <div className="absolute -top-2 -right-2 min-w-[1.4rem] h-5 px-1 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-black border-2 border-slate-900 shadow-lg animate-pulse ring-1 ring-emerald-500/30">
                +{calculateGKBonus(p).toString().replace('.', ',')}
              </div>
            )}
            {p.role === 'ATT' && calculateFWBonus(p) > 0 && (
              <div className="absolute -top-2 -right-2 min-w-[1.4rem] h-5 px-1 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-black border-2 border-slate-900 shadow-lg animate-pulse ring-1 ring-emerald-500/30">
                +{calculateFWBonus(p).toString().replace('.', ',')}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* 2. Name & Total */}
      <div className="flex-1 min-w-0">
        <div className="flex gap-2 items-center">
          <div className="shrink-0 w-6 flex items-center justify-center">
            <ClubLogo club={p.club} className="w-5 h-5" />
          </div>
          <div className="flex flex-col flex-1 min-w-0 relative">
            <input 
              type="text"
              value={p.name}
              onChange={(e) => {
                onUpdatePlayer(p.id, 'name', e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className={`bg-transparent border-none p-0 font-bold focus:outline-none focus:ring-0 w-full truncate text-sm ${
                isDarkMode ? 'text-slate-200' : 'text-slate-900'
              }`}
              autoComplete="off"
            />
            <p className="text-[10px] text-slate-500 font-mono leading-none">Tot: {calculatePlayerTotal(p).toFixed(1)}</p>
            
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className={`absolute left-0 right-0 top-full mt-1 rounded-lg border shadow-xl z-50 overflow-hidden ${
                    isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  {suggestions.map(s => (
                    <button
                      key={s}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectSuggestion(s);
                      }}
                      className={`w-full text-left px-3 py-2 text-[10px] font-bold flex items-center gap-2 transition-colors ${
                        isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="shrink-0 w-4 h-4 flex items-center justify-center">
                        <ClubLogo club={SERIE_A_PLAYER_DATABASE[s]?.club} className="w-3.5 h-3.5" />
                      </div>
                      <span className="flex-1 truncate">{s}</span>
                      <span className="opacity-50 text-[8px] uppercase tracking-tighter shrink-0">{SERIE_A_PLAYER_DATABASE[s]?.club}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 3. Vote */}
      <div className="flex flex-col items-center">
        <span className="text-[7px] font-bold text-slate-500 uppercase">Voto</span>
        <input 
          type="number" 
          step="0.5"
          value={p.vote}
          onChange={(e) => onUpdatePlayer(p.id, 'vote', parseFloat(e.target.value) || 0)}
          className="w-10 h-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded text-center text-xs font-bold text-emerald-500 dark:text-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-inner"
        />
      </div>

      {/* 4. Stats Sequence: G - GS - RS - A - RP */}
      <div className="flex items-center gap-1">
          <CompactEvent label="G" val={p.goals} onChange={v => onUpdatePlayer(p.id, 'goals', v)} color="text-emerald-500" isDarkMode={isDarkMode} />
          <CompactEvent label="GS" val={p.goalsConceded} onChange={v => onUpdatePlayer(p.id, 'goalsConceded', v)} color="text-red-500" isDarkMode={isDarkMode} />
          <CompactEvent label="RS" val={p.penaltiesMissed} onChange={v => onUpdatePlayer(p.id, 'penaltiesMissed', v)} color="text-orange-500" isDarkMode={isDarkMode} />
          <CompactEvent label="A" val={p.ownGoals} onChange={v => onUpdatePlayer(p.id, 'ownGoals', v)} color="text-orange-500" isDarkMode={isDarkMode} />
          <CompactEvent label="RP" val={p.penaltiesSaved} onChange={v => onUpdatePlayer(p.id, 'penaltiesSaved', v)} color="text-sky-500" isDarkMode={isDarkMode} />
      </div>
      
      {/* 5. Cards */}
      <div className="flex items-center gap-1">
        <div className="flex flex-col items-center">
          <span className="text-[7px] font-bold text-slate-500 uppercase">A</span>
          <button 
            onClick={() => onUpdatePlayer(p.id, 'yellowCard', !p.yellowCard)}
            className={`w-3 h-5 rounded-sm border transition-all ${
              p.yellowCard 
                ? 'bg-amber-400 border-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.2)]' 
                : (isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200')
            }`}
          />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[7px] font-bold text-slate-500 uppercase">E</span>
          <button 
            onClick={() => onUpdatePlayer(p.id, 'redCard', !p.redCard)}
            className={`w-3 h-5 rounded-sm border transition-all ${
              p.redCard 
                ? 'bg-red-500 border-red-600 shadow-[0_0_8px_rgba(239,68,68,0.2)]' 
                : (isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200')
            }`}
          />
        </div>
      </div>

      {/* 6. Captain */}
      <button 
        onClick={() => onUpdatePlayer(p.id, 'isCaptain', !p.isCaptain)}
        className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-all ml-1 ${
          p.isCaptain 
            ? 'border-amber-500 bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
            : (isDarkMode ? 'border-slate-800 text-slate-500 hover:border-slate-700' : 'border-slate-200 text-slate-400 hover:border-slate-300')
        }`}
        title="Capitano"
      >
        <span className="text-[11px] font-black leading-none">C</span>
      </button>
    </div>
  );
}

function TeamDetails({ team, calc, opponentCalc, onUpdatePlayer, onUpdateTeamName, onUpdateFormation, isDarkMode }: { 
  team: Team, 
  calc: TeamCalculations, 
  opponentCalc: TeamCalculations,
  onUpdatePlayer: (id: string, field: keyof Player, val: any) => void,
  onUpdateTeamName: (name: string) => void,
  onUpdateFormation: (formation: string) => void,
  isDarkMode: boolean
}) {
  const formations = ['3-4-3', '3-5-2', '3-6-1', '4-3-3', '4-4-2', '4-5-1', '5-3-2', '5-4-1'];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500 shrink-0" />
            <input 
              type="text"
              value={team.name}
              onChange={(e) => onUpdateTeamName(e.target.value)}
              className="bg-transparent border-none p-0 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-0 w-full"
              placeholder="Nome Squadra"
            />
            {team.isHome && (
              <span className="shrink-0 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                CASA
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-slate-500 shrink-0" />
                  <div className="flex flex-wrap gap-1">
                    {formations.map((form) => (
                      <button
                        key={form}
                        onClick={() => onUpdateFormation(form)}
                        className={`px-2 py-1 rounded text-[10px] font-black tracking-tighter transition-all border ${
                          team.formation === form 
                            ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                            : (isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900')
                        }`}
                      >
                        {form}
                      </button>
                    ))}
                  </div>
        </div>
      </div>

      <div className="space-y-2">
        {team.players.map(p => (
          <MatchPlayerRow 
            key={p.id}
            p={p}
            onUpdatePlayer={onUpdatePlayer}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>

      <div className={`p-6 rounded-2xl border space-y-3 transition-colors ${isDarkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Dettaglio Registro</h4>
        <div className="space-y-1 text-sm">
          <CalcRow label="Punti Base" val={calc.basePoints.toFixed(1)} sub={calc.formulaDetails.basePoints} isDarkMode={isDarkMode} />
          <CalcRow label="Bonus/Malus Eventi" val={calc.eventsPoints.toFixed(1)} sub={calc.formulaDetails.eventsPoints} isDarkMode={isDarkMode} />
          <CalcRow label="Modificatore DIF" val={calc.modifiers.dfModifier.toFixed(1)} sub={calc.formulaDetails.dfModifier} isDarkMode={isDarkMode} />
          <CalcRow label="Modificatore CC" val={calc.modifiers.mfModifier.toFixed(1)} sub={calc.formulaDetails.mfModifier} isDarkMode={isDarkMode} />
          <CalcRow label="Bonus POR" val={calc.modifiers.gkBonus.toFixed(1)} sub={calc.formulaDetails.gkBonus} isDarkMode={isDarkMode} />
          <CalcRow label="Bonus ATT" val={calc.modifiers.fwBonus.toFixed(1)} sub={calc.formulaDetails.fwBonus} isDarkMode={isDarkMode} />
          <CalcRow label="Capitano" val={calc.captainEffect.toFixed(1)} sub={calc.formulaDetails.captainEffect} isDarkMode={isDarkMode} />
          <CalcRow label="Ammonizioni" val={calc.yellowCardsMalus.toFixed(1)} sub={calc.formulaDetails.yellowCards} isDarkMode={isDarkMode} />
          <CalcRow label="Espulsioni" val={calc.redCardsMalus.toFixed(1)} sub={calc.formulaDetails.redCards} isDarkMode={isDarkMode} />
          {calc.formulaDetails.numPlayersMalus !== 'Nessuno' && (
            <CalcRow label="Punti Ufficio" val={calc.numPlayersMalus.toFixed(1)} sub={calc.formulaDetails.numPlayersMalus} isDarkMode={isDarkMode} />
          )}
          <CalcRow label="Bonus Casa" val={calc.homeBonus.toFixed(1)} sub={calc.formulaDetails.homeBonus} isDarkMode={isDarkMode} />
          {calc.isUnder60 && <div className="text-red-400 text-[10px] font-bold uppercase mt-2">Sotto 60: +1 GOL Avversario</div>}
          <div className={`pt-2 border-t flex justify-between font-bold text-emerald-400 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <span>TOTALE</span>
            <span>{calc.totalScore.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompactEvent({ label, val, onChange, color, isDarkMode }: { label: string, val: number, onChange: (v: number) => void, color: string, isDarkMode: boolean }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`text-[7px] font-bold uppercase ${color}`}>{label}</span>
      <div className={`flex items-center rounded overflow-hidden w-10 h-6 shadow-inner border transition-colors ${isDarkMode ? 'bg-slate-950 border-slate-700' : 'bg-white border-slate-200'}`}>
        <button 
          onClick={() => onChange(Math.max(0, val - 1))} 
          className={`flex-1 h-full transition-colors flex items-center justify-center ${isDarkMode ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-slate-50 text-slate-400'}`}
        >
          <Minus className="w-2.5 h-2.5"/>
        </button>
        <span className={`w-3.5 text-center text-[10px] font-mono font-black border-x leading-none transition-colors ${isDarkMode ? 'border-slate-800/50 bg-slate-900/30 text-slate-100' : 'border-slate-100 bg-slate-50 text-slate-900'}`}>
          {val}
        </span>
        <button 
          onClick={() => onChange(val + 1)} 
          className={`flex-1 h-full transition-colors flex items-center justify-center ${isDarkMode ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-slate-50 text-slate-400'}`}
        >
          <Plus className="w-2.5 h-2.5"/>
        </button>
      </div>
    </div>
  );
}

function CalcRow({ label, val, sub, isDarkMode }: { label: string, val: string, sub?: string, isDarkMode: boolean }) {
  return (
    <div className={`flex flex-col py-2 border-b last:border-0 group ${isDarkMode ? 'border-slate-800/50' : 'border-slate-100/60'}`}>
      <div className="flex justify-between items-center">
        <span className="text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-tight">{label}</span>
        <span className={`font-mono font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{val}</span>
      </div>
      {sub && (
        <div className="mt-1 flex items-start gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
          <Info className="w-2.5 h-2.5 mt-0.5 text-emerald-500 shrink-0" />
          <span className="text-[10px] text-slate-500 font-mono leading-relaxed break-all">
            {sub}
          </span>
        </div>
      )}
    </div>
  );
}

function DashboardView({ 
  lastMatches, 
  currentMatchday, 
  onStartMatch,
  onChangeMatchday,
  totalMatchdays,
  isDarkMode,
  standings
}: { 
  lastMatches: HistoricalMatch[], 
  currentMatchday: Matchday, 
  onStartMatch: (m: UpcomingMatch) => void,
  onChangeMatchday: (id: number) => void,
  totalMatchdays: number,
  isDarkMode: boolean,
  standings: Standing[]
}) {
  const podium = standings.slice(0, 3);
  const lastTeam = standings.length > 3 ? standings[standings.length - 1] : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20">
      <div className="px-2">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Panoramica</h2>
        <p className="text-slate-500 font-medium text-sm lg:text-base">Ultimi risultati e prossimi incontri</p>
      </div>

      {/* Classifica Flash */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-1">
        {standings.length > 0 ? (
          <>
            <div className={`col-span-1 md:col-span-3 p-6 rounded-[2.5rem] border flex flex-col md:flex-row items-center gap-8 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex items-center gap-4 shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Podio</h3>
                  <p className="text-[10px] text-slate-400 font-medium uppercase">I primi tre della classe</p>
                </div>
              </div>

              <div className="flex-1 flex gap-4 w-full overflow-x-auto no-scrollbar pb-2 md:pb-0">
                {podium.map((team, idx) => (
                  <div key={team.teamName} className={`flex-1 min-w-[140px] p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                    idx === 0 
                      ? (isDarkMode ? 'bg-amber-500/10 border-amber-500/20 shadow-lg shadow-amber-500/5' : 'bg-amber-50 border-amber-200 shadow-lg shadow-amber-500/10')
                      : (isDarkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-100')
                  }`}>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 ${
                      idx === 0 ? 'bg-amber-500 text-white' : (idx === 1 ? 'bg-slate-400 text-white' : 'bg-orange-500 text-white')
                    }`}>
                      {idx + 1}°
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className={`text-[11px] font-black uppercase truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{team.teamName}</span>
                      <span className="text-[10px] font-mono text-slate-500 leading-none">{team.points} PT</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-6 rounded-[2.5rem] border flex md:flex-col items-center justify-center gap-4 text-center ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                <ArrowDown className="w-5 h-5" />
              </div>
              <div className="flex flex-col md:items-center min-w-0">
                <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Coda</h3>
                <p className={`text-xs font-black uppercase truncate max-w-full ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{lastTeam ? lastTeam.teamName : (standings[standings.length-1]?.teamName || '-')}</p>
                <span className="text-[10px] font-mono text-slate-500 mt-0.5">{(lastTeam || standings[standings.length-1])?.points || 0} PT</span>
              </div>
            </div>
          </>
        ) : (
          <div className={`col-span-full p-10 rounded-[2.5rem] border border-dashed text-center flex flex-col items-center justify-center gap-3 transition-colors ${
            isDarkMode 
              ? 'bg-slate-900/50 border-slate-800 text-slate-700 shadow-inner' 
              : 'bg-white border-slate-200 text-slate-300 shadow-sm'
          }`}>
            <ListOrdered className="w-8 h-8 opacity-30" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Classifica Generata Dopo il Primo Match</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Prossima Giornata */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {currentMatchday.label}
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={() => onChangeMatchday(Math.max(1, currentMatchday.id - 1))}
                className={`p-1 transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                disabled={currentMatchday.id === 1}
              >
                <ArrowLeftRight className="w-4 h-4 rotate-180" />
              </button>
              <button 
                onClick={() => onChangeMatchday(Math.min(totalMatchdays, currentMatchday.id + 1))}
                className={`p-1 transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                disabled={currentMatchday.id === totalMatchdays}
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {currentMatchday.matches.map(u => (
              <div key={u.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-col gap-4 group shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Inizio ore {u.time}</span>
                  <div className="p-1 px-2 rounded bg-slate-100 dark:bg-slate-800 text-[9px] font-black text-slate-400 uppercase">Match {u.id.split('-').pop()}</div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 text-center font-black text-slate-900 dark:text-white truncate text-sm uppercase">{u.team1Name || 'Squadra 1'}</div>
                  <div className="text-slate-300 dark:text-slate-700 font-black italic">VS</div>
                  <div className="flex-1 text-center font-black text-slate-900 dark:text-white truncate text-sm uppercase">{u.team2Name || 'Squadra 2'}</div>
                </div>
                <button 
                  onClick={() => onStartMatch(u)}
                  className={`w-full py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    isDarkMode 
                      ? 'bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300' 
                      : 'bg-slate-100 hover:bg-emerald-500 hover:text-white text-slate-600'
                  }`}
                >
                  Carica nel Calcolatore
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Ultimi Risultati */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <History className="w-4 h-4" />
              Ultimi Risultati
            </h3>
          </div>
          <div className="space-y-3">
            {lastMatches.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] text-slate-400 dark:text-slate-700 font-black text-[10px] uppercase tracking-widest">
                Nessun risultato disponibile
              </div>
            ) : (
              lastMatches.map(m => (
                <div key={m.id} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-3xl p-5 flex items-center justify-between gap-4 shadow-sm">
                  <div className="flex-1 text-right font-black text-slate-900 dark:text-white truncate text-xs uppercase">{m.team1Name}</div>
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <span className="text-xl font-black text-emerald-500">{m.team1Goals}</span>
                    <span className="text-slate-300 dark:text-slate-700 font-black">-</span>
                    <span className="text-xl font-black text-emerald-500">{m.team2Goals}</span>
                  </div>
                  <div className="flex-1 font-black text-slate-900 dark:text-white truncate text-xs uppercase">{m.team2Name}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HistoryView({ matches, onDelete, isDarkMode }: { matches: HistoricalMatch[], onDelete: (id: string) => void, isDarkMode: boolean }) {
  if (matches.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex flex-col items-center justify-center py-20 rounded-[2.5rem] border border-dashed transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <History className={`w-12 h-12 mb-4 ${isDarkMode ? 'text-slate-700' : 'text-slate-200'}`} />
        <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-sm">Nessun incontro salvato</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Storico Incontri</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {matches.map((match) => (
          <div key={match.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-slate-700 transition-colors group shadow-sm">
            <div className="flex flex-col items-center md:items-start gap-1">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{match.date}</span>
              <div className="flex items-center gap-3">
                {match.winner !== 'Pareggio' && (
                  <div className="p-1 px-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400">
                    VITTORIA {match.winner.toUpperCase()}
                  </div>
                )}
                {match.winner === 'Pareggio' && (
                  <div className={`p-1 px-2 rounded border text-[9px] font-black ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                    PAREGGIO
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-8 md:gap-12">
              <div className="flex flex-col items-center md:items-end w-24 md:w-32">
                <span className={`text-lg font-black text-center md:text-right truncate w-full ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{match.team1Name}</span>
                <span className="text-[10px] font-mono text-slate-500">{match.team1Score.toFixed(1)} pt</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-emerald-500">{match.team1Goals}</span>
                <span className="text-slate-300 dark:text-slate-700 font-black">-</span>
                <span className="text-4xl font-black text-emerald-500">{match.team2Goals}</span>
              </div>

              <div className="flex flex-col items-center md:items-start w-24 md:w-32">
                <span className={`text-lg font-black text-center md:text-left truncate w-full ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{match.team2Name}</span>
                <span className="text-[10px] font-mono text-slate-500">{match.team2Score.toFixed(1)} pt</span>
              </div>
            </div>

            <button 
              onClick={() => onDelete(match.id)}
              className="p-3 rounded-2xl bg-red-500/10 border border-red-500/0 text-red-500/50 hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function StandingsView({ standings, isDarkMode }: { standings: Standing[], isDarkMode: boolean }) {
  if (standings.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex flex-col items-center justify-center py-20 rounded-[2.5rem] border border-dashed transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <Trophy className={`w-12 h-12 mb-4 ${isDarkMode ? 'text-slate-700' : 'text-slate-200'}`} />
        <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-sm">Nessun dato classifica disponibile</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="px-2">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Classifica</h2>
        <p className="text-slate-500 font-medium text-sm lg:text-base">Punteggi e posizioni aggiornate in tempo reale</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-5">Pos</th>
                <th className="px-6 py-5">Squadra</th>
                <th className="px-4 py-5 text-center">G</th>
                <th className="px-4 py-5 text-center text-emerald-500">V</th>
                <th className="px-4 py-5 text-center text-slate-400">P</th>
                <th className="px-4 py-5 text-center text-red-500">S</th>
                <th className="px-4 py-5 text-center">GF</th>
                <th className="px-4 py-5 text-center">GS</th>
                <th className="px-4 py-5 text-center text-white">DR</th>
                <th className="px-6 py-5 text-right font-black text-emerald-400 text-xs">Punti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {standings.map((team, index) => (
                <tr key={team.teamName} className={`hover:bg-slate-800/30 transition-colors group border-l-2 ${CLUB_COLORS[team.teamName.toUpperCase().trim()]?.replace('text-', 'border-') || 'border-transparent'}`}>
                  <td className="px-6 py-5">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-black ${
                      index === 0 ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' :
                      index === 1 ? 'bg-slate-300 text-slate-950 shadow-lg shadow-slate-300/20' :
                      index === 2 ? 'bg-orange-700 text-white shadow-lg shadow-orange-700/20' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <Shield className={`w-4 h-4 ${CLUB_COLORS[team.teamName.toUpperCase().trim()] || (index === 0 ? 'text-amber-400' : 'text-emerald-500')}`} />
                      <span className="font-bold text-slate-100 uppercase tracking-tight">{team.teamName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-center text-sm font-mono text-slate-400">{team.played}</td>
                  <td className="px-4 py-5 text-center text-sm font-mono font-bold text-emerald-500/80">{team.won}</td>
                  <td className="px-4 py-5 text-center text-sm font-mono font-bold text-slate-500">{team.drawn}</td>
                  <td className="px-4 py-5 text-center text-sm font-mono font-bold text-red-500/80">{team.lost}</td>
                  <td className="px-4 py-5 text-center text-sm font-mono text-slate-400">{team.goalsFor}</td>
                  <td className="px-4 py-5 text-center text-sm font-mono text-slate-400">{team.goalsAgainst}</td>
                  <td className="px-4 py-5 text-center text-sm font-mono font-bold text-white">{team.goalsFor - team.goalsAgainst}</td>
                  <td className="px-6 py-5 text-right">
                    <span className="text-xl font-black text-emerald-400 drop-shadow-sm">{team.points}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

const SQUAD_LIMITS: Record<Role, number> = {
  POR: 3,
  DIF: 8,
  CC: 8,
  ATT: 6
};

const CLUB_LOGOS: Record<string, string> = {
  'ATALANTA': 'https://upload.wikimedia.org/wikipedia/it/6/66/Atalanta_BC.svg',
  'BOLOGNA': 'https://upload.wikimedia.org/wikipedia/it/5/5b/Bologna_F.C._1909_logo.svg',
  'CAGLIARI': 'https://upload.wikimedia.org/wikipedia/it/6/61/Cagliari_Calcio_1920_logo.svg',
  'COMO': 'https://upload.wikimedia.org/wikipedia/it/0/09/Como_1907_logo.svg',
  'EMPOLI': 'https://upload.wikimedia.org/wikipedia/it/1/12/Empoli_F.C._logo.svg',
  'FIORENTINA': 'https://upload.wikimedia.org/wikipedia/it/b/ba/ACF_Fiorentina_2022_logo.svg',
  'GENOA': 'https://upload.wikimedia.org/wikipedia/it/6/6c/Genoa_C.F.C._logo.svg',
  'INTER': 'https://upload.wikimedia.org/wikipedia/it/0/05/Inter_Milan_2021_logo.svg',
  'JUVENTUS': 'https://upload.wikimedia.org/wikipedia/it/d/d2/Juventus_Main_Logo_2017.svg',
  'LAZIO': 'https://upload.wikimedia.org/wikipedia/it/c/ce/S.S._Lazio_badge.svg',
  'LECCE': 'https://upload.wikimedia.org/wikipedia/it/c/c6/U.S._Lecce_logo.svg',
  'MILAN': 'https://upload.wikimedia.org/wikipedia/it/d/d0/A.C._Milan_logo.svg',
  'MONZA': 'https://upload.wikimedia.org/wikipedia/it/d/d6/AC_Monza_logo.svg',
  'NAPOLI': 'https://upload.wikimedia.org/wikipedia/it/2/2d/SSC_Napoli_2024.svg',
  'PARMA': 'https://upload.wikimedia.org/wikipedia/it/b/b3/Parma_Calcio_1913_logo.svg',
  'ROMA': 'https://upload.wikimedia.org/wikipedia/it/f/f7/AS_Roma_logo_%282017%29.svg',
  'TORINO': 'https://upload.wikimedia.org/wikipedia/it/2/2e/Torino_FC_Logo.svg',
  'UDINESE': 'https://upload.wikimedia.org/wikipedia/it/c/ce/Udinese_Calcio_logo.svg',
  'VENEZIA': 'https://upload.wikimedia.org/wikipedia/it/3/30/Venezia_FC_2022_logo.svg',
  'VERONA': 'https://upload.wikimedia.org/wikipedia/it/9/92/Helllas_Verona_FC_logo_%282020%29.svg',
};

const CLUB_COLORS: Record<string, string> = {
  'ATALANTA': 'text-blue-500',
  'BOLOGNA': 'text-red-600',
  'CAGLIARI': 'text-red-700',
  'COMO': 'text-blue-600',
  'EMPOLI': 'text-blue-700',
  'FIORENTINA': 'text-purple-600',
  'GENOA': 'text-red-800',
  'INTER': 'text-blue-600',
  'JUVENTUS': 'text-slate-400',
  'LAZIO': 'text-sky-400',
  'LECCE': 'text-yellow-500',
  'MILAN': 'text-red-600',
  'MONZA': 'text-red-500',
  'NAPOLI': 'text-sky-500',
  'PARMA': 'text-yellow-600',
  'ROMA': 'text-red-700',
  'TORINO': 'text-red-900',
  'UDINESE': 'text-slate-500',
  'VENEZIA': 'text-orange-600',
  'VERONA': 'text-yellow-400',
};

function ClubLogo({ club, className = "w-4 h-4" }: { club?: string, className?: string }) {
  const [error, setError] = React.useState(false);
  
  if (!club) return null;
  const normalizedClub = club.toUpperCase().trim();
  const logoUrl = CLUB_LOGOS[normalizedClub];

  if (!logoUrl || error) {
    return (
      <div className={`${className} bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0`}>
        <span className="text-[6px] font-bold opacity-50">{club.substring(0, 2).toUpperCase()}</span>
      </div>
    );
  }

  return (
    <div className={`${className} flex items-center justify-center shrink-0`}>
      <img 
        src={logoUrl} 
        alt={club} 
        className="w-full h-full object-contain"
        referrerPolicy="no-referrer"
        onError={() => setError(true)}
      />
    </div>
  );
}

function AddPlayerForm({ onAdd, disabledRoles = [] }: { onAdd: (name: string, role: Role, club: string, cost: number) => void, disabledRoles?: Role[] }) {
  const [name, setName] = useState('');
  const [club, setClub] = useState('');
  const [role, setRole] = useState<Role>(() => {
    const roles: Role[] = ['POR', 'DIF', 'CC', 'ATT'];
    return roles.find(r => !disabledRoles.includes(r)) || 'DIF';
  });
  const [cost, setCost] = useState<number>(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // Auto-fill logic
  useEffect(() => {
    const searchName = name.trim();
    if (searchName.length < 2) {
      setSuggestions([]);
      return;
    }

    const matches = Object.keys(SERIE_A_PLAYER_DATABASE).filter(p => 
      p.toLowerCase().includes(searchName.toLowerCase())
    );

    setSuggestions(matches.slice(0, 5));

    // Exact match auto-fill
    const exactMatch = Object.keys(SERIE_A_PLAYER_DATABASE).find(p => 
      p.toLowerCase() === searchName.toLowerCase()
    );

    if (exactMatch) {
      const data = SERIE_A_PLAYER_DATABASE[exactMatch];
      setClub(data.club);
      if (!disabledRoles.includes(data.role)) {
        setRole(data.role);
      }
    }
  }, [name, disabledRoles]);

  const selectSuggestion = (playerName: string) => {
    const data = SERIE_A_PLAYER_DATABASE[playerName];
    setName(playerName);
    setClub(data.club);
    setSuggestions([]);
    if (!disabledRoles.includes(data.role)) {
      setRole(data.role);
    }
  };
  
  // Set role if current role becomes disabled
  useEffect(() => {
    if (disabledRoles.includes(role)) {
      const roles: Role[] = ['POR', 'DIF', 'CC', 'ATT'];
      const nextAvailable = roles.find(r => !disabledRoles.includes(r));
      if (nextAvailable) setRole(nextAvailable);
    }
  }, [disabledRoles, role]);

  const { isDarkMode } = (() => {
    // This is a bit of a hack since we don't have isDarkMode here easily, 
    // but we can check the document element class
    return { isDarkMode: document.documentElement.classList.contains('dark') };
  })();

  const handleSubmit = () => {
    if (!name.trim() || disabledRoles.includes(role)) return;
    onAdd(name.trim(), role, club.trim(), cost);
    setName('');
    setClub('');
    setCost(0);
  };

  const isAllFull = disabledRoles.length === 4;

  return (
    <div className={`flex flex-col gap-2 p-3 rounded-xl border transition-all ${
      isAllFull 
        ? (isDarkMode ? 'bg-slate-900 border-slate-800 opacity-50 grayscale' : 'bg-slate-100 border-slate-200 opacity-50 grayscale')
        : (isDarkMode ? 'bg-slate-950/40 border-slate-800/60' : 'bg-slate-50 border-slate-200 focus-within:border-emerald-500/30 transition-colors')
    }`}>
      <div className="flex gap-2 relative">
        <div className="flex-1 relative">
          <input
            disabled={isAllFull}
            className={`w-full border rounded-lg px-3 py-1.5 text-xs outline-none transition-all ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:ring-emerald-500/50' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-emerald-500/20'
            } focus:ring-1 disabled:cursor-not-allowed`}
            placeholder={isAllFull ? "Rosa Completa" : "Calciatore..."}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            autoComplete="off"
          />
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className={`absolute left-0 right-0 top-full mt-1 rounded-lg border shadow-xl z-50 overflow-hidden ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                {suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => selectSuggestion(s)}
                    className={`w-full text-left px-3 py-2 text-[10px] font-bold flex items-center gap-2 transition-colors ${
                      isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="shrink-0 w-4 h-4 flex items-center justify-center">
                      <ClubLogo club={SERIE_A_PLAYER_DATABASE[s]?.club} className="w-3.5 h-3.5" />
                    </div>
                    <span className="flex-1 truncate">{s}</span>
                    <span className="opacity-50 text-[8px] uppercase tracking-tighter shrink-0">{SERIE_A_PLAYER_DATABASE[s]?.club}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="relative">
          <input
            disabled={isAllFull}
            className={`w-24 border rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none transition-all ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:ring-emerald-500/50' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-emerald-500/20'
            } focus:ring-1 disabled:cursor-not-allowed`}
            placeholder={isAllFull ? "-" : "Squadra..."}
            value={club}
            onChange={(e) => setClub(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-4 h-4">
            <ClubLogo club={club} className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`flex rounded-lg p-0.5 border flex-1 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          {(['POR', 'DIF', 'CC', 'ATT'] as Role[]).map(r => {
            const isDisabled = disabledRoles.includes(r);
            return (
              <button
                key={r}
                type="button"
                disabled={isDisabled}
                onClick={() => setRole(r)}
                className={`flex-1 py-1 rounded-md text-[9px] font-black transition-all relative ${
                  role === r 
                    ? 'bg-emerald-500 text-white' 
                    : (isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')
                } ${isDisabled ? 'opacity-20 cursor-not-allowed line-through' : ''}`}
              >
                {r}
              </button>
            );
          })}
        </div>
        <div className={`flex items-center gap-1.5 rounded-lg px-2 py-1 border w-16 transition-all ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } ${isAllFull ? 'opacity-20' : ''}`}>
          <span className="text-[9px] font-black text-slate-400 dark:text-slate-600">CR</span>
          <input 
            type="number"
            disabled={isAllFull}
            className="bg-transparent border-none p-0 w-full text-[10px] font-black text-emerald-500 dark:text-emerald-400 focus:outline-none disabled:cursor-not-allowed"
            value={cost === 0 ? '' : cost}
            placeholder="0"
            onChange={(e) => setCost(parseInt(e.target.value) || 0)}
          />
        </div>
        <button
          type="button"
          disabled={isAllFull || !name.trim()}
          onClick={handleSubmit}
          className={`p-1.5 rounded-lg transition-all active:scale-95 ${
            isAllFull || !name.trim()
              ? 'bg-slate-500 text-slate-800 opacity-20 cursor-not-allowed'
              : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
          }`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function SquadsView({ squads, setSquads, isDarkMode }: { 
  squads: { [key: string]: { players: SquadPlayer[], spentCredits: number } }, 
  setSquads: React.Dispatch<React.SetStateAction<{ [key: string]: { players: SquadPlayer[], spentCredits: number } }>>,
  isDarkMode: boolean
}) {
  const [editingTeam, setEditingTeam] = useState<string | null>(null);

  const teamNames = Object.keys(squads);

  const addPlayer = (teamName: string, name: string, role: Role, club: string, cost: number) => {
    const roleCount = squads[teamName].players.filter(p => p.role === role).length;
    if (roleCount >= SQUAD_LIMITS[role]) return;

    setSquads(prev => ({
      ...prev,
      [teamName]: {
        ...prev[teamName],
        players: [...prev[teamName].players, { 
          id: crypto.randomUUID(), 
          name, 
          role, 
          club,
          cost 
        }]
      }
    }));
  };

  const removePlayer = (teamName: string, playerId: string) => {
    setSquads(prev => ({
      ...prev,
      [teamName]: {
        ...prev[teamName],
        players: prev[teamName].players.filter(p => p.id !== playerId)
      }
    }));
  };

  const updatePlayer = (teamName: string, playerId: string, field: keyof SquadPlayer, value: any) => {
    setSquads(prev => ({
      ...prev,
      [teamName]: {
        ...prev[teamName],
        players: prev[teamName].players.map(p => p.id === playerId ? { ...p, [field]: value } : p)
      }
    }));
  };

  const updateSpentCredits = (teamName: string, value: number) => {
    setSquads(prev => ({
      ...prev,
      [teamName]: {
        ...prev[teamName],
        spentCredits: value
      }
    }));
  };

  const addTeam = () => {
    const newName = `Nuova Squadra ${Object.keys(squads).length + 1}`;
    setSquads(prev => ({
      ...prev,
      [newName]: { players: [], spentCredits: 0 }
    }));
    setEditingTeam(newName);
  };

  const deleteTeam = (teamName: string) => {
    if (confirm(`Sei sicuro di voler eliminare la squadra "${teamName}"?`)) {
      setSquads(prev => {
        const { [teamName]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const renameTeam = (oldName: string, newName: string) => {
    const trimmedNewName = newName.trim();
    if (!trimmedNewName || oldName === trimmedNewName) {
      setEditingTeam(null);
      return;
    }
    
    // Prevent overwriting existing team
    if (squads[trimmedNewName]) {
      setEditingTeam(null);
      return;
    }

    setSquads(prev => {
      const { [oldName]: data, ...rest } = prev;
      return {
        ...rest,
        [trimmedNewName]: data
      };
    });
    setEditingTeam(null);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const importExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

        const newSquads: { [key: string]: { players: SquadPlayer[], spentCredits: number } } = {};
        
        // Skip header if it looks like one
        let startIdx = 0;
        if (data[0] && (data[0][0]?.toString().toLowerCase().includes('squadra') || data[0][1]?.toString().toLowerCase().includes('giocatore') || data[0][0]?.toString().toLowerCase().includes('team'))) {
          startIdx = 1;
        }

        for (let i = startIdx; i < data.length; i++) {
          const row = data[i];
          if (!row || row.length < 2) continue;
          const team = row[0]?.toString().trim();
          const player = row[1]?.toString().trim();
          const role = (row[2]?.toString().trim().toUpperCase() as Role) || 'DIF';
          const cost = parseInt(row[3]?.toString()) || 0;
          const club = row[4]?.toString().trim() || '';

          if (team && player) {
            if (!newSquads[team]) newSquads[team] = { players: [], spentCredits: 0 };
            newSquads[team].players.push({
              id: crypto.randomUUID(),
              name: player,
              role: ['POR', 'DIF', 'CC', 'ATT'].includes(role) ? role : 'DIF',
              club: club,
              cost: cost
            });
          }
        }

        if (Object.keys(newSquads).length > 0) {
          if (confirm(`Trovate ${Object.keys(newSquads).length} squadre e ${Object.values(newSquads).reduce((acc, s) => acc + s.players.length, 0)} giocatori. Vuoi sovrascrivere le rose attuali?`)) {
            setSquads(newSquads);
            alert("Rose caricate con successo!");
          }
        } else {
          alert("Nessun dato valido trovato. Usa un file Excel con colonne: 'Squadra', 'Giocatore', 'Ruolo', 'Costo', 'Squadra Serie A'.");
        }
      } catch (err) {
        alert("Errore durante il caricamento del file.");
      }
    };
    reader.readAsBinaryString(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Le Rose</h2>
          <p className="text-slate-500 font-medium text-xs">Componenti e budget delle squadre</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={addTeam}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border shadow-lg group ${isDarkMode ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-100'}`}
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Aggiungi Squadra</span>
          </button>
          <label className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all border shadow-lg group ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200'}`}>
            <FileUp className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Excel</span>
            <input type="file" accept=".xlsx, .xls" onChange={importExcel} className="hidden" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {teamNames.map((teamName) => (
          <div key={teamName} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-fit shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/40">
              <div className="flex items-center justify-between mb-3 gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                  {editingTeam === teamName ? (
                    <input
                      autoFocus
                      className={`border-none rounded px-2 py-0.5 text-sm font-black uppercase italic outline-none ring-1 ring-emerald-500 w-full ${
                        isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'
                      }`}
                      defaultValue={teamName}
                      onBlur={(e) => renameTeam(teamName, e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && renameTeam(teamName, e.currentTarget.value)}
                    />
                  ) : (
                    <h3 
                      className={`text-sm font-black uppercase italic tracking-tight cursor-pointer hover:text-emerald-400 transition-colors truncate min-w-0 ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}
                      onClick={() => setEditingTeam(teamName)}
                    >
                      {teamName}
                    </h3>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-white border border-slate-200 text-slate-500 shadow-sm'
                  }`}>
                    {squads[teamName].players.length}
                  </div>
                  <button 
                    onClick={() => deleteTeam(teamName)}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 mb-3">
                <div className={`flex items-center justify-between px-3 py-2 rounded-xl border ${
                  isDarkMode ? 'bg-slate-900/50 border-slate-800/50' : 'bg-white border-slate-100 shadow-sm'
                }`}>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-tighter">Budget Speso</span>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs font-black ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        {squads[teamName].players.reduce((acc, p) => acc + p.cost, 0)}
                      </span>
                      <span className="text-[8px] font-black text-slate-400">CR</span>
                    </div>
                  </div>
                  <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-tighter">Rimanenti</span>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs font-black ${
                        (260 - squads[teamName].players.reduce((acc, p) => acc + p.cost, 0)) < 0 
                          ? 'text-red-500' 
                          : (isDarkMode ? 'text-white' : 'text-slate-900')
                      }`}>
                        {260 - squads[teamName].players.reduce((acc, p) => acc + p.cost, 0)}
                      </span>
                      <span className="text-[8px] font-black text-slate-400">CR</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 space-y-4">
              <div className="space-y-4 pr-0.5">
                {(['POR', 'DIF', 'CC', 'ATT'] as Role[]).map(role => {
                  const players = squads[teamName].players.filter(p => p.role === role);
                  if (players.length === 0) return null;
                  return (
                    <div key={role} className="space-y-1.5">
                      <div className="flex items-center gap-1.5 px-1">
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm border ${
                          role === 'POR' ? (isDarkMode ? 'bg-amber-500/20 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-100') :
                          role === 'DIF' ? (isDarkMode ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100') :
                          role === 'CC' ? (isDarkMode ? 'bg-blue-500/20 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-100') :
                          (isDarkMode ? 'bg-red-500/20 text-red-400 border-red-500/20' : 'bg-red-50 text-red-600 border-red-100')
                        }`}>
                          {role === 'POR' ? 'P' : role === 'DIF' ? 'D' : role === 'CC' ? 'C' : 'A'}
                        </span>
                        <span className={`text-[8px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          ({players.length}/{SQUAD_LIMITS[role]})
                        </span>
                        <div className={`h-px flex-1 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                      </div>
                      <div className="space-y-1">
                        {players.map((player) => (
                          <div key={player.id} className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border group/item transition-all ${
                            isDarkMode 
                              ? 'bg-slate-950/50 border-slate-800/60 hover:bg-slate-800/40' 
                              : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                          }`}>
                            <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
                              <div className="shrink-0 flex items-center justify-center w-6 h-6">
                                <ClubLogo club={player.club} className="w-5 h-5" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className={`text-xs font-bold truncate ${
                                  isDarkMode ? 'text-slate-100' : 'text-slate-900'
                                }`}>{player.name}</span>
                                {player.club && (
                                  <span className={`text-[10px] uppercase font-black tracking-tighter opacity-70 ${
                                    isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                                  }`}>
                                    {player.club}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-0.5 opacity-60 group-hover/item:opacity-100 transition-opacity">
                                <span className="text-[8px] font-black text-slate-500">CR</span>
                                <input 
                                  type="number"
                                  className={`bg-transparent border-none p-0 w-6 text-[10px] font-black focus:outline-none ${
                                    isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
                                  }`}
                                  value={player.cost}
                                  onChange={(e) => updatePlayer(teamName, player.id, 'cost', parseInt(e.target.value) || 0)}
                                />
                              </div>
                              <button
                                onClick={() => removePlayer(teamName, player.id)}
                                className={`p-0.5 rounded transition-colors ${
                                  isDarkMode ? 'text-slate-700 hover:text-red-500' : 'text-slate-400 hover:text-red-600'
                                }`}
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {squads[teamName].players.length === 0 && (
                  <div className="py-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-700 uppercase tracking-widest leading-loose">
                      Rosa Vuota
                    </p>
                  </div>
                )}
              </div>

              <AddPlayerForm 
                onAdd={(name, role, club, cost) => addPlayer(teamName, name, role, club, cost)} 
                disabledRoles={(['POR', 'DIF', 'CC', 'ATT'] as Role[]).filter(r => 
                  squads[teamName].players.filter(p => p.role === r).length >= SQUAD_LIMITS[r]
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ChampionshipView({ 
  calendar, 
  onUpdateMatch, 
  onBulkUpdate, 
  squads, 
  setSquads,
  currentMatchdayId,
  standings,
  isDarkMode
}: { 
  calendar: Matchday[], 
  onUpdateMatch: (matchdayId: number, matchId: string, updates: Partial<UpcomingMatch>) => void,
  onBulkUpdate?: (newCal: Matchday[]) => void,
  squads: { [key: string]: { players: SquadPlayer[], spentCredits: number } },
  setSquads: React.Dispatch<React.SetStateAction<{ [key: string]: { players: SquadPlayer[], spentCredits: number } }>>,
  currentMatchdayId: number,
  standings: Standing[],
  isDarkMode: boolean
}) {
  const [subTab, setSubTab] = useState<'rose' | 'standings' | 'calendar'>('standings');

  return (
    <div className="space-y-8">
      <div className="px-2">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Campionato</h2>
        <p className="text-slate-500 font-medium text-sm lg:text-base">Tutto il necessario per seguire la stagione</p>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1 scrollbar-hide overflow-x-auto">
        <button
          onClick={() => setSubTab('rose')}
          className={`pb-3 px-4 text-sm font-black uppercase tracking-widest transition-all relative shrink-0 ${
            subTab === 'rose' ? 'text-emerald-500' : (isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-900')
          }`}
        >
          Rose
          {subTab === 'rose' && (
            <motion.div layoutId="subtab" className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setSubTab('standings')}
          className={`pb-3 px-4 text-sm font-black uppercase tracking-widest transition-all relative shrink-0 ${
            subTab === 'standings' ? 'text-emerald-500' : (isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-900')
          }`}
        >
          Classifica
          {subTab === 'standings' && (
            <motion.div layoutId="subtab" className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setSubTab('calendar')}
          className={`pb-3 px-4 text-sm font-black uppercase tracking-widest transition-all relative shrink-0 ${
            subTab === 'calendar' ? 'text-emerald-500' : (isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-900')
          }`}
        >
          Calendario
          {subTab === 'calendar' && (
            <motion.div layoutId="subtab" className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 rounded-full" />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {subTab === 'rose' ? (
          <motion.div
            key="rose"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <SquadsView squads={squads} setSquads={setSquads} isDarkMode={isDarkMode} />
          </motion.div>
        ) : subTab === 'standings' ? (
          <motion.div
            key="standings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <StandingsView standings={standings} isDarkMode={isDarkMode} />
          </motion.div>
        ) : (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <CalendarView 
              calendar={calendar} 
              onUpdateMatch={onUpdateMatch} 
              onBulkUpdate={onBulkUpdate} 
              squads={Object.keys(squads)} 
              currentMatchdayId={currentMatchdayId} 
              isDarkMode={isDarkMode}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CalendarView({ 
  calendar, 
  onUpdateMatch,
  onBulkUpdate,
  squads,
  currentMatchdayId,
  isDarkMode
}: { 
  calendar: Matchday[], 
  onUpdateMatch: (matchdayId: number, matchId: string, updates: Partial<UpcomingMatch>) => void,
  onBulkUpdate?: (newCal: Matchday[]) => void,
  squads: string[],
  currentMatchdayId: number,
  isDarkMode: boolean
}) {
  const [selectedDayId, setSelectedDayId] = useState(currentMatchdayId);
  const currentDay = calendar.find(d => d.id === selectedDayId) || calendar[0];

  // Group days for easier navigation (Groups of 5)
  const groups = [];
  for (let i = 0; i < calendar.length; i += 5) {
    groups.push(calendar.slice(i, i + 5));
  }

  const copyMatchday = () => {
    const text = `${currentDay.label}\n` + 
      currentDay.matches.map((m, i) => {
        const h = m.team1Name || '???';
        const a = m.team2Name || '???';
        return `${i+1}. ${h} vs ${a} (${m.time})`;
      }).join('\n');
    
    navigator.clipboard.writeText(text).then(() => {
      alert("Copiato negli appunti!");
    });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const importExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

        // Format: Day (1-35), Home, Away
        // Example: 1, Team A, Team B
        
        const newCalendar = JSON.parse(JSON.stringify(calendar)) as Matchday[];
        let totalImported = 0;

        let startIdx = 0;
        // Search for header or start directly
        if (data[0] && (data[0][0]?.toString().toLowerCase().includes('giornata') || data[0][1]?.toString().toLowerCase().includes('casa') || data[0][0]?.toString().toLowerCase().includes('day'))) {
          startIdx = 1;
        }

        const matchCounts: Record<number, number> = {};

        for (let i = startIdx; i < data.length; i++) {
          const row = data[i];
          if (!row || row.length < 3) continue;
          
          const rawDay = row[0]?.toString().replace(/[^0-9]/g, '');
          let dayNum = parseInt(rawDay);
          const home = row[1]?.toString().trim();
          const away = row[2]?.toString().trim();
          const time = row[3]?.toString().trim() || '15:00';

          if (dayNum >= 1 && dayNum <= 35 && home && away) {
            const dayIdx = dayNum - 1;
            if (!matchCounts[dayNum]) matchCounts[dayNum] = 0;
            const matchIdx = matchCounts[dayNum];
            
            if (matchIdx < 5) {
              newCalendar[dayIdx].matches[matchIdx] = {
                id: `m-${dayNum}-${matchIdx}`,
                team1Name: home,
                team2Name: away,
                time: time
              };
              matchCounts[dayNum]++;
              totalImported++;
            }
          }
        }

        if (totalImported > 0) {
          if (confirm(`Importati ${totalImported} incontri. Vuoi sovrascrivere il calendario attuale?`)) {
            onBulkUpdate?.(newCalendar);
            alert("Calendario caricato con successo!");
          }
        } else {
          alert("Nessun dato valido trovato. Usa un file Excel con colonne: 'Giornata', 'Casa', 'Trasferta'. Per i file Word, copia e incolla i dati nelle singole giornate.");
        }
      } catch (err) {
        alert("Errore durante il caricamento del file.");
      }
    };
    reader.readAsBinaryString(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <datalist id="squad-list">
        {squads.map(s => <option key={s} value={s} />)}
      </datalist>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tight">Calendario</h2>
          <p className="text-slate-500 font-medium text-sm lg:text-base">Gestione delle 35 giornate di campionato</p>
        </div>
        <div className="flex gap-3">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".xlsx,.xls,.csv" 
              onChange={importExcel}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg border border-slate-700 transition-all active:scale-95"
            >
              <FileUp className="w-4 h-4" />
              Importa Excel
            </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-56 xl:w-72 space-y-6">
          <div className="bg-slate-900 rounded-[2rem] p-4 border border-slate-800 shadow-xl">
             <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
               <ListOrdered className="w-3 h-3" />
               Seleziona Giornata
             </p>
             <div className="space-y-4 max-h-[500px] overflow-y-auto no-scrollbar pr-1">
               {groups.map((group, gIdx) => (
                 <div key={gIdx} className="space-y-1">
                   <div className="px-3 py-1 text-[9px] font-black text-slate-700 uppercase tracking-[0.2em]">{gIdx * 5 + 1} - {Math.min(35, (gIdx + 1) * 5)}</div>
                   {group.map(day => (
                     <button
                       key={day.id}
                       onClick={() => setSelectedDayId(day.id)}
                       className={`w-full group flex items-center justify-between px-4 py-2.5 rounded-xl transition-all font-bold text-sm ${
                         selectedDayId === day.id 
                           ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' 
                           : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                       }`}
                     >
                       <span className="flex items-center gap-2">
                         {day.label}
                         {day.id === currentMatchdayId && (
                           <span className={`w-1.5 h-1.5 rounded-full ${selectedDayId === day.id ? 'bg-slate-950' : 'bg-emerald-500'} animate-pulse`} />
                         )}
                       </span>
                       <span className={`text-[9px] font-black opacity-0 group-hover:opacity-100 transition-opacity ${selectedDayId === day.id ? 'text-slate-900' : 'text-slate-600'}`}>VIEW</span>
                     </button>
                   ))}
                 </div>
               ))}
             </div>
          </div>
          
          {selectedDayId === currentMatchdayId ? (
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3">
              <Star className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-relaxed">
                Questa è la giornata attualmente visualizzata in Dashboard
              </p>
            </div>
          ) : (
             <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
              <Info className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-relaxed">
                Puoi impostare questa come giornata corrente dalla Dashboard
              </p>
            </div>
          )}
        </div>

        {/* Match Editor */}
        <div className="flex-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] rounded-full -translate-y-12 translate-x-12" />
            
            <div className="px-8 py-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between relative">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tight">{currentDay.label}</h3>
                <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Editing Mode • 5 Incontri</span>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6 space-y-2">
              {currentDay.matches.map((match, idx) => (
                <div key={match.id} className="relative group/match p-2 md:p-1 rounded-xl md:rounded-none border border-slate-200 dark:border-slate-800 md:border-none bg-slate-50/30 dark:bg-slate-950/20 md:bg-transparent">
                  <div className="flex items-center gap-2 w-full">
                    <div className={`flex-none px-1.5 py-0.5 rounded border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                      <span className="text-[8px] font-black uppercase tracking-widest">M{idx + 1}</span>
                    </div>

                    <div className="flex-1 flex items-center gap-1 min-w-0">
                      <input 
                        list="squad-list"
                        className={`flex-1 min-w-0 border rounded-lg px-2.5 py-1.5 font-bold uppercase tracking-tight outline-none transition-all text-[10px] ${
                          isDarkMode 
                            ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-800 focus:border-emerald-500 group-hover/match:border-slate-700' 
                            : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-300 focus:border-emerald-500 group-hover/match:border-slate-300'
                        }`}
                        placeholder="Casa..."
                        value={match.team1Name}
                        onChange={(e) => onUpdateMatch(currentDay.id, match.id, { team1Name: e.target.value })}
                      />

                      <div className="flex-none text-[10px] font-black text-slate-400 dark:text-slate-700 italic">VS</div>

                      <input 
                        list="squad-list"
                        className={`flex-1 min-w-0 border rounded-lg px-2.5 py-1.5 font-bold uppercase tracking-tight outline-none transition-all text-[10px] ${
                          isDarkMode 
                            ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-800 focus:border-emerald-500 group-hover/match:border-slate-700' 
                            : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-300 focus:border-emerald-500 group-hover/match:border-slate-300'
                        }`}
                        placeholder="Trasferta..."
                        value={match.team2Name}
                        onChange={(e) => onUpdateMatch(currentDay.id, match.id, { team2Name: e.target.value })}
                      />
                    </div>

                    <div className="flex-none flex items-center">
                      <button 
                        onClick={() => {
                          const t1 = match.team1Name;
                          onUpdateMatch(currentDay.id, match.id, { team1Name: match.team2Name, team2Name: t1 });
                        }}
                        className={`p-1 rounded-lg transition-all sm:opacity-0 group-hover/match:opacity-100 ${
                          isDarkMode ? 'text-slate-600 hover:text-emerald-500' : 'text-slate-400 hover:text-emerald-600'
                        }`}
                      >
                        <ArrowLeftRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  {idx < currentDay.matches.length - 1 && (
                    <div className={`hidden md:block absolute -bottom-1 left-0 w-full h-[1px] ${
                      isDarkMode ? 'bg-slate-800/10' : 'bg-slate-100'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className={`p-6 border border-dashed rounded-[2rem] flex items-center gap-4 text-slate-500 transition-colors ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <Info className={`w-5 h-5 shrink-0 ${isDarkMode ? 'text-emerald-500/50' : 'text-emerald-500'}`} />
                <p className="text-[11px] font-medium leading-relaxed">
                  Tutti i dati inseriti qui verranno salvati automaticamente. 
                  Usa lo <span className={`font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Zoom</span> del browser se vuoi vedere più giornate contemporaneamente.
                </p>
              </div>
              <div className={`p-6 border border-dashed rounded-[2rem] flex items-center gap-4 text-slate-500 transition-colors ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <RefreshCw className={`w-5 h-5 shrink-0 ${isDarkMode ? 'text-emerald-500/50' : 'text-emerald-500'}`} />
                <p className="text-[11px] font-medium leading-relaxed">
                  I nomi delle squadre suggeriti provengono dalla pagina <span className={`font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Rose</span>. Assicurati di averle create!
                </p>
              </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function RulesView({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-12 pb-20"
    >
      <div className="text-left space-y-4 px-2">
        <div className="flex flex-col items-start">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">Regolamento Ufficiale</h2>
          <div className="w-16 h-1 bg-emerald-500 rounded-full mt-2 opacity-50" />
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium">Guida completa ai calcoli e alle dinamiche di FantaCampagnano</p>
      </div>

      <section className="space-y-8">
        <RuleSection title="Composizione e Formazione" icon={<UsersIcon className="w-5 h-5 text-indigo-500 dark:text-indigo-400"/>}>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-10 shadow-sm">
            {/* Top Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                  <UsersIcon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Lega</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-200">10 Squadre Totali</p>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Durata</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-200">35 Giornate</p>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                  <Repeat className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cambi</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-200">5 Sostituzioni</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Squad & Formations */}
              <div className="space-y-10 text-slate-900 dark:text-slate-100">
                {/* Squad Structure */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Shirt className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                    <h4 className="font-bold text-slate-700 dark:text-slate-200 uppercase text-[10px] tracking-widest px-2 py-0.5 bg-indigo-500/10 rounded">Composizione Rosa</h4>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">Ogni squadra deve essere composta da <span className="text-slate-900 dark:text-white font-bold">25 calciatori</span>:</p>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { l: 'POR', v: '3', c: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
                        { l: 'DIF', v: '8', c: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
                        { l: 'CC', v: '8', c: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
                        { l: 'ATT', v: '6', c: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' }
                      ].map(role => (
                        <div key={role.l} className={`p-3 rounded-xl border text-center transition-transform hover:scale-105 duration-200 ${role.c}`}>
                          <p className="text-[10px] font-black uppercase opacity-70 mb-0.5">{role.l}</p>
                          <p className="text-xl font-black">{role.v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Formations Grid */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <LayoutGrid className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                    <h4 className="font-bold text-slate-700 dark:text-slate-200 uppercase text-[10px] tracking-widest px-2 py-0.5 bg-indigo-500/10 rounded">Moduli Consentiti</h4>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {['3-4-3', '3-5-2', '3-6-1', '4-3-3', '4-4-2', '4-5-1', '5-3-2', '5-4-1'].map((modulo) => (
                      <div key={modulo} className="group cursor-default bg-slate-50 dark:bg-slate-950/50 hover:bg-indigo-500/10 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-all text-center">
                        <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 tracking-tighter">{modulo}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Match Lineup */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  <h4 className="font-bold text-slate-700 dark:text-slate-200 uppercase text-[10px] tracking-widest px-2 py-0.5 bg-indigo-500/10 rounded">Schieramento Match</h4>
                </div>
                <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
                  <div className="space-y-8">
                    {/* Titolari Section */}
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-6 rounded-full bg-emerald-500/50" />
                          <h5 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-widest">Titolari</h5>
                        </div>
                        <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">11 GIOCATORI</span>
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          { l: 'POR', v: '1' },
                          { l: 'DIF', v: '3-5' },
                          { l: 'CEN', v: '3-6' },
                          { l: 'ATT', v: '1-3' }
                        ].map(item => (
                          <div key={item.l} className="flex flex-col items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 transition-colors hover:border-slate-200 dark:hover:border-slate-700">
                            <span className="text-[10px] font-bold text-slate-500 mb-1">{item.l}</span>
                            <span className={`text-base font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{item.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Panchina Section */}
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-6 rounded-full bg-amber-500/50" />
                          <h5 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-widest">Panchina</h5>
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">7 GIOCATORI</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-5">
                        {['1 POR', '2 DIF', '2 CC', '2 ATT'].map(item => (
                          <span key={item} className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border shadow-sm ${isDarkMode ? 'text-slate-300 bg-slate-900 border-slate-800' : 'text-slate-600 bg-white border-slate-200'}`}>{item}</span>
                        ))}
                      </div>
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                        <Info className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5 opacity-70" />
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                          <span className="text-indigo-600 dark:text-indigo-300 font-bold">Nota Bene:</span> Si possono schierare un massimo di 7 giocatori, indipendentemente dalla distribuzione nei vari reparti.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RuleSection>

        <RuleSection title="Legenda Interfaccia" icon={<Info className="w-5 h-5 text-sky-500 dark:text-sky-400"/>}>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Guida rapida alle abbreviazioni utilizzate nella riga di ogni calciatore:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <LegendItem label="G" desc="Gol Segnati" color="text-emerald-500" />
              <LegendItem label="GS" desc="Gol Subiti" color="text-red-500" />
              <LegendItem label="RS" desc="Rigori Sbagliati" color="text-orange-500" />
              <LegendItem label="A" desc="Autogol" color="text-orange-500" />
              <LegendItem label="RP" desc="Rigori Parati" color="text-sky-500" />
              <LegendItem label="A" desc="Ammonizione (Card)" color="text-amber-500 dark:text-amber-400" isCard />
              <LegendItem label="E" desc="Espulsione (Card)" color="text-red-500" isCard />
              <LegendItem label="Tot" desc="Punteggio Totale" color={isDarkMode ? "text-white" : "text-slate-900"} />
              <LegendItem label="Voto" desc="Voto in Pagella" color="text-emerald-500 dark:text-emerald-400" />
              <LegendItem label="C" desc="Capitano" color="text-amber-500" />
            </div>
          </div>
        </RuleSection>

        <RuleSection title="Punteggi ed Eventi" icon={<Star className="w-5 h-5 text-amber-500 dark:text-amber-400"/>}>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-4">Evento</th>
                  <th className="pb-4 text-right">Punti</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <TableRow label="Gol" val="+3.0" icon={<Target className="w-4 h-4 text-emerald-500" />} isDarkMode={isDarkMode} />
                <TableRow label="Gol Subito" val="-1.0" icon={<CircleX className="w-4 h-4 text-red-500" />} isDarkMode={isDarkMode} />
                <TableRow label="Rigore Segnato" val="+3.0" icon={<CircleDot className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />} isDarkMode={isDarkMode} />
                <TableRow label="Rigore Parato" val="+3.0" icon={<ShieldCheck className="w-4 h-4 text-sky-500 dark:text-sky-400" />} isDarkMode={isDarkMode} />
                <TableRow label="Rigore Sbagliato" val="-3.0" icon={<Ban className="w-4 h-4 text-orange-500" />} isDarkMode={isDarkMode} />
                <TableRow label="Autogol" val="-3.0" icon={<ShieldX className="w-4 h-4 text-red-600" />} isDarkMode={isDarkMode} />
                <TableRow label="Ammonizione" val="-0.5" icon={<Square className="w-4 h-4 fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400" />} isDarkMode={isDarkMode} />
                <TableRow label="Espulsione" val="-1.0" icon={<Square className="w-4 h-4 fill-red-500 text-red-500" />} isDarkMode={isDarkMode} />
                <TableRow label="Fattore Casa" val="+3.0" icon={<Home className="w-4 h-4 text-slate-400 dark:text-slate-500" />} isDarkMode={isDarkMode} />
              </tbody>
            </table>
          </div>
        </RuleSection>

        <RuleSection title="Bonus Portiere" icon={<Shield className="w-5 h-5 text-sky-500 dark:text-sky-400"/>}>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Bonus assegnato in base al voto del portiere (voto puro, non influenzato dai gol subiti).</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <RangeCard label="Voto 6.5" val="+0.5" color="text-emerald-500 dark:text-emerald-400" isDarkMode={isDarkMode} />
              <RangeCard label="Voto 7.0" val="+1.0" color="text-emerald-500 dark:text-emerald-400" isDarkMode={isDarkMode} />
              <RangeCard label="Voto 7.5" val="+1.5" color="text-emerald-500 dark:text-emerald-400" isDarkMode={isDarkMode} />
              <RangeCard label="Voto 8.0+" val="+2.0" color="text-emerald-500 dark:text-emerald-400" isDarkMode={isDarkMode} />
            </div>
            <div className="mt-4 p-3 bg-red-500/5 dark:bg-red-500/10 border border-red-500/10 dark:border-red-500/20 rounded-xl flex items-center gap-2">
               <Info className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" />
               <p className="text-xs font-bold text-red-500 dark:text-red-400 uppercase">IL BONUS NON VIENE ASSEGNATO SE IL PORTIERE PARA UN RIGORE.</p>
            </div>
          </div>
        </RuleSection>

        <RuleSection title="Modificatore Difesa" icon={<Shield className="w-5 h-5 text-emerald-500"/>}>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Si calcola la media voti reali dei difensori schierati. Il bonus o malus risultante influisce sul punteggio dell'<b>AVVERSARIO</b>.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {[
                { l: "7.00 - 7.25", v: "-5.0" },
                { l: "6.75 - 6.99", v: "-4.0" },
                { l: "6.50 - 6.74", v: "-3.0" },
                { l: "6.25 - 6.49", v: "-2.0" },
                { l: "6.00 - 6.24", v: "-1.0" },
                { l: "5.75 - 5.99", v: "0.0" },
                { l: "5.50 - 5.74", v: "+1.0" },
                { l: "5.25 - 5.49", v: "+2.0" },
                { l: "5.00 - 5.24", v: "+3.0" },
                { l: "< 5.00", v: "+4.0" }
              ].map(range => (
                <RangeCard key={range.l} label={range.l} val={range.v} color={isDarkMode ? "text-slate-200" : "text-slate-900"} isDarkMode={isDarkMode} />
              ))}
            </div>
            <div className={`mt-6 flex flex-col sm:flex-row gap-4 pt-6 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
               <div className={`flex-1 flex items-center gap-3 p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <ArrowUp className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Difesa a 3: Scala verso l'alto</p>
               </div>
               <div className={`flex-1 flex items-center gap-3 p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="w-8 h-8 rounded-full bg-slate-500/10 flex items-center justify-center text-slate-500">
                    <Minus className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Difesa a 4: Punteggio Standard</p>
               </div>
               <div className={`flex-1 flex items-center gap-3 p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Difesa a 5: Scala verso il basso</p>
               </div>
            </div>
          </div>
        </RuleSection>

        <RuleSection title="Modificatore Centrocampo" icon={<Layout className="w-5 h-5 text-indigo-500 dark:text-indigo-400"/>}>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Si calcola la differenza tra la somma voti dei rispettivi centrocampi (i giocatori assenti contano 5.0). Il risultato determina un bonus per la squadra con la somma più alta e un malus per l'altra.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <CCRangeCard diff="1 pt" val="0.5" isDarkMode={isDarkMode} />
              <CCRangeCard diff="2 pt" val="1.0" isDarkMode={isDarkMode} />
              <CCRangeCard diff="3 pt" val="1.5" isDarkMode={isDarkMode} />
              <CCRangeCard diff="4 pt" val="2.0" isDarkMode={isDarkMode} />
              <CCRangeCard diff="5 pt" val="2.5" isDarkMode={isDarkMode} />
              <CCRangeCard diff="6 pt" val="3.0" isDarkMode={isDarkMode} />
              <CCRangeCard diff="7 pt" val="3.5" isDarkMode={isDarkMode} />
              <CCRangeCard diff="8 pt" val="4.0" isDarkMode={isDarkMode} />
            </div>
            <p className="text-[10px] text-slate-500 italic mt-4">* In caso di numero diverso di centrocampisti, si aggiungono "giocatori d'ufficio" da 5.0 per pareggiare il numero (fino al massimo schierato dall'avversario).</p>
          </div>
        </RuleSection>

        <RuleSection title="Bonus Attacco" icon={<Star className="w-5 h-5 text-amber-500 dark:text-amber-400"/>}>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Bonus assegnato agli attaccanti che <b>NON</b> segnano alcun gol.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Voto 6.5</p>
                <p className={`text-xl font-black ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>+0.5</p>
              </div>
              <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Voto 7.0</p>
                <p className={`text-xl font-black ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>+1.0</p>
              </div>
              <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Voto 7.5</p>
                <p className={`text-xl font-black ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>+1.5</p>
              </div>
              <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Voto 8.0+</p>
                <p className={`text-xl font-black ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>+2.0</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-red-500/5 dark:bg-red-500/10 border border-red-500/10 dark:border-red-500/20 rounded-xl flex items-center gap-2">
               <Info className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" />
               <p className="text-xs font-bold text-red-500 dark:text-red-400 uppercase">IL BONUS NON VIENE ASSEGNATO SE L'ATTACCANTE SEGNA UN GOL/RIGORE.</p>
            </div>
          </div>
        </RuleSection>

        <RuleSection title="Soglie Gol" icon={<RefreshCw className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-500'}`}/>}>
           <div className={`border rounded-3xl p-8 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Le soglie determinano il numero di gol segnati da una squadra in base al punteggio totale accumulato (somma tra voti e bonus/malus).</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 text-center">
              <div><p className="text-xs text-slate-500 font-bold uppercase mb-1">&lt; 66</p><p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>0</p><p className="text-[10px] uppercase text-slate-600">GOL</p></div>
              <div><p className="text-xs text-slate-500 font-bold uppercase mb-1">66 - 71.5</p><p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>1</p><p className="text-[10px] uppercase text-slate-600">GOL</p></div>
              <div><p className="text-xs text-slate-500 font-bold uppercase mb-1">72 - 76.5</p><p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>2</p><p className="text-[10px] uppercase text-slate-600">GOL</p></div>
              <div><p className="text-xs text-slate-500 font-bold uppercase mb-1">77 - 80.5</p><p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>3</p><p className="text-[10px] uppercase text-slate-600">GOL</p></div>
              <div><p className="text-xs text-slate-500 font-bold uppercase mb-1">81 - 84.5</p><p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>4</p><p className="text-[10px] uppercase text-slate-600">GOL</p></div>
              <div><p className="text-xs text-slate-500 font-bold uppercase mb-1">85 - 88.5</p><p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>5</p><p className="text-[10px] uppercase text-slate-600">GOL</p></div>
              <div><p className="text-xs text-slate-500 font-bold uppercase mb-1">89 - 92.5</p><p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>6</p><p className="text-[10px] uppercase text-slate-600">GOL</p></div>
              <div><p className="text-xs text-slate-500 font-bold uppercase mb-1">93 - 96.5</p><p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>7</p><p className="text-[10px] uppercase text-slate-600">GOL</p></div>
              <div className={`col-span-full pt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                <p className="text-sm text-emerald-500 font-bold">Vittoria: Necessaria differenza di almeno 3 punti tra le squadre.</p>
                <p className="text-sm text-red-500 font-bold">Malus Sotto 60: Se una squadra fa meno di 60 pt, regala un gol all'avversario.</p>
              </div>
           </div>
          </div>
        </RuleSection>
      </section>
    </motion.div>
  );
}

function RuleSection({ title, children, icon }: { title: string, children: React.ReactNode, icon: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-l-2 border-emerald-500 pl-4 py-1">
        {icon}
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function RuleCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
      <h4 className="font-bold text-slate-900 dark:text-slate-200">{title}</h4>
      {children}
    </div>
  );
}

function TableRow({ label, val, icon, isDarkMode }: { label: string, val: string, icon?: React.ReactNode, isDarkMode: boolean, key?: string | number }) {
  return (
    <tr className={`border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
      <td className="py-3 text-slate-500 dark:text-slate-400 font-medium text-xs">
        <div className="flex items-center gap-3">
          {icon}
          <span>{label}</span>
        </div>
      </td>
      <td className={`py-3 text-right font-mono font-bold text-xs ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{val}</td>
    </tr>
  );
}

function RangeCard({ label, val, color, isDarkMode }: { label: string, val: string, color: string, isDarkMode: boolean, key?: string | number }) {
  return (
    <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center space-y-1 group transition-colors ${
      isDarkMode 
        ? 'bg-slate-950 border-slate-800 hover:border-emerald-500/30' 
        : 'bg-slate-50 border-slate-100 hover:border-emerald-500/20'
    }`}>
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{label}</p>
      <p className={`text-xl font-black ${color}`}>{val}</p>
    </div>
  );
}

function CCRangeCard({ diff, val, isDarkMode }: { diff: string, val: string, isDarkMode: boolean, key?: string | number }) {
  return (
    <div className={`p-3 rounded-2xl border flex justify-between items-center group transition-colors ${
      isDarkMode
        ? 'bg-slate-950 border-slate-800 hover:border-emerald-500/50'
        : 'bg-slate-50 border-slate-100 hover:border-emerald-500/30'
    }`}>
      <div className="flex flex-col">
        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">Diff.</span>
        <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{diff}</span>
      </div>
      <div className="text-right">
        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">Bonus/Malus</span>
        <p className={`text-sm font-black ${isDarkMode ? 'text-emerald-400' : 'text-emerald-500'}`}>+{val} / -{val}</p>
      </div>
    </div>
  );
}

function LegendItem({ label, desc, color, isCard }: { label: string, desc: string, color: string, isCard?: boolean }) {
  const { isDarkMode } = (() => {
    return { isDarkMode: document.documentElement.classList.contains('dark') };
  })();

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors shadow-sm ${isDarkMode ? 'bg-slate-950 border-slate-800/50' : 'bg-white border-slate-100'}`}>
      <div className={`w-8 h-8 shrink-0 flex items-center justify-center rounded text-[11px] font-black ${color} ${isCard ? (isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-slate-100 border border-slate-200') : (isDarkMode ? 'bg-slate-900' : 'bg-slate-50')}`}>
        {label}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black text-slate-500 uppercase leading-none mb-1 truncate">{desc}</p>
        <p className={`text-[11px] font-bold ${color}`}>{label}</p>
      </div>
    </div>
  );
}

function MiniLegend({ label, desc, color, isCard }: { label: string, desc: string, color: string, isCard?: boolean }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800/50 shadow-sm dark:shadow-none">
      <div className={`w-5 h-5 flex items-center justify-center rounded-[4px] text-[8px] font-black ${color} ${isCard ? 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700' : 'bg-slate-50 dark:bg-slate-900'}`}>
        {label}
      </div>
      <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter">{desc}</span>
    </div>
  );
}

const Users = (props: any) => <User {...props} />;
