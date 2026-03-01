import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog';
import {
  Users,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Mail,
  Phone,
  Building,
  UserPlus,
  Download,
  X
} from 'lucide-react';
import { useCreatedUsers } from '@/contexts/CreatedUsersContext';

interface UserDetailsDialogProps {
  user: any;
  onClose: () => void;
}

function UserDetailsDialog({ user, onClose }: UserDetailsDialogProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-1 text-sm">
                {user.position} • {user.role}
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

        <div className="overflow-y-auto px-6 py-4 flex-1">
          <div className="space-y-4">{/* Contact Information */}
            <Card className="p-4 border-violet-200 bg-violet-50/30">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-violet-600" />
                Contact Information
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600 text-xs">Email:</span>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-xs">Phone:</span>
                  <p className="font-medium text-gray-900">{user.phone}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-xs">National ID:</span>
                  <p className="font-medium text-gray-900">{user.nationalId || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-xs">Date of Birth:</span>
                  <p className="font-medium text-gray-900">{user.dateOfBirth || 'N/A'}</p>
                </div>
              </div>
            </Card>

            {/* Position Details */}
            <Card className="p-4 border-blue-200 bg-blue-50/30">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                <Building className="w-4 h-4 text-blue-600" />
                Position Details
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600 text-xs">Role/Rank:</span>
                  <p className="font-medium text-gray-900">{user.role}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-xs">Department:</span>
                  <p className="font-medium text-gray-900">{user.department}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600 text-xs">Reporting To:</span>
                  <p className="font-medium text-gray-900">{user.reportingTo || 'N/A'}</p>
                </div>
              </div>
            </Card>

            {/* Location & Jurisdiction */}
            <Card className="p-4 border-green-200 bg-green-50/30">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-green-600" />
                Location & Jurisdiction
              </h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-gray-600 text-xs">Region:</span>
                    <p className="font-medium text-gray-900">{user.region}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs">County:</span>
                    <p className="font-medium text-gray-900">{user.county}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs">Sub-County:</span>
                    <p className="font-medium text-gray-900">{user.subcounty || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs">Headquarters:</span>
                    <p className="font-medium text-gray-900">{user.headquarters}</p>
                  </div>
                </div>
                {user.jurisdictionOverview && (
                  <div className="mt-2">
                    <span className="text-gray-600 text-xs">Jurisdiction Overview:</span>
                    <p className="font-medium text-gray-900 mt-1 text-sm">{user.jurisdictionOverview}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Background & Experience */}
            <Card className="p-4 border-amber-200 bg-amber-50/30">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Background & Experience</h3>
              <div className="space-y-2 text-sm">
                {user.education && (
                  <div>
                    <span className="text-gray-600 text-xs">Education:</span>
                    <p className="font-medium text-gray-900">{user.education}</p>
                  </div>
                )}
                {user.yearsOfExperience && (
                  <div>
                    <span className="text-gray-600 text-xs">Years of Experience:</span>
                    <p className="font-medium text-gray-900">{user.yearsOfExperience} years</p>
                  </div>
                )}
                {user.expertise && user.expertise.length > 0 && (
                  <div>
                    <span className="text-gray-600 text-xs">Areas of Expertise:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.expertise.map((exp: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 text-xs">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Budget & Metrics */}
            {user.budgetAllocated && (
              <Card className="p-4 border-purple-200 bg-purple-50/30">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Budget & Performance Metrics</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600 text-xs">Budget Allocated:</span>
                    <p className="font-medium text-gray-900">KES {(parseFloat(user.budgetAllocated) / 1000000).toFixed(1)}M</p>
                  </div>
                  {user.performanceTarget && (
                    <div>
                      <span className="text-gray-600 text-xs">Performance Target:</span>
                      <p className="font-medium text-gray-900">{user.performanceTarget}%</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Key Initiatives */}
            {user.initiatives && user.initiatives.length > 0 && (
              <Card className="p-4 border-indigo-200 bg-indigo-50/30">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Key Initiatives ({user.initiatives.length})</h3>
                <div className="space-y-2">
                  {user.initiatives.map((initiative: any) => (
                    <div key={initiative.id} className="border-l-4 border-indigo-400 pl-3 py-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{initiative.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{initiative.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Account Status */}
            <Card className="p-4 border-gray-200 bg-gray-50/30">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Account Status</h3>
              <div className="flex items-center gap-3">
                <Badge className="bg-green-500 text-white text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Active
                </Badge>
                <span className="text-xs text-gray-600">
                  Created: {new Date(user.createdAt).toLocaleDateString('en-KE', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface UserManagementProps {
  onCriticalAction: (title: string, description: string, action: () => void) => void;
}

export function UserManagement({ onCriticalAction }: UserManagementProps) {
  const { createdUsers } = useCreatedUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const getRoleName = (role: string) => {
    const roleMap: Record<string, string> = {
      'SNA': 'Secretary National Administrator',
      'RC': 'Regional Commissioner',
      'CC': 'County Commissioner',
      'DC': 'District Commissioner',
      'ACC': 'Assistant County Commissioner',
      'CS': 'Cabinet Secretary',
      'PS': 'Principal Secretary',
      'AS': 'Assistant Secretary'
    };
    return roleMap[role] || role;
  };

  const getDepartmentName = (dept: string) => {
    const deptMap: Record<string, string> = {
      'county-admin': 'County Administration',
      'national-admin': 'National Administration',
      'security': 'Security & Safety',
      'devolution': 'Devolution Affairs',
      'border-management': 'Border Management',
      'special-programs': 'Special Programs'
    };
    return deptMap[dept] || dept;
  };

  const filteredUsers = createdUsers.filter(user => {
    const matchesSearch = 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.county?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Role', 'Department', 'Region', 'County', 'Created Date'];
    const rows = createdUsers.map(user => [
      `${user.firstName} ${user.lastName}`,
      user.email,
      user.phone,
      getRoleName(user.role),
      getDepartmentName(user.department),
      user.region,
      user.county,
      new Date(user.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kenya-admin-users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 border-violet-200 bg-violet-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-violet-600 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage all users created in the Kenya National Administration system
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-3xl font-bold text-violet-600">{createdUsers.length}</div>
              <div className="text-xs text-gray-600">Total Users</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or county..."
              className="pl-10"
            />
          </div>
          <div className="w-64">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
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
          <Button onClick={exportToCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </Card>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {createdUsers.length === 0 ? 'No Users Created Yet' : 'No Users Match Your Search'}
            </h3>
            <p className="text-gray-600 text-sm">
              {createdUsers.length === 0 
                ? 'Click "Create New Employee" in the navigation to add your first officer.'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{user.position}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {getDepartmentName(user.department)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-3 h-3" />
                        {user.county}, {user.region}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('en-KE')}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500 text-white">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* User Details Dialog */}
      {selectedUser && (
        <UserDetailsDialog
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}