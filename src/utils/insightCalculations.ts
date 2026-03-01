import { users } from '@/data/users';
import { transfers, leaveRecords } from '@/data/transfersAndLeave';

// Calculate officers nearing retirement (within 12 months)
export const calculateRetiringOfficers = (region?: string) => {
  const today = new Date();
  const oneYearFromNow = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
  
  const retiringOfficers = users.filter(officer => {
    if (!officer.dateOfBirth) return false;
    const birthDate = new Date(officer.dateOfBirth);
    const retirementAge = 60;
    const retirementDate = new Date(birthDate.getFullYear() + retirementAge, birthDate.getMonth(), birthDate.getDate());
    return retirementDate >= today && retirementDate <= oneYearFromNow;
  });

  // Filter by region if provided (for RC)
  const filteredOfficers = region 
    ? retiringOfficers.filter(o => o.region === region)
    : retiringOfficers;

  return {
    count: filteredOfficers.length,
    officers: filteredOfficers
  };
};

// Calculate regional coverage data
export const calculateRegionalCoverage = () => {
  const regions = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Turkana', 'Marsabit', 'Wajir', 'Garissa', 'Embu'];
  
  return regions.map(region => {
    const officersInRegion = users.filter(u => u.region === region).length;
    const requiredOfficers = 250 + Math.floor(Math.random() * 100);
    const coverageRate = Math.floor((officersInRegion / requiredOfficers) * 100);
    // Calculate awaiting deployment based on leave records showing they're not currently on leave
    const awaitingDeployment = Math.floor(Math.random() * 5); // Mock data since we don't track deployment status
    
    return {
      region,
      current: officersInRegion,
      required: requiredOfficers,
      coverage: coverageRate,
      shortage: Math.max(0, requiredOfficers - officersInRegion),
      awaitingDeployment
    };
  }).sort((a, b) => a.coverage - b.coverage);
};

// Calculate officers awaiting deployment
export const calculateAwaitingDeployment = () => {
  // Mock calculation since User interface doesn't have deployment status
  return Math.floor(users.length * 0.03); // Approximately 3% awaiting deployment
};

// Calculate regional coverage rate (overall)
export const calculateOverallCoverageRate = () => {
  const totalOfficers = users.length;
  const requiredOfficers = 2500; // Approximate national requirement
  return Math.floor((totalOfficers / requiredOfficers) * 100);
};

// Calculate officers with outstanding training
export const calculateOutstandingTraining = () => {
  // Mock logic: officers who haven't had training in 2+ years or new officers
  const officersNeedingTraining = users.filter(u => {
    if (!u.dateOfJoining) return false;
    const joinDate = new Date(u.dateOfJoining);
    const yearsInService = (new Date().getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return yearsInService > 2 || yearsInService < 1;
  });

  return officersNeedingTraining.length;
};

// Calculate officers on study leave
export const calculateOfficersOnStudyLeave = () => {
  return leaveRecords.filter(l => l.status === 'study_leave').length;
};

// Calculate interdepartmental transfers
export const calculateInterdepartmentalTransfers = () => {
  return transfers.filter(t => t.fromMinistry && t.toMinistry && t.fromMinistry !== t.toMinistry).length;
};

// Calculate transfer requests received
export const calculateTransferRequestsReceived = () => {
  return transfers.filter(t => t.status === 'pending_approval' || t.status === 'drafted').length;
};

// Calculate officers posted to ministries
export const calculateOfficersPostedToMinistries = () => {
  return users.filter(u => u.role === 'US' || u.role === 'AS').length;
};

// Training needs data
export const getTrainingData = () => {
  const trainingNeeds = [
    { name: 'Leadership & Management', priority: 'High', officers: 45, budget: 1200000, deadline: 'March 2026' },
    { name: 'Digital Governance', priority: 'High', officers: 38, budget: 950000, deadline: 'April 2026' },
    { name: 'Policy Development', priority: 'Medium', officers: 52, budget: 820000, deadline: 'May 2026' },
    { name: 'Crisis Management', priority: 'High', officers: 29, budget: 780000, deadline: 'March 2026' },
    { name: 'Financial Administration', priority: 'Medium', officers: 41, budget: 670000, deadline: 'June 2026' },
  ];

  const officersNeedingTraining = users.filter(u => {
    if (!u.dateOfJoining) return false;
    const joinDate = new Date(u.dateOfJoining);
    const yearsInService = (new Date().getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return yearsInService > 2 || yearsInService < 1;
  });

  return {
    programs: trainingNeeds,
    officers: officersNeedingTraining.slice(0, 15).map(officer => ({
      ...officer,
      trainingNeeded: trainingNeeds[Math.floor(Math.random() * trainingNeeds.length)].name,
      lastTraining: `${1 + Math.floor(Math.random() * 3)} years ago`,
      priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as 'High' | 'Medium' | 'Low'
    })),
    totalOfficersNeedingTraining: officersNeedingTraining.length
  };
};
