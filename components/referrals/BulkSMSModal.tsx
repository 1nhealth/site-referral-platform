'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MessageSquare,
  Users,
  ChevronRight,
  ChevronLeft,
  Check,
  Send,
  AlertCircle,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Checkbox } from '@/components/ui/Checkbox';
import { Avatar } from '@/components/ui/Avatar';
import { smsTemplates, replaceTokens, getSMSInfo, availableTokens } from '@/lib/mock-data/sms-templates';
import { mockStudies } from '@/lib/mock-data/studies';
import { mockSite } from '@/lib/mock-data/site';
import type { Referral } from '@/lib/types';

interface BulkSMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedReferrals: Referral[];
  senderName?: string;
}

type Step = 'recipients' | 'template' | 'preview' | 'success';

export function BulkSMSModal({
  isOpen,
  onClose,
  selectedReferrals,
  senderName = 'Sarah',
}: BulkSMSModalProps) {
  const [step, setStep] = useState<Step>('recipients');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(selectedReferrals.map((r) => r.id))
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [customMessage, setCustomMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const selectedTemplate = smsTemplates.find((t) => t.id === selectedTemplateId);
  const messageContent = selectedTemplateId === 'custom' ? customMessage : selectedTemplate?.content || '';

  const finalRecipients = selectedReferrals.filter((r) => selectedIds.has(r.id));

  // Preview message for first recipient
  const previewMessage = useMemo(() => {
    if (finalRecipients.length === 0 || !messageContent) return '';

    const firstRecipient = finalRecipients[0];
    const study = mockStudies.find((s) => s.id === firstRecipient.studyId);

    return replaceTokens(messageContent, {
      firstName: firstRecipient.firstName,
      lastName: firstRecipient.lastName,
      studyName: study?.name || 'Research Study',
      senderName,
      siteName: mockSite.name,
      sitePhone: '(555) 123-4567',
      siteAddress: mockSite.address,
      appointmentDate: 'Monday, Dec 16',
      appointmentTime: '10:00 AM',
    });
  }, [finalRecipients, messageContent, senderName]);

  const smsInfo = getSMSInfo(previewMessage);

  const handleToggleRecipient = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === selectedReferrals.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(selectedReferrals.map((r) => r.id)));
    }
  };

  const handleSend = async () => {
    setIsSending(true);
    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSending(false);
    setStep('success');
  };

  const handleClose = () => {
    setStep('recipients');
    setSelectedTemplateId('');
    setCustomMessage('');
    onClose();
  };

  const canProceedToTemplate = selectedIds.size > 0;
  const canProceedToPreview = selectedTemplateId !== '' && (selectedTemplateId !== 'custom' || customMessage.length > 0);

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {['recipients', 'template', 'preview'].map((s, index) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              step === s
                ? 'bg-mint text-white'
                : ['recipients', 'template', 'preview'].indexOf(step) > index
                ? 'bg-mint/20 text-mint'
                : 'bg-bg-tertiary text-text-muted'
            }`}
          >
            {['recipients', 'template', 'preview'].indexOf(step) > index ? (
              <Check className="w-4 h-4" />
            ) : (
              index + 1
            )}
          </div>
          {index < 2 && (
            <div
              className={`w-12 h-0.5 mx-1 ${
                ['recipients', 'template', 'preview'].indexOf(step) > index
                  ? 'bg-mint'
                  : 'bg-bg-tertiary'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderRecipients = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-text-primary">Select Recipients</h3>
        <button
          onClick={handleSelectAll}
          className="text-sm text-mint hover:underline"
        >
          {selectedIds.size === selectedReferrals.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
        {selectedReferrals.map((referral) => {
          const study = mockStudies.find((s) => s.id === referral.studyId);
          return (
            <motion.div
              key={referral.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                selectedIds.has(referral.id)
                  ? 'border-mint/30 bg-mint/5'
                  : 'border-glass-border bg-bg-tertiary/30 hover:bg-bg-tertiary/50'
              }`}
              onClick={() => handleToggleRecipient(referral.id)}
            >
              <Checkbox
                checked={selectedIds.has(referral.id)}
                onChange={() => handleToggleRecipient(referral.id)}
              />
              <Avatar
                firstName={referral.firstName}
                lastName={referral.lastName}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-primary truncate">
                  {referral.firstName} {referral.lastName}
                </p>
                <p className="text-xs text-text-muted truncate">{study?.name}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-glass-border">
        <span className="text-sm text-text-muted">
          {selectedIds.size} of {selectedReferrals.length} selected
        </span>
        <Button
          variant="primary"
          rightIcon={<ChevronRight className="w-4 h-4" />}
          onClick={() => setStep('template')}
          disabled={!canProceedToTemplate}
        >
          Choose Template
        </Button>
      </div>
    </div>
  );

  const renderTemplate = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-text-primary">Choose Message Template</h3>

      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
        {smsTemplates.map((template) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-xl border cursor-pointer transition-colors ${
              selectedTemplateId === template.id
                ? 'border-mint/30 bg-mint/5'
                : 'border-glass-border bg-bg-tertiary/30 hover:bg-bg-tertiary/50'
            }`}
            onClick={() => setSelectedTemplateId(template.id)}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-text-primary">{template.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-bg-tertiary text-text-muted capitalize">
                {template.category}
              </span>
            </div>
            <p className="text-xs text-text-muted line-clamp-2">{template.content}</p>
          </motion.div>
        ))}

        {/* Custom message option */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-xl border cursor-pointer transition-colors ${
            selectedTemplateId === 'custom'
              ? 'border-mint/30 bg-mint/5'
              : 'border-glass-border bg-bg-tertiary/30 hover:bg-bg-tertiary/50'
          }`}
          onClick={() => setSelectedTemplateId('custom')}
        >
          <span className="font-medium text-text-primary">Custom Message</span>
          <p className="text-xs text-text-muted">Write your own message</p>
        </motion.div>
      </div>

      {selectedTemplateId === 'custom' && (
        <div className="space-y-2">
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Type your message here... Use tokens like {{firstName}} for personalization"
            className="w-full h-24 px-3 py-2 bg-bg-tertiary/50 border border-glass-border rounded-xl text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-mint/50"
          />
          <div className="flex flex-wrap gap-1">
            {availableTokens.slice(0, 4).map((t) => (
              <button
                key={t.token}
                onClick={() => setCustomMessage((prev) => prev + ' ' + t.token)}
                className="text-xs px-2 py-1 rounded-md bg-bg-tertiary text-text-muted hover:text-mint transition-colors"
              >
                {t.token}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-glass-border">
        <Button
          variant="ghost"
          leftIcon={<ChevronLeft className="w-4 h-4" />}
          onClick={() => setStep('recipients')}
        >
          Back
        </Button>
        <Button
          variant="primary"
          rightIcon={<ChevronRight className="w-4 h-4" />}
          onClick={() => setStep('preview')}
          disabled={!canProceedToPreview}
        >
          Preview
        </Button>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-text-primary">Preview & Send</h3>

      {/* Message preview */}
      <GlassCard variant="inset" padding="md">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-vista-blue/10">
            <MessageSquare className="w-5 h-5 text-vista-blue" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-text-primary whitespace-pre-wrap">{previewMessage}</p>
            <div className="flex items-center gap-3 mt-3 text-xs text-text-muted">
              <span>{smsInfo.charCount} characters</span>
              <span>{smsInfo.segmentCount} SMS segment{smsInfo.segmentCount > 1 ? 's' : ''}</span>
              {smsInfo.isLong && (
                <span className="text-warning flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Long message
                </span>
              )}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Recipients summary */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-tertiary/30 border border-glass-border">
        <div className="p-2 rounded-xl bg-mint/10">
          <Users className="w-5 h-5 text-mint" />
        </div>
        <div>
          <p className="font-medium text-text-primary">
            Sending to {finalRecipients.length} recipient{finalRecipients.length > 1 ? 's' : ''}
          </p>
          <p className="text-xs text-text-muted">
            {finalRecipients.slice(0, 3).map((r) => r.firstName).join(', ')}
            {finalRecipients.length > 3 && ` and ${finalRecipients.length - 3} more`}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-glass-border">
        <Button
          variant="ghost"
          leftIcon={<ChevronLeft className="w-4 h-4" />}
          onClick={() => setStep('template')}
        >
          Back
        </Button>
        <Button
          variant="primary"
          leftIcon={<Send className="w-4 h-4" />}
          onClick={handleSend}
          isLoading={isSending}
        >
          Send {finalRecipients.length} Message{finalRecipients.length > 1 ? 's' : ''}
        </Button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="w-16 h-16 rounded-full bg-mint/20 flex items-center justify-center mx-auto mb-4"
      >
        <Check className="w-8 h-8 text-mint" />
      </motion.div>
      <h3 className="text-xl font-semibold text-text-primary mb-2">
        Messages Sent!
      </h3>
      <p className="text-text-secondary mb-6">
        Successfully sent {finalRecipients.length} SMS message{finalRecipients.length > 1 ? 's' : ''}.
      </p>
      <Button variant="primary" onClick={handleClose}>
        Done
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step !== 'success' ? 'Bulk SMS Campaign' : undefined}
      size="md"
    >
      {step !== 'success' && renderStepIndicator()}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {step === 'recipients' && renderRecipients()}
          {step === 'template' && renderTemplate()}
          {step === 'preview' && renderPreview()}
          {step === 'success' && renderSuccess()}
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
}
