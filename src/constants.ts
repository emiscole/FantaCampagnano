/**
 * Regole Fantacampagnano - Constants and Logic
 */

import { Team, TeamCalculations, Role, Player, MatchResult } from './types';

export const MODULI_POSSIBILI = [
  '3-4-3', '3-5-2', '3-6-1', '4-3-3', '4-4-2', '4-5-1', '5-3-2', '5-4-1'
];

export const FORMATION_ROLES: Record<string, Role[]> = {
  '3-4-3': ['POR', 'DIF', 'DIF', 'DIF', 'CC', 'CC', 'CC', 'CC', 'ATT', 'ATT', 'ATT'],
  '3-5-2': ['POR', 'DIF', 'DIF', 'DIF', 'CC', 'CC', 'CC', 'CC', 'CC', 'ATT', 'ATT'],
  '3-6-1': ['POR', 'DIF', 'DIF', 'DIF', 'CC', 'CC', 'CC', 'CC', 'CC', 'CC', 'ATT'],
  '4-3-3': ['POR', 'DIF', 'DIF', 'DIF', 'DIF', 'CC', 'CC', 'CC', 'ATT', 'ATT', 'ATT'],
  '4-4-2': ['POR', 'DIF', 'DIF', 'DIF', 'DIF', 'CC', 'CC', 'CC', 'CC', 'ATT', 'ATT'],
  '4-5-1': ['POR', 'DIF', 'DIF', 'DIF', 'DIF', 'CC', 'CC', 'CC', 'CC', 'CC', 'ATT'],
  '5-3-2': ['POR', 'DIF', 'DIF', 'DIF', 'DIF', 'DIF', 'CC', 'CC', 'CC', 'ATT', 'ATT'],
  '5-4-1': ['POR', 'DIF', 'DIF', 'DIF', 'DIF', 'DIF', 'CC', 'CC', 'CC', 'CC', 'ATT'],
};

export const GOAL_THRESHOLDS = [
  { threshold: 66, goals: 0 },
  { threshold: 72, goals: 1 }, // 66 - 71.5
  { threshold: 77, goals: 2 }, // 72 - 76.5
  { threshold: 81, goals: 3 }, // 77 - 80.5
  { threshold: 85, goals: 4 }, // 81 - 84.5
  { threshold: 89, goals: 5 }, // 85 - 88.5
  { threshold: 93, goals: 6 }, // 89 - 92.5
  { threshold: 97, goals: 7 }  // 93 - 96.5
];

export const calculateGoals = (score: number): number => {
  if (score < 66) return 0;
  if (score < 72) return 1;
  if (score < 77) return 2;
  if (score < 81) return 3;
  if (score < 85) return 4;
  if (score < 89) return 5;
  if (score < 93) return 6;
  return 7;
};

export const calculatePlayerTotal = (p: Player): number => {
  let total = p.vote;
  
  // Event-based scores
  total += p.goals * 3;
  total -= p.goalsConceded * 1;
  total -= p.ownGoals * 3;
  total += p.penaltiesSaved * 3;
  
  // "Rigore Sbagliato = -3 punti"
  total -= p.penaltiesMissed * 3;

  if (p.yellowCard) total -= 0.5;
  if (p.redCard) total -= 1;

  return total;
};

export const calculateCaptainBonus = (p: Player): number => {
  if (!p.isCaptain) return 0;
  const v = p.vote;
  if (v < 5) return -1;
  if (v < 6) return -0.5;
  if (v <= 6.5) return 0.5;
  return 1;
};

export const calculateGKBonus = (p: Player): number => {
  if (p.penaltiesSaved > 0) return 0;
  const vote = p.vote;
  if (vote >= 8) return 2;
  if (vote >= 7.5) return 1.5;
  if (vote >= 7) return 1;
  if (vote >= 6.5) return 0.5;
  return 0;
};

export const calculateFWBonus = (p: Player): number => {
  if (p.role !== 'ATT') return 0;
  // Bonus assigned if player doesn't score goal
  if (p.goals > 0) return 0;
  
  if (p.vote >= 8) return 2;
  if (p.vote >= 7.5) return 1.5;
  if (p.vote >= 7) return 1;
  if (p.vote >= 6.5) return 0.5;
  return 0;
};

