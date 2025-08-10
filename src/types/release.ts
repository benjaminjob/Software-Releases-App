export type ReleaseStatus = 'upcoming' | 'released' | 'beta' | 'live';

export type ConfirmationLevel = 'official' | 'likely' | 'rumored' | 'speculative';

export type ReleaseType = 'apple' | 'google' | 'microsoft' | 'home-assistant' | 'valve' | 'samsung';

export interface Release {
  id: string;
  title: string;
  company: ReleaseType;
  startDate: string;
  endDate?: string;
  description: string;
  status: ReleaseStatus;
  confirmationLevel: ConfirmationLevel;
  icon: string;
  learnMoreUrl?: string;
}