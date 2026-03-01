import { Transfer } from '@/data/transfersAndLeave';
import { User, UserRole, users as allUsers } from '@/data/users';
import { officers } from '@/data/transfersAndLeave';

// Regional mapping for Kenya's 8 administrative regions
const regionalMapping: Record<string, string[]> = {
  'Nairobi': ['Nairobi'],
  'Coast': ['Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita-Taveta'],
  'Rift Valley': ['Turkana', 'West Pokot', 'Samburu', 'Trans-Nzoia', 'Uasin Gishu', 'Elgeyo-Marakwet', 
                  'Nandi', 'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet'],
  'North Eastern': ['Garissa', 'Wajir', 'Mandera'],
  'Eastern': ['Marsabit', 'Isiolo', 'Meru', 'Tharaka-Nithi', 'Embu', 'Kitui', 'Machakos', 'Makueni'],
  'Western': ['Kakamega', 'Vihiga', 'Bungoma', 'Busia'],
  'Central': ['Nyandarua', 'Nyeri', 'Kirinyaga', "Murang'a", 'Kiambu'],
  'Nyanza': ['Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira']
};

// Get counties under a specific region
const getCountiesInRegion = (region: string): string[] => {
  return regionalMapping[region] || [];
};

// Get county from a district/location name
const getCountyFromLocation = (location: string): string | null => {
  // First check if the location itself is a county
  for (const counties of Object.values(regionalMapping)) {
    if (counties.some(county => location.includes(county))) {
      return counties.find(county => location.includes(county)) || null;
    }
  }
  
  // Try to extract county from district name patterns
  // e.g., "Nairobi District 1" -> "Nairobi"
  for (const counties of Object.values(regionalMapping)) {
    for (const county of counties) {
      if (location.startsWith(county)) {
        return county;
      }
    }
  }
  
  return null;
};

// Get region from a county
const getRegionFromCounty = (county: string): string | null => {
  for (const [region, counties] of Object.entries(regionalMapping)) {
    if (counties.includes(county)) {
      return region;
    }
  }
  return null;
};

// Role hierarchy mappings
const roleHierarchy: Record<UserRole, UserRole[]> = {
  'CS': ['PS', 'PAS', 'RC', 'CC', 'DC', 'ACC', 'SNA', 'US', 'AS'], // Sees all
  'PS': ['PS', 'PAS', 'RC', 'CC', 'DC', 'ACC', 'SNA', 'US', 'AS'], // Sees all
  'PAS': ['PS', 'PAS', 'RC', 'CC', 'DC', 'ACC', 'SNA', 'US', 'AS'], // Sees all
  'RC': ['CC'], // Only sees County Commissioners
  'CC': ['DC'], // Only sees District Commissioners
  'DC': ['ACC'], // Only sees Assistant County Commissioners
  'ACC': [], // No subordinates
  'SNA': ['US'], // Only sees Under Secretaries
  'US': ['AS'], // Only sees Assistant Secretaries
  'AS': [] // No subordinates
};

/**
 * Filter transfers based on user role and jurisdiction
 * Users always see:
 * 1. Transfers they initiated/drafted/approved
 * 2. Transfers where THEY are the officer being transferred
 * 3. Transfers in their jurisdiction (subordinates)
 */
