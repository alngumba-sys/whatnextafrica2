import { useState } from 'react';
import { users, getRoleName } from '@/data/users';
import { useAuth } from '@/contexts/AuthContext';
import { useLogo } from '@/contexts/LogoContext';
import { LogIn, Shield, Eye, EyeOff, Search, Check, ChevronsUpDown } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/app/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { cn } from '@/app/components/ui/utils';

export function LoginPage() {
  const [selectedUsername, setSelectedUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { login } = useAuth();
  const { loginLogo } = useLogo();

  console.log('LoginPage rendering');

  const selectedUser = users.find(u => u.username === selectedUsername);

  // Custom filtering function for strict search matching
  const filterUsers = (query: string) => {
    if (!query || query.trim() === '') {
      return users;
    }

    const searchTerm = query.toLowerCase().trim();
    
    return users.filter(user => {
      const name = user.name.toLowerCase();
      const username = user.username.toLowerCase();
      const role = getRoleName(user.role).toLowerCase();
      const region = user.region?.toLowerCase() || '';

      // Check if search term matches any field
      return (
        name.includes(searchTerm) ||
        username.includes(searchTerm) ||
        role.includes(searchTerm) ||
        region.includes(searchTerm)
      );
    });
  };

  const filteredUsers = filterUsers(searchQuery);

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
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
      <div className="w-full max-w-md px-4">
        <Card className="p-8 shadow-lg bg-white border-[#66023C]/20">
          {/* Header */}
          <div className="text-center mx-[0px] mt-[0px] mb-[7px]">
            <div className="flex justify-center mb-4">
              {loginLogo ? (
                <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden bg-white p-2 border-2 border-white">
                  <img 
                    src={loginLogo.url} 
                    alt="Ministry Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 bg-[#66023C] rounded-full flex items-center justify-center">
                  <Shield className="w-12 h-12 text-white" />
                </div>
              )}
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
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {selectedUser ? (
                      <div className="flex items-center gap-2 text-left">
                        <Shield className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <div className="overflow-hidden">
                          <div className="font-medium truncate">{selectedUser.name}</div>
                          <div className="text-xs text-gray-500 truncate">
                            {getRoleName(selectedUser.role)}
                            {selectedUser.region && ` - ${selectedUser.region}`}
                          </div>
                        </div>
                      </div>
                    ) : (
                      "Search for a user..."
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Type to search (e.g., 'IT Manager', 'john.doe')..."
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                    />
                    <CommandList>
                      <CommandEmpty>No user found.</CommandEmpty>
                      <CommandGroup>
                        {filteredUsers.map((user) => {
                          const roleDisplay = getRoleName(user.role);
                          const searchValue = `${user.username} ${user.name} ${roleDisplay}`.toLowerCase();
                          
                          return (
                            <CommandItem
                              key={user.id}
                              value={searchValue}
                              onSelect={() => {
                                setSelectedUsername(user.username);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedUsername === user.username ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-gray-500" />
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {roleDisplay}
                                    {user.region && ` - ${user.region}`}
                                  </div>
                                </div>
                              </div>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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

            <Button type="submit" className="w-full bg-[#66023C] hover:bg-[#4a0128]" size="lg">
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