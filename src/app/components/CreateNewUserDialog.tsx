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
  DollarSign,
  Target,
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
  'Nairobi': ['Westlands', 'Dagoretti North', 'Dagoretti South', 'Lang\'ata', 'Kibra', 'Roysambu', 'Kasarani', 'Ruaraka'],
  'Kajiado': ['Kajiado North', 'Kajiado Central', 'Kajiado East', 'Kajiado West', 'Kajiado South'],
  'Kiambu': ['Kiambu', 'Thika Town', 'Ruiru', 'Juja', 'Gatundu South', 'Gatundu North'],
  'Mombasa': ['Changamwe', 'Jomvu', 'Kisauni', 'Nyali', 'Likoni', 'Mvita'],
  'Kisumu': ['Kisumu East', 'Kisumu West', 'Kisumu Central', 'Seme', 'Nyando'],
  'Nakuru': ['Nakuru Town East', 'Nakuru Town West', 'Gilgil', 'Naivasha', 'Molo']
};

const SUBCOUNTY_HEADQUARTERS_MAPPING: Record<string, string> = {
  'Westlands': 'Westlands - Parklands Office',
  'Dagoretti North': 'Dagoretti North - Kawangware',
  'Kajiado North': 'Kajiado North - Ongata Rongai',
  'Nakuru Town East': 'Nakuru - Milimani'
};

const COUNTY_HEADQUARTERS: Record<string, string> = {
  'Nairobi': 'Nairobi - Harambee House',
  'Kajiado': 'Kajiado Town',
  'Mombasa': 'Mombasa - Treasury Square',
  'Kisumu': 'Kisumu - Kondele'
};

// Department to superior officers mapping
const DEPARTMENT_SUPERIORS: Record<string, Array<{id: string, name: string, role: string}>> = {
  'county-admin': [
    { id: 'sna-001', name: 'Dr. Raymond Omollo (Secretary National Administrator)', role: 'SNA' },
    { id: 'rc-001', name: 'James Kianda (Regional Commissioner - Nairobi)', role: 'RC' }
  ],
  'national-admin': [
    { id: 'sna-001', name: 'Dr. Raymond Omollo (Secretary National Administrator)', role: 'SNA' },
    { id: 'ps-001', name: 'Dr. Mary Muthoni (Principal Secretary)', role: 'PS' }
  ],
  'security': [
    { id: 'rc-001', name: 'James Kianda (Regional Commissioner - Nairobi)', role: 'RC' }
  ],
  'devolution': [
    { id: 'ps-001', name: 'Dr. Mary Muthoni (Principal Secretary)', role: 'PS' }
  ],
  'border-management': [
    { id: 'rc-008', name: 'Abdi Ibrahim (Regional Commissioner - North Eastern)', role: 'RC' }
  ],
  'special-programs': [
    { id: 'sna-001', name: 'Dr. Raymond Omollo (Secretary National Administrator)', role: 'SNA' }
  ]
};