export function filterTransfersByJurisdiction(transfers: Transfer[], currentUser: User): Transfer[] {
  // CS, PS, and PAS see all transfers
  if (['CS', 'PS', 'PAS'].includes(currentUser.role)) {
    return transfers;
  }

  const subordinateRoles = roleHierarchy[currentUser.role] || [];
  
  return transfers.filter(transfer => {
    // CRITICAL: User always sees transfers where THEY are the officer being transferred
    if (transfer.officerId === currentUser.id) {
      return true;
    }

    // IMPORTANT: User always sees transfers they initiated, drafted, or approved
    if (transfer.initiatedBy === currentUser.id || 
        transfer.draftedBy === currentUser.id ||
        transfer.approvedBy === currentUser.id) {
      return true;
    }

    // Check if the transfer is for a subordinate role
    if (!subordinateRoles.includes(transfer.officerRole as UserRole)) {
      return false;
    }

    // For Regional Commissioners - filter by region
    if (currentUser.role === 'RC') {
      if (!currentUser.region) return false;
      
      const countiesInRegion = getCountiesInRegion(currentUser.region);
      const officer = officers.find(o => o.id === transfer.officerId);
      
      if (!officer) return false;
      
      // Check if officer's current location is in the RC's region
      const officerCounty = getCountyFromLocation(officer.currentLocation);
      if (officerCounty && countiesInRegion.includes(officerCounty)) {
        return true;
      }
      
      // Also check fromLocation and toLocation
      const fromCounty = getCountyFromLocation(transfer.fromLocation);
      const toCounty = getCountyFromLocation(transfer.toLocation);
      
      return (fromCounty && countiesInRegion.includes(fromCounty)) ||
             (toCounty && countiesInRegion.includes(toCounty));
    }

    // For County Commissioners - filter by county
    if (currentUser.role === 'CC') {
      if (!currentUser.region) return false; // region is the county for CC
      
      const officer = officers.find(o => o.id === transfer.officerId);
      if (!officer) return false;
      
      // Check if officer's current location is in the CC's county
      const officerCounty = getCountyFromLocation(officer.currentLocation);
      if (officerCounty === currentUser.region) {
        return true;
      }
      
      // Also check fromLocation and toLocation
      const fromCounty = getCountyFromLocation(transfer.fromLocation);
      const toCounty = getCountyFromLocation(transfer.toLocation);
      
      return fromCounty === currentUser.region || toCounty === currentUser.region;
    }

    // For District Commissioners - filter by district/supervisor relationship
    if (currentUser.role === 'DC') {
      const officer = officers.find(o => o.id === transfer.officerId);
      if (!officer) return false;
      
      // Check if the DC is the supervisor of this ACC
      return officer.supervisorId === currentUser.id;
    }

    // For SNA - sees all US transfers (no geographic restriction)
    if (currentUser.role === 'SNA') {
      return transfer.officerRole === 'US' || transfer.officerRole === 'Under Secretary';
    }

    // For Under Secretaries - filter by ministry
    if (currentUser.role === 'US') {
      if (!currentUser.ministryId) return false;
      
      const officer = officers.find(o => o.id === transfer.officerId);
      if (!officer) return false;
      
      // Check if AS is in the same ministry
      return officer.currentMinistry === currentUser.ministryId ||
             transfer.fromMinistry === currentUser.ministryId ||
             transfer.toMinistry === currentUser.ministryId;
    }

    return false;
  });
}

/**
 * Get a description of what transfers the user is viewing
 */
export function getTransferViewDescription(currentUser: User): string {
  switch (currentUser.role) {
    case 'CS':
    case 'PS':
    case 'PAS':
      return 'You are viewing all transfers across the entire administration.';
    
    case 'RC':
      return `You are viewing transfers for County Commissioners in the ${currentUser.region} region.`;
    
    case 'CC':
      return `You are viewing transfers for District Commissioners in ${currentUser.region} County.`;
    
    case 'DC':
      return 'You are viewing transfers for Assistant County Commissioners under your supervision.';
    
    case 'SNA':
      return 'You are viewing transfers for Under Secretaries across all ministries.';
    
    case 'US':
      return 'You are viewing transfers for Assistant Secretaries in your ministry.';
    
    case 'ACC':
    case 'AS':
      return 'You have no subordinates to manage transfers for.';
    
    default:
      return '';
  }
}

/**
 * Filter officers based on user role and jurisdiction
 * Returns officers that the current user has authority over
 */
export function filterOfficersByJurisdiction(currentUser: User): User[] {
  // CS, PS, and PAS see all officers
  if (['CS', 'PS', 'PAS'].includes(currentUser.role)) {
    return allUsers;
  }

  const subordinateRoles = roleHierarchy[currentUser.role] || [];
  
  return allUsers.filter(officer => {
    // Check if the officer is of a subordinate role
    if (!subordinateRoles.includes(officer.role)) {
      return false;
    }

    // For Regional Commissioners - filter by region
    if (currentUser.role === 'RC') {
      if (!currentUser.region) return false;
      
      const countiesInRegion = getCountiesInRegion(currentUser.region);
      
      // Check if officer's region (county for CC) is in the RC's region
      if (officer.role === 'CC' && officer.region) {
        return countiesInRegion.includes(officer.region);
      }
      
      return false;
    }

    // For County Commissioners - filter by county
    if (currentUser.role === 'CC') {
      if (!currentUser.region) return false;
      
      // Check if DC's region (county) matches CC's county
      if (officer.role === 'DC' && officer.region === currentUser.region) {
        return true;
      }
      
      return false;
    }

    // For District Commissioners - filter by supervisor relationship
    if (currentUser.role === 'DC') {
      if (officer.role === 'ACC') {
        // Check in officers data for supervisor relationship
        const officerData = officers.find(o => o.id === officer.id);
        return officerData?.supervisorId === currentUser.id;
      }
      return false;
    }

    // For SNA - sees all US
    if (currentUser.role === 'SNA') {
      return officer.role === 'US';
    }

    // For Under Secretaries - filter by ministry
    if (currentUser.role === 'US') {
      if (!currentUser.ministryId) return false;
      
      // Check if AS is in the same ministry
      return officer.role === 'AS' && officer.ministryId === currentUser.ministryId;
    }

    return false;
  });
}