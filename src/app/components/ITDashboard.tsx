import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLogo, type UploadedAsset } from '@/contexts/LogoContext';
import { 
  Settings, Users, Shield, Database, Key, Activity, Lock, 
  Eye, AlertTriangle, CheckCircle, Clock, FileText, Download,
  UserPlus, UserMinus, Search, Filter, MoreVertical, Image, Upload, Trash2, X, Star
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Badge } from '@/app/components/ui/badge';
import { Switch } from '@/app/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { toast } from 'sonner';

// Mock data for demonstration
const mockUsers = [
  { id: 1, username: 'john.doe', name: 'John Doe', role: 'Cabinet Secretary', status: 'active', lastLogin: '2024-03-01 14:30', mfa: true },
  { id: 2, username: 'jane.smith', name: 'Jane Smith', role: 'Principal Secretary', status: 'active', lastLogin: '2024-03-01 12:15', mfa: true },
  { id: 3, username: 'bob.wilson', name: 'Bob Wilson', role: 'Regional Commissioner', status: 'inactive', lastLogin: '2024-02-28 09:00', mfa: false },
  { id: 4, username: 'alice.brown', name: 'Alice Brown', role: 'County Commissioner', status: 'active', lastLogin: '2024-03-01 13:45', mfa: true },
];

const mockLoginActivity = [
  { id: 1, username: 'john.doe', time: '2024-03-01 14:30', ip: '192.168.1.100', status: 'success', location: 'Nairobi' },
  { id: 2, username: 'jane.smith', time: '2024-03-01 12:15', ip: '192.168.1.101', status: 'success', location: 'Mombasa' },
  { id: 3, username: 'unknown', time: '2024-03-01 11:00', ip: '45.33.21.10', status: 'failed', location: 'Unknown' },
  { id: 4, username: 'bob.wilson', time: '2024-02-28 09:00', ip: '192.168.1.102', status: 'success', location: 'Kisumu' },
];

const mockSecurityEvents = [
  { id: 1, type: 'suspicious_login', description: 'Multiple failed login attempts', user: 'unknown', time: '2024-03-01 11:00', severity: 'high' },
  { id: 2, type: 'permission_change', description: 'Role permissions modified', user: 'it.manager', time: '2024-03-01 10:30', severity: 'medium' },
  { id: 3, type: 'data_access', description: 'Bulk data export', user: 'jane.smith', time: '2024-03-01 09:15', severity: 'low' },
];

const mockBackups = [
  { id: 1, name: 'Daily Backup - March 1', date: '2024-03-01 02:00', size: '2.4 GB', status: 'completed' },
  { id: 2, name: 'Daily Backup - Feb 29', date: '2024-02-29 02:00', size: '2.3 GB', status: 'completed' },
  { id: 3, name: 'Weekly Backup - Feb 25', date: '2024-02-25 02:00', size: '15.7 GB', status: 'completed' },
];