export function CreateNewUserDialog({ onClose }: CreateNewUserDialogProps) {
  const { addUser } = useCreatedUsers();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Form state
  const [formData, setFormData] = useState({
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
    region: '',
    county: '',
    subcounty: '',
    headquarters: '',
    jurisdictionOverview: '',
    education: '',
    yearsOfExperience: '',
    previousPositions: '',
    expertise: [] as string[],
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
    
    if (field === 'region') {
      setFormData(prev => ({ ...prev, [field]: value, county: '', subcounty: '', headquarters: '' }));
    } else if (field === 'county') {
      setFormData(prev => ({ ...prev, [field]: value, subcounty: '', headquarters: '' }));
    } else if (field === 'subcounty') {
      const hq = SUBCOUNTY_HEADQUARTERS_MAPPING[value] || `${value} - District Office`;
      setFormData(prev => ({ ...prev, [field]: value, headquarters: hq }));
    } else if (field === 'department') {
      setFormData(prev => ({ ...prev, [field]: value, reportingTo: '' }));
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
    console.log('Form submitted:', formData);
    addUser(formData);
    toast.success('User created successfully!');
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl !h-[85vh] !flex !flex-col !p-0 !gap-0 !overflow-hidden">
        {/* Fixed Header */}
        <div className="flex-shrink-0 bg-[#66023C] text-white px-[24px] py-[8px]">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-white">Create New Employee</DialogTitle>
              <DialogDescription className="text-white/80 text-sm mt-1">
                Step {currentStep} of {totalSteps}: {
                  currentStep === 1 ? 'Personal Information & Role' :
                  currentStep === 2 ? 'Location & Background' :
                  'Budget & Performance'
                }
              </DialogDescription>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`h-1 flex-1 rounded-full transition-all ${
                  step <= currentStep ? 'bg-white' : 'bg-white/30'
                }`} />
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 px-[24px] py-[0px]">
          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-5 border border-gray-200">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                  <User className="w-5 h-5 text-[#66023C]" />
                  <h3 className="font-semibold text-gray-900">Personal Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="firstName" className="text-xs font-medium text-gray-700">First Name *</Label>
                    <Input id="firstName" value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} placeholder="Enter first name" className="mt-1 h-9" />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-xs font-medium text-gray-700">Last Name *</Label>
                    <Input id="lastName" value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} placeholder="Enter last name" className="mt-1 h-9" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-xs font-medium text-gray-700">Email Address *</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="name@interior.go.ke" className="mt-1 h-9" />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-xs font-medium text-gray-700">Phone Number *</Label>
                    <Input id="phone" type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="+254 700 000 000" className="mt-1 h-9" />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth" className="text-xs font-medium text-gray-700">Date of Birth</Label>
                    <Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} className="mt-1 h-9" />
                  </div>
                  <div>
                    <Label htmlFor="nationalId" className="text-xs font-medium text-gray-700">National ID Number</Label>
                    <Input id="nationalId" value={formData.nationalId} onChange={(e) => updateField('nationalId', e.target.value)} placeholder="Enter ID number" className="mt-1 h-9" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-5 border border-gray-200">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                  <Building className="w-5 h-5 text-[#66023C]" />
                  <h3 className="font-semibold text-gray-900">Role & Position</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="role" className="text-xs font-medium text-gray-700">Role/Rank *</Label>
                    <Select value={formData.role} onValueChange={(value) => updateField('role', value)}>
                      <SelectTrigger className="mt-1 h-9">
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
                    <Label htmlFor="position" className="text-xs font-medium text-gray-700">Position Title *</Label>
                    <Input id="position" value={formData.position} onChange={(e) => updateField('position', e.target.value)} placeholder="e.g., Regional Commissioner - Nairobi" className="mt-1 h-9" />
                  </div>
                  <div>
                    <Label htmlFor="department" className="text-xs font-medium text-gray-700">Department/Division</Label>
                    <Select value={formData.department} onValueChange={(value) => updateField('department', value)}>
                      <SelectTrigger className="mt-1 h-9">
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
                    <Label htmlFor="reportingTo" className="text-xs font-medium text-gray-700">Reporting To</Label>
                    <Select value={formData.reportingTo} onValueChange={(value) => updateField('reportingTo', value)}>
                      <SelectTrigger className="mt-1 h-9">
                        <SelectValue placeholder="Select superior officer" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENT_SUPERIORS[formData.department]?.map((superior) => (
                          <SelectItem key={superior.id} value={superior.id}>{superior.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 px-[20px] py-[0px]">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                  <MapPin className="w-5 h-5 text-[#66023C]" />
                  <h3 className="font-semibold text-gray-900">Location & Background</h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="region" className="text-xs font-medium text-gray-700">Region</Label>
                      <Select value={formData.region} onValueChange={(value) => updateField('region', value)}>
                        <SelectTrigger className="mt-1 h-9">
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
                      <Label htmlFor="county" className="text-xs font-medium text-gray-700">County</Label>
                      <Select value={formData.county} onValueChange={(value) => updateField('county', value)}>
                        <SelectTrigger className="mt-1 h-9">
                          <SelectValue placeholder="Select county" />
                        </SelectTrigger>
                        <SelectContent>
                          {REGION_COUNTY_MAPPING[formData.region]?.map((county) => (
                            <SelectItem key={county} value={county}>{county}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subcounty" className="text-xs font-medium text-gray-700">Sub-County/District</Label>
                    <Select value={formData.subcounty} onValueChange={(value) => updateField('subcounty', value)}>
                      <SelectTrigger className="mt-1 h-9">
                        <SelectValue placeholder="Select sub-county" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTY_SUBCOUNTY_MAPPING[formData.county]?.map((subcounty) => (
                          <SelectItem key={subcounty} value={subcounty}>{subcounty}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="headquarters" className="text-xs font-medium text-gray-700">Headquarters Location</Label>
                    <Select value={formData.headquarters} onValueChange={(value) => updateField('headquarters', value)} disabled={!formData.subcounty && !formData.county}>
                      <SelectTrigger className="mt-1 h-9">
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
                    <Label htmlFor="jurisdictionOverview" className="text-xs font-medium text-gray-700">Jurisdiction Overview</Label>
                    <Textarea id="jurisdictionOverview" value={formData.jurisdictionOverview} onChange={(e) => updateField('jurisdictionOverview', e.target.value)} placeholder="Describe the officer's area of jurisdiction..." rows={2} className="mt-1 text-sm" />
                  </div>
                  <div>
                    <Label htmlFor="education" className="text-xs font-medium text-gray-700">Educational Background</Label>
                    <Textarea id="education" value={formData.education} onChange={(e) => updateField('education', e.target.value)} placeholder="List degrees, certifications..." rows={2} className="mt-1 text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="yearsOfExperience" className="text-xs font-medium text-gray-700">Years of Experience</Label>
                      <Input id="yearsOfExperience" type="number" value={formData.yearsOfExperience} onChange={(e) => updateField('yearsOfExperience', e.target.value)} placeholder="Enter total years" className="mt-1 h-9" />
                    </div>
                    <div className="flex items-end">
                      <div className="flex-1">
                        <Label htmlFor="expertise" className="text-xs font-medium text-gray-700">Areas of Expertise</Label>
                        <div className="flex gap-2 mt-1">
                          <Input value={expertiseInput} onChange={(e) => setExpertiseInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())} placeholder="e.g., Security Management" className="h-9" />
                          <Button type="button" onClick={addExpertise} size="sm" className="bg-[#66023C] hover:bg-[#66023C]/90 h-9">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {formData.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.expertise.map((exp, index) => (
                        <Badge key={index} variant="outline" className="bg-[#F5F5DC] text-gray-800 border-gray-300">
                          {exp}
                          <button onClick={() => removeExpertise(index)} className="ml-2 hover:text-red-600">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div>
                    <Label htmlFor="previousPositions" className="text-xs font-medium text-gray-700">Previous Positions</Label>
                    <Textarea id="previousPositions" value={formData.previousPositions} onChange={(e) => updateField('previousPositions', e.target.value)} placeholder="List previous roles and positions held..." rows={2} className="mt-1 text-sm" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-5 border border-gray-200">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                  <DollarSign className="w-5 h-5 text-[#66023C]" />
                  <h3 className="font-semibold text-gray-900">Budget & Performance</h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="budgetAllocated" className="text-xs font-medium text-gray-700">Budget Allocated (KES)</Label>
                      <Input id="budgetAllocated" value={formData.budgetAllocated} onChange={(e) => updateField('budgetAllocated', e.target.value)} placeholder="e.g., 850000000" className="mt-1 h-9" />
                      {formData.budgetAllocated && (
                        <p className="text-xs text-gray-500 mt-1">≈ KES {(parseFloat(formData.budgetAllocated) / 1000000).toFixed(1)}M</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="performanceTarget" className="text-xs font-medium text-gray-700">Performance Target (%)</Label>
                      <Input id="performanceTarget" type="number" min="0" max="100" value={formData.performanceTarget} onChange={(e) => updateField('performanceTarget', e.target.value)} placeholder="e.g., 95" className="mt-1 h-9" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="kpiMetrics" className="text-xs font-medium text-gray-700">Key Performance Indicators (KPIs)</Label>
                    <Textarea id="kpiMetrics" value={formData.kpiMetrics} onChange={(e) => updateField('kpiMetrics', e.target.value)} placeholder="List key metrics to track performance..." rows={3} className="mt-1 text-sm" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-5 border border-gray-200">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                  <Target className="w-5 h-5 text-[#66023C]" />
                  <h3 className="font-semibold text-gray-900">Strategic Initiatives</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <Label htmlFor="initiativeTitle" className="text-xs font-medium text-gray-700">Initiative Title</Label>
                    <Input id="initiativeTitle" value={initiativeTitle} onChange={(e) => setInitiativeTitle(e.target.value)} placeholder="e.g., Community Policing Enhancement" className="mt-1 mb-2 h-9" />
                    <Label htmlFor="initiativeDesc" className="text-xs font-medium text-gray-700">Description</Label>
                    <Textarea id="initiativeDesc" value={initiativeDesc} onChange={(e) => setInitiativeDesc(e.target.value)} placeholder="Describe the initiative..." rows={2} className="mt-1 mb-2 text-sm" />
                    <Button type="button" onClick={addInitiative} size="sm" className="w-full bg-[#66023C] hover:bg-[#66023C]/90 h-9">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Initiative
                    </Button>
                  </div>

                  {formData.initiatives.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-gray-700">Added Initiatives ({formData.initiatives.length})</h4>
                      {formData.initiatives.map((initiative) => (
                        <Card key={initiative.id} className="p-3 border-gray-200">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold text-sm text-gray-900 mb-1">{initiative.title}</h5>
                              <p className="text-xs text-gray-600 line-clamp-2">{initiative.description}</p>
                            </div>
                            <button onClick={() => removeInitiative(initiative.id)} className="p-1 hover:bg-red-100 rounded flex-shrink-0">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Footer with Navigation */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200 px-[24px] py-[0px]">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1} className="h-9">
              Previous
            </Button>
            
            <div className="text-sm text-gray-600 font-medium">
              Step {currentStep} of {totalSteps}
            </div>

            {currentStep === totalSteps ? (
              <Button onClick={handleSubmit} className="bg-[#66023C] hover:bg-[#66023C]/90 h-9">
                <Check className="w-4 h-4 mr-2" />
                Create User
              </Button>
            ) : (
              <Button onClick={handleNext} className="bg-[#66023C] hover:bg-[#66023C]/90 h-9">
                Next
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
