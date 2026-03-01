import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/app/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/app/components/ui/alert-dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
import { DatePicker } from "@/app/components/ui/date-picker";
import { type RegionalCommissioner } from "@/data/regionalCommissioners";
import { Plus, X, RefreshCw, Calendar, Trash } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { ScrollArea } from "@/app/components/ui/scroll-area";

// Regional data
const REGIONS = [
  "Central Region",
  "Nyanza Region",
  "North Eastern Region",
  "Rift Valley Region",
  "Western Region",
  "Coast Region",
  "Eastern Region",
  "Nairobi Metropolitan Region",
];

const HEADQUARTERS_BY_REGION: Record<string, string[]> = {
  "Central Region": ["Nyeri", "Nairobi", "Kiambu", "Murang'a", "Nyandarua", "Kirinyaga"],
  "Nyanza Region": ["Kisumu", "Homa Bay", "Siaya", "Migori", "Kisii", "Nyamira"],
  "North Eastern Region": ["Garissa", "Wajir", "Mandera", "Isiolo", "Marsabit"],
  "Rift Valley Region": ["Nakuru", "Eldoret", "Naivasha", "Kericho", "Bomet", "Kabarnet"],
  "Western Region": ["Kakamega", "Bungoma", "Busia", "Vihiga"],
  "Coast Region": ["Mombasa", "Malindi", "Kilifi", "Lamu", "Kwale", "Taita Taveta"],
  "Eastern Region": ["Embu", "Meru", "Isiolo", "Tharaka Nithi", "Kitui", "Machakos"],
  "Nairobi Metropolitan Region": ["Nairobi", "Kiambu", "Kajiado", "Machakos"],
};

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AddCommissionerDialogProps extends DialogProps {
  onAdd: (commissioner: Partial<RegionalCommissioner>) => void;
}

interface DeleteCommissionerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commissioner: RegionalCommissioner | null;
  onConfirm: () => void;
}

interface TransferCommissionerDialogProps extends DialogProps {
  commissioner: RegionalCommissioner | null;
  onTransfer: (commissionerId: string, newRegion: string, newHeadquarters: string) => void;
}

interface ManageLeaveDaysDialogProps extends DialogProps {
  commissioner: RegionalCommissioner | null;
  onUpdate: (commissionerId: string, leaveDays: { annual: number; taken: number; remaining: number; sick: number }) => void;
}

