export interface RegionalCommissioner {
  id: string;
  fullName: string;
  initials: string;
  region: string;
  headquarters: string;
  appointmentDate: string;
  tenure: string;
  countiesCovered: number;
  populationServed: string;
  countyCommissioners: number;
  totalStaff: number;
  education: string[];
  careerHistory: string[];
  yearsOfService: number;
  specializations?: string[];
  keyInitiatives: string[];
  recentActivities?: string[];
  performanceMetrics?: {
    securityIncidents?: string;
    projectCompletion?: string;
    staffSatisfaction?: string;
    citizenEngagement?: string;
    securityIncidentsHandled?: number;
    projectsCompleted?: number;
    budgetUtilization?: number;
    citizenSatisfactionScore?: number;
  };
  budgetInfo?: {
    allocated: number;
    spent: number;
    remaining: number;
    yearOverYear: string; // e.g., "+12%" or "-5%"
  };
  historicalData?: {
    transfers: Array<{
      date: string;
      from: string;
      to: string;
      reason: string;
    }>;
    promotions: Array<{
      date: string;
      from: string;
      to: string;
    }>;
    performanceTrend: Array<{
      quarter: string;
      score: number;
    }>;
  };
  riskFlags?: {
    retiringSoon?: boolean;
    excessiveLeave?: boolean;
    understaffed?: boolean;
    longTenureNoTransfer?: boolean;
  };
  budgetAllocated?: string;
  contact: {
    phone: string;
    email: string;
    address: string;
    officeHours: string;
  };
  leaveDays?: {
    annual: number;
    taken: number;
    remaining: number;
    sick: number;
  };
}

