import { CountyCommissioner } from "@/data/countyCommissioners";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { ArrowLeft, MapPin, Users, Building2, Clock, Calendar, Phone, Mail, Briefcase, GraduationCap, Award, Target, TrendingUp, DollarSign, AlertCircle } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";

interface CountyCommissionerDetailPageProps {
  cc: CountyCommissioner;
  onBack: () => void;
}

export function CountyCommissionerDetailPage({ cc, onBack }: CountyCommissionerDetailPageProps) {
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
              Back to All C.C
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{cc.fullName}</h1>
              <p className="text-sm text-gray-600">County Commissioner - {cc.county}</p>
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
              {cc.initials}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{cc.fullName}</h2>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100">
                  County Commissioner
                </Badge>
                <Badge variant="outline">{cc.county}</Badge>
                <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200">
                  {cc.region}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Appointed: {cc.appointmentDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{cc.tenure}</span>
                </div>
                {cc.recentTransfer && (
                  <div className="flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span className="text-amber-700 font-medium">{cc.recentTransfer}</span>
                  </div>
                )}
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
                <div className="text-xs text-violet-700 font-medium mb-1">County</div>
                <div className="text-base font-bold text-gray-900">{cc.county}</div>
              </div>
              <div className="bg-violet-50 rounded-lg p-3 border border-violet-200">
                <div className="text-xs text-violet-700 font-medium mb-1">Headquarters</div>
                <div className="text-base font-bold text-gray-900">{cc.headquarters}</div>
              </div>
              <div className="bg-violet-50 rounded-lg p-3 border border-violet-200">
                <div className="text-xs text-violet-700 font-medium mb-1">Sub-Counties</div>
                <div className="text-base font-bold text-gray-900">{cc.subcountiesManaged}</div>
              </div>
              <div className="bg-violet-50 rounded-lg p-3 border border-violet-200">
                <div className="text-xs text-violet-700 font-medium mb-1">Population</div>
                <div className="text-base font-bold text-gray-900">{cc.populationServed}</div>
              </div>
              <div className="bg-violet-50 rounded-lg p-3 border border-violet-200">
                <div className="text-xs text-violet-700 font-medium mb-1">D.C. Supervised</div>
                <div className="text-base font-bold text-gray-900">{cc.districtCommissioners}</div>
              </div>
              <div className="bg-violet-50 rounded-lg p-3 border border-violet-200">
                <div className="text-xs text-violet-700 font-medium mb-1">Total Staff</div>
                <div className="text-base font-bold text-gray-900">{cc.totalStaff}</div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Performance & Budget */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-violet-600" />
              Performance & Budget
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-green-700 font-medium">Performance Score</span>
                  <Award className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-900">{cc.performanceScore}%</div>
                <div className="text-xs text-green-600 mt-1">
                  {cc.performanceScore >= 90 ? 'Excellent' : cc.performanceScore >= 85 ? 'Good' : 'Satisfactory'}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-700 font-medium">Budget Allocated</span>
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-900">{cc.budgetAllocated}</div>
                <div className="text-xs text-blue-600 mt-1">FY 2023/24</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-purple-700 font-medium">Budget Spent</span>
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-900">{cc.budgetSpent}</div>
                <div className="text-xs text-purple-600 mt-1">As of Feb 2026</div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-amber-700 font-medium">Utilization Rate</span>
                  <Target className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-3xl font-bold text-amber-900">{cc.utilizationRate}%</div>
                <div className="text-xs text-amber-600 mt-1">
                  {cc.utilizationRate >= 90 ? 'Excellent' : cc.utilizationRate >= 80 ? 'Good' : 'Fair'}
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Reporting Structure */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-violet-600" />
              Reporting Structure
            </h3>
            <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-violet-600" />
                <div>
                  <div className="text-sm text-violet-700 font-medium">Reports to</div>
                  <div className="text-base font-bold text-gray-900">{cc.regionalCommissioner}</div>
                  <div className="text-xs text-gray-600">Regional Commissioner - {cc.region}</div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Contact Information */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-violet-600" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                <Phone className="w-4 h-4 text-gray-600" />
                <div>
                  <div className="text-xs text-gray-600">Phone</div>
                  <div className="text-sm font-semibold text-gray-900">{cc.phoneNumber}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                <Mail className="w-4 h-4 text-gray-600" />
                <div>
                  <div className="text-xs text-gray-600">Email</div>
                  <div className="text-sm font-semibold text-gray-900">{cc.email}</div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Education & Qualifications */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-violet-600" />
              Education & Qualifications
            </h3>
            <div className="space-y-2">
              {cc.education.map((edu, index) => (
                <div key={index} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                  <div className="w-2 h-2 rounded-full bg-violet-600 mt-2" />
                  <span className="text-sm text-gray-700">{edu}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Professional Experience */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-violet-600" />
              Previous Postings
            </h3>
            <div className="space-y-2">
              {cc.previousPostings.map((posting, index) => (
                <div key={index} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                  <div className="w-2 h-2 rounded-full bg-violet-600 mt-2" />
                  <span className="text-sm text-gray-700">{posting}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Areas of Expertise */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-violet-600" />
              Areas of Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {cc.expertise.map((area, index) => (
                <Badge key={index} variant="outline" className="bg-violet-50 text-violet-700 border-violet-200">
                  {area}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Key Initiatives */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-violet-600" />
              Key Initiatives
            </h3>
            <div className="space-y-2">
              {cc.keyInitiatives.map((initiative, index) => (
                <div key={index} className="flex items-start gap-3 bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
                  <span className="text-sm text-gray-700">{initiative}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Challenges */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Current Challenges
            </h3>
            <div className="space-y-2">
              {cc.challenges.map((challenge, index) => (
                <div key={index} className="flex items-start gap-3 bg-amber-50 rounded-lg p-3 border border-amber-200">
                  <div className="w-2 h-2 rounded-full bg-amber-600 mt-2" />
                  <span className="text-sm text-gray-700">{challenge}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Leave Balance */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-violet-600" />
              Leave Status
            </h3>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-blue-700 font-medium mb-1">Annual Leave Balance</div>
                  <div className="text-3xl font-bold text-blue-900">{cc.leaveBalance} days</div>
                  <div className="text-xs text-blue-600 mt-1">Remaining in current cycle</div>
                </div>
                <div className="w-20 h-20 rounded-full border-8 border-blue-200 flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-900">{cc.leaveBalance}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
