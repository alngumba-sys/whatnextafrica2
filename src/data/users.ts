export type UserRole = 'CS' | 'PS' | 'PAS' | 'RC' | 'CC' | 'DC' | 'ACC' | 'SNA' | 'US' | 'AS';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  region?: string; // For RC, CC, DC, ACC
  ministryId?: string; // For US, AS posted to ministries
  email: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female';
  employeeNumber?: string;
  dateOfJoining?: string;
  yearsOfService?: number;
  nationality?: string;
  education?: string;
  currentStation?: string;
}

// Kenya's 47 counties
const counties = [
  'Nairobi', 'Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita-Taveta', 'Garissa',
  'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka-Nithi', 'Embu', 'Kitui',
  'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga', 'Murang\'a', 'Kiambu', 'Turkana',
  'West Pokot', 'Samburu', 'Trans-Nzoia', 'Uasin Gishu', 'Elgeyo-Marakwet', 'Nandi', 'Baringo',
  'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma',
  'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira'
];

// Sample districts per county (some counties)
const districts = [
  // Nairobi - 17 districts
  'Westlands', 'Dagoretti North', 'Dagoretti South', 'Langata', 'Kibra', 'Roysambu', 'Kasarani',
  'Ruaraka', 'Embakasi South', 'Embakasi North', 'Embakasi Central', 'Embakasi East', 'Embakasi West',
  'Makadara', 'Kamukunji', 'Starehe', 'Mathare',
  // Kiambu - 12 districts
  'Gatundu South', 'Gatundu North', 'Juja', 'Thika Town', 'Ruiru', 'Githunguri', 'Kiambu Town',
  'Kiambaa', 'Kabete', 'Kikuyu', 'Limuru', 'Lari',
  // Machakos - 8 districts
  'Machakos Town', 'Mavoko', 'Kathiani', 'Yatta', 'Kangundo', 'Matungulu', 'Mwala', 'Masinga',
  // Nakuru - 11 districts
  'Nakuru Town East', 'Nakuru Town West', 'Gilgil', 'Naivasha', 'Molo', 'Njoro', 'Rongai',
  'Subukia', 'Kuresoi South', 'Kuresoi North', 'Bahati',
  // Mombasa - 6 districts
  'Changamwe', 'Jomvu', 'Kisauni', 'Nyali', 'Likoni', 'Mvita',
  // Kisumu - 7 districts
  'Kisumu East', 'Kisumu West', 'Kisumu Central', 'Seme', 'Nyando', 'Muhoroni', 'Nyakach',
  // Kakamega - 12 districts
  'Lugari', 'Likuyani', 'Malava', 'Lurambi', 'Navakholo', 'Mumias West', 'Mumias East', 'Matungu',
  'Butere', 'Khwisero', 'Shinyalu', 'Ikolomani',
  // Bungoma - 9 districts
  'Bumula', 'Kabuchai', 'Kanduyi', 'Kimilili', 'Mt. Elgon', 'Sirisia', 'Tongaren', 'Webuye East', 'Webuye West',
  // Meru - 9 districts
  'Igembe South', 'Igembe Central', 'Igembe North', 'Tigania West', 'Tigania East', 'North Imenti',
  'Buuri', 'Central Imenti', 'South Imenti',
  // Kilifi - 7 districts
  'Kilifi North', 'Kilifi South', 'Kaloleni', 'Genze', 'Malindi', 'Magarini', 'Rabai'
];

// Generate more districts to reach 400
const additionalDistricts: string[] = [];
for (let i = 1; i <= 270; i++) {
  const county = counties[i % counties.length];
  additionalDistricts.push(`${county} District ${Math.floor(i / counties.length) + 1}`);
}
const allDistricts = [...districts, ...additionalDistricts];

