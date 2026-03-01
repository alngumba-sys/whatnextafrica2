import { useState } from 'react';
import { users, getRoleName } from '@/data/users';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, Shield, Eye, EyeOff } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import coatOfArms from 'figma:asset/ed57e0c3f3c3ffae8d9e72531b73a87f82baf646.png';

export function LoginPage() {
  const [selectedUsername, setSelectedUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedUsername) {
      setError('Please select a username');
      return;
    }

    if (password !== 'Test@1234') {
      setError('Invalid password');
      return;
    }

    const user = users.find(u => u.username === selectedUsername);
    if (user) {
      login(user);
    } else {
      setError('User not found');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faedcd' }}>
      <div className="w-full max-w-md px-4">
        <Card className="p-8 shadow-lg">
          {/* Header */}
          <div className="text-center mx-[0px] mt-[0px] mb-[7px]">
            <div className="flex justify-center mb-4">
              <img src={coatOfArms} alt="Kenya Coat of Arms" className="h-24 w-auto" />
            </div>
            <p className="font-semibold text-gray-600 uppercase tracking-wide text-[16px] mx-[0px] mt-[-10px] mb-[8px]">
              Office of the President
            </p>
            <h1 className="font-bold text-gray-900 mb-1 text-[16px]">
              Ministry of Interior and National Administration
            </h1>
            <p className="text-xs text-gray-400">
              National Administration Officers Connect
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Select User</Label>
              <Select value={selectedUsername} onValueChange={setSelectedUsername}>
                <SelectTrigger id="username" className="w-full">
                  <SelectValue placeholder="Choose your username" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.username}>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-gray-500">
                            {getRoleName(user.role)}
                            {user.region && ` - ${user.region}`}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full bg-[rgb(50,49,65)]" size="lg">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Government of Kenya • Ministry of Interior and National Administration
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}