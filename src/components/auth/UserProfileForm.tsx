import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { User, Briefcase, Globe, Building, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Database } from '../../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UserProfileFormProps {
  onClose?: () => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [fullName, setFullName] = useState('');
  const [website, setWebsite] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  const getProfile = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setFullName(data.full_name || '');
        setWebsite(data.website || '');
        setCompanyName(data.company_name || '');
        setIndustry(data.industry || '');
        setAvatarUrl(data.avatar_url || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }
      setAvatarFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatarUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return null;
    
    const fileExt = avatarFile.name.split('.').pop();
    const filePath = `avatars/${user.id}-${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile);
    
    if (uploadError) {
      toast.error('Error uploading avatar');
      console.error(uploadError);
      return null;
    }
    
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setUpdating(true);
      
      // Upload avatar if changed
      let newAvatarUrl = avatarUrl;
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar();
        if (uploadedUrl) {
          newAvatarUrl = uploadedUrl;
        }
      }
      
      const updates = {
        id: user.id,
        full_name: fullName,
        website,
        company_name: companyName,
        industry,
        avatar_url: newAvatarUrl,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('profiles')
        .upsert(updates);
      
      if (error) {
        throw error;
      }
      
      toast.success('Profile updated successfully');
      if (onClose) onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 w-full max-w-md mx-auto">
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 mb-3">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
          <label className="cursor-pointer px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
            <span>Change Avatar</span>
            <input 
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>
        
        {/* Full Name */}
        <div>
          <label className="text-white font-medium mb-2 block">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white 
                       placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
              placeholder="John Doe"
            />
          </div>
        </div>
        
        {/* Website */}
        <div>
          <label className="text-white font-medium mb-2 block">Website</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white 
                       placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
              placeholder="https://example.com"
            />
          </div>
        </div>
        
        {/* Company Name */}
        <div>
          <label className="text-white font-medium mb-2 block">Company Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white 
                       placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
              placeholder="Acme Inc."
            />
          </div>
        </div>
        
        {/* Industry */}
        <div>
          <label className="text-white font-medium mb-2 block">Industry</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white 
                       placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
              placeholder="Technology, Marketing, etc."
            />
          </div>
        </div>
        
        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            disabled={updating}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black 
                     font-bold rounded-lg hover:from-yellow-300 hover:to-amber-400 transition-all duration-300 
                     shadow-lg shadow-yellow-400/25 hover:shadow-yellow-400/40 disabled:opacity-50 
                     disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {updating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
          
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 
                       transition-all duration-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;