export const calculateDFModifierIndex = (avg: number): number => {
  if (avg < 5) return 4;
  if (avg < 5.25) return 3;
  if (avg < 5.5) return 2;
  if (avg < 5.75) return 1;
  if (avg < 6) return 0;
  if (avg < 6.25) return -1;
  if (avg < 6.5) return -2;
  if (avg < 6.75) return -3;
  if (avg < 7) return -4;
  return -5;
};

export const calculateMatch = (teamA: Team, teamB: Team): MatchResult => {
  const calcTeam = (t: Team): TeamCalculations => {
    let base = 0;
    let eventsScore = 0;
    let yellowMalus = 0;
    let redMalus = 0;
    
    const starters = t.players.slice(0, 11);
    const activePlayers = starters.filter(p => !p.isDNP);
    const missingCount = 11 - activePlayers.length;
    
    // "SI ASSEGNA 4 NEL TOTALE" (for 10 or 9 players, the total points for missing players is 4)
    let officeTotalPoints = 0;
    let officeDetail = 'Nessuno';
    
    if (missingCount === 1) {
      officeTotalPoints = 4;
      officeDetail = '1 Assente: +4.0 Ufficio';
    } else if (missingCount >= 2) {
      officeTotalPoints = 4; // 4 + 0 as per user request
      officeDetail = `${missingCount} Assenti: +4.0 Ufficio (4+0)`;
    }

    let goalsInfo = activePlayers.filter(p => p.goals > 0).map(p => `${p.name}: +${p.goals * 3}`).join(', ');
    let concededInfo = activePlayers.filter(p => p.goalsConceded > 0).map(p => `${p.name}: -${p.goalsConceded * 1}`).join(', ');
    let othersInfo = activePlayers.filter(p => p.ownGoals > 0 || p.penaltiesSaved > 0 || p.penaltiesMissed > 0)
      .map(p => {
        let items = [];
        if (p.ownGoals > 0) items.push(`Autogol: -${p.ownGoals * 3}`);
        if (p.penaltiesSaved > 0) items.push(`Rig. Parato: +${p.penaltiesSaved * 3}`);
        if (p.penaltiesMissed > 0) items.push(`Rig. Sbagliato: -${p.penaltiesMissed * 3}`);
        return `${p.name}(${items.join(' ')})`;
      }).join(', ');

    activePlayers.forEach(p => {
      base += p.vote;
      
      // Event-based scores
      let pEvents = 0;
      pEvents += p.goals * 3;
      pEvents -= p.goalsConceded * 1;
      pEvents -= p.ownGoals * 3;
      pEvents += p.penaltiesSaved * 3;
      pEvents -= p.penaltiesMissed * 3;
      eventsScore += pEvents;

      if (p.yellowCard) yellowMalus -= 0.5;
      if (p.redCard) redMalus -= 1;
    });

    const captain = activePlayers.find(p => p.isCaptain);
    const capEffect = captain ? calculateCaptainBonus(captain) : 0;
    const eventDetail = [
      goalsInfo ? `Gol: ${goalsInfo}` : '',
      concededInfo ? `Subiti: ${concededInfo}` : '',
      othersInfo ? `Altri: ${othersInfo}` : ''
    ].filter(Boolean).join(' | ') || 'Nessuno';

    return {
      basePoints: base + officeTotalPoints,
      eventsPoints: eventsScore,
      yellowCardsMalus: yellowMalus,
      redCardsMalus: redMalus,
      bonuses: 0,
      maluses: 0,
      modifiers: { gkBonus: 0, dfModifier: 0, mfModifier: 0, fwBonus: 0 },
      captainEffect: capEffect,
      homeBonus: t.isHome ? 3 : 0,
      numPlayersMalus: officeTotalPoints,
      totalScore: 0,
      goals: 0,
      isUnder60: false,
      formulaDetails: {
        basePoints: activePlayers.length > 0 
          ? activePlayers.map(p => p.vote).join(' + ') + 
            (missingCount >= 1 ? ` + 4.0 (Uff)` : '') + 
            (missingCount >= 2 ? Array(missingCount - 1).fill(' + 0.0').join('') : '')
          : (missingCount >= 1 ? `4.0 (Uff)${missingCount >= 2 ? Array(missingCount - 1).fill(' + 0.0').join('') : ''}` : '0'),
        dfModifier: '',
        mfModifier: '',
        gkBonus: '',
        fwBonus: '',
        captainEffect: captain ? `${captain.vote} ➔ ${capEffect > 0 ? '+' : ''}${capEffect}` : 'Nessuno',
        yellowCards: `Count: ${activePlayers.filter(p => p.yellowCard).length} × (-0.5)`,
        redCards: `Count: ${activePlayers.filter(p => p.redCard).length} × (-1)`,
        homeBonus: t.isHome ? '3.0' : '0.0',
        eventsPoints: eventDetail,
        numPlayersMalus: officeDetail
      }
    };
  };

  // Cross calculations
  const startersA = teamA.players.slice(0, 11);
  const startersB = teamB.players.slice(0, 11);
  const activeA = startersA.filter(p => !p.isDNP);
  const activeB = startersB.filter(p => !p.isDNP);

  // GK Logic
  const gkA = activeA.find(p => p.role === 'POR');
  const gkB = activeB.find(p => p.role === 'POR');
  const gkBonusA = gkA ? calculateGKBonus(gkA) : 0;
  const gkBonusB = gkB ? calculateGKBonus(gkB) : 0;

  // DF Logic
  const dfStartersA = startersA.filter(p => p.role === 'DIF');
  const dfStartersB = startersB.filter(p => p.role === 'DIF');
  const dfActiveA = activeA.filter(p => p.role === 'DIF');
  const dfActiveB = activeB.filter(p => p.role === 'DIF');
  
  const getDfModInfo = (active: Player[], starters: Player[]) => {
    if (starters.length === 0) return { mod: 0, detail: 'Nessun DIF' };
    const votes = active.map(p => p.vote);
    const missing = starters.length - active.length;
    // Missing players count as 5.0 for the average
    const sum = votes.reduce((s, v) => s + v, 0) + (missing * 5);
    const avg = sum / starters.length;
    let mod = calculateDFModifierIndex(avg);
    
    let detail = `Media(${votes.concat(Array(missing).fill(5)).join(', ')}) = ${avg.toFixed(2)} ➔ ${mod}`;
    if (starters.length === 3) {
      mod += 1;
      detail += ' [+1 Modulo 3 DIF]';
    }
    if (starters.length === 5) {
      mod -= 1;
      detail += ' [-1 Modulo 5 DIF]';
    }
    return { mod, detail };
  };
  const dfResA = getDfModInfo(dfActiveA, dfStartersA);
  const dfResB = getDfModInfo(dfActiveB, dfStartersB);

  // MF Logic
  const mfStartersA = startersA.filter(p => p.role === 'CC');
  const mfStartersB = startersB.filter(p => p.role === 'CC');
  const mfActiveA = activeA.filter(p => p.role === 'CC');
  const mfActiveB = activeB.filter(p => p.role === 'CC');
  const maxMf = Math.max(mfStartersA.length, mfStartersB.length);
  
  const getMfSumInfo = (active: Player[], starters: Player[], maxCount: number) => {
    let votes = active.map(p => p.vote);
    const missingInRole = starters.length - active.length;
    // Missing players count as 5.0 for the sum
    let sum = votes.reduce((s, v) => s + v, 0) + (missingInRole * 5);
    let detail = active.length > 0 ? votes.join(' + ') : '0';
    if (missingInRole > 0) {
      detail += ` + (${missingInRole} × 5.0 Uff.)`;
    }
    
    // Fill up to maxCount
    if (starters.length < maxCount) {
      const extraMissing = maxCount - starters.length;
      sum += extraMissing * 5;
      detail += ` + (${extraMissing} × 5.0 Uff. Modulo)`;
    }
    return { sum, detail };
  };
  const resMfA = getMfSumInfo(mfActiveA, mfStartersA, maxMf);
  const resMfB = getMfSumInfo(mfActiveB, mfStartersB, maxMf);
  const diffMf = resMfA.sum - resMfB.sum;
  let mfModA = 0;
  let mfModB = 0;
  
  if (Math.abs(diffMf) >= 1) {
    const scale = Math.min(8, Math.floor(Math.abs(diffMf)));
    const value = scale * 0.5;
    if (diffMf > 0) {
      mfModA = value;
      mfModB = -value;
    } else {
      mfModA = -value;
      mfModB = value;
    }
  }
  const mfDetailA = `Diff Sum CC(${resMfA.sum.toFixed(1)} - ${resMfB.sum.toFixed(1)}) = ${diffMf.toFixed(1)} ➔ ${mfModA > 0 ? '+' : ''}${mfModA}`;
  const mfDetailB = `Diff Sum CC(${resMfB.sum.toFixed(1)} - ${resMfA.sum.toFixed(1)}) = ${(-diffMf).toFixed(1)} ➔ ${mfModB > 0 ? '+' : ''}${mfModB}`;

  // FW Logic
  const getFwInfo = (forwards: Player[]) => {
    const bonuses = forwards.map(p => calculateFWBonus(p));
    const sum = bonuses.reduce((s, b) => s + b, 0);
    const detail = bonuses.length > 0 ? bonuses.join(' + ') : '0';
    return { sum, detail };
  };
  const resFwA = getFwInfo(activeA.filter(p => p.role === 'ATT'));
  const resFwB = getFwInfo(activeB.filter(p => p.role === 'ATT'));

  const resA = calcTeam(teamA);
  const resB = calcTeam(teamB);

  resA.modifiers.gkBonus = gkBonusA;
  resB.modifiers.gkBonus = gkBonusB;
  resA.formulaDetails.gkBonus = gkA ? `${gkA.vote} ➔ +${gkBonusA}` : 'Nessuno';
  resB.formulaDetails.gkBonus = gkB ? `${gkB.vote} ➔ +${gkBonusB}` : 'Nessuno';
  
  resA.modifiers.dfModifier = dfResB.mod;
  resB.modifiers.dfModifier = dfResA.mod;
  resA.formulaDetails.dfModifier = dfResB.detail;
  resB.formulaDetails.dfModifier = dfResA.detail;
  
  resA.modifiers.mfModifier = mfStartersA.length > 0 ? mfModA : 0;
  resB.modifiers.mfModifier = mfStartersB.length > 0 ? mfModB : 0;
  resA.formulaDetails.mfModifier = mfDetailA;
  resB.formulaDetails.mfModifier = mfDetailB;
  
  resA.modifiers.fwBonus = resFwA.sum;
  resB.modifiers.fwBonus = resFwB.sum;
  resA.formulaDetails.fwBonus = resFwA.detail;
  resB.formulaDetails.fwBonus = resFwB.detail;

  resA.totalScore = resA.basePoints + resA.eventsPoints + resA.yellowCardsMalus + resA.redCardsMalus + resA.captainEffect + resA.homeBonus + resA.modifiers.gkBonus + resA.modifiers.dfModifier + resA.modifiers.mfModifier + resA.modifiers.fwBonus;
  resB.totalScore = resB.basePoints + resB.eventsPoints + resB.yellowCardsMalus + resB.redCardsMalus + resB.captainEffect + resB.homeBonus + resB.modifiers.gkBonus + resB.modifiers.dfModifier + resB.modifiers.mfModifier + resB.modifiers.fwBonus;

  resA.isUnder60 = resA.totalScore < 60;
  resB.isUnder60 = resB.totalScore < 60;

  resA.goals = calculateGoals(resA.totalScore);
  resB.goals = calculateGoals(resB.totalScore);

  if (resA.isUnder60) resB.goals += 1;
  if (resB.isUnder60) resA.goals += 1;

  let winner = 'Pareggio';
  const diffScore = Math.abs(resA.totalScore - resB.totalScore);
  if (diffScore >= 3) {
    if (resA.goals > resB.goals) winner = teamA.name;
    else if (resB.goals > resA.goals) winner = teamB.name;
  }

  return { team1: resA, team2: resB, winner };
};