// Kenyan first names (mixed gender)
const firstNames = [
  'John', 'Mary', 'Peter', 'Jane', 'James', 'Grace', 'David', 'Faith', 'Daniel', 'Rose',
  'Samuel', 'Lucy', 'Joseph', 'Agnes', 'Michael', 'Margaret', 'Paul', 'Catherine', 'Moses', 'Ann',
  'Benjamin', 'Sarah', 'Francis', 'Esther', 'Anthony', 'Joyce', 'Vincent', 'Elizabeth', 'Patrick', 'Jennifer',
  'Stephen', 'Christine', 'Robert', 'Caroline', 'Thomas', 'Alice', 'George', 'Ruth', 'William', 'Nancy',
  'Charles', 'Rebecca', 'Richard', 'Susan', 'Emmanuel', 'Beatrice', 'Mark', 'Eunice', 'Simon', 'Mercy',
  'Kevin', 'Betty', 'Eric', 'Lydia', 'Isaac', 'Phoebe', 'Andrew', 'Rachel', 'Jackson', 'Janet',
  'Joshua', 'Gladys', 'Philip', 'Winnie', 'Nicholas', 'Florence', 'Timothy', 'Martha', 'Kenneth', 'Veronica',
  'Fred', 'Monica', 'Harrison', 'Violet', 'Collins', 'Phyllis', 'Dennis', 'Judy', 'Geoffrey', 'Edith',
  'Alex', 'Jacinta', 'Leonard', 'Teresa', 'Evans', 'Josephine', 'Allan', 'Millicent', 'Felix', 'Priscilla'
];

const lastNames = [
  'Kamau', 'Ochieng', 'Kiplagat', 'Mwangi', 'Otieno', 'Korir', 'Njoroge', 'Omondi', 'Kimutai', 'Wanjiku',
  'Achieng', 'Kipkoech', 'Njeri', 'Owino', 'Rotich', 'Wambui', 'Ouma', 'Mutai', 'Wanjiru', 'Odero',
  'Cheruiyot', 'Nyambura', 'Odhiambo', 'Langat', 'Wangari', 'Okoth', 'Kibet', 'Wairimu', 'Oloo', 'Sang',
  'Mumbi', 'Onyango', 'Kiptoo', 'Nyokabi', 'Awuor', 'Bett', 'Wangui', 'Onyango', 'Tanui', 'Wamuyu',
  'Ayako', 'Ruto', 'Njoki', 'Omweri', 'Kirui', 'Waithera', 'Okello', 'Yego', 'Kanana', 'Owiyo',
  'Komen', 'Muthoni', 'Odhiambo', 'Kiprotich', 'Wambugu', 'Okumu', 'Lagat', 'Waweru', 'Onyango', 'Kiprono',
  'Wanjala', 'Auma', 'Kosgey', 'Nduta', 'Oketch', 'Terer', 'Karanja', 'Opiyo', 'Kimeli', 'Karimi',
  'Atieno', 'Kipruto', 'Kagendo', 'Omondi', 'Chepkwony', 'Mureithi', 'Adhiambo', 'Mutua', 'Mboya', 'Maina',
  'Onyango', 'Kemboi', 'Kariuki', 'Odhiambo', 'Lagat', 'Kimani', 'Oduor', 'Biwott', 'Githinji', 'Oluoch',
  'Kibet', 'Gachoki', 'Wekesa', 'Kirui', 'Mburu', 'Onyango', 'Kipchirchir', 'Wachira', 'Omondi', 'Kiprop'
];

// Helper to generate random name
const generateName = (index: number): string => {
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[(index * 7) % lastNames.length];
  return `${firstName} ${lastName}`;
};

// Helper to generate username
const generateUsername = (name: string): string => {
  return name.toLowerCase().replace(/ /g, '.');
};

