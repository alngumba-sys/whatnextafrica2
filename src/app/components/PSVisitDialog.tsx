import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { MapPin, Calendar, Users, Building2 } from 'lucide-react';
import { Card } from '@/app/components/ui/card';

interface ReceivingOfficer {
  name: string;
  role: string;
  location: string;
}

interface PSVisitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock visit data - in production this would come from an API/database
const getTodaysVisit = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  
  // Rotate through different regions based on day of week
  const visits = [
    {
      region: 'Nairobi County',
      area: 'Nairobi Metropolitan',
      purpose: 'Inspection of Regional Administration Office and meeting with County Security Committee',
      receivingOfficers: [
        { name: 'Agnes Mwikali Kiilu', role: 'Regional Commissioner - Nairobi Metropolitan', location: 'Nairobi Regional HQ' },
        { name: 'Josephine Mango', role: 'County Commissioner - Nairobi', location: 'Nairobi County Office' },
        { name: 'Fredrick Shisia', role: 'Deputy County Commissioner - Westlands', location: 'Westlands Sub-County' }
      ]
    },
    {
      region: 'Coast Region',
      area: 'Mombasa County',
      purpose: 'Security review meeting with regional leadership and port authority officials',
      receivingOfficers: [
        { name: 'Rhoda Kanini Onyancha', role: 'Regional Commissioner - Coast', location: 'Mombasa Regional HQ' },
        { name: 'Mohammed Salim', role: 'County Commissioner - Mombasa', location: 'Mombasa County Office' },
        { name: 'Grace Wambui Kariuki', role: 'Deputy County Commissioner - Mvita', location: 'Mvita Sub-County' }
      ]
    },
    {
      region: 'Central Region',
      area: 'Kiambu County',
      purpose: 'Review of administrative reforms and field visit to community projects',
      receivingOfficers: [
        { name: 'David Kiptoo', role: 'Regional Commissioner - Central', location: 'Nyeri Regional HQ' },
        { name: 'John Kuria', role: 'County Commissioner - Kiambu', location: 'Kiambu County Office' },
        { name: 'Faith Mumbi', role: 'Deputy County Commissioner - Thika', location: 'Thika Sub-County' }
      ]
    },
    {
      region: 'Rift Valley Region',
      area: 'Nakuru County',
      purpose: 'National security briefing and administration coordination meeting',
      receivingOfficers: [
        { name: 'Mohammed Guyo Waqo', role: 'Regional Commissioner - Rift Valley', location: 'Nakuru Regional HQ' },
        { name: 'Peter Gathii', role: 'County Commissioner - Nakuru', location: 'Nakuru County Office' },
        { name: 'Lucy Chepkoech', role: 'Deputy County Commissioner - Nakuru East', location: 'Nakuru East Sub-County' }
      ]
    },
    {
      region: 'Western Region',
      area: 'Kakamega County',
      purpose: 'Inspection of administrative units and community policing initiatives',
      receivingOfficers: [
        { name: 'Sarah Nyambura', role: 'Regional Commissioner - Western', location: 'Kakamega Regional HQ' },
        { name: 'Patrick Odhiambo', role: 'County Commissioner - Kakamega', location: 'Kakamega County Office' },
        { name: 'Nancy Wanjiru', role: 'Deputy County Commissioner - Mumias', location: 'Mumias Sub-County' }
      ]
    }
  ];
  
  return visits[dayOfWeek % visits.length];
};

export function PSVisitDialog({ open, onOpenChange }: PSVisitDialogProps) {
  const visit = getTodaysVisit();
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MapPin className="w-6 h-6 text-rose-600" />
            Principal Secretary - Today's Visit
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Detailed information about today's visit for the Principal Secretary.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Date */}
          <Card className="p-4 bg-rose-50 border-rose-200">
            <div className="flex items-center gap-2 text-rose-800">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">{today}</span>
            </div>
          </Card>

          {/* Visit Location */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase">Visit Location</h3>
            <Card className="p-4 border-l-4 border-l-rose-500">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-rose-600 mt-0.5" />
                <div>
                  <h4 className="font-bold text-lg text-gray-900">{visit.region}</h4>
                  <p className="text-sm text-gray-600">{visit.area}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Purpose */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase">Purpose of Visit</h3>
            <Card className="p-4 bg-gray-50">
              <p className="text-sm text-gray-700 leading-relaxed">{visit.purpose}</p>
            </Card>
          </div>

          {/* Receiving Officers */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase flex items-center gap-2">
              <Users className="w-4 h-4" />
              Receiving Officers
            </h3>
            <div className="space-y-3">
              {visit.receivingOfficers.map((officer, index) => (
                <Card 
                  key={index} 
                  className="p-4 border-l-4 border-l-violet-500 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-violet-100 p-2 rounded-lg">
                      <Users className="w-5 h-5 text-violet-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{officer.name}</h4>
                      <p className="text-sm text-violet-700 font-medium">{officer.role}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span>{officer.location}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <Card className="p-3 bg-blue-50 border-blue-200">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> All receiving officers have been notified and are expected to be present at their respective stations during the visit.
            </p>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}