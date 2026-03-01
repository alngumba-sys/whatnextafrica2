// Kenya Government Ministries
// Based on https://www.kenyaembassyaddis.org/about-kenya/government-and-political-system/government-ministries/

export interface Ministry {
  id: string;
  name: string;
  abbreviation: string;
}

export const ministries: Ministry[] = [
  { id: "1", name: "Ministry of Interior and National Administration", abbreviation: "MoINA" },
  { id: "2", name: "Ministry of Foreign Affairs", abbreviation: "MoFA" },
  { id: "3", name: "Ministry of Defence", abbreviation: "MoD" },
  { id: "4", name: "Ministry of Education", abbreviation: "MoE" },
  { id: "5", name: "Ministry of Health", abbreviation: "MoH" },
  { id: "6", name: "Ministry of Agriculture and Livestock Development", abbreviation: "MoALD" },
  { id: "7", name: "Ministry of Finance and Economic Planning", abbreviation: "MoFEP" },
  { id: "8", name: "Ministry of Trade, Industry and Cooperatives", abbreviation: "MoTIC" },
  { id: "9", name: "Ministry of Energy and Petroleum", abbreviation: "MoEP" },
  { id: "10", name: "Ministry of Transport and Infrastructure", abbreviation: "MoTI" },
  { id: "11", name: "Ministry of Water, Sanitation and Irrigation", abbreviation: "MoWSI" },
  { id: "12", name: "Ministry of Environment, Climate Change and Forestry", abbreviation: "MoECCF" },
  { id: "13", name: "Ministry of Lands, Housing and Urban Development", abbreviation: "MoLHUD" },
  { id: "14", name: "Ministry of Tourism, Wildlife and Heritage", abbreviation: "MoTWH" },
  { id: "15", name: "Ministry of Sports, Youth Affairs and the Arts", abbreviation: "MoSYAA" },
  { id: "16", name: "Ministry of Labour and Social Protection", abbreviation: "MoLSP" },
  { id: "17", name: "Ministry of Public Service and Gender", abbreviation: "MoPSG" },
  { id: "18", name: "Ministry of ICT and Digital Economy", abbreviation: "MoICTDE" },
  { id: "19", name: "Ministry of Mining, Blue Economy and Maritime Affairs", abbreviation: "MoMBEMA" },
  { id: "20", name: "Ministry of East African Community and Regional Development", abbreviation: "MoEACRD" },
];
