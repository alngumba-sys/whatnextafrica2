import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { 
  User, 
  MapPin, 
  Building, 
  Phone, 
  Mail, 
  FileText, 
  Target, 
  DollarSign,
  BarChart3,
  Calendar,
  X,
  Check,
  Plus,
  Trash2
} from 'lucide-react';
import { useCreatedUsers } from '@/contexts/CreatedUsersContext';
import { toast } from 'sonner';

interface CreateNewUserDialogProps {
  onClose: () => void;
}

interface Initiative {
  id: string;
  title: string;
  description: string;
}

// Administrative hierarchy data structures
const REGION_COUNTY_MAPPING: Record<string, string[]> = {
  'nairobi': ['Nairobi', 'Kajiado', 'Kiambu'],
  'central': ['Nyeri', 'Murang\'a', 'Kirinyaga', 'Nyandarua', 'Laikipia'],
  'coast': ['Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita-Taveta'],
  'eastern': ['Embu', 'Tharaka-Nithi', 'Meru', 'Isiolo', 'Marsabit', 'Kitui', 'Machakos', 'Makueni'],
  'nyanza': ['Kisumu', 'Siaya', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira'],
  'rift-valley': ['Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma', 'Busia', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo-Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Samburu', 'West Pokot', 'Turkana'],
  'western': ['Kakamega', 'Vihiga', 'Bungoma', 'Busia'],
  'north-eastern': ['Garissa', 'Wajir', 'Mandera']
};

const COUNTY_SUBCOUNTY_MAPPING: Record<string, string[]> = {
  'Nairobi': ['Westlands', 'Dagoretti North', 'Dagoretti South', 'Lang\'ata', 'Kibra', 'Roysambu', 'Kasarani', 'Ruaraka', 'Embakasi South', 'Embakasi North', 'Embakasi Central', 'Embakasi East', 'Embakasi West', 'Makadara', 'Kamukunji', 'Starehe', 'Mathare'],
  'Kajiado': ['Kajiado North', 'Kajiado Central', 'Kajiado East', 'Kajiado West', 'Kajiado South'],
  'Kiambu': ['Kiambu', 'Thika Town', 'Ruiru', 'Juja', 'Gatundu South', 'Gatundu North', 'Githunguri', 'Kiambaa', 'Kabete', 'Kikuyu', 'Limuru', 'Lari'],
  'Mombasa': ['Changamwe', 'Jomvu', 'Kisauni', 'Nyali', 'Likoni', 'Mvita'],
  'Kwale': ['Msambweni', 'Lunga Lunga', 'Matuga', 'Kinango'],
  'Kilifi': ['Kilifi North', 'Kilifi South', 'Kaloleni', 'Rabai', 'Ganze', 'Malindi', 'Magarini'],
  'Tana River': ['Galole', 'Bura', 'Garsen'],
  'Lamu': ['Lamu East', 'Lamu West'],
  'Taita-Taveta': ['Taveta', 'Wundanyi', 'Mwatate', 'Voi'],
  'Kisumu': ['Kisumu East', 'Kisumu West', 'Kisumu Central', 'Seme', 'Nyando', 'Muhoroni', 'Nyakach'],
  'Nakuru': ['Nakuru Town East', 'Nakuru Town West', 'Gilgil', 'Naivasha', 'Molo', 'Njoro', 'Rongai', 'Subukia', 'Kuresoi South', 'Kuresoi North', 'Bahati'],
  'Nyeri': ['Nyeri Town', 'Tetu', 'Kieni', 'Mathira', 'Othaya', 'Mukurweini'],
  'Muranga': ['Maragwa', 'Kigumo', 'Mathioya', 'Kangema', 'Gatanga', 'Kiharu', 'Kandara'],
  'Kirinyaga': ['Kirinyaga Central', 'Kirinyaga East', 'Kirinyaga West', 'Mwea'],
  'Nyandarua': ['Kinangop', 'Kipipiri', 'Ol Kalou', 'Ol Jorok', 'Ndaragwa'],
  'Laikipia': ['Laikipia East', 'Laikipia West', 'Laikipia North'],
  'Embu': ['Manyatta', 'Runyenjes', 'Mbeere South', 'Mbeere North'],
  'Tharaka-Nithi': ['Tharaka', 'Chuka/Igambang\'ombe', 'Maara'],
  'Meru': ['Igembe South', 'Igembe Central', 'Igembe North', 'Tigania West', 'Tigania East', 'North Imenti', 'Buuri', 'Central Imenti', 'South Imenti'],
  'Isiolo': ['Isiolo North', 'Isiolo South'],
  'Marsabit': ['Moyale', 'North Horr', 'Saku', 'Laisamis'],
  'Kitui': ['Kitui Central', 'Kitui West', 'Kitui Rural', 'Kitui South', 'Kitui East', 'Mwingi North', 'Mwingi West', 'Mwingi Central'],
  'Machakos': ['Machakos Town', 'Mavoko', 'Kathiani', 'Yatta', 'Kangundo', 'Matungulu', 'Mwala', 'Masinga'],
  'Makueni': ['Makueni', 'Kibwezi West', 'Kibwezi East', 'Kilome', 'Kaiti', 'Mbooni'],
  'Siaya': ['Alego Usonga', 'Gem', 'Ugenya', 'Ugunja', 'Bondo', 'Rarieda'],
  'Homa Bay': ['Kasipul', 'Kabondo Kasipul', 'Karachuonyo', 'Rangwe', 'Homa Bay Town', 'Ndhiwa', 'Suba North', 'Suba South'],
  'Migori': ['Rongo', 'Awendo', 'Suna East', 'Suna West', 'Uriri', 'Nyatike', 'Kuria West', 'Kuria East'],
  'Kisii': ['Kitutu Chache North', 'Kitutu Chache South', 'Nyaribari Masaba', 'Nyaribari Chache', 'Bobasi', 'South Mugirango', 'Bomachoge Borabu', 'Bomachoge Chache', 'Bonchari'],
  'Nyamira': ['Kitutu Masaba', 'West Mugirango', 'North Mugirango', 'Borabu'],
  'Narok': ['Narok North', 'Narok South', 'Narok East', 'Narok West', 'Transmara West', 'Transmara East'],
  'Kericho': ['Kipkelion East', 'Kipkelion West', 'Ainamoi', 'Bureti', 'Belgut', 'Sigowet/Soin'],
  'Bomet': ['Sotik', 'Chepalungu', 'Bomet East', 'Bomet Central', 'Konoin'],
  'Kakamega': ['Butere', 'Mumias West', 'Mumias East', 'Matungu', 'Khwisero', 'Shinyalu', 'Lurambi', 'Ikolomani', 'Lugari', 'Malava', 'Navakholo', 'Likuyani'],
  'Vihiga': ['Vihiga', 'Sabatia', 'Hamisi', 'Luanda', 'Emuhaya'],
  'Bungoma': ['Bumula', 'Kabuchai', 'Sirisia', 'Tongaren', 'Webuye East', 'Webuye West', 'Kimilili', 'Mt. Elgon', 'Kanduyi'],
  'Busia': ['Teso North', 'Teso South', 'Nambale', 'Matayos', 'Butula', 'Funyula', 'Budalangi'],
  'Trans Nzoia': ['Cherangany', 'Endebess', 'Saboti', 'Kiminini', 'Kwanza'],
  'Uasin Gishu': ['Ainabkoi', 'Kapseret', 'Kesses', 'Moiben', 'Soy', 'Turbo'],
  'Elgeyo-Marakwet': ['Keiyo North', 'Keiyo South', 'Marakwet East', 'Marakwet West'],
  'Nandi': ['Tinderet', 'Aldai', 'Nandi Hills', 'Chesumei', 'Emgwen', 'Mosop'],
  'Baringo': ['Baringo North', 'Baringo Central', 'Baringo South', 'Mogotio', 'Eldama Ravine', 'Tiaty'],
  'Samburu': ['Samburu North', 'Samburu Central', 'Samburu East'],
  'West Pokot': ['Kacheliba', 'Kapenguria', 'Sigor', 'Pokot South'],
  'Turkana': ['Turkana North', 'Turkana West', 'Turkana Central', 'Loima', 'Turkana South', 'Turkana East', 'Kibish'],
  'Garissa': ['Garissa Township', 'Balambala', 'Lagdera', 'Dadaab', 'Fafi', 'Ijara'],
  'Wajir': ['Wajir North', 'Wajir East', 'Tarbaj', 'Wajir West', 'Eldas', 'Wajir South'],
  'Mandera': ['Mandera West', 'Banissa', 'Mandera North', 'Mandera South', 'Mandera East', 'Lafey']
};

const SUBCOUNTY_HEADQUARTERS_MAPPING: Record<string, string> = {
  'Westlands': 'Westlands - Parklands Office',
  'Dagoretti North': 'Dagoretti North - Kawangware',
  'Dagoretti South': 'Dagoretti South - Riruta',
  'Lang\'ata': 'Lang\'ata - Karen',
  'Kibra': 'Kibra - Olympic',
  'Roysambu': 'Roysambu - Kahawa West',
  'Kasarani': 'Kasarani - Mwiki',
  'Ruaraka': 'Ruaraka - Utalii',
  'Kajiado North': 'Kajiado North - Ongata Rongai',
  'Kajiado Central': 'Kajiado Central - Kajiado Town',
  'Kajiado East': 'Kajiado East - Kitengela',
  'Kajiado West': 'Kajiado West - Magadi',
  'Kajiado South': 'Kajiado South - Namanga',
  'Kiambu': 'Kiambu Town',
  'Thika Town': 'Thika Municipal Office',
  'Ruiru': 'Ruiru Town',
  'Nakuru Town East': 'Nakuru - Milimani',
  'Nakuru Town West': 'Nakuru - Kwa Rhonda',
  'Kisumu East': 'Kisumu - Kondele',
  'Kisumu West': 'Kisumu - Manyatta',
  'Changamwe': 'Mombasa - Changamwe',
  'Mvita': 'Mombasa - Treasury Square'
};

const COUNTY_HEADQUARTERS: Record<string, string> = {
  'Nairobi': 'Nairobi - Harambee House',
  'Kajiado': 'Kajiado Town',
  'Kiambu': 'Kiambu Town',
  'Mombasa': 'Mombasa - Treasury Square',
  'Kisumu': 'Kisumu - Kondele',
  'Nakuru': 'Nakuru - Milimani',
  'Nyeri': 'Nyeri Town',
  'Embu': 'Embu Town',
  'Garissa': 'Garissa Town',
  'Kakamega': 'Kakamega Town'
};

// Department to superior officers mapping
const DEPARTMENT_SUPERIORS: Record<string, Array<{id: string, name: string, role: string}>> = {
  'county-admin': [
    { id: 'sna-001', name: 'Dr. Raymond Omollo (Secretary National Administrator)', role: 'SNA' },
    { id: 'rc-001', name: 'James Kianda (Regional Commissioner - Nairobi)', role: 'RC' },
    { id: 'rc-002', name: 'Mwende Mwinzi (Regional Commissioner - Central)', role: 'RC' },
    { id: 'rc-003', name: 'Mohamed Hassan (Regional Commissioner - Coast)', role: 'RC' },
    { id: 'cc-001', name: 'Wilson Njenga Kariuki (County Commissioner - Nairobi)', role: 'CC' }
  ],
  'national-admin': [
    { id: 'sna-001', name: 'Dr. Raymond Omollo (Secretary National Administrator)', role: 'SNA' },
    { id: 'ps-001', name: 'Dr. Mary Muthoni (Principal Secretary)', role: 'PS' }
  ],
  'security': [
    { id: 'rc-001', name: 'James Kianda (Regional Commissioner - Nairobi)', role: 'RC' },
    { id: 'rc-003', name: 'Mohamed Hassan (Regional Commissioner - Coast)', role: 'RC' },
    { id: 'cc-001', name: 'Wilson Njenga Kariuki (County Commissioner - Nairobi)', role: 'CC' }
  ],
  'devolution': [
    { id: 'ps-001', name: 'Dr. Mary Muthoni (Principal Secretary)', role: 'PS' },
    { id: 'cc-001', name: 'Wilson Njenga Kariuki (County Commissioner - Nairobi)', role: 'CC' }
  ],
  'border-management': [
    { id: 'rc-003', name: 'Mohamed Hassan (Regional Commissioner - Coast)', role: 'RC' },
    { id: 'rc-008', name: 'Abdi Ibrahim (Regional Commissioner - North Eastern)', role: 'RC' }
  ],
  'special-programs': [
    { id: 'sna-001', name: 'Dr. Raymond Omollo (Secretary National Administrator)', role: 'SNA' },
    { id: 'ps-001', name: 'Dr. Mary Muthoni (Principal Secretary)', role: 'PS' }
  ]
};

export function CreateNewUserDialog({ onClose }: CreateNewUserDialogProps) {
  const { addUser } = useCreatedUsers();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Personal Information & Role
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationalId: '',
    role: '',
    position: '',
    department: '',
    reportingTo: '',
    
    // Step 2: Location & Background
    region: '',
    county: '',
    subcounty: '',
    headquarters: '',
    jurisdictionOverview: '',
    education: '',
    yearsOfExperience: '',
    previousPositions: '',
    expertise: [] as string[],
    
    // Step 3: Budget & Initiatives
    budgetAllocated: '',
    performanceTarget: '',
    kpiMetrics: '',
    initiatives: [] as Initiative[]
  });

  const [expertiseInput, setExpertiseInput] = useState('');
  const [initiativeTitle, setInitiativeTitle] = useState('');
  const [initiativeDesc, setInitiativeDesc] = useState('');

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Handle cascading resets
    if (field === 'region') {
      // Reset county, subcounty, and headquarters when region changes
      setFormData(prev => ({ 
        ...prev, 
        [field]: value,
        county: '',
        subcounty: '',
        headquarters: ''
      }));
    } else if (field === 'county') {
      // Reset subcounty and headquarters when county changes
      setFormData(prev => ({ 
        ...prev, 
        [field]: value,
        subcounty: '',
        headquarters: ''
      }));
    } else if (field === 'subcounty') {
      // Auto-set headquarters when subcounty is selected
      // First check if there's a specific mapping, otherwise generate from subcounty name
      const hq = SUBCOUNTY_HEADQUARTERS_MAPPING[value] || `${value} - District Office`;
      setFormData(prev => ({ 
        ...prev, 
        [field]: value,
        headquarters: hq
      }));
    } else if (field === 'department') {
      // Reset reportingTo when department changes
      setFormData(prev => ({ 
        ...prev, 
        [field]: value,
        reportingTo: ''
      }));
    }
  };

  const addExpertise = () => {
    if (expertiseInput.trim()) {
      updateField('expertise', [...formData.expertise, expertiseInput.trim()]);
      setExpertiseInput('');
    }
  };

  const removeExpertise = (index: number) => {
    updateField('expertise', formData.expertise.filter((_, i) => i !== index));
  };

  const addInitiative = () => {
    if (initiativeTitle.trim() && initiativeDesc.trim()) {
      const newInitiative: Initiative = {
        id: Date.now().toString(),
        title: initiativeTitle.trim(),
        description: initiativeDesc.trim()
      };
      updateField('initiatives', [...formData.initiatives, newInitiative]);
      setInitiativeTitle('');
      setInitiativeDesc('');
    }
  };

  const removeInitiative = (id: string) => {
    updateField('initiatives', formData.initiatives.filter(i => i.id !== id));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Here you would handle the form submission
    console.log('Form submitted:', formData);
    addUser(formData);
    toast.success('User created successfully!');
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="px-6 pt-4 pb-3 border-b bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">Create New Employee</DialogTitle>
              <DialogDescription className="text-gray-600 mt-1">
                Add a new officer to the Kenya National Administration system
              </DialogDescription>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="my-4 px-6">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step === currentStep 
                    ? 'bg-violet-600 border-violet-600 text-white' 
                    : step < currentStep
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {step < currentStep ? <Check className="w-4 h-4" /> : step}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-600 text-center mt-1">
            Step {currentStep} of {totalSteps}: {
              currentStep === 1 ? 'Personal Information & Role' :
              currentStep === 2 ? 'Location & Background' :
              'Budget & Initiatives'
            }
          </div>
        </div>

        {/* Form Content */}
        <div className="space-y-4 px-6 pb-4">
          {/* Step 1: Personal Information & Role */}
          {currentStep === 1 && (
            <Card className="p-6 border-violet-200 bg-violet-50/30">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-violet-600" />
                <h3 className="text-lg font-bold text-gray-900">Personal Information & Role</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="name@interior.go.ke"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+254 700 000 000"
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateField('dateOfBirth', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="nationalId">National ID Number</Label>
                  <Input
                    id="nationalId"
                    value={formData.nationalId}
                    onChange={(e) => updateField('nationalId', e.target.value)}
                    placeholder="Enter ID number"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role/Rank *</Label>
                  <Select value={formData.role} onValueChange={(value) => updateField('role', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SNA">Secretary National Administrator</SelectItem>
                      <SelectItem value="RC">Regional Commissioner</SelectItem>
                      <SelectItem value="CC">County Commissioner</SelectItem>
                      <SelectItem value="DC">District Commissioner</SelectItem>
                      <SelectItem value="ACC">Assistant County Commissioner</SelectItem>
                      <SelectItem value="CS">Cabinet Secretary</SelectItem>
                      <SelectItem value="PS">Principal Secretary</SelectItem>
                      <SelectItem value="AS">Assistant Secretary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="position">Position Title *</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => updateField('position', e.target.value)}
                    placeholder="e.g., Regional Commissioner - Nairobi"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department/Division</Label>
                  <Select value={formData.department} onValueChange={(value) => updateField('department', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="county-admin">County Administration</SelectItem>
                      <SelectItem value="national-admin">National Administration</SelectItem>
                      <SelectItem value="security">Security & Safety</SelectItem>
                      <SelectItem value="devolution">Devolution Affairs</SelectItem>
                      <SelectItem value="border-management">Border Management</SelectItem>
                      <SelectItem value="special-programs">Special Programs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="reportingTo">Reporting To (Superior Officer)</Label>
                  <Select value={formData.reportingTo} onValueChange={(value) => updateField('reportingTo', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select superior officer" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENT_SUPERIORS[formData.department]?.map((superior) => (
                        <SelectItem key={superior.id} value={superior.id}>
                          {superior.name} ({superior.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          )}

          {/* Step 2: Location & Background */}
          {currentStep === 2 && (
            <Card className="p-6 border-green-200 bg-green-50/30">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">Location & Background</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="region">Region</Label>
                    <Select value={formData.region} onValueChange={(value) => updateField('region', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nairobi">Nairobi Region</SelectItem>
                        <SelectItem value="central">Central Region</SelectItem>
                        <SelectItem value="coast">Coast Region</SelectItem>
                        <SelectItem value="eastern">Eastern Region</SelectItem>
                        <SelectItem value="nyanza">Nyanza Region</SelectItem>
                        <SelectItem value="rift-valley">Rift Valley Region</SelectItem>
                        <SelectItem value="western">Western Region</SelectItem>
                        <SelectItem value="north-eastern">North Eastern Region</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="county">County</Label>
                    <Select value={formData.county} onValueChange={(value) => updateField('county', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select county" />
                      </SelectTrigger>
                      <SelectContent>
                        {REGION_COUNTY_MAPPING[formData.region]?.map((county) => (
                          <SelectItem key={county} value={county}>
                            {county}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="subcounty">Sub-County/District</Label>
                  <Select value={formData.subcounty} onValueChange={(value) => updateField('subcounty', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sub-county" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTY_SUBCOUNTY_MAPPING[formData.county]?.map((subcounty) => (
                        <SelectItem key={subcounty} value={subcounty}>
                          {subcounty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="headquarters">Headquarters Location</Label>
                  <Select 
                    value={formData.headquarters} 
                    onValueChange={(value) => updateField('headquarters', value)}
                    disabled={!formData.subcounty && !formData.county}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select headquarters" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.subcounty ? (
                        <SelectItem value={SUBCOUNTY_HEADQUARTERS_MAPPING[formData.subcounty] || `${formData.subcounty} - District Office`}>
                          {SUBCOUNTY_HEADQUARTERS_MAPPING[formData.subcounty] || `${formData.subcounty} - District Office`}
                        </SelectItem>
                      ) : formData.county ? (
                        <SelectItem value={COUNTY_HEADQUARTERS[formData.county] || `${formData.county} County HQ`}>
                          {COUNTY_HEADQUARTERS[formData.county] || `${formData.county} County HQ`}
                        </SelectItem>
                      ) : null}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="jurisdictionOverview">Jurisdiction Overview</Label>
                  <Textarea
                    id="jurisdictionOverview"
                    value={formData.jurisdictionOverview}
                    onChange={(e) => updateField('jurisdictionOverview', e.target.value)}
                    placeholder="Describe the officer's area of jurisdiction, population served, key areas..."
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="education">Educational Background</Label>
                  <Textarea
                    id="education"
                    value={formData.education}
                    onChange={(e) => updateField('education', e.target.value)}
                    placeholder="List degrees, certifications, and educational qualifications..."
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                  <Input
                    id="yearsOfExperience"
                    type="number"
                    value={formData.yearsOfExperience}
                    onChange={(e) => updateField('yearsOfExperience', e.target.value)}
                    placeholder="Enter total years"
                  />
                </div>
                <div>
                  <Label htmlFor="previousPositions">Previous Positions</Label>
                  <Textarea
                    id="previousPositions"
                    value={formData.previousPositions}
                    onChange={(e) => updateField('previousPositions', e.target.value)}
                    placeholder="List previous roles and positions held..."
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="expertise">Areas of Expertise</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={expertiseInput}
                      onChange={(e) => setExpertiseInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                      placeholder="e.g., Security Management"
                    />
                    <Button type="button" onClick={addExpertise} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.expertise.map((exp, index) => (
                      <Badge key={index} variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                        {exp}
                        <button
                          onClick={() => removeExpertise(index)}
                          className="ml-2 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Step 3: Budget & Initiatives */}
          {currentStep === 3 && (
            <Card className="p-6 border-indigo-200 bg-indigo-50/30">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-gray-900">Budget & Initiatives</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="budgetAllocated">Budget Allocated (KES)</Label>
                  <Input
                    id="budgetAllocated"
                    value={formData.budgetAllocated}
                    onChange={(e) => updateField('budgetAllocated', e.target.value)}
                    placeholder="e.g., 850000000"
                  />
                  {formData.budgetAllocated && (
                    <p className="text-xs text-gray-600 mt-1">
                      ≈ KES {(parseFloat(formData.budgetAllocated) / 1000000).toFixed(1)}M
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="performanceTarget">Performance Target (%)</Label>
                  <Input
                    id="performanceTarget"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.performanceTarget}
                    onChange={(e) => updateField('performanceTarget', e.target.value)}
                    placeholder="e.g., 95"
                  />
                </div>
                <div>
                  <Label htmlFor="kpiMetrics">Key Performance Indicators (KPIs)</Label>
                  <Textarea
                    id="kpiMetrics"
                    value={formData.kpiMetrics}
                    onChange={(e) => updateField('kpiMetrics', e.target.value)}
                    placeholder="List key metrics to track performance: security incidents reduced, public satisfaction, etc..."
                    rows={4}
                  />
                </div>
                <div className="border-2 border-dashed border-indigo-200 rounded-lg p-4 bg-white">
                  <Label htmlFor="initiativeTitle">Initiative Title</Label>
                  <Input
                    id="initiativeTitle"
                    value={initiativeTitle}
                    onChange={(e) => setInitiativeTitle(e.target.value)}
                    placeholder="e.g., Community Policing Enhancement"
                    className="mb-2"
                  />
                  <Label htmlFor="initiativeDesc">Description</Label>
                  <Textarea
                    id="initiativeDesc"
                    value={initiativeDesc}
                    onChange={(e) => setInitiativeDesc(e.target.value)}
                    placeholder="Describe the initiative, its goals, and expected outcomes..."
                    rows={3}
                    className="mb-2"
                  />
                  <Button type="button" onClick={addInitiative} size="sm" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Initiative
                  </Button>
                </div>

                {formData.initiatives.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700">Added Initiatives ({formData.initiatives.length})</h4>
                    {formData.initiatives.map((initiative) => (
                      <Card key={initiative.id} className="p-4 border-indigo-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 mb-1">{initiative.title}</h5>
                            <p className="text-sm text-gray-600">{initiative.description}</p>
                          </div>
                          <button
                            onClick={() => removeInitiative(initiative.id)}
                            className="ml-3 p-1 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          <div className="text-sm text-gray-600">
            {currentStep} of {totalSteps}
          </div>

          {currentStep === totalSteps ? (
            <Button onClick={handleSubmit} className="bg-violet-600 hover:bg-violet-700">
              <Check className="w-4 h-4 mr-2" />
              Create User
            </Button>
          ) : (
            <Button onClick={handleNext} className="bg-violet-600 hover:bg-violet-700">
              Next
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}