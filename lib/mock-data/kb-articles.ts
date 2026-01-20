export interface ArticleSection {
  id: string;
  title: string;
  level: 2 | 3;
  content: string;
}

export interface KBArticle {
  slug: string;
  categoryId: string;
  title: string;
  sections: ArticleSection[];
}

export const kbArticles: Record<string, KBArticle> = {
  'configure-calendar-engine': {
    slug: 'configure-calendar-engine',
    categoryId: 'admin',
    title: 'Configure Calendar Engine',
    sections: [
      {
        id: 'what-are-calendly-flows',
        title: 'What Are Calendly Flows?',
        level: 2,
        content: 'Calendly Flows let you create guided scheduling experiences instead of just sending a booking link. You can add steps like qualifying questions, branching logic, and routing people to the right meeting or resource.',
      },
      {
        id: 'who-completes-setup',
        title: 'Who Completes the Calendly Setup?',
        level: 2,
        content: 'The Patient Coordinator Lead will create the Calendly team and new event types.\n\nThe study\'s Campaign Manager will enable the Calendly integrations per study, associate the necessary PCs and other users, and configure the campaign form.',
      },
      {
        id: 'calendly-setup',
        title: 'Calendly Setup',
        level: 2,
        content: '',
      },
      {
        id: 'create-team',
        title: 'Create Team',
        level: 3,
        content: 'Start by creating a team that includes all the users that will need to schedule appointments for the specific study.\n\n1. Login to Calendly\n2. Navigate to Event Types\n3. Follow these instructions to create a new team\n   - Give the team a name that\'s easily identifiable in 1nData. The name should reference the study the team will work on.',
      },
      {
        id: 'create-event-type',
        title: 'Create New Event Type',
        level: 3,
        content: 'Create event types for each type of appointment that needs to be scheduled. Common event types include:\n\n- Initial Screening Call\n- Follow-up Consultation\n- Study Enrollment Meeting\n- Consent Review Session',
      },
      {
        id: 'enable-integration',
        title: 'Enable Calendly Integration on Study',
        level: 3,
        content: 'Once your Calendly team and event types are configured, you\'ll need to enable the integration within 1nData for each study that will use it.',
      },
      {
        id: 'associate-users',
        title: 'Associate 1nData Users to Calendly Users',
        level: 3,
        content: 'Map your 1nData user accounts to their corresponding Calendly accounts to ensure proper attribution and scheduling permissions.',
      },
      {
        id: 'configure-form',
        title: 'Configure Campaign Form',
        level: 3,
        content: 'Set up the campaign form to include the Calendly scheduling widget. This allows referrals to book appointments directly from the form.',
      },
      {
        id: 'notification-cadence',
        title: 'Notification Cadence',
        level: 3,
        content: 'Configure when and how appointment reminders are sent to both the patient coordinator and the referral. Recommended settings:\n\n- 24 hours before appointment\n- 1 hour before appointment\n- Include calendar invitation with video link',
      },
    ],
  },
  'managing-automations': {
    slug: 'managing-automations',
    categoryId: 'admin',
    title: 'Managing 1nData Automations Guide',
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        level: 2,
        content: 'Automations in 1nData help streamline your workflow by automatically triggering actions based on specific events or conditions.',
      },
      {
        id: 'creating-automations',
        title: 'Creating Automations',
        level: 2,
        content: 'To create a new automation, navigate to Settings > Automations and click "Create New".',
      },
      {
        id: 'automation-triggers',
        title: 'Automation Triggers',
        level: 3,
        content: 'Available triggers include:\n\n- Referral status change\n- Appointment scheduled\n- Form submission\n- Time-based triggers',
      },
    ],
  },
  'create-custom-sms': {
    slug: 'create-custom-sms',
    categoryId: 'study-management',
    title: 'Create a Custom SMS Message',
    sections: [
      {
        id: 'getting-started',
        title: 'Getting Started',
        level: 2,
        content: 'Custom SMS messages allow you to personalize your communication with referrals beyond the standard templates.',
      },
      {
        id: 'creating-template',
        title: 'Creating a Template',
        level: 2,
        content: 'Navigate to Messages > Templates to create a new SMS template. Use merge fields to personalize messages.',
      },
    ],
  },
};

export function getArticle(categoryId: string, slug: string): KBArticle | undefined {
  const article = kbArticles[slug];
  if (article && article.categoryId === categoryId) {
    return article;
  }
  return undefined;
}

export function getArticleTableOfContents(article: KBArticle) {
  return article.sections.map((section) => ({
    id: section.id,
    title: section.title,
    level: section.level,
  }));
}
