'use client';

import { useState } from 'react';
import { FlaskConical, Save, Plus, X } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { mockStudies } from '@/lib/mock-data/studies';

interface SiteData {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export function SiteSettings() {
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [site, setSite] = useState<SiteData>({
    name: 'Metro Clinical Research Center',
    address: '123 Medical Plaza Dr, Suite 400',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
    addToast({
      type: 'success',
      title: 'Site Settings Updated',
      message: 'Your site information has been saved.',
    });
  };

  return (
    <GlassCard padding="lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text-primary">Site Information</h2>
        {!isEditing ? (
          <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
            Edit Site
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

      <div className="space-y-6">
        {/* Site Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Site Name"
              value={site.name}
              onChange={(e) => setSite({ ...site, name: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div className="md:col-span-2">
            <Input
              label="Street Address"
              value={site.address}
              onChange={(e) => setSite({ ...site, address: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <Input
            label="City"
            value={site.city}
            onChange={(e) => setSite({ ...site, city: e.target.value })}
            disabled={!isEditing}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="State"
              value={site.state}
              onChange={(e) => setSite({ ...site, state: e.target.value })}
              disabled={!isEditing}
            />
            <Input
              label="ZIP"
              value={site.zip}
              onChange={(e) => setSite({ ...site, zip: e.target.value })}
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Active Studies */}
        <div className="pt-6 border-t border-glass-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-text-primary flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-mint" />
              Active Studies
            </h3>
            <Button variant="ghost" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Add Study
            </Button>
          </div>

          <div className="space-y-2">
            {mockStudies.map((study) => (
              <div
                key={study.id}
                className="flex items-center justify-between p-3 rounded-xl bg-bg-tertiary/50"
              >
                <div>
                  <p className="font-medium text-text-primary">{study.name}</p>
                  <p className="text-sm text-text-muted">{study.sponsor}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      study.status === 'active'
                        ? 'bg-mint/10 text-mint'
                        : 'bg-amber-500/10 text-amber-500'
                    }`}
                  >
                    {study.status === 'active' ? 'Active' : 'Enrolling'}
                  </span>
                  <button className="p-1 text-text-muted hover:text-error transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