// Generate dates
const generateJoiningDate = (index: number): string => {
  const year = 2010 + (index % 15);
  const month = String((index % 12) + 1).padStart(2, '0');
  const day = String(((index * 7) % 28) + 1).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const generateDOB = (index: number): string => {
  const year = 1970 + (index % 25);
  const month = String((index % 12) + 1).padStart(2, '0');
  const day = String(((index * 3) % 28) + 1).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Sample users for each role
export const users: User[] = [
  // Cabinet Secretary
  { id: 'cs1', username: 'kipchumba.murkomen', name: 'Hon. Kipchumba Murkomen', role: 'CS', email: 'cs@interior.go.ke' },
  
  // Principal Secretary
  { id: 'ps1', username: 'raymond.omollo', name: 'Dr. Raymond Omollo, C.B.S.', role: 'PS', email: 'ps@interior.go.ke' },
  
  // Principal Administrative Secretaries
  { id: 'pas1', username: 'beverly.opwora', name: 'Beverly Opwora', role: 'PAS', email: 'pas1@interior.go.ke' },
  { id: 'pas2', username: 'samson.mwathethe', name: 'Samson Mwathethe', role: 'PAS', email: 'pas2@interior.go.ke' },
  
  // Secretary National Administrator
  { id: 'sna1', username: 'moses.lilan', name: 'Moses Lilan', role: 'SNA', email: 'sna@interior.go.ke' },
  
  // Regional Commissioners
  { 
    id: 'rc1', 
    username: 'james.kianda', 
    name: 'James Kianda', 
    role: 'RC', 
    region: 'Nairobi', 
    email: 'rc.nairobi@interior.go.ke',
    dateOfBirth: '1966-02-15', // Retiring in Feb 2026
    gender: 'Male',
    employeeNumber: 'RC/2015/0145',
    dateOfJoining: '1995-07-01',
    yearsOfService: 31,
    nationality: 'Kenyan',
    education: 'Master of Public Administration',
    currentStation: 'Nairobi Regional Office'
  },
  { 
    id: 'rc2', 
    username: 'rhoda.onyancha', 
    name: 'Rhoda Onyancha', 
    role: 'RC', 
    region: 'Coast', 
    email: 'rc.coast@interior.go.ke',
    dateOfBirth: '1966-04-22', // Retiring in April 2026
    gender: 'Female',
    employeeNumber: 'RC/2016/0089',
    dateOfJoining: '1998-02-15',
    yearsOfService: 28,
    nationality: 'Kenyan',
    education: 'Master of Security Studies',
    currentStation: 'Mombasa Regional Office'
  },
  { 
    id: 'rc3', 
    username: 'george.natembeya', 
    name: 'George Natembeya', 
    role: 'RC', 
    region: 'Rift Valley', 
    email: 'rc.riftvalley@interior.go.ke',
    dateOfBirth: '1966-07-08', // Retiring in July 2026
    gender: 'Male',
    employeeNumber: 'RC/2014/0056',
    dateOfJoining: '1992-06-01',
    yearsOfService: 34,
    nationality: 'Kenyan',
    education: 'Bachelor of Arts',
    currentStation: 'Nakuru Regional Office'
  },
  { id: 'rc4', username: 'abdi.hassan', name: 'Abdi Hassan Omar', role: 'RC', region: 'North Eastern', email: 'rc.northeastern@interior.go.ke', currentStation: 'Garissa Regional Office' },
  { id: 'rc5', username: 'maalim.mohammed', name: 'Maalim Mohammed', role: 'RC', region: 'Eastern', email: 'rc.eastern@interior.go.ke', currentStation: 'Embu Regional Office' },
  { id: 'rc6', username: 'wanyama.musiambo', name: 'Wanyama Musiambo', role: 'RC', region: 'Western', email: 'rc.western@interior.go.ke', currentStation: 'Kakamega Regional Office' },
  { id: 'rc7', username: 'joseph.kanyiri', name: 'Joseph Kanyiri', role: 'RC', region: 'Central', email: 'rc.central@interior.go.ke', currentStation: 'Nyeri Regional Office' },
  { id: 'rc8', username: 'isaack.masinde', name: 'Isaack Masinde', role: 'RC', region: 'Nyanza', email: 'rc.nyanza@interior.go.ke', currentStation: 'Kisumu Regional Office' },
  
  // County Commissioners - 47 counties
  ...counties.map((county, index) => {
    // Set some CCs to retire soon
    let dateOfBirth = generateDOB(index * 13);
    let joiningDate = generateJoiningDate(index * 13);
    let yearsOfService = 2026 - (2010 + (index % 15));
    
    if (index === 0) { // Nairobi CC - retiring in March 2026
      dateOfBirth = '1966-03-10';
      joiningDate = '1994-03-10';
      yearsOfService = 32;
    } else if (index === 5) { // Lamu CC - retiring in May 2026
      dateOfBirth = '1966-05-18';
      joiningDate = '1996-05-18';
      yearsOfService = 30;
    } else if (index === 10) { // Marsabit CC - retiring in August 2026
      dateOfBirth = '1966-08-25';
      joiningDate = '1993-08-25';
      yearsOfService = 33;
    } else if (index === 22) { // Kiambu CC - retiring in June 2026
      dateOfBirth = '1966-06-14';
      joiningDate = '1995-06-14';
      yearsOfService = 31;
    }
    
    return {
      id: `cc${index + 1}`,
      username: generateUsername(`cc.${county}`),
      name: generateName(index * 13),
      role: 'CC' as UserRole,
      region: county,
      email: `cc.${county.toLowerCase().replace(/[\\s']/g, '')}@interior.go.ke`,
      dateOfBirth,
      gender: (index % 3 === 0 ? 'Female' : 'Male') as 'Male' | 'Female',
      employeeNumber: `CC/${2015 + (index % 10)}/${String(index + 1).padStart(4, '0')}`,
      dateOfJoining: joiningDate,
      yearsOfService,
      nationality: 'Kenyan',
      education: ['Bachelor of Arts', 'Master of Public Administration', 'Bachelor of Law', 'Master of Security Studies'][index % 4],
      currentStation: `${county} County Office`
    };
  }),

  // District Commissioners - 400
  ...allDistricts.slice(0, 400).map((district, index) => {
    const countyIndex = index % counties.length;
    const county = counties[countyIndex];
    
    // Set some DCs to retire soon
    let dateOfBirth = generateDOB(index * 17 + 1000);
    let joiningDate = generateJoiningDate(index * 17 + 1000);
    let yearsOfService = 2026 - (2010 + ((index * 17 + 1000) % 15));
    
    if (index === 0) { // Westlands DC - retiring in Feb 2026 (2 weeks)
      dateOfBirth = '1966-02-12';
      joiningDate = '1995-02-12';
      yearsOfService = 31;
    } else if (index === 15) { // Mathare DC - retiring in March 2026
      dateOfBirth = '1966-03-20';
      joiningDate = '1996-03-20';
      yearsOfService = 30;
    } else if (index === 25) { // Thika DC - retiring in April 2026
      dateOfBirth = '1966-04-05';
      joiningDate = '1994-04-05';
      yearsOfService = 32;
    } else if (index === 50) { // Nakuru East DC - retiring in September 2026
      dateOfBirth = '1966-09-15';
      joiningDate = '1993-09-15';
      yearsOfService = 33;
    } else if (index === 100) { // Random DC - retiring in October 2026
      dateOfBirth = '1966-10-28';
      joiningDate = '1995-10-28';
      yearsOfService = 31;
    }
    
    return {
      id: `dc${index + 1}`,
      username: generateUsername(`dc.${district.replace(/[\\s']/g, '')}`).substring(0, 30),
      name: generateName(index * 17 + 1000),
      role: 'DC' as UserRole,
      region: district,
      email: `dc${index + 1}@interior.go.ke`,
      dateOfBirth,
      gender: (index % 2 === 0 ? 'Female' : 'Male') as 'Male' | 'Female',
      employeeNumber: `DC/${2015 + (index % 10)}/${String(index + 1).padStart(4, '0')}`,
      dateOfJoining: joiningDate,
      yearsOfService,
      nationality: 'Kenyan',
      education: ['Bachelor of Arts', 'Bachelor of Law', 'Diploma in Public Administration', 'Bachelor of Security Management'][index % 4],
      currentStation: `${district} District Office`
    };
  }),

  // Assistant County Commissioners - 2000
  ...Array.from({ length: 2000 }, (_, index) => {
    const districtIndex = index % 400;
    const district = allDistricts[districtIndex];
    const locationNum = Math.floor(index / 400) + 1;
    const location = `${district} Location ${locationNum}`;
    
    // Set some ACCs to retire soon
    let dateOfBirth = generateDOB(index * 23 + 5000);
    let joiningDate = generateJoiningDate(index * 23 + 5000);
    let yearsOfService = 2026 - (2010 + ((index * 23 + 5000) % 15));
    
    if (index === 0) { // First ACC - retiring in Feb 2026 (next week!)
      dateOfBirth = '1966-02-08';
      joiningDate = '1994-02-08';
      yearsOfService = 32;
    } else if (index === 10) { // ACC #11 - retiring in March 2026
      dateOfBirth = '1966-03-15';
      joiningDate = '1995-03-15';
      yearsOfService = 31;
    } else if (index === 50) { // ACC #51 - retiring in April 2026
      dateOfBirth = '1966-04-12';
      joiningDate = '1996-04-12';
      yearsOfService = 30;
    } else if (index === 100) { // ACC #101 - retiring in May 2026
      dateOfBirth = '1966-05-20';
      joiningDate = '1994-05-20';
      yearsOfService = 32;
    } else if (index === 200) { // ACC #201 - retiring in November 2026
      dateOfBirth = '1966-11-30';
      joiningDate = '1993-11-30';
      yearsOfService = 33;
    } else if (index === 300) { // ACC #301 - retiring in December 2026
      dateOfBirth = '1966-12-25';
      joiningDate = '1995-12-25';
      yearsOfService = 31;
    }
    
    return {
      id: `acc${index + 1}`,
      username: `acc${index + 1}.user`,
      name: generateName(index * 23 + 5000),
      role: 'ACC' as UserRole,
      region: location,
      email: `acc${index + 1}@interior.go.ke`,
      dateOfBirth,
      gender: (index % 2 === 0 ? 'Male' : 'Female') as 'Male' | 'Female',
      employeeNumber: `ACC/${2015 + (index % 10)}/${String(index + 1).padStart(4, '0')}`,
      dateOfJoining: joiningDate,
      yearsOfService,
      nationality: 'Kenyan',
      education: ['Diploma in Public Administration', 'Bachelor of Arts', 'Certificate in Security Management', 'Bachelor of Law'][index % 4],
      currentStation: `${location} Sub-County Office`
    };
  }),

  // Under Secretaries (posted to various ministries)
  { id: 'us1', username: 'john.mwenda', name: 'John Mwenda', role: 'US', ministryId: '4', email: 'us.education@interior.go.ke', currentStation: 'Ministry of Education' },
  { id: 'us2', username: 'grace.kimani', name: 'Grace Kimani', role: 'US', ministryId: '5', email: 'us.health@interior.go.ke', currentStation: 'Ministry of Health' },
  { id: 'us3', username: 'daniel.odhiambo', name: 'Daniel Odhiambo', role: 'US', ministryId: '6', email: 'us.agriculture@interior.go.ke', currentStation: 'Ministry of Agriculture' },
  { id: 'us4', username: 'joyce.kipchirchir', name: 'Joyce Kipchirchir', role: 'US', ministryId: '7', email: 'us.finance@interior.go.ke', currentStation: 'Ministry of Finance' },
  { id: 'us5', username: 'robert.mwangangi', name: 'Robert Mwangangi', role: 'US', ministryId: '8', email: 'us.transport@interior.go.ke', currentStation: 'Ministry of Transport' },
  { id: 'us6', username: 'ann.wambugu', name: 'Ann Wambugu', role: 'US', ministryId: '9', email: 'us.water@interior.go.ke', currentStation: 'Ministry of Water' },
  
  // Assistant Secretaries (posted to various ministries)
  { id: 'as1', username: 'alice.wanjiku', name: 'Alice Wanjiku', role: 'AS', ministryId: '4', email: 'as.education@interior.go.ke', currentStation: 'Ministry of Education' },
  { id: 'as2', username: 'michael.omondi', name: 'Michael Omondi', role: 'AS', ministryId: '5', email: 'as.health@interior.go.ke', currentStation: 'Ministry of Health' },
  { id: 'as3', username: 'sarah.chebet', name: 'Sarah Chebet', role: 'AS', ministryId: '7', email: 'as.finance@interior.go.ke', currentStation: 'Ministry of Finance' },
  { id: 'as4', username: 'martin.kibet', name: 'Martin Kibet', role: 'AS', ministryId: '4', email: 'as2.education@interior.go.ke', currentStation: 'Ministry of Education' },
  { id: 'as5', username: 'angela.mueni', name: 'Angela Mueni', role: 'AS', ministryId: '6', email: 'as.agriculture@interior.go.ke', currentStation: 'Ministry of Agriculture' },
  { id: 'as6', username: 'thomas.onyango', name: 'Thomas Onyango', role: 'AS', ministryId: '8', email: 'as.transport@interior.go.ke', currentStation: 'Ministry of Transport' },
  { id: 'as7', username: 'eunice.njoki', name: 'Eunice Njoki', role: 'AS', ministryId: '9', email: 'as.water@interior.go.ke', currentStation: 'Ministry of Water' },
  { id: 'as8', username: 'kevin.mutinda', name: 'Kevin Mutinda', role: 'AS', ministryId: '5', email: 'as2.health@interior.go.ke', currentStation: 'Ministry of Health' },
];

export const getRoleName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    CS: 'Cabinet Secretary',
    PS: 'Principal Secretary',
    PAS: 'Principal Administrative Secretary',
    RC: 'Regional Commissioner',
    CC: 'County Commissioner',
    DC: 'District Commissioner',
    ACC: 'Assistant County Commissioner',
    SNA: 'Secretary National Administrator',
    US: 'Under Secretary',
    AS: 'Assistant Secretary',
  };
  return roleNames[role];
};

export const canApproveTransfers = (role: UserRole): boolean => {
  return ['PS', 'PAS'].includes(role);
};

export const canInitiateTransfers = (role: UserRole): boolean => {
  return ['RC', 'SNA'].includes(role);
};

export const canUpdateLeaveStatus = (role: UserRole): boolean => {
  return ['CC', 'DC', 'ACC'].includes(role);
};

export const canManageReporting = (role: UserRole): boolean => {
  return ['PAS', 'ACC'].includes(role);
};