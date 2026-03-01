import { RegionalCommissioner } from "@/data/regionalCommissioners";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { ArrowLeft, MapPin, Users, Building2, Clock, Calendar, Phone, Mail, Briefcase, GraduationCap, Award, Target, TrendingUp, DollarSign } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";

interface RegionalCommissionerDetailPageProps {
  rc: RegionalCommissioner;
  onBack: () => void;
}

export function RegionalCommissionerDetailPage({ rc, onBack }: RegionalCommissionerDetailPageProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2F3F4' }}>
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="flex items-center gap-2 hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to All R.C
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{rc.fullName}</h1>
              <p className="text-sm text-gray-600">Regional Commissioner - {rc.region}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Card className="p-8 bg-white">
          {/* Header Section */}
          <div className="flex items-start gap-6 mb-6">
            <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white text-4xl font-bold shrink-0 shadow-md">
              {rc.initials}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{rc.fullName}</h2>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100">
                  Regional Commissioner
                </Badge>
                <Badge variant="outline">{rc.region}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Appointed: {rc.appointmentDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{rc.tenure}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Jurisdictional Overview */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-violet-600" />
              Jurisdictional Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-violet-50 rounded-lg p-3 border border-violet-200">
                <div className="text-xs text-violet-700 font-medium mb-1">Region</div>
                <div className="text-base font-bold text-gray-900">{rc.region}</div>
              </div>
              <div className="bg-violet-50 rounded-lg p-3 border border-violet-200">
                <div className="text-xs text-violet-700 font-medium mb-1">Headquarters</div>
                <div className="text-base font-bold text-gray-900">{rc.headquarters}</div>
              </div>
              <div className="bg-violet-50 rounded-lg p-3 border border-violet-200">
                <div className="text-xs text-violet-700 font-medium mb-1">Counties</div>
                <div className="text-base font-bold text-gray-900">{rc.countiesCovered}</div>
              </div>
              <div className="bg-violet-50 rounded-lg p-3 border border-violet-200">
                <div className="text-xs text-violet-700 font-medium mb-1">Population</div>
                <div className="text-base font-bold text-gray-900">{rc.populationServed}</div>
              </div>
              <div className="bg-violet-50 rounded-lg p-3 border border-violet-200">
                <div className="text-xs text-violet-700 font-medium mb-1">C.C. Supervised</div>
                <div className="text-base font-bold text-gray-900">{rc.countyCommissioners}</div>
              </div>
              <div className="bg-violet-50 rounded-lg p-3 border border-violet-200">
                <div className="text-xs text-violet-700 font-medium mb-1">Total Staff</div>
                <div className="text-base font-bold text-gray-900">{rc.totalStaff}</div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Professional Background */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-violet-600" />
                  Professional Background
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="w-4 h-4 text-violet-600" />
                      <span className="font-semibold text-gray-900 text-sm">Education</span>
                    </div>
                    <ul className="space-y-1 ml-6">
                      {rc.education.map((edu, idx) => (
                        <li key={idx} className="text-sm text-gray-700">• {edu}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-violet-600" />
                      <span className="font-semibold text-gray-900 text-sm">Career History</span>
                    </div>
                    <ul className="space-y-1 ml-6">
                      {rc.careerHistory.map((role, idx) => (
                        <li key={idx} className="text-sm text-gray-700">• {role}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="font-semibold text-gray-900 text-sm mb-1">Years of Service</div>
                    <div className="text-xl font-bold text-violet-600">{rc.yearsOfService} years</div>
                  </div>
                  {rc.specializations && rc.specializations.length > 0 && (
                    <div>
                      <div className="font-semibold text-gray-900 text-sm mb-2">Areas of Expertise</div>
                      <div className="flex flex-wrap gap-2">
                        {rc.specializations.map((spec, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-violet-100 text-violet-700 text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-violet-600" />
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{rc.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{rc.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{rc.contact.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Office Hours: {rc.contact.officeHours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Key Initiatives */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-violet-600" />
                  Key Initiatives
                </h3>
                <ul className="space-y-2">
                  {rc.keyInitiatives.map((initiative, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-gray-50 rounded-lg p-3">
                      <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 shrink-0" />
                      <span className="text-sm text-gray-700">{initiative}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recent Activities */}
              {rc.recentActivities && rc.recentActivities.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-violet-600" />
                    Recent Activities
                  </h3>
                  <ul className="space-y-1">
                    {rc.recentActivities.map((activity, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-violet-600 font-bold">→</span>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Performance Metrics */}
              {rc.performanceMetrics && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-violet-600" />
                    Performance Metrics
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(rc.performanceMetrics).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                        <div className="text-xs text-gray-600 mb-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-base font-bold text-gray-900">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Budget */}
              {rc.budgetAllocated && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-violet-600" />
                    Regional Budget
                  </h3>
                  <div className="bg-gradient-to-r from-violet-50 to-violet-100 rounded-lg p-4 border border-violet-200">
                    <div className="text-sm text-violet-700 font-medium mb-1">Annual Operational Budget</div>
                    <div className="text-2xl font-bold text-violet-900">{rc.budgetAllocated}</div>
                    <div className="text-xs text-violet-600 mt-1">Fiscal Year 2025/2026</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}