export function AddCommissionerDialog({ open, onOpenChange, onAdd }: AddCommissionerDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    fullName: "",
    region: "",
    headquarters: "",
    countiesCovered: "",
    populationServed: "",
    appointmentDate: "",
    totalStaff: "",
    
    // Professional Background
    education: [""],
    careerHistory: [""],
    yearsOfService: "",
    areasOfExpertise: [] as string[],
    currentExpertise: "",
    
    // Contact Information
    phone: "",
    email: "",
    officeAddress: "",
    officeHours: "Monday - Friday, 8:00 AM - 5:00 PM",
    
    // Key Initiatives
    initiatives: [{ title: "", description: "" }],
  });

  const handleAddEducation = () => {
    setFormData({ ...formData, education: [...formData.education, ""] });
  };

  const handleRemoveEducation = (index: number) => {
    const newEducation = formData.education.filter((_, i) => i !== index);
    setFormData({ ...formData, education: newEducation });
  };

  const handleEducationChange = (index: number, value: string) => {
    const newEducation = [...formData.education];
    newEducation[index] = value;
    setFormData({ ...formData, education: newEducation });
  };

  const handleAddCareerHistory = () => {
    setFormData({ ...formData, careerHistory: [...formData.careerHistory, ""] });
  };

  const handleRemoveCareerHistory = (index: number) => {
    const newCareerHistory = formData.careerHistory.filter((_, i) => i !== index);
    setFormData({ ...formData, careerHistory: newCareerHistory });
  };

  const handleCareerHistoryChange = (index: number, value: string) => {
    const newCareerHistory = [...formData.careerHistory];
    newCareerHistory[index] = value;
    setFormData({ ...formData, careerHistory: newCareerHistory });
  };

  const handleAddExpertise = () => {
    if (formData.currentExpertise.trim()) {
      setFormData({
        ...formData,
        areasOfExpertise: [...formData.areasOfExpertise, formData.currentExpertise.trim()],
        currentExpertise: "",
      });
    }
  };

  const handleRemoveExpertise = (index: number) => {
    const newExpertise = formData.areasOfExpertise.filter((_, i) => i !== index);
    setFormData({ ...formData, areasOfExpertise: newExpertise });
  };

  const handleAddInitiative = () => {
    setFormData({ ...formData, initiatives: [...formData.initiatives, { title: "", description: "" }] });
  };

  const handleRemoveInitiative = (index: number) => {
    const newInitiatives = formData.initiatives.filter((_, i) => i !== index);
    setFormData({ ...formData, initiatives: newInitiatives });
  };

  const handleInitiativeChange = (index: number, field: 'title' | 'description', value: string) => {
    const newInitiatives = [...formData.initiatives];
    newInitiatives[index][field] = value;
    setFormData({ ...formData, initiatives: newInitiatives });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate initials from full name
    const nameParts = formData.fullName.trim().split(" ");
    const initials = nameParts
      .filter((part, idx) => idx === 0 || idx === nameParts.length - 1)
      .map(part => part[0])
      .join("");

    const newCommissioner: Partial<RegionalCommissioner> = {
      id: `rc-${Date.now()}`,
      fullName: formData.fullName,
      initials: initials.toUpperCase(),
      region: formData.region,
      headquarters: formData.headquarters,
      appointmentDate: formData.appointmentDate,
      tenure: "0 months",
      countiesCovered: parseInt(formData.countiesCovered),
      populationServed: formData.populationServed,
      countyCommissioners: parseInt(formData.countiesCovered),
      totalStaff: parseInt(formData.totalStaff) || 0,
      education: formData.education.filter(e => e.trim() !== ""),
      careerHistory: formData.careerHistory.filter(c => c.trim() !== ""),
      yearsOfService: parseInt(formData.yearsOfService) || 0,
      specializations: formData.areasOfExpertise,
      keyInitiatives: formData.initiatives
        .filter(i => i.title.trim() !== "")
        .map(i => `${i.title} - ${i.description}`),
      budgetAllocated: "TBD",
      contact: {
        phone: formData.phone || "+254 700 000 000",
        email: formData.email || `rc.${formData.region.toLowerCase().replace(/\s+/g, '')}@interior.go.ke`,
        address: formData.officeAddress || `Regional Office, ${formData.headquarters}`,
        officeHours: formData.officeHours,
      },
      leaveDays: {
        annual: 30,
        taken: 0,
        remaining: 30,
        sick: 14,
      },
    };

    onAdd(newCommissioner);
    
    // Reset form
    setFormData({
      fullName: "",
      region: "",
      headquarters: "",
      countiesCovered: "",
      populationServed: "",
      appointmentDate: "",
      totalStaff: "",
      education: [""],
      careerHistory: [""],
      yearsOfService: "",
      areasOfExpertise: [],
      currentExpertise: "",
      phone: "",
      email: "",
      officeAddress: "",
      officeHours: "Monday - Friday, 8:00 AM - 5:00 PM",
      initiatives: [{ title: "", description: "" }],
    });
    setCurrentStep(1);
    onOpenChange(false);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh]" style={{ maxWidth: '739px' }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-violet-600" />
            Add New Regional Commissioner
          </DialogTitle>
          <DialogDescription>
            Complete the form below to add a new Regional Commissioner to the system.
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex-1 h-2 rounded-full ${
                step <= currentStep ? 'bg-violet-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Basic Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Dr. John Doe Kamau"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="region">Region *</Label>
                    <Select
                      value={formData.region}
                      onValueChange={(value) => setFormData({ ...formData, region: value, headquarters: "" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a region" />
                      </SelectTrigger>
                      <SelectContent>
                        {REGIONS.map(region => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="headquarters">Headquarters *</Label>
                    <Select
                      value={formData.headquarters}
                      onValueChange={(value) => setFormData({ ...formData, headquarters: value })}
                      disabled={!formData.region}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select headquarters" />
                      </SelectTrigger>
                      <SelectContent>
                        {HEADQUARTERS_BY_REGION[formData.region]?.map(hq => (
                          <SelectItem key={hq} value={hq}>{hq}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="countiesCovered">Counties *</Label>
                    <Input
                      id="countiesCovered"
                      type="number"
                      min="1"
                      value={formData.countiesCovered}
                      onChange={(e) => setFormData({ ...formData, countiesCovered: e.target.value })}
                      placeholder="6"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="populationServed">Population *</Label>
                    <Input
                      id="populationServed"
                      value={formData.populationServed}
                      onChange={(e) => setFormData({ ...formData, populationServed: e.target.value })}
                      placeholder="4.7M"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalStaff">Total Staff *</Label>
                    <Input
                      id="totalStaff"
                      type="number"
                      min="0"
                      value={formData.totalStaff}
                      onChange={(e) => setFormData({ ...formData, totalStaff: e.target.value })}
                      placeholder="298"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointmentDate">Appointment Date *</Label>
                  <DatePicker
                    id="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={(date) => {
                      const formatted = date ? date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "";
                      setFormData({ ...formData, appointmentDate: formatted });
                    }}
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Professional Background */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Professional Background</h3>
                
                <div className="space-y-2">
                  <Label>Education</Label>
                  {formData.education.map((edu, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={edu}
                        onChange={(e) => handleEducationChange(index, e.target.value)}
                        placeholder="e.g., PhD in Criminology and Security Studies, University of Cape Town"
                      />
                      {formData.education.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEducation(index)}
                        >
                          <Trash className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={handleAddEducation}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Career History</Label>
                  {formData.careerHistory.map((career, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={career}
                        onChange={(e) => handleCareerHistoryChange(index, e.target.value)}
                        placeholder="e.g., County Commissioner, Kilifi County (2018-2021)"
                      />
                      {formData.careerHistory.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCareerHistory(index)}
                        >
                          <Trash className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={handleAddCareerHistory}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Career Entry
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsOfService">Years of Service *</Label>
                  <Input
                    id="yearsOfService"
                    type="number"
                    min="0"
                    value={formData.yearsOfService}
                    onChange={(e) => setFormData({ ...formData, yearsOfService: e.target.value })}
                    placeholder="18"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Areas of Expertise</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.currentExpertise}
                      onChange={(e) => setFormData({ ...formData, currentExpertise: e.target.value })}
                      placeholder="e.g., Maritime Security"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddExpertise();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={handleAddExpertise}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.areasOfExpertise.map((expertise, index) => (
                      <Badge key={index} variant="secondary" className="bg-violet-100 text-violet-700">
                        {expertise}
                        <button
                          type="button"
                          onClick={() => handleRemoveExpertise(index)}
                          className="ml-2 hover:text-violet-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Contact Information */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Contact Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+254 767 890 006"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="rc.region@interior.go.ke"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="officeAddress">Office Address</Label>
                  <Textarea
                    id="officeAddress"
                    value={formData.officeAddress}
                    onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                    placeholder="Regional Command Center, Mombasa Island, P.O. Box 6006-80100"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="officeHours">Office Hours</Label>
                  <Input
                    id="officeHours"
                    value={formData.officeHours}
                    onChange={(e) => setFormData({ ...formData, officeHours: e.target.value })}
                    placeholder="Monday - Friday, 8:00 AM - 5:00 PM"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Key Initiatives */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Key Initiatives</h3>
                
                {formData.initiatives.map((initiative, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <Label>Initiative {index + 1}</Label>
                      {formData.initiatives.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveInitiative(index)}
                        >
                          <Trash className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                    <Input
                      value={initiative.title}
                      onChange={(e) => handleInitiativeChange(index, 'title', e.target.value)}
                      placeholder="Initiative Title (e.g., Blue Economy Security Initiative)"
                    />
                    <Textarea
                      value={initiative.description}
                      onChange={(e) => handleInitiativeChange(index, 'description', e.target.value)}
                      placeholder="Description (e.g., Protecting maritime resources and fishing communities)"
                      rows={2}
                    />
                  </div>
                ))}
                
                <Button type="button" variant="outline" size="sm" onClick={handleAddInitiative}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Initiative
                </Button>
              </div>
            )}
          </form>
        </ScrollArea>

        <DialogFooter className="flex justify-between">
          <div>
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {currentStep < 4 ? (
              <Button type="button" className="bg-violet-600 hover:bg-violet-700" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" className="bg-violet-600 hover:bg-violet-700" onClick={handleSubmit}>
                Add Commissioner
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteCommissionerDialog({ open, onOpenChange, commissioner, onConfirm }: DeleteCommissionerDialogProps) {
  const [confirmationText, setConfirmationText] = useState("");
  
  const isConfirmationValid = confirmationText === commissioner?.fullName;

  const handleConfirm = () => {
    if (isConfirmationValid) {
      onConfirm();
      setConfirmationText("");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setConfirmationText("");
    }
    onOpenChange(newOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <X className="w-5 h-5 text-red-600" />
            Confirm Deletion
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove <span className="font-semibold">{commissioner?.fullName}</span> from the Regional Commissioners list?
            <br /><br />
            <span className="text-red-600 font-medium">This action cannot be undone.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-2 py-4">
          <Label htmlFor="confirmation" className="text-sm text-gray-700">
            Type <span className="font-semibold">{commissioner?.fullName}</span> to confirm:
          </Label>
          <Input
            id="confirmation"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder={`E.g. ${commissioner?.fullName}`}
            className="font-mono"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmationText("")}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} 
            disabled={!isConfirmationValid}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Delete Commissioner
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function TransferCommissionerDialog({ open, onOpenChange, commissioner, onTransfer }: TransferCommissionerDialogProps) {
  const [newRegion, setNewRegion] = useState("");
  const [newHeadquarters, setNewHeadquarters] = useState("");

  // Calculate AI insights
  const aiInsights = useMemo(() => {
    if (!commissioner || !newRegion || !newHeadquarters) return null;

    const insights: { type: 'warning' | 'info' | 'success'; message: string }[] = [];

    // Calculate retirement proximity
    const retirementAge = 60;
    const estimatedCurrentAge = 30 + commissioner.yearsOfService;
    const yearsToRetirement = Math.max(0, retirementAge - estimatedCurrentAge);
    const monthsToRetirement = Math.round(yearsToRetirement * 12);

    // Distance analysis (simplified - could use actual coordinates)
    const cityDistances: Record<string, Record<string, number>> = {
      "Nairobi": { "Mombasa": 480, "Kisumu": 350, "Nakuru": 160, "Nyeri": 150, "Garissa": 370, "Kakamega": 400, "Embu": 130 },
      "Mombasa": { "Nairobi": 480, "Kisumu": 800, "Malindi": 120, "Garissa": 400, "Nyeri": 600 },
      "Kisumu": { "Nairobi": 350, "Mombasa": 800, "Kakamega": 50, "Nakuru": 200 },
      "Nakuru": { "Nairobi": 160, "Kisumu": 200, "Nyeri": 120, "Eldoret": 160 },
      "Nyeri": { "Nairobi": 150, "Nakuru": 120, "Embu": 90, "Meru": 100 },
      "Garissa": { "Nairobi": 370, "Mombasa": 400, "Wajir": 280 },
      "Kakamega": { "Nairobi": 400, "Kisumu": 50, "Bungoma": 50 },
      "Embu": { "Nairobi": 130, "Nyeri": 90, "Meru": 70 },
    };

    const distance = cityDistances[commissioner.headquarters]?.[newHeadquarters] || 0;

    // Retirement proximity warning
    if (monthsToRetirement <= 6) {
      insights.push({
        type: 'warning',
        message: `⚠️ This commissioner is retiring in ${monthsToRetirement} month${monthsToRetirement !== 1 ? 's' : ''}. Consider if a major relocation is advisable at this career stage.`
      });
    } else if (monthsToRetirement <= 12) {
      insights.push({
        type: 'info',
        message: `ℹ️ Note: Retirement is in ${monthsToRetirement} months. This transfer allows time to establish effective leadership before succession planning begins.`
      });
    }

    // Distance analysis
    if (distance > 400) {
      insights.push({
        type: 'warning',
        message: `⚠️ Long-distance transfer (~${distance}km from ${commissioner.headquarters} to ${newHeadquarters}). Consider family relocation logistics and transition period.`
      });
    } else if (distance > 200) {
      insights.push({
        type: 'info',
        message: `ℹ️ Moderate distance transfer (~${distance}km). Standard relocation support recommended.`
      });
    } else if (distance > 0) {
      insights.push({
        type: 'success',
        message: `✓ Relatively short transfer (~${distance}km). Minimal disruption expected.`
      });
    }

    // Experience and region change analysis
    const regionChange = commissioner.region !== newRegion;
    if (regionChange && commissioner.yearsOfService < 10) {
      insights.push({
        type: 'info',
        message: `ℹ️ With ${commissioner.yearsOfService} years of experience, this cross-regional transfer provides valuable diverse exposure.`
      });
    } else if (regionChange && commissioner.yearsOfService >= 10) {
      insights.push({
        type: 'success',
        message: `✓ Seasoned administrator (${commissioner.yearsOfService} yrs) well-equipped to lead ${newRegion}.`
      });
    }

    // Leave days consideration
    if (commissioner.leaveDays && commissioner.leaveDays.remaining < 5) {
      insights.push({
        type: 'warning',
        message: `⚠️ Low leave balance (${commissioner.leaveDays.remaining} days remaining). Transfer timing may impact pending leave.`
      });
    }

    return insights.length > 0 ? insights : null;
  }, [commissioner, newRegion, newHeadquarters]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commissioner) {
      onTransfer(commissioner.id, newRegion, newHeadquarters);
      setNewRegion("");
      setNewHeadquarters("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-600" />
            Transfer Commissioner
          </DialogTitle>
          <DialogDescription>
            Transfer <span className="font-semibold">{commissioner?.fullName}</span> to a new region.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg text-sm">
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Current Region:</span>
              <span className="font-semibold">{commissioner?.region}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Current HQ:</span>
              <span className="font-semibold">{commissioner?.headquarters}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newRegion">New Region *</Label>
            <Select
              id="newRegion"
              value={newRegion}
              onValueChange={(value) => setNewRegion(value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a region">{newRegion}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newHeadquarters">New Headquarters *</Label>
            <Select
              id="newHeadquarters"
              value={newHeadquarters}
              onValueChange={(value) => setNewHeadquarters(value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a headquarters">{newHeadquarters}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {HEADQUARTERS_BY_REGION[newRegion]?.map(hq => (
                  <SelectItem key={hq} value={hq}>{hq}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {aiInsights && (
            <div className="space-y-2">
              {aiInsights.map((insight, idx) => (
                <div key={idx} className={`p-3 rounded-lg ${insight.type === 'warning' ? 'bg-red-50 text-red-600' : insight.type === 'info' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                  <div className="text-xs text-gray-600 mb-1">{insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}</div>
                  <div className="text-sm font-bold">
                    {insight.message}
                  </div>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Transfer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ManageLeaveDaysDialog({ open, onOpenChange, commissioner, onUpdate }: ManageLeaveDaysDialogProps) {
  const [leaveDays, setLeaveDays] = useState({
    annual: commissioner?.leaveDays?.annual || 30,
    taken: commissioner?.leaveDays?.taken || 0,
    remaining: commissioner?.leaveDays?.remaining || 30,
    sick: commissioner?.leaveDays?.sick || 14,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commissioner) {
      // Recalculate remaining
      const remaining = leaveDays.annual - leaveDays.taken;
      onUpdate(commissioner.id, { ...leaveDays, remaining });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Manage Leave Days
          </DialogTitle>
          <DialogDescription>
            Update leave days for <span className="font-semibold">{commissioner?.fullName}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="annual">Annual Allocation</Label>
              <Input
                id="annual"
                type="number"
                min="0"
                value={leaveDays.annual}
                onChange={(e) => setLeaveDays({ ...leaveDays, annual: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taken">Days Taken</Label>
              <Input
                id="taken"
                type="number"
                min="0"
                max={leaveDays.annual}
                value={leaveDays.taken}
                onChange={(e) => setLeaveDays({ ...leaveDays, taken: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sick">Sick Leave Allocation</Label>
              <Input
                id="sick"
                type="number"
                min="0"
                value={leaveDays.sick}
                onChange={(e) => setLeaveDays({ ...leaveDays, sick: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Remaining Days</div>
              <div className="text-2xl font-bold text-green-600">
                {leaveDays.annual - leaveDays.taken}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Update Leave Days
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}