export function ITDashboard() {
  const { user } = useAuth();
  const { uploadedAssets, addAsset, deleteAsset, primaryLogo, setPrimaryLogo } = useLogo();
  const [selectedTab, setSelectedTab] = useState('users');
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Logo Management State
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState('');
  const [assetDescription, setAssetDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only PNG, JPG, and SVG files are allowed');
      return;
    }

    setSelectedFile(file);
  };

  // Handle asset upload
  const handleUploadAsset = async () => {
    // Validation
    if (!assetName.trim()) {
      toast.error('Please enter an asset name');
      return;
    }
    if (!assetType) {
      toast.error('Please select an asset type');
      return;
    }
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsUploading(true);

    try {
      // Convert file to base64 for display
      const reader = new FileReader();
      reader.onload = (e) => {
        const newAsset: UploadedAsset = {
          id: `asset-${Date.now()}`,
          name: assetName,
          type: assetType,
          description: assetDescription,
          url: e.target?.result as string,
          size: selectedFile.size,
          uploadedAt: new Date().toLocaleString(),
        };

        addAsset(newAsset);
        
        // Reset form
        setAssetName('');
        setAssetType('');
        setAssetDescription('');
        setSelectedFile(null);
        
        // Reset file input
        const fileInput = document.getElementById('asset-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';

        toast.success(`Asset "${assetName}" uploaded successfully!`);
        setIsUploading(false);
      };

      reader.onerror = () => {
        toast.error('Failed to read file');
        setIsUploading(false);
      };

      reader.readAsDataURL(selectedFile);
    } catch (error) {
      toast.error('Failed to upload asset');
      setIsUploading(false);
    }
  };

  // Handle asset deletion
  const handleDeleteAsset = (assetId: string) => {
    const asset = uploadedAssets.find(a => a.id === assetId);
    deleteAsset(assetId);
    toast.success(`Asset "${asset?.name}" deleted successfully`);
  };

  // Format asset type for display
  const formatAssetType = (type: string) => {
    const typeMap: Record<string, string> = {
      'header': 'Header Logo',
      'login': 'Login Screen',
      'dashboard': 'Dashboard Icon',
      'footer': 'Footer Logo',
      'banner': 'Banner Image',
      'other': 'Other'
    };
    return typeMap[type] || type;
  };

  // Calculate total storage used
  const totalStorageUsed = uploadedAssets.reduce((sum, asset) => sum + asset.size, 0);
  const storageMB = (totalStorageUsed / (1024 * 1024)).toFixed(2);

  // Stats
  const stats = {
    totalUsers: 2465,
    activeUsers: 2401,
    suspiciousEvents: 3,
    lastBackup: '2 hours ago',
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="p-6 bg-[#F5F5DC] border-[#66023C]/20">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-[#66023C] flex items-center justify-center">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#66023C]">IT Management Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.name}</p>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-white border-[#66023C]/20">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded bg-[#F5F5DC] flex items-center justify-center">
              <Users className="h-6 w-6 text-[#66023C]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-[#66023C]">{stats.totalUsers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-[#66023C]/20">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded bg-green-50 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-[#66023C]/20">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded bg-red-50 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Security Alerts</p>
              <p className="text-2xl font-bold text-red-600">{stats.suspiciousEvents}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-[#66023C]/20">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded bg-blue-50 flex items-center justify-center">
              <Database className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Backup</p>
              <p className="text-lg font-bold text-blue-600">{stats.lastBackup}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="data-[state=active]:bg-[#66023C] data-[state=active]:text-white">
            <Users className="w-4 h-4 mr-2" />
            User & Access Management
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-[#66023C] data-[state=active]:text-white">
            <Shield className="w-4 h-4 mr-2" />
            System Security
          </TabsTrigger>
          <TabsTrigger value="logos" className="data-[state=active]:bg-[#66023C] data-[state=active]:text-white">
            <Image className="w-4 h-4 mr-2" />
            Logo Management
          </TabsTrigger>
          <TabsTrigger value="data" className="data-[state=active]:bg-[#66023C] data-[state=active]:text-white">
            <Database className="w-4 h-4 mr-2" />
            Data Management
          </TabsTrigger>
        </TabsList>

        {/* User & Access Management */}
        <TabsContent value="users" className="space-y-6">
          {/* User Management Tools */}
          <Card className="p-6 border-[#66023C]/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#66023C]">Staff Accounts</h2>
                <p className="text-sm text-gray-600">Create, manage, and monitor user accounts</p>
              </div>
              <Dialog open={createUserOpen} onOpenChange={setCreateUserOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#66023C] hover:bg-[#4a0128]">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create New Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Staff Account</DialogTitle>
                    <DialogDescription>
                      Fill in the details to create a new user account with appropriate role-based permissions.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullname">Full Name</Label>
                        <Input id="fullname" placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" placeholder="john.doe" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john.doe@interior.go.ke" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" placeholder="+254 712 345 678" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cs">Cabinet Secretary</SelectItem>
                            <SelectItem value="ps">Principal Secretary</SelectItem>
                            <SelectItem value="rc">Regional Commissioner</SelectItem>
                            <SelectItem value="cc">County Commissioner</SelectItem>
                            <SelectItem value="acc">Assistant County Commissioner</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="region">Region/County</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nairobi">Nairobi</SelectItem>
                            <SelectItem value="mombasa">Mombasa</SelectItem>
                            <SelectItem value="kisumu">Kisumu</SelectItem>
                            <SelectItem value="nakuru">Nakuru</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="mfa" />
                      <Label htmlFor="mfa">Enable Multi-Factor Authentication (MFA)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="force-password" defaultChecked />
                      <Label htmlFor="force-password">Force password change on first login</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCreateUserOpen(false)}>Cancel</Button>
                    <Button className="bg-[#66023C] hover:bg-[#4a0128]">Create Account</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, username, or role..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* User Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>MFA</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.username}</p>
                        </div>
                      </TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className={user.status === 'active' ? 'bg-green-100 text-green-800' : ''}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.mfa ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Enabled
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700">
                            Disabled
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Password & MFA Policies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-[#66023C]/20">
              <div className="flex items-center gap-3 mb-4">
                <Key className="h-5 w-5 text-[#66023C]" />
                <h3 className="font-bold text-[#66023C]">Password Policies</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Minimum password length</Label>
                  <Select defaultValue="8">
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 characters</SelectItem>
                      <SelectItem value="8">8 characters</SelectItem>
                      <SelectItem value="12">12 characters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Require special characters</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Require uppercase & lowercase</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Password expiration (days)</Label>
                  <Select defaultValue="90">
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full bg-[#66023C] hover:bg-[#4a0128]">
                  Save Password Policy
                </Button>
              </div>
            </Card>

            <Card className="p-6 border-[#66023C]/20">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-5 w-5 text-[#66023C]" />
                <h3 className="font-bold text-[#66023C]">Multi-Factor Authentication</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Require MFA for all users</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>MFA for admin roles only</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Allow SMS verification</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Allow authenticator apps</Label>
                  <Switch defaultChecked />
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>2,401</strong> users have MFA enabled
                  </p>
                </div>
                <Button className="w-full bg-[#66023C] hover:bg-[#4a0128]">
                  Save MFA Settings
                </Button>
              </div>
            </Card>
          </div>

          {/* Login Activity Monitor */}
          <Card className="p-6 border-[#66023C]/20">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="h-5 w-5 text-[#66023C]" />
              <h3 className="font-bold text-[#66023C]">Recent Login Activity</h3>
            </div>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLoginActivity.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.username}</TableCell>
                      <TableCell className="text-sm text-gray-600">{activity.time}</TableCell>
                      <TableCell className="text-sm text-gray-600">{activity.ip}</TableCell>
                      <TableCell className="text-sm text-gray-600">{activity.location}</TableCell>
                      <TableCell>
                        <Badge variant={activity.status === 'success' ? 'default' : 'destructive'} className={activity.status === 'success' ? 'bg-green-100 text-green-800' : ''}>
                          {activity.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* System Security */}
        <TabsContent value="security" className="space-y-6">
          {/* Security Monitoring */}
          <Card className="p-6 border-[#66023C]/20">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-[#66023C]" />
              <h3 className="font-bold text-[#66023C]">Security Events & Suspicious Activity</h3>
            </div>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSecurityEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium capitalize">{event.type.replace('_', ' ')}</TableCell>
                      <TableCell>{event.description}</TableCell>
                      <TableCell>{event.user}</TableCell>
                      <TableCell className="text-sm text-gray-600">{event.time}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            event.severity === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                            event.severity === 'medium' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                            'bg-blue-50 text-blue-700 border-blue-200'
                          }
                        >
                          {event.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Security Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-[#66023C]/20">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="h-5 w-5 text-[#66023C]" />
                <h3 className="font-bold text-[#66023C]">Access Restrictions</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable IP whitelist</Label>
                  <Switch />
                </div>
                <div className="space-y-2">
                  <Label>Allowed IP Ranges</Label>
                  <Input placeholder="192.168.1.0/24" />
                  <Button variant="outline" size="sm" className="w-full">
                    Add IP Range
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Restrict login hours</Label>
                  <Switch />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label className="text-xs">From</Label>
                    <Input type="time" defaultValue="06:00" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">To</Label>
                    <Input type="time" defaultValue="22:00" disabled />
                  </div>
                </div>
                <Button className="w-full bg-[#66023C] hover:bg-[#4a0128]">
                  Save Restrictions
                </Button>
              </div>
            </Card>

            <Card className="p-6 border-[#66023C]/20">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-5 w-5 text-[#66023C]" />
                <h3 className="font-bold text-[#66023C]">Data Encryption</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Encrypt data at rest</Label>
                  <Switch defaultChecked disabled />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Encrypt data in transit (SSL/TLS)</Label>
                  <Switch defaultChecked disabled />
                </div>
                <div className="flex items-center justify-between">
                  <Label>End-to-end encryption</Label>
                  <Switch defaultChecked />
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>SSL Certificate:</strong> Valid until Dec 2026
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Encryption Key Rotation</Label>
                  <Select defaultValue="90">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">Every 30 days</SelectItem>
                      <SelectItem value="90">Every 90 days</SelectItem>
                      <SelectItem value="180">Every 180 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </div>

          {/* Audit Logs */}
          <Card className="p-6 border-[#66023C]/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-[#66023C]" />
                <h3 className="font-bold text-[#66023C]">Audit Logs & Compliance</h3>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Logs
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Audit Logging Enabled</p>
                    <p className="text-sm text-green-600">All system activities are being logged</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Log Retention Period</p>
                  <p className="text-2xl font-bold text-[#66023C]">365 days</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Log Entries</p>
                  <p className="text-2xl font-bold text-[#66023C]">1.2M</p>
                </div>
              </div>
              <Button className="w-full" variant="outline">
                Schedule Access Review
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Logo Management */}
        <TabsContent value="logos" className="space-y-6">
          {/* Logo Upload Section */}
          <Card className="p-6 border-[#66023C]/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Image className="h-5 w-5 text-[#66023C]"/>
                <div>
                  <h3 className="font-bold text-[#66023C]">Platform Assets Management</h3>
                  <p className="text-sm text-gray-600">Upload and manage logos, icons, and branding assets</p>
                </div>
              </div>
            </div>

            {/* Upload Form */}
            <div className="p-6 bg-[#F5F5DC]/30 border border-[#66023C]/20 rounded-lg mb-6">
              <div className="flex items-center gap-4 mb-4">
                <Upload className="h-5 w-5 text-[#66023C]"/>
                <h4 className="font-semibold text-[#66023C]">Upload New Asset</h4>
              </div>
              
              {/* Persistence Info Banner */}
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-semibold">Assets Persist Across Sessions</p>
                  <p className="text-xs text-green-700 mt-1">
                    All uploaded logos and assets are saved automatically and will remain visible to all users, even after logout or browser refresh.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="asset-name">Asset Name</Label>
                    <Input id="asset-name" placeholder="e.g., Ministry Logo" value={assetName} onChange={(e) => setAssetName(e.target.value)}/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="asset-type">Asset Type</Label>
                    <Select value={assetType} onValueChange={setAssetType}>
                      <SelectTrigger id="asset-type">
                        <SelectValue placeholder="Select type"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="header">Header Logo</SelectItem>
                        <SelectItem value="login">Login Screen Logo</SelectItem>
                        <SelectItem value="dashboard">Dashboard Icon</SelectItem>
                        <SelectItem value="footer">Footer Logo</SelectItem>
                        <SelectItem value="banner">Banner Image</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asset-file">Select Image File</Label>
                  <Input id="asset-file" type="file" accept="image/*" onChange={handleFileChange}/>
                  <p className="text-xs text-gray-500">Accepted formats: PNG, JPG, SVG (Max size: 5MB)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asset-description">Description (Optional)</Label>
                  <Input id="asset-description" placeholder="Brief description of this asset" value={assetDescription} onChange={(e) => setAssetDescription(e.target.value)}/>
                </div>
                <Button className="w-full bg-[#66023C] hover:bg-[#4a0128]" onClick={handleUploadAsset} disabled={isUploading}>
                  <Upload className="w-4 h-4 mr-2"/>
                  {isUploading ? 'Uploading...' : 'Upload Asset'}
                </Button>
              </div>
            </div>

            {/* Current Assets Gallery */}
            <div>
              <h4 className="font-semibold text-[#66023C] mb-4">Current Assets</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Uploaded assets */}
                {uploadedAssets.length > 0 ? (
                  uploadedAssets.map(asset => (
                    <div key={asset.id} className="relative group p-2 border-2 border-gray-300 rounded-lg bg-white hover:shadow-lg transition-shadow">
                      <div className="aspect-square w-full flex items-center justify-center overflow-hidden rounded bg-gray-50">
                        <img 
                          src={asset.url} 
                          alt={asset.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-900 truncate">{asset.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{formatAssetType(asset.type)}</p>
                        <p className="text-xs text-gray-400">{(asset.size / 1024).toFixed(2)} KB</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="absolute top-2 right-2 bg-white/90 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity" 
                        title="Delete" 
                        onClick={() => handleDeleteAsset(asset.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500"/>
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center h-40 bg-gray-50">
                    <Image className="h-8 w-8 text-gray-400 mb-2"/>
                    <p className="text-sm text-gray-500">No assets uploaded yet</p>
                    <p className="text-xs text-gray-400 mt-1">Upload your first asset above</p>
                  </div>
                )}
              </div>
            </div>

            {/* Active Assets List */}
            <Card className="p-6 border-[#66023C]/20">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-5 w-5 text-[#66023C]"/>
                <h3 className="font-bold text-[#66023C]">Asset Library</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Total Assets: <strong>{uploadedAssets.length}</strong></p>
                <p className="text-sm text-gray-600">Storage Used: <strong>{storageMB} MB</strong> / 100 MB</p>
              </div>
              <div className="mt-4 p-8 bg-gray-50 border rounded-lg text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-3">
                  <Image className="w-8 h-8 text-gray-400"/>
                </div>
                <p className="text-gray-600 font-medium">No assets in library</p>
                <p className="text-sm text-gray-500 mt-1">Upload assets to see them listed here</p>
              </div>
            </Card>

            {/* Asset Usage Guidelines */}
            <Card className="p-6 border-[#66023C]/20 bg-blue-50">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-5 w-5 text-blue-600"/>
                <h3 className="font-bold text-blue-900">Asset Upload Guidelines</h3>
              </div>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0"/>
                  <span>Use high-resolution images for logos (minimum 512x512px recommended)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0"/>
                  <span>PNG format with transparent background works best for logos and icons</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0"/>
                  <span>SVG format is ideal for scalable graphics and icons</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0"/>
                  <span>Ensure all uploaded assets comply with government branding standards</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0"/>
                  <span>Recommended colors: Maroon (#66023C), Beige (#F5F5DC), and Black</span>
                </li>
              </ul>
            </Card>
          </Card>
        </TabsContent>

        {/* Data Management */}
        <TabsContent value="data" className="space-y-6">
          {/* Backup Management */}
          <Card className="p-6 border-[#66023C]/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-[#66023C]" />
                <h3 className="font-bold text-[#66023C]">Automated Backups</h3>
              </div>
              <Button className="bg-[#66023C] hover:bg-[#4a0128]">
                <Download className="w-4 h-4 mr-2" />
                Run Manual Backup
              </Button>
            </div>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Backup Name</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBackups.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell className="font-medium">{backup.name}</TableCell>
                      <TableCell className="text-sm text-gray-600">{backup.date}</TableCell>
                      <TableCell className="text-sm text-gray-600">{backup.size}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {backup.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" title="Restore">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Download">
                            <FileText className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Backup Schedule & Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-[#66023C]/20">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-5 w-5 text-[#66023C]" />
                <h3 className="font-bold text-[#66023C]">Backup Schedule</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Daily Backup Time</Label>
                  <Input type="time" defaultValue="02:00" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Weekly Full Backup</Label>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Weekly Backup Day</Label>
                  <Select defaultValue="sunday">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="tuesday">Tuesday</SelectItem>
                      <SelectItem value="wednesday">Wednesday</SelectItem>
                      <SelectItem value="thursday">Thursday</SelectItem>
                      <SelectItem value="friday">Friday</SelectItem>
                      <SelectItem value="saturday">Saturday</SelectItem>
                      <SelectItem value="sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Monthly Archive</Label>
                  <Switch defaultChecked />
                </div>
                <Button className="w-full bg-[#66023C] hover:bg-[#4a0128]">
                  Update Schedule
                </Button>
              </div>
            </Card>

            <Card className="p-6 border-[#66023C]/20">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-5 w-5 text-[#66023C]" />
                <h3 className="font-bold text-[#66023C]">Data Retention Policy</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Backup Retention Period</Label>
                  <Select defaultValue="90">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Archive Retention</Label>
                  <Select defaultValue="7years">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1year">1 year</SelectItem>
                      <SelectItem value="3years">3 years</SelectItem>
                      <SelectItem value="5years">5 years</SelectItem>
                      <SelectItem value="7years">7 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Auto-delete expired backups</Label>
                  <Switch defaultChecked />
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Current storage: <strong>47.3 GB</strong>
                  </p>
                </div>
                <Button className="w-full bg-[#66023C] hover:bg-[#4a0128]">
                  Save Retention Policy
                </Button>
              </div>
            </Card>
          </div>

          {/* Recovery Testing & Database Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-[#66023C]/20">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-5 w-5 text-[#66023C]" />
                <h3 className="font-bold text-[#66023C]">Data Recovery Testing</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>Last Recovery Test:</strong> Feb 15, 2024
                  </p>
                  <p className="text-sm text-blue-600">Status: Successful</p>
                </div>
                <div className="space-y-2">
                  <Label>Select Backup to Test</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a backup" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockBackups.map((backup) => (
                        <SelectItem key={backup.id} value={backup.id.toString()}>
                          {backup.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" variant="outline">
                  Run Recovery Test
                </Button>
                <p className="text-xs text-gray-500">
                  Recovery tests validate backup integrity without affecting production data
                </p>
              </div>
            </Card>

            <Card className="p-6 border-[#66023C]/20">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="h-5 w-5 text-[#66023C]" />
                <h3 className="font-bold text-[#66023C]">Database Performance</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Query Response</p>
                    <p className="text-2xl font-bold text-green-600">23ms</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">CPU Usage</p>
                    <p className="text-2xl font-bold text-blue-600">34%</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Memory</p>
                    <p className="text-2xl font-bold text-orange-600">2.1GB</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Connections</p>
                    <p className="text-2xl font-bold text-[#66023C]">47</p>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  View Detailed Metrics
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}