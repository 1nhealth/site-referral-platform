export interface SMSTemplate {
  id: string;
  name: string;
  content: string;
  category: 'outreach' | 'reminder' | 'confirmation' | 'custom';
}

export const smsTemplates: SMSTemplate[] = [
  {
    id: 'initial-outreach',
    name: 'Initial Outreach',
    content: `Hi {{firstName}}, this is {{senderName}} from {{siteName}}. We received your interest in our {{studyName}} study. Would you be available for a brief phone call to discuss if you might be a good fit? Reply YES to schedule.`,
    category: 'outreach',
  },
  {
    id: 'follow-up-reminder',
    name: 'Follow-up Reminder',
    content: `Hi {{firstName}}, just following up on our {{studyName}} study. We'd love to speak with you about the opportunity. Please call us at {{sitePhone}} or reply to this message. Thank you!`,
    category: 'reminder',
  },
  {
    id: 'appointment-confirmation',
    name: 'Appointment Confirmation',
    content: `Hi {{firstName}}, this is a reminder of your appointment for the {{studyName}} study on {{appointmentDate}} at {{appointmentTime}}. Please reply CONFIRM or call {{sitePhone}} if you need to reschedule.`,
    category: 'confirmation',
  },
  {
    id: 'missed-call',
    name: 'Missed Call Follow-up',
    content: `Hi {{firstName}}, we tried to reach you about the {{studyName}} study. Please call us back at {{sitePhone}} at your earliest convenience. We look forward to speaking with you!`,
    category: 'reminder',
  },
  {
    id: 'screening-reminder',
    name: 'Screening Visit Reminder',
    content: `Hi {{firstName}}, reminder: Your screening visit for {{studyName}} is tomorrow at {{appointmentTime}}. Location: {{siteAddress}}. Please bring a valid ID. Questions? Call {{sitePhone}}.`,
    category: 'confirmation',
  },
];

// Available tokens for personalization
export const availableTokens = [
  { token: '{{firstName}}', description: 'Patient first name' },
  { token: '{{lastName}}', description: 'Patient last name' },
  { token: '{{studyName}}', description: 'Study name' },
  { token: '{{senderName}}', description: 'Coordinator name' },
  { token: '{{siteName}}', description: 'Research site name' },
  { token: '{{sitePhone}}', description: 'Site phone number' },
  { token: '{{siteAddress}}', description: 'Site address' },
  { token: '{{appointmentDate}}', description: 'Appointment date' },
  { token: '{{appointmentTime}}', description: 'Appointment time' },
];

// Replace tokens in template with actual values
export function replaceTokens(
  template: string,
  values: Record<string, string>
): string {
  let result = template;

  Object.entries(values).forEach(([key, value]) => {
    const token = `{{${key}}}`;
    result = result.replace(new RegExp(token, 'g'), value);
  });

  return result;
}

// Get character count for SMS (standard SMS is 160 chars)
export function getSMSInfo(message: string): {
  charCount: number;
  segmentCount: number;
  isLong: boolean;
} {
  const charCount = message.length;
  // Standard SMS is 160 chars, but Unicode reduces to 70
  const segmentLength = /[^\x00-\x7F]/.test(message) ? 70 : 160;
  const segmentCount = Math.ceil(charCount / segmentLength);

  return {
    charCount,
    segmentCount,
    isLong: segmentCount > 1,
  };
}
