export interface CountyCommissioner {
  id: string;
  fullName: string;
  initials: string;
  county: string;
  region: string;
  regionalCommissioner: string;
  appointmentDate: string;
  tenure: string;
  headquarters: string;
  subcountiesManaged: number;
  populationServed: string;
  districtCommissioners: number;
  totalStaff: number;
  education: string[];
  previousPostings: string[];
  performanceScore: number;
  budgetAllocated: string;
  budgetSpent: string;
  utilizationRate: number;
  leaveBalance: number;
  recentTransfer: string | null;
  phoneNumber: string;
  email: string;
  expertise: string[];
  keyInitiatives: string[];
  challenges: string[];
}

export const countyCommissioners: CountyCommissioner[] = [
  // Nairobi Region
  {
    id: 'cc-nairobi-001',
    fullName: 'Wilson Njenga Kariuki',
    initials: 'WNK',
    county: 'Nairobi',
    region: 'Nairobi Region',
    regionalCommissioner: 'James Kianda',
    appointmentDate: 'March 2022',
    tenure: '1 yr 11 mos',
    headquarters: 'Nairobi County HQ',
    subcountiesManaged: 17,
    populationServed: '4.4M',
    districtCommissioners: 17,
    totalStaff: 312,
    education: [
      'Master of Public Administration - University of Nairobi',
      'Bachelor of Arts (Political Science) - Kenyatta University'
    ],
    previousPostings: [
      'County Commissioner - Machakos (2019-2022)',
      'District Commissioner - Westlands (2016-2019)',
      'Assistant County Commissioner - Kasarani (2013-2016)'
    ],
    performanceScore: 92,
    budgetAllocated: 'KES 280M',
    budgetSpent: 'KES 256M',
    utilizationRate: 91,
    leaveBalance: 18,
    recentTransfer: null,
    phoneNumber: '+254 712 345 001',
    email: 'w.kariuki@interior.go.ke',
    expertise: ['Urban Administration', 'Security Coordination', 'Disaster Management'],
    keyInitiatives: [
      'Nairobi Metropolitan Security Framework',
      'Enhanced Disaster Response System',
      'Community Policing Integration'
    ],
    challenges: [
      'High population density requiring intensive coordination',
      'Managing diverse urban challenges across 17 sub-counties'
    ]
  },
  {
    id: 'cc-kajiado-001',
    fullName: 'Josephine Wanjiru Mwangi',
    initials: 'JWM',
    county: 'Kajiado',
    region: 'Nairobi Region',
    regionalCommissioner: 'James Kianda',
    appointmentDate: 'June 2021',
    tenure: '2 yrs 8 mos',
    headquarters: 'Kajiado Town',
    subcountiesManaged: 5,
    populationServed: '1.1M',
    districtCommissioners: 5,
    totalStaff: 98,
    education: [
      'Master of Public Policy - Strathmore University',
      'Bachelor of Social Sciences - Egerton University'
    ],
    previousPostings: [
      'District Commissioner - Kajiado North (2018-2021)',
      'Assistant County Commissioner - Ongata Rongai (2015-2018)'
    ],
    performanceScore: 88,
    budgetAllocated: 'KES 95M',
    budgetSpent: 'KES 82M',
    utilizationRate: 86,
    leaveBalance: 22,
    recentTransfer: null,
    phoneNumber: '+254 712 345 002',
    email: 'j.mwangi@interior.go.ke',
    expertise: ['Pastoralist Community Relations', 'Land Administration', 'Wildlife Conflict Resolution'],
    keyInitiatives: [
      'Human-Wildlife Conflict Mitigation Program',
      'Pastoralist Resource Management',
      'Cross-border Coordination (Tanzania)'
    ],
    challenges: [
      'Managing human-wildlife conflicts in conservation areas',
      'Balancing development with environmental conservation'
    ]
  },

  // Central Region
  {
    id: 'cc-kiambu-001',
    fullName: 'David Kimani Njoroge',
    initials: 'DKN',
    county: 'Kiambu',
    region: 'Central Region',
    regionalCommissioner: 'Mary Nyambura Njoroge',
    appointmentDate: 'January 2020',
    tenure: '4 yrs 1 mo',
    headquarters: 'Kiambu Town',
    subcountiesManaged: 12,
    populationServed: '2.4M',
    districtCommissioners: 12,
    totalStaff: 198,
    education: [
      'Master of Business Administration - USIU',
      'Bachelor of Public Administration - University of Nairobi'
    ],
    previousPostings: [
      'County Commissioner - Nyeri (2017-2020)',
      'District Commissioner - Thika (2014-2017)',
      'Assistant County Commissioner - Limuru (2011-2014)'
    ],
    performanceScore: 90,
    budgetAllocated: 'KES 165M',
    budgetSpent: 'KES 148M',
    utilizationRate: 90,
    leaveBalance: 15,
    recentTransfer: null,
    phoneNumber: '+254 712 345 003',
    email: 'd.njoroge@interior.go.ke',
    expertise: ['Agricultural Development Support', 'Infrastructure Coordination', 'Revenue Administration'],
    keyInitiatives: [
      'Coffee & Tea Value Chain Support',
      'Industrial Area Security Enhancement',
      'Transport Corridor Management'
    ],
    challenges: [
      'Managing rapid urbanization in peri-urban areas',
      'Coordinating between urban and rural sub-counties'
    ]
  },
  {
    id: 'cc-muranga-001',
    fullName: 'John Kamau Gitau',
    initials: 'JKG',
    county: "Murang'a",
    region: 'Central Region',
    regionalCommissioner: 'Mary Nyambura Njoroge',
    appointmentDate: 'August 2021',
    tenure: '2 yrs 6 mos',
    headquarters: "Murang'a Town",
    subcountiesManaged: 7,
    populationServed: '1.1M',
    districtCommissioners: 7,
    totalStaff: 112,
    education: [
      'Master of Public Administration - Kenyatta University',
      'Bachelor of Arts (Economics) - University of Nairobi'
    ],
    previousPostings: [
      'District Commissioner - Kandara (2018-2021)',
      'Assistant County Commissioner - Maragua (2015-2018)'
    ],
    performanceScore: 85,
    budgetAllocated: 'KES 88M',
    budgetSpent: 'KES 75M',
    utilizationRate: 85,
    leaveBalance: 20,
    recentTransfer: null,
    phoneNumber: '+254 712 345 004',
    email: 'j.gitau@interior.go.ke',
    expertise: ['Community Development', 'Agricultural Policy', 'Water Resource Management'],
    keyInitiatives: [
      'Community Water Projects Support',
      'Agricultural Extension Coordination',
      'Youth Employment Programs'
    ],
    challenges: [
      'Water scarcity management during dry seasons',
      'Supporting transition from subsistence to commercial farming'
    ]
  },
  {
    id: 'cc-nyeri-001',
    fullName: 'Margaret Wanjiku Kamau',
    initials: 'MWK',
    county: 'Nyeri',
    region: 'Central Region',
    regionalCommissioner: 'Mary Nyambura Njoroge',
    appointmentDate: 'May 2020',
    tenure: '3 yrs 9 mos',
    headquarters: 'Nyeri Town',
    subcountiesManaged: 6,
    populationServed: '760K',
    districtCommissioners: 6,
    totalStaff: 95,
    education: [
      'Master of Public Policy - University of Nairobi',
      'Bachelor of Education - Kenyatta University'
    ],
    previousPostings: [
      'District Commissioner - Nyeri Central (2017-2020)',
      'Assistant County Commissioner - Mukurweini (2014-2017)'
    ],
    performanceScore: 89,
    budgetAllocated: 'KES 75M',
    budgetSpent: 'KES 67M',
    utilizationRate: 89,
    leaveBalance: 17,
    recentTransfer: null,
    phoneNumber: '+254 712 345 005',
    email: 'm.kamau@interior.go.ke',
    expertise: ['Education Coordination', 'Tourism Development', 'Heritage Conservation'],
    keyInitiatives: [
      'Mt. Kenya Tourism Enhancement',
      'Heritage Site Protection Programs',
      'Educational Excellence Support'
    ],
    challenges: [
      'Managing tourism activities around Mt. Kenya ecosystem',
      'Balancing conservation with community livelihoods'
    ]
  },

  // Coast Region
  {
    id: 'cc-mombasa-001',
    fullName: 'Salim Hassan Mohamed',
    initials: 'SHM',
    county: 'Mombasa',
    region: 'Coast Region',
    regionalCommissioner: 'Rhoda Kanini Onyancha',
    appointmentDate: 'February 2022',
    tenure: '1 yr 11 mos',
    headquarters: 'Mombasa County HQ',
    subcountiesManaged: 6,
    populationServed: '1.2M',
    districtCommissioners: 6,
    totalStaff: 145,
    education: [
      'Master of International Relations - USIU',
      'Bachelor of Arts (Political Science) - Moi University'
    ],
    previousPostings: [
      'County Commissioner - Kilifi (2019-2022)',
      'District Commissioner - Kisauni (2016-2019)',
      'Assistant County Commissioner - Nyali (2013-2016)'
    ],
    performanceScore: 91,
    budgetAllocated: 'KES 125M',
    budgetSpent: 'KES 114M',
    utilizationRate: 91,
    leaveBalance: 16,
    recentTransfer: null,
    phoneNumber: '+254 712 345 006',
    email: 's.mohamed@interior.go.ke',
    expertise: ['Port Security', 'Maritime Administration', 'Counter-terrorism'],
    keyInitiatives: [
      'Port of Mombasa Security Enhancement',
      'Coastal Tourism Safety Programs',
      'Maritime Border Coordination'
    ],
    challenges: [
      'Managing complex port security and international trade flows',
      'Coordinating with maritime security agencies'
    ]
  },
  {
    id: 'cc-kwale-001',
    fullName: 'Fatuma Abdalla Omar',
    initials: 'FAO',
    county: 'Kwale',
    region: 'Coast Region',
    regionalCommissioner: 'Rhoda Kanini Onyancha',
    appointmentDate: 'September 2021',
    tenure: '2 yrs 5 mos',
    headquarters: 'Kwale Town',
    subcountiesManaged: 4,
    populationServed: '900K',
    districtCommissioners: 4,
    totalStaff: 78,
    education: [
      'Master of Public Administration - Kenyatta University',
      'Bachelor of Social Work - Pwani University'
    ],
    previousPostings: [
      'District Commissioner - Msambweni (2018-2021)',
      'Assistant County Commissioner - Kinango (2015-2018)'
    ],
    performanceScore: 87,
    budgetAllocated: 'KES 68M',
    budgetSpent: 'KES 59M',
    utilizationRate: 87,
    leaveBalance: 21,
    recentTransfer: null,
    phoneNumber: '+254 712 345 007',
    email: 'f.omar@interior.go.ke',
    expertise: ['Community Relations', 'Tourism Development', 'Cultural Heritage'],
    keyInitiatives: [
      'Coastal Tourism Development Support',
      'Community Land Rights Programs',
      'Cross-border Trade Facilitation (Tanzania)'
    ],
    challenges: [
      'Managing tourism development while protecting local communities',
      'Addressing historical land grievances'
    ]
  },

  // Rift Valley Region
  {
    id: 'cc-nakuru-001',
    fullName: 'Peter Mwangi Kuria',
    initials: 'PMK',
    county: 'Nakuru',
    region: 'Rift Valley Region',
    regionalCommissioner: 'George Natembeya',
    appointmentDate: 'March 2021',
    tenure: '2 yrs 11 mos',
    headquarters: 'Nakuru Town',
    subcountiesManaged: 11,
    populationServed: '2.2M',
    districtCommissioners: 11,
    totalStaff: 178,
    education: [
      'Master of Security Management - Kenyatta University',
      'Bachelor of Arts (Sociology) - Egerton University'
    ],
    previousPostings: [
      'County Commissioner - Baringo (2018-2021)',
      'District Commissioner - Nakuru East (2015-2018)',
      'Assistant County Commissioner - Rongai (2012-2015)'
    ],
    performanceScore: 88,
    budgetAllocated: 'KES 145M',
    budgetSpent: 'KES 128M',
    utilizationRate: 88,
    leaveBalance: 19,
    recentTransfer: null,
    phoneNumber: '+254 712 345 008',
    email: 'p.kuria@interior.go.ke',
    expertise: ['Conflict Resolution', 'Environmental Management', 'Agricultural Coordination'],
    keyInitiatives: [
      'Lake Nakuru Conservation Support',
      'Inter-ethnic Cohesion Programs',
      'Flamingo Migration Corridor Protection'
    ],
    challenges: [
      'Managing ethnic diversity and preventing conflict',
      'Balancing environmental conservation with agriculture'
    ]
  },

  // Western Region
  {
    id: 'cc-kakamega-001',
    fullName: 'Joyce Akinyi Odhiambo',
    initials: 'JAO',
    county: 'Kakamega',
    region: 'Western Region',
    regionalCommissioner: 'Irungu Macharia',
    appointmentDate: 'July 2020',
    tenure: '3 yrs 7 mos',
    headquarters: 'Kakamega Town',
    subcountiesManaged: 12,
    populationServed: '1.9M',
    districtCommissioners: 12,
    totalStaff: 165,
    education: [
      'Master of Development Studies - Maseno University',
      'Bachelor of Public Administration - Moi University'
    ],
    previousPostings: [
      'County Commissioner - Vihiga (2017-2020)',
      'District Commissioner - Mumias (2014-2017)',
      'Assistant County Commissioner - Lurambi (2011-2014)'
    ],
    performanceScore: 90,
    budgetAllocated: 'KES 132M',
    budgetSpent: 'KES 119M',
    utilizationRate: 90,
    leaveBalance: 14,
    recentTransfer: null,
    phoneNumber: '+254 712 345 009',
    email: 'j.odhiambo@interior.go.ke',
    expertise: ['Sugar Industry Coordination', 'Community Development', 'Agricultural Policy'],
    keyInitiatives: [
      'Kakamega Forest Conservation Programs',
      'Sugar Belt Revitalization Support',
      'Small-scale Mining Regulation'
    ],
    challenges: [
      'Supporting revival of sugar industry',
      'Protecting Kakamega Forest from encroachment'
    ]
  },

  // Nyanza Region
  {
    id: 'cc-kisumu-001',
    fullName: 'Michael Omondi Otieno',
    initials: 'MOO',
    county: 'Kisumu',
    region: 'Nyanza Region',
    regionalCommissioner: 'Magu Mutindika',
    appointmentDate: 'April 2021',
    tenure: '2 yrs 10 mos',
    headquarters: 'Kisumu City',
    subcountiesManaged: 7,
    populationServed: '1.2M',
    districtCommissioners: 7,
    totalStaff: 132,
    education: [
      'Master of Public Policy - University of Nairobi',
      'Bachelor of Economics - Maseno University'
    ],
    previousPostings: [
      'County Commissioner - Siaya (2018-2021)',
      'District Commissioner - Kisumu East (2015-2018)',
      'Assistant County Commissioner - Winam (2012-2015)'
    ],
    performanceScore: 89,
    budgetAllocated: 'KES 108M',
    budgetSpent: 'KES 96M',
    utilizationRate: 89,
    leaveBalance: 18,
    recentTransfer: null,
    phoneNumber: '+254 712 345 010',
    email: 'm.otieno@interior.go.ke',
    expertise: ['Urban Development', 'Fisheries Management', 'Lake Basin Coordination'],
    keyInitiatives: [
      'Lake Victoria Fisheries Protection',
      'Kisumu Port Revitalization',
      'Smart City Initiative Support'
    ],
    challenges: [
      'Managing fishing industry sustainability',
      'Coordinating lake basin development initiatives'
    ]
  },

  // Eastern Region
  {
    id: 'cc-machakos-001',
    fullName: 'Agnes Nduku Mutua',
    initials: 'ANM',
    county: 'Machakos',
    region: 'Eastern Region',
    regionalCommissioner: 'Wilfred Nyagwanga',
    appointmentDate: 'October 2021',
    tenure: '2 yrs 4 mos',
    headquarters: 'Machakos Town',
    subcountiesManaged: 8,
    populationServed: '1.4M',
    districtCommissioners: 8,
    totalStaff: 124,
    education: [
      'Master of Public Administration - Kenyatta University',
      'Bachelor of Arts (Sociology) - University of Nairobi'
    ],
    previousPostings: [
      'District Commissioner - Machakos Town (2018-2021)',
      'Assistant County Commissioner - Mavoko (2015-2018)'
    ],
    performanceScore: 86,
    budgetAllocated: 'KES 98M',
    budgetSpent: 'KES 84M',
    utilizationRate: 86,
    leaveBalance: 22,
    recentTransfer: null,
    phoneNumber: '+254 712 345 011',
    email: 'a.mutua@interior.go.ke',
    expertise: ['Water Management', 'Horticulture Development', 'Industrial Coordination'],
    keyInitiatives: [
      'Water Harvesting Programs',
      'Athi River Industrial Zone Coordination',
      'Horticulture Export Support'
    ],
    challenges: [
      'Managing water scarcity in semi-arid areas',
      'Supporting transition to commercial agriculture'
    ]
  },

  // North Eastern Region
  {
    id: 'cc-garissa-001',
    fullName: 'Boaz Cherutich Kiptoo',
    initials: 'BCK',
    county: 'Garissa',
    region: 'North Eastern Region',
    regionalCommissioner: 'Nicodemus Ndalana',
    appointmentDate: 'January 2023',
    tenure: '1 yr 1 mo',
    headquarters: 'Garissa Town',
    subcountiesManaged: 7,
    populationServed: '840K',
    districtCommissioners: 7,
    totalStaff: 118,
    education: [
      'Master of Security Studies - University of Nairobi',
      'Bachelor of Public Administration - Moi University'
    ],
    previousPostings: [
      'County Commissioner - Wajir (2020-2023)',
      'District Commissioner - Lagdera (2017-2020)',
      'Assistant County Commissioner - Dadaab (2014-2017)'
    ],
    performanceScore: 84,
    budgetAllocated: 'KES 92M',
    budgetSpent: 'KES 77M',
    utilizationRate: 84,
    leaveBalance: 25,
    recentTransfer: 'Recent transfer from Wajir',
    phoneNumber: '+254 712 345 012',
    email: 'b.kiptoo@interior.go.ke',
    expertise: ['Border Security', 'Refugee Management', 'Counter-terrorism'],
    keyInitiatives: [
      'Cross-border Security Enhancement (Somalia)',
      'Dadaab Refugee Camp Coordination',
      'Pastoralist Community Support'
    ],
    challenges: [
      'Managing complex security situation near Somalia border',
      'Coordinating large refugee population administration'
    ]
  }
];
