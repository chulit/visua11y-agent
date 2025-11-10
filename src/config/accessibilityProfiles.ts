import { ISettingsStates } from '@/types/ISettings';
import { WidgetSizeInput } from './widgetSize';
import profileMotorImpaired from '@/icons/profileMotorImpaired.svg';
import profileBlind from '@/icons/profileBlind.svg';
import profileColorBlind from '@/icons/profileColorBlind.svg';
import profileDyslexia from '@/icons/profileDyslexia.svg';
import profileLowVision from '@/icons/profileLowVision.svg';
import profileCognitive from '@/icons/profileCognitive.svg';
import profileSeizure from '@/icons/profileSeizure.svg';
import profileADHD from '@/icons/profileADHD.svg';

export interface IAccessibilityProfile {
  id: string;
  label: string;
  description: string;
  icon?: string;
  states: ISettingsStates;
  widgetSize?: WidgetSizeInput;
  position?: string;
  offset?: number[];
}

export const ACCESSIBILITY_PROFILES: IAccessibilityProfile[] = [
  {
    id: 'motor-impaired',
    label: 'Motor Impaired',
    description: 'Big cursor, voice navigation, and no animations.',
    icon: profileMotorImpaired,
    widgetSize: 'medium',
    states: {
      fontSize: 1.1,
      'big-cursor': true,
      'voice-navigation': true,
      'stop-animations': true,
    },
  },
  {
    id: 'blind-mode',
    label: 'Blind',
    description: 'Screen reader helpers with higher contrast.',
    icon: profileBlind,
    widgetSize: 'medium',
    states: {
      fontSize: 1.15,
      contrast: 'high-contrast',
      'screen-reader': true,
      'voice-navigation': true,
    },
  },
  {
    id: 'color-blind',
    label: 'Color Blind',
    description: 'High contrast palette with desaturated media.',
    icon: profileColorBlind,
    widgetSize: 'default',
    states: {
      contrast: 'high-contrast',
      'image-desaturation': true,
      'highlight-links': true,
    },
  },
  {
    id: 'dyslexia-mode',
    label: 'Dyslexia',
    description: 'Friendly font, extra spacing, stronger weight.',
    icon: profileDyslexia,
    widgetSize: 'default',
    states: {
      'readable-font': true,
      'letter-spacing': true,
      'line-height': true,
      'font-weight': true,
      fontSize: 1.05,
    },
  },
  {
    id: 'low-vision-mode',
    label: 'Low vision',
    description: 'Dark contrast and 130% magnification.',
    icon: profileLowVision,
    widgetSize: 'medium',
    states: {
      fontSize: 1.3,
      contrast: 'dark-contrast',
      'big-cursor': true,
      'readable-font': true,
    },
  },
  {
    id: 'cognitive-learning',
    label: 'Cognitive & Learning',
    description: 'Highlights key sections and enables voice help.',
    icon: profileCognitive,
    widgetSize: 'medium',
    states: {
      'highlight-title': true,
      'highlight-links': true,
      'voice-navigation': true,
      'readable-guide': true,
    },
  },
  {
    id: 'seizure-epileptic',
    label: 'Seizure & Epileptic',
    description: 'Stops animations and desaturates imagery.',
    icon: profileSeizure,
    widgetSize: 'default',
    states: {
      'stop-animations': true,
      'image-desaturation': true,
      'low-saturation': true,
    },
  },
  {
    id: 'adhd-mode',
    label: 'ADHD',
    description: 'Reading guide, highlighted links, calmer palette.',
    icon: profileADHD,
    widgetSize: 'small',
    states: {
      'readable-guide': true,
      'highlight-links': true,
      'highlight-title': true,
      contrast: 'light-contrast',
    },
  },
];
