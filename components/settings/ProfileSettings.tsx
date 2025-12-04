'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Save } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { useToast } from '@/components/ui/Toast';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

export function ProfileSettings() {
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@clinicalsite.com',
    phone: '(555) 123-4567',
    role: 'Site Coordinator',
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile has been saved successfully.',
    });
  };

  return (
    <GlassCard padding="lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text-primary">Profile</h2>
        {!isEditing ? (
          <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Save className="w-4 h-4" />}
              onClick={handleSave}
              isLoading={isSaving}
            >
              Save
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <Avatar
              firstName={profile.firstName}
              lastName={profile.lastName}
              size="xl"
            />
            {isEditing && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute bottom-0 right-0 p-2 bg-mint rounded-full text-white hover:bg-mint-dark transition-colors"
              >
                <Camera className="w-4 h-4" />
              </motion.button>
            )}
          </div>
          <p className="mt-3 text-sm text-text-muted">{profile.role}</p>
        </div>

        {/* Form Fields */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={profile.firstName}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            disabled={!isEditing}
          />
          <Input
            label="Last Name"
            value={profile.lastName}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            disabled={!isEditing}
          />
          <Input
            label="Email"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            disabled={!isEditing}
          />
          <Input
            label="Phone"
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            disabled={!isEditing}
          />
        </div>
      </div>
    </GlassCard>
  );
}