export const regionalCommissioners: RegionalCommissioner[] = [
  {
    id: "rc-1",
    fullName: "Dr. James Kamau Mwangi",
    initials: "JM",
    region: "Central Region",
    headquarters: "Nyeri",
    appointmentDate: "March 15, 2022",
    tenure: "2 years, 10 months",
    countiesCovered: 5,
    populationServed: "4.3M",
    countyCommissioners: 5,
    totalStaff: 247,
    education: [
      "PhD in Public Administration, University of Nairobi",
      "Master of Arts in Governance, Kenyatta University",
      "Bachelor of Arts in Political Science, University of Nairobi",
    ],
    careerHistory: [
      "County Commissioner, Kiambu County (2018-2022)",
      "Deputy County Commissioner, Nakuru (2015-2018)",
      "Assistant County Commissioner, Meru (2012-2015)",
      "District Officer, Various Locations (2008-2012)",
    ],
    yearsOfService: 18,
    specializations: [
      "Security Coordination",
      "Inter-County Relations",
      "Conflict Resolution",
      "Development Planning",
    ],
    keyInitiatives: [
      "Regional Security Enhancement Program - Coordinated inter-county security operations reducing crime by 32%",
      "Central Region Development Forum - Quarterly stakeholder meetings for regional planning",
      "Youth Empowerment Initiative - Training programs for 5,000+ youth in entrepreneurship",
      "Environmental Conservation Drive - Tree planting campaign with 2M trees planted",
      "Border Security Strengthening - Enhanced coordination between counties on border security",
    ],
    recentActivities: [
      "Inspection tour of Nyandarua County security installations (Jan 20, 2026)",
      "Chaired Regional Security Committee meeting in Nyeri (Jan 15, 2026)",
      "Attended national administrative officers conference in Nairobi (Jan 10, 2026)",
      "Launched farmer cooperative support program in Kirinyaga (Jan 5, 2026)",
    ],
    performanceMetrics: {
      securityIncidents: "↓ 28%",
      projectCompletion: "87%",
      staffSatisfaction: "4.5/5",
      citizenEngagement: "12,340 cases resolved",
    },
    budgetInfo: {
      allocated: 485000000,
      spent: 350000000,
      remaining: 135000000,
      yearOverYear: "+12%"
    },
    historicalData: {
      transfers: [
        {
          date: "March 15, 2022",
          from: "Kiambu County",
          to: "Nyeri",
          reason: "Promotion to Regional Commissioner"
        }
      ],
      promotions: [
        {
          date: "March 15, 2022",
          from: "County Commissioner",
          to: "Regional Commissioner"
        }
      ],
      performanceTrend: [
        {
          quarter: "Q1 2022",
          score: 85
        },
        {
          quarter: "Q2 2022",
          score: 88
        },
        {
          quarter: "Q3 2022",
          score: 90
        },
        {
          quarter: "Q4 2022",
          score: 92
        },
        {
          quarter: "Q1 2023",
          score: 94
        },
        {
          quarter: "Q2 2023",
          score: 95
        },
        {
          quarter: "Q3 2023",
          score: 96
        },
        {
          quarter: "Q4 2023",
          score: 97
        },
        {
          quarter: "Q1 2024",
          score: 98
        },
        {
          quarter: "Q2 2024",
          score: 99
        },
        {
          quarter: "Q3 2024",
          score: 100
        },
        {
          quarter: "Q4 2024",
          score: 100
        }
      ]
    },
    riskFlags: {
      retiringSoon: false,
      excessiveLeave: false,
      understaffed: false,
      longTenureNoTransfer: false
    },
    budgetAllocated: "KSh 485M",
    contact: {
      phone: "+254 712 345 001",
      email: "rc.central@interior.go.ke",
      address: "Regional Coordination Office, Nyeri Town, P.O. Box 1001-10100",
      officeHours: "Monday - Friday, 8:00 AM - 5:00 PM",
    },
    leaveDays: {
      annual: 30,
      taken: 12,
      remaining: 18,
      sick: 14,
    },
  },
  {
    id: "rc-2",
    fullName: "Ms. Grace Achieng Otieno",
    initials: "GA",
    region: "Nyanza Region",
    headquarters: "Kisumu",
    appointmentDate: "June 10, 2021",
    tenure: "3 years, 7 months",
    countiesCovered: 6,
    populationServed: "5.8M",
    countyCommissioners: 6,
    totalStaff: 312,
    education: [
      "Master of Public Policy, Strathmore University",
      "Bachelor of Laws (LLB), University of Nairobi",
      "Diploma in Leadership and Management, Kenya School of Government",
    ],
    careerHistory: [
      "County Commissioner, Siaya County (2017-2021)",
      "Deputy County Commissioner, Kisii (2014-2017)",
      "Assistant County Commissioner, Migori (2011-2014)",
      "Assistant Chief, Homa Bay District (2008-2011)",
    ],
    yearsOfService: 17,
    specializations: [
      "Community Policing",
      "Gender Mainstreaming",
      "Lake Region Security",
      "Disaster Management",
    ],
    keyInitiatives: [
      "Lake Victoria Security Initiative - Joint patrols with marine police reducing lake incidents",
      "Women Economic Empowerment Program - Grants and training for 3,000+ women entrepreneurs",
      "Regional Peace Building Forums - Monthly dialogue sessions with community leaders",
      "Education Access Campaign - Infrastructure support for schools in remote areas",
      "Health Service Delivery Enhancement - Coordinating mobile medical camps across the region",
    ],
    recentActivities: [
      "Launched fishing community support program in Homa Bay (Jan 18, 2026)",
      "Chaired inter-county cooperation meeting with 6 county commissioners (Jan 12, 2026)",
      "Inspected flood preparedness measures in Kisumu (Jan 8, 2026)",
      "Met with religious leaders to promote peace ahead of by-elections (Jan 3, 2026)",
    ],
    performanceMetrics: {
      crimeReduction: "↓ 24%",
      disasterResponse: "95% readiness",
      communityProjects: "142 completed",
      interCountyDisputes: "↓ 41%",
    },
    budgetInfo: {
      allocated: 567000000,
      spent: 450000000,
      remaining: 117000000,
      yearOverYear: "+10%"
    },
    historicalData: {
      transfers: [
        {
          date: "June 10, 2021",
          from: "Siaya County",
          to: "Kisumu",
          reason: "Promotion to Regional Commissioner"
        }
      ],
      promotions: [
        {
          date: "June 10, 2021",
          from: "County Commissioner",
          to: "Regional Commissioner"
        }
      ],
      performanceTrend: [
        {
          quarter: "Q1 2022",
          score: 85
        },
        {
          quarter: "Q2 2022",
          score: 88
        },
        {
          quarter: "Q3 2022",
          score: 90
        },
        {
          quarter: "Q4 2022",
          score: 92
        },
        {
          quarter: "Q1 2023",
          score: 94
        },
        {
          quarter: "Q2 2023",
          score: 95
        },
        {
          quarter: "Q3 2023",
          score: 96
        },
        {
          quarter: "Q4 2023",
          score: 97
        },
        {
          quarter: "Q1 2024",
          score: 98
        },
        {
          quarter: "Q2 2024",
          score: 99
        },
        {
          quarter: "Q3 2024",
          score: 100
        },
        {
          quarter: "Q4 2024",
          score: 100
        }
      ]
    },
    riskFlags: {
      retiringSoon: false,
      excessiveLeave: false,
      understaffed: false,
      longTenureNoTransfer: false
    },
    budgetAllocated: "KSh 567M",
    contact: {
      phone: "+254 723 456 002",
      email: "rc.nyanza@interior.go.ke",
      address: "Regional Office, Kisumu Central, P.O. Box 2002-40100",
      officeHours: "Monday - Friday, 8:00 AM - 5:00 PM",
    },
    leaveDays: {
      annual: 30,
      taken: 8,
      remaining: 22,
      sick: 14,
    },
  },
  {
    id: "rc-3",
    fullName: "Mr. Ahmed Hassan Mohamed",
    initials: "AH",
    region: "North Eastern Region",
    headquarters: "Garissa",
    appointmentDate: "September 1, 2020",
    tenure: "4 years, 4 months",
    countiesCovered: 3,
    populationServed: "2.1M",
    countyCommissioners: 3,
    totalStaff: 189,
    education: [
      "Master of Science in Security Management, Moi University",
      "Bachelor of Arts in International Relations, United States International University",
      "Advanced Diploma in Conflict Management, Kenya School of Government",
    ],
    careerHistory: [
      "County Commissioner, Wajir County (2016-2020)",
      "Deputy County Commissioner, Mandera (2013-2016)",
      "Assistant County Commissioner, Garissa (2010-2013)",
      "Provincial Administration Officer, Various Stations (2006-2010)",
    ],
    yearsOfService: 20,
    specializations: [
      "Border Security Management",
      "Counter-Terrorism Operations",
      "Pastoralist Community Relations",
      "Arid Lands Development",
    ],
    keyInitiatives: [
      "Border Security Enhancement Program - Strengthened surveillance along Somalia border",
      "Drought Resilience Initiative - Water infrastructure and livestock support programs",
      "Cross-Border Trade Facilitation - Formalized trade routes with enhanced security",
      "Community Reconciliation Forums - Inter-clan dialogue and peace-building sessions",
      "Education for Nomadic Communities - Mobile schools and scholarship programs for 2,000+ children",
    ],
    recentActivities: [
      "Supervised security operations along the Kenya-Somalia border (Jan 22, 2026)",
      "Launched drought relief distribution program in Wajir (Jan 17, 2026)",
      "Met with elders council for peace-building discussions (Jan 11, 2026)",
      "Inspected Kenya Police reservist training in Mandera (Jan 6, 2026)",
    ],
    performanceMetrics: {
      borderIncidents: "↓ 45%",
      communityPolicing: "78 nyumba kumi groups",
      droughtResponse: "23,000 families assisted",
      securityOperations: "156 successful",
    },
    budgetInfo: {
      allocated: 623000000,
      spent: 500000000,
      remaining: 123000000,
      yearOverYear: "+15%"
    },
    historicalData: {
      transfers: [
        {
          date: "September 1, 2020",
          from: "Wajir County",
          to: "Garissa",
          reason: "Promotion to Regional Commissioner"
        }
      ],
      promotions: [
        {
          date: "September 1, 2020",
          from: "County Commissioner",
          to: "Regional Commissioner"
        }
      ],
      performanceTrend: [
        {
          quarter: "Q1 2022",
          score: 85
        },
        {
          quarter: "Q2 2022",
          score: 88
        },
        {
          quarter: "Q3 2022",
          score: 90
        },
        {
          quarter: "Q4 2022",
          score: 92
        },
        {
          quarter: "Q1 2023",
          score: 94
        },
        {
          quarter: "Q2 2023",
          score: 95
        },
        {
          quarter: "Q3 2023",
          score: 96
        },
        {
          quarter: "Q4 2023",
          score: 97
        },
        {
          quarter: "Q1 2024",
          score: 98
        },
        {
          quarter: "Q2 2024",
          score: 99
        },
        {
          quarter: "Q3 2024",
          score: 100
        },
        {
          quarter: "Q4 2024",
          score: 100
        }
      ]
    },
    riskFlags: {
      retiringSoon: false,
      excessiveLeave: false,
      understaffed: false,
      longTenureNoTransfer: false
    },
    budgetAllocated: "KSh 623M",
    contact: {
      phone: "+254 734 567 003",
      email: "rc.northeastern@interior.go.ke",
      address: "Regional Headquarters, Garissa Town, P.O. Box 3003-70100",
      officeHours: "Monday - Friday, 8:00 AM - 5:00 PM",
    },
    leaveDays: {
      annual: 30,
      taken: 15,
      remaining: 15,
      sick: 14,
    },
  },
  {
    id: "rc-4",
    fullName: "Mrs. Caroline Wanjiru Njoroge",
    initials: "CN",
    region: "Rift Valley Region",
    headquarters: "Nakuru",
    appointmentDate: "January 20, 2021",
    tenure: "3 years",
    countiesCovered: 14,
    populationServed: "12.2M",
    countyCommissioners: 14,
    totalStaff: 658,
    education: [
      "Master of Arts in Peace Studies, University of Bradford (UK)",
      "Bachelor of Arts in Sociology, Egerton University",
      "Certificate in Advanced Security Management, Kenya School of Government",
    ],
    careerHistory: [
      "County Commissioner, Kajiado County (2018-2021)",
      "Deputy County Commissioner, Baringo (2015-2018)",
      "Assistant County Commissioner, Narok (2011-2015)",
      "District Officer, Nandi District (2007-2011)",
    ],
    yearsOfService: 19,
    specializations: [
      "Ethnic Conflict Resolution",
      "Multi-County Coordination",
      "Electoral Security",
      "Land Dispute Mediation",
    ],
    keyInitiatives: [
      "Regional Peace and Cohesion Program - Inter-ethnic dialogue forums reducing conflicts by 56%",
      "Rift Valley Economic Corridor Development - Coordinating 14 counties on infrastructure projects",
      "Farmer-Herder Conflict Resolution - Mediation framework resolving 230+ disputes",
      "Electoral Preparedness Campaign - Security planning for peaceful elections across region",
      "Climate Change Adaptation - Regional strategy for managing environmental challenges",
    ],
    recentActivities: [
      "Chaired Rift Valley Regional Commissioners forum in Nakuru (Jan 24, 2026)",
      "Mediated land dispute between two communities in Laikipia (Jan 19, 2026)",
      "Launched peace caravan in preparation for upcoming by-elections (Jan 14, 2026)",
      "Inspected security preparations for regional sports event in Eldoret (Jan 9, 2026)",
    ],
    performanceMetrics: {
      conflictResolution: "230 cases settled",
      peaceForums: "48 conducted",
      electoralPreparedness: "98%",
      landDisputes: "↓ 37%",
    },
    budgetInfo: {
      allocated: 1200000000,
      spent: 900000000,
      remaining: 300000000,
      yearOverYear: "+20%"
    },
    historicalData: {
      transfers: [
        {
          date: "January 20, 2021",
          from: "Kajiado County",
          to: "Nakuru",
          reason: "Promotion to Regional Commissioner"
        }
      ],
      promotions: [
        {
          date: "January 20, 2021",
          from: "County Commissioner",
          to: "Regional Commissioner"
        }
      ],
      performanceTrend: [
        {
          quarter: "Q1 2022",
          score: 85
        },
        {
          quarter: "Q2 2022",
          score: 88
        },
        {
          quarter: "Q3 2022",
          score: 90
        },
        {
          quarter: "Q4 2022",
          score: 92
        },
        {
          quarter: "Q1 2023",
          score: 94
        },
        {
          quarter: "Q2 2023",
          score: 95
        },
        {
          quarter: "Q3 2023",
          score: 96
        },
        {
          quarter: "Q4 2023",
          score: 97
        },
        {
          quarter: "Q1 2024",
          score: 98
        },
        {
          quarter: "Q2 2024",
          score: 99
        },
        {
          quarter: "Q3 2024",
          score: 100
        },
        {
          quarter: "Q4 2024",
          score: 100
        }
      ]
    },
    riskFlags: {
      retiringSoon: false,
      excessiveLeave: false,
      understaffed: false,
      longTenureNoTransfer: false
    },
    budgetAllocated: "KSh 1.2B",
    contact: {
      phone: "+254 745 678 004",
      email: "rc.riftvalley@interior.go.ke",
      address: "Regional Command Center, Nakuru Town, P.O. Box 4004-20100",
      officeHours: "Monday - Friday, 8:00 AM - 5:00 PM",
    },
    leaveDays: {
      annual: 30,
      taken: 9,
      remaining: 21,
      sick: 14,
    },
  },
  {
    id: "rc-5",
    fullName: "Mr. David Kiplagat Rotich",
    initials: "DK",
    region: "Western Region",
    headquarters: "Kakamega",
    appointmentDate: "April 5, 2022",
    tenure: "2 years, 9 months",
    countiesCovered: 4,
    populationServed: "5.1M",
    countyCommissioners: 4,
    totalStaff: 276,
    education: [
      "Master of Public Administration, University of Nairobi",
      "Bachelor of Commerce, Kenyatta University",
      "Diploma in Project Management, Kenya Institute of Management",
    ],
    careerHistory: [
      "County Commissioner, Bungoma County (2019-2022)",
      "Deputy County Commissioner, Kakamega (2016-2019)",
      "Assistant County Commissioner, Vihiga (2013-2016)",
      "Assistant Chief, Busia District (2009-2013)",
    ],
    yearsOfService: 16,
    specializations: [
      "Rural Development",
      "Agricultural Coordination",
      "Public Service Delivery",
      "Youth Affairs",
    ],
    keyInitiatives: [
      "Western Region Sugar Belt Revitalization - Coordinating support for sugar farmers",
      "Cross-Border Trade Management - Enhanced cooperation with Uganda on trade security",
      "Youth Sports and Talent Development - Regional tournaments and talent identification programs",
      "Education Excellence Campaign - Bursary programs and school infrastructure support",
      "Healthcare Access Initiative - Mobile clinics serving remote villages across 4 counties",
    ],
    recentActivities: [
      "Launched sugarcane farmers cooperative support program (Jan 23, 2026)",
      "Inspected Kenya-Uganda border points in Busia (Jan 16, 2026)",
      "Chaired regional youth affairs meeting in Kakamega (Jan 13, 2026)",
      "Attended inter-county sports event in Vihiga (Jan 7, 2026)",
    ],
    performanceMetrics: {
      youthPrograms: "87 initiatives",
      borderSecurity: "↑ 43% efficiency",
      agriculturalSupport: "15,000 farmers",
      healthcareReach: "34,000 beneficiaries",
    },
    budgetInfo: {
      allocated: 512000000,
      spent: 400000000,
      remaining: 112000000,
      yearOverYear: "+10%"
    },
    historicalData: {
      transfers: [
        {
          date: "April 5, 2022",
          from: "Bungoma County",
          to: "Kakamega",
          reason: "Promotion to Regional Commissioner"
        }
      ],
      promotions: [
        {
          date: "April 5, 2022",
          from: "County Commissioner",
          to: "Regional Commissioner"
        }
      ],
      performanceTrend: [
        {
          quarter: "Q1 2022",
          score: 85
        },
        {
          quarter: "Q2 2022",
          score: 88
        },
        {
          quarter: "Q3 2022",
          score: 90
        },
        {
          quarter: "Q4 2022",
          score: 92
        },
        {
          quarter: "Q1 2023",
          score: 94
        },
        {
          quarter: "Q2 2023",
          score: 95
        },
        {
          quarter: "Q3 2023",
          score: 96
        },
        {
          quarter: "Q4 2023",
          score: 97
        },
        {
          quarter: "Q1 2024",
          score: 98
        },
        {
          quarter: "Q2 2024",
          score: 99
        },
        {
          quarter: "Q3 2024",
          score: 100
        },
        {
          quarter: "Q4 2024",
          score: 100
        }
      ]
    },
    riskFlags: {
      retiringSoon: false,
      excessiveLeave: false,
      understaffed: false,
      longTenureNoTransfer: false
    },
    budgetAllocated: "KSh 512M",
    contact: {
      phone: "+254 756 789 005",
      email: "rc.western@interior.go.ke",
      address: "Regional Offices, Kakamega Town, P.O. Box 5005-50100",
      officeHours: "Monday - Friday, 8:00 AM - 5:00 PM",
    },
    leaveDays: {
      annual: 30,
      taken: 11,
      remaining: 19,
      sick: 14,
    },
  },
  {
    id: "rc-6",
    fullName: "Dr. Fatuma Ali Juma",
    initials: "FA",
    region: "Coast Region",
    headquarters: "Mombasa",
    appointmentDate: "July 15, 2021",
    tenure: "3 years, 6 months",
    countiesCovered: 6,
    populationServed: "4.7M",
    countyCommissioners: 6,
    totalStaff: 298,
    education: [
      "PhD in Criminology and Security Studies, University of Cape Town",
      "Master of Arts in International Relations, University of Nairobi",
      "Bachelor of Arts in Political Science, Pwani University",
    ],
    careerHistory: [
      "County Commissioner, Kilifi County (2018-2021)",
      "Deputy County Commissioner, Mombasa (2015-2018)",
      "Assistant County Commissioner, Kwale (2012-2015)",
      "District Officer, Lamu District (2008-2012)",
    ],
    yearsOfService: 18,
    specializations: [
      "Maritime Security",
      "Counter-Radicalization",
      "Tourism Safety",
      "Coastal Development",
    ],
    keyInitiatives: [
      "Blue Economy Security Initiative - Protecting maritime resources and fishing communities",
      "Tourism Safety Enhancement Program - Coordinated security for tourist areas reducing incidents by 41%",
      "Counter-Radicalization Community Program - Youth engagement and community awareness campaigns",
      "Coastal Erosion Response - Coordinating with environmental agencies on coastal protection",
      "Port Security Coordination - Enhanced security measures at Mombasa Port and Lamu Port",
    ],
    recentActivities: [
      "Chaired maritime security meeting with Navy and Coast Guard (Jan 25, 2026)",
      "Launched fishing community support initiative in Kilifi (Jan 21, 2026)",
      "Inspected tourist security measures in Diani Beach (Jan 15, 2026)",
      "Met with religious leaders for counter-radicalization dialogue (Jan 10, 2026)",
    ],
    performanceMetrics: {
      maritimeSecurity: "↓ 52% incidents",
      tourismSafety: "98.5% rating",
      counterRadicalization: "56 programs",
      portSecurity: "Zero breaches",
    },
    budgetInfo: {
      allocated: 634000000,
      spent: 500000000,
      remaining: 134000000,
      yearOverYear: "+15%"
    },
    historicalData: {
      transfers: [
        {
          date: "July 15, 2021",
          from: "Kilifi County",
          to: "Mombasa",
          reason: "Promotion to Regional Commissioner"
        }
      ],
      promotions: [
        {
          date: "July 15, 2021",
          from: "County Commissioner",
          to: "Regional Commissioner"
        }
      ],
      performanceTrend: [
        {
          quarter: "Q1 2022",
          score: 85
        },
        {
          quarter: "Q2 2022",
          score: 88
        },
        {
          quarter: "Q3 2022",
          score: 90
        },
        {
          quarter: "Q4 2022",
          score: 92
        },
        {
          quarter: "Q1 2023",
          score: 94
        },
        {
          quarter: "Q2 2023",
          score: 95
        },
        {
          quarter: "Q3 2023",
          score: 96
        },
        {
          quarter: "Q4 2023",
          score: 97
        },
        {
          quarter: "Q1 2024",
          score: 98
        },
        {
          quarter: "Q2 2024",
          score: 99
        },
        {
          quarter: "Q3 2024",
          score: 100
        },
        {
          quarter: "Q4 2024",
          score: 100
        }
      ]
    },
    riskFlags: {
      retiringSoon: false,
      excessiveLeave: false,
      understaffed: false,
      longTenureNoTransfer: false
    },
    budgetAllocated: "KSh 634M",
    contact: {
      phone: "+254 767 890 006",
      email: "rc.coast@interior.go.ke",
      address: "Regional Command Center, Mombasa Island, P.O. Box 6006-80100",
      officeHours: "Monday - Friday, 8:00 AM - 5:00 PM",
    },
    leaveDays: {
      annual: 30,
      taken: 10,
      remaining: 20,
      sick: 14,
    },
  },
  {
    id: "rc-7",
    fullName: "Mr. Peter Mwenda Mutua",
    initials: "PM",
    region: "Eastern Region",
    headquarters: "Embu",
    appointmentDate: "November 10, 2021",
    tenure: "3 years, 2 months",
    countiesCovered: 8,
    populationServed: "6.2M",
    countyCommissioners: 8,
    totalStaff: 423,
    education: [
      "Master of Science in Development Studies, University of Nairobi",
      "Bachelor of Arts in Economics, Kenyatta University",
      "Advanced Certificate in Public Administration, Kenya School of Government",
    ],
    careerHistory: [
      "County Commissioner, Machakos County (2018-2021)",
      "Deputy County Commissioner, Kitui (2015-2018)",
      "Assistant County Commissioner, Makueni (2012-2015)",
      "District Officer, Meru District (2008-2012)",
    ],
    yearsOfService: 17,
    specializations: [
      "Disaster Management",
      "Food Security",
      "Water Resource Management",
      "Infrastructure Development",
    ],
    keyInitiatives: [
      "Eastern Region Water Security Program - Coordinating water projects across 8 counties",
      "Drought and Famine Mitigation - Early warning systems and emergency response protocols",
      "Agricultural Productivity Enhancement - Farmer training and modern farming techniques",
      "Road Infrastructure Advocacy - Lobbying for improved road network in the region",
      "Community Empowerment Centers - Establishing resource centers in all 8 counties",
    ],
    recentActivities: [
      "Launched water project in Kitui County (Jan 26, 2026)",
      "Chaired regional disaster management committee meeting (Jan 20, 2026)",
      "Inspected food distribution centers in Makueni (Jan 14, 2026)",
      "Met with farmers' cooperatives in Tharaka Nithi (Jan 8, 2026)",
    ],
    performanceMetrics: {
      waterProjects: "34 completed",
      foodSecurity: "87,000 families",
      disasterPreparedness: "92%",
      infrastructureProjects: "67 ongoing",
    },
    budgetInfo: {
      allocated: 578000000,
      spent: 450000000,
      remaining: 128000000,
      yearOverYear: "+10%"
    },
    historicalData: {
      transfers: [
        {
          date: "November 10, 2021",
          from: "Machakos County",
          to: "Embu",
          reason: "Promotion to Regional Commissioner"
        }
      ],
      promotions: [
        {
          date: "November 10, 2021",
          from: "County Commissioner",
          to: "Regional Commissioner"
        }
      ],
      performanceTrend: [
        {
          quarter: "Q1 2022",
          score: 85
        },
        {
          quarter: "Q2 2022",
          score: 88
        },
        {
          quarter: "Q3 2022",
          score: 90
        },
        {
          quarter: "Q4 2022",
          score: 92
        },
        {
          quarter: "Q1 2023",
          score: 94
        },
        {
          quarter: "Q2 2023",
          score: 95
        },
        {
          quarter: "Q3 2023",
          score: 96
        },
        {
          quarter: "Q4 2023",
          score: 97
        },
        {
          quarter: "Q1 2024",
          score: 98
        },
        {
          quarter: "Q2 2024",
          score: 99
        },
        {
          quarter: "Q3 2024",
          score: 100
        },
        {
          quarter: "Q4 2024",
          score: 100
        }
      ]
    },
    riskFlags: {
      retiringSoon: false,
      excessiveLeave: false,
      understaffed: false,
      longTenureNoTransfer: false
    },
    budgetAllocated: "KSh 578M",
    contact: {
      phone: "+254 778 901 007",
      email: "rc.eastern@interior.go.ke",
      address: "Regional Coordination Office, Embu Town, P.O. Box 7007-60100",
      officeHours: "Monday - Friday, 8:00 AM - 5:00 PM",
    },
    leaveDays: {
      annual: 30,
      taken: 13,
      remaining: 17,
      sick: 14,
    },
  },
  {
    id: "rc-8",
    fullName: "Ms. Lucy Nyambura Karanja",
    initials: "LN",
    region: "Nairobi Metropolitan Region",
    headquarters: "Nairobi",
    appointmentDate: "February 1, 2020",
    tenure: "4 years, 11 months",
    countiesCovered: 3,
    populationServed: "9.5M",
    countyCommissioners: 3,
    totalStaff: 512,
    education: [
      "Master of Arts in Urban Governance, Strathmore University",
      "Bachelor of Social Sciences, University of Nairobi",
      "Certificate in Security Management, FBI National Academy (USA)",
    ],
    careerHistory: [
      "County Commissioner, Nairobi County (2017-2020)",
      "Deputy County Commissioner, Kiambu (2014-2017)",
      "Assistant County Commissioner, Kajiado (2011-2014)",
      "Chief, Nairobi District (2007-2011)",
    ],
    yearsOfService: 19,
    specializations: [
      "Urban Security Management",
      "Metropolitan Coordination",
      "Organized Crime Prevention",
      "Public Order Management",
    ],
    keyInitiatives: [
      "Metropolitan Security Integration - Coordinating Nairobi, Kiambu, and Kajiado security operations",
      "Urban Crime Prevention Program - Multi-agency approach reducing major crimes by 34%",
      "Traffic Management Coordination - Working with police to ease congestion in metropolitan area",
      "Slum Upgrading Support - Coordinating with county governments on informal settlements",
      "Business Security Enhancement - Liaison with business community for commercial district safety",
    ],
    recentActivities: [
      "Chaired metropolitan security meeting with all stakeholders (Jan 27, 2026)",
      "Launched community policing initiative in Eastlands (Jan 22, 2026)",
      "Inspected traffic management measures on Thika Road (Jan 18, 2026)",
      "Met with business associations on CBD security (Jan 11, 2026)",
    ],
    performanceMetrics: {
      crimeReduction: "↓ 34%",
      publicOrderEvents: "1,247 managed",
      interCountyOps: "234 joint operations",
      responseTime: "↓ 28% faster",
    },
    budgetInfo: {
      allocated: 1800000000,
      spent: 1400000000,
      remaining: 400000000,
      yearOverYear: "+20%"
    },
    historicalData: {
      transfers: [
        {
          date: "February 1, 2020",
          from: "Nairobi County",
          to: "Nairobi",
          reason: "Promotion to Regional Commissioner"
        }
      ],
      promotions: [
        {
          date: "February 1, 2020",
          from: "County Commissioner",
          to: "Regional Commissioner"
        }
      ],
      performanceTrend: [
        {
          quarter: "Q1 2022",
          score: 85
        },
        {
          quarter: "Q2 2022",
          score: 88
        },
        {
          quarter: "Q3 2022",
          score: 90
        },
        {
          quarter: "Q4 2022",
          score: 92
        },
        {
          quarter: "Q1 2023",
          score: 94
        },
        {
          quarter: "Q2 2023",
          score: 95
        },
        {
          quarter: "Q3 2023",
          score: 96
        },
        {
          quarter: "Q4 2023",
          score: 97
        },
        {
          quarter: "Q1 2024",
          score: 98
        },
        {
          quarter: "Q2 2024",
          score: 99
        },
        {
          quarter: "Q3 2024",
          score: 100
        },
        {
          quarter: "Q4 2024",
          score: 100
        }
      ]
    },
    riskFlags: {
      retiringSoon: false,
      excessiveLeave: false,
      understaffed: false,
      longTenureNoTransfer: false
    },
    budgetAllocated: "KSh 1.8B",
    contact: {
      phone: "+254 789 012 008",
      email: "rc.nairobi@interior.go.ke",
      address: "Regional Command Center, Harambee Avenue, Nairobi, P.O. Box 8008-00100",
      officeHours: "Monday - Friday, 8:00 AM - 5:00 PM",
    },
    leaveDays: {
      annual: 30,
      taken: 14,
      remaining: 16,
      sick: 14,
    },
  },
];