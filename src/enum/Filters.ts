import { TEXT_SELECTORS } from './Selectors';
import IToolConfig from '../types/IToolConfig';

export interface IFilters {
  [key: string]: IToolConfig;
}

export const FILTERS: IFilters = {
  'dark-contrast': {
    styles: {
      color: '#FFF',
      fill: '#FFF',
      'background-color': '#000',
    },
    childrenSelector: TEXT_SELECTORS,
  },
  'light-contrast': {
    styles: {
      color: '#000',
      fill: '#000',
      'background-color': '#FFF',
    },
    childrenSelector: TEXT_SELECTORS,
  },
  'high-contrast': {
    childrenSelector: [' body > *:not(.visua11y-agent-container):not(.visua11y-agent-menu)'],
    styles: {
      filter: 'contrast(125%)',
    },
  },
  'invert-colors': {
    childrenSelector: [' body > *:not(.visua11y-agent-container):not(.visua11y-agent-menu)'],
    styles: {
      filter: 'invert(100%)',
    },
  },
  'image-desaturation': {
    selector: 'html.aws-filter',
    childrenSelector: [' img', ' picture img', ' figure img', ' video'],
    styles: {
      filter: 'grayscale(100%)',
    },
  },
  'high-saturation': {
    childrenSelector: [' body > *:not(.visua11y-agent-container):not(.visua11y-agent-menu)'],
    styles: {
      filter: 'saturate(200%)',
    },
  },
  'low-saturation': {
    childrenSelector: [' body > *:not(.visua11y-agent-container):not(.visua11y-agent-menu)'],
    styles: {
      filter: 'saturate(50%)',
    },
  },
  monochrome: {
    childrenSelector: [' body > *:not(.visua11y-agent-container):not(.visua11y-agent-menu)'],
    styles: {
      filter: 'grayscale(100%)',
    },
  },
};

export default FILTERS;
