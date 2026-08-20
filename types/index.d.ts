export type WidgetSizePreset = 'small' | 'medium' | 'large' | 'default' | number;

export type CustomPaletteState = {
  enabled?: boolean;
  activeCategory?: string;
  colors?: Record<string, string>;
};

export interface ISettingsStates {
  fontSize?: number;
  contrast?: string | false;
  'custom-palette'?: CustomPaletteState;
  [key: string]: boolean | string | number | CustomPaletteState | undefined;
}

export interface ISettings {
  lang?: string;
  position?: string;
  offset?: number[];
  widgetSize?: WidgetSizePreset | number;
  activeProfile?: string;
  footerHidden?: boolean;
  footerSize?: 'small' | 'medium' | 'large';
  states: ISettingsStates;
  updatedAt?: Date;
}

export interface Visua11yAgentOptions {
  lang?: string;
  position?: string;
  offset?: number[] | string;
  size?: string | number;
  buttonSize?: number;
  icon?: string;
  iconSize?: number;
}

export interface Visua11yAgentPlugin {
  changeLanguage: (code: string) => Promise<void>;
  setIcon: (html?: string) => void;
  setWidgetSize: (size: string | number) => void;
  setButtonSize: (size: number) => void;
  setPosition: (position: string) => void;
  setOffset: (offset: number[] | string) => void;
  setIconSize: (size: number) => void;
  openMenu: () => void;
  closeMenu: () => void;
  toggleTool: (key: string, enable?: boolean) => void;
  setProfile: (profileId: string) => void;
  getSettings: () => ISettings;
  hideFooter: (hide: boolean) => void;
  setFooterSize: (size: 'small' | 'medium' | 'large') => void;
  registerLanguage: (options: IRegisterLanguageOptions) => string | undefined;
  resetAll: () => void;
}

export interface ILanguage {
  code: string;
  label: string;
}

export interface IRegisterLanguageOptions {
  code: string;
  label?: string;
  dictionary: Record<string, string>;
  merge?: boolean;
}

export declare function registerLanguage(options: IRegisterLanguageOptions): string | undefined;
export declare function loadLanguage(code: string): Promise<Record<string, string>>;
export declare const LANGUAGES: ILanguage[];
export declare const ALL_LOCALES: Record<string, Record<string, string>>;
export declare const enLocale: Record<string, string>;
export declare const idLocale: Record<string, string>;

export declare function createVisua11yAgent(options?: Visua11yAgentOptions): Visua11yAgentPlugin;
export declare function initVisua11yAgent(options: { options: Visua11yAgentOptions }): Visua11yAgentPlugin;
export declare function visua11yAgent(options: { options?: Visua11yAgentOptions } | Visua11yAgentOptions): Visua11yAgentPlugin;

export declare const VERSION: string;
export declare const version: string;

declare const _default: typeof visua11yAgent;
export default _default;
