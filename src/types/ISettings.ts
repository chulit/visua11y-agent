import { ICustomPaletteState } from '@/tools/customPalette';

export interface ISettingsStates {
    fontSize?: number;
    contrast?: string | false;
    'custom-palette'?: ICustomPaletteState;
    [key: string]: boolean | string | number | ICustomPaletteState | undefined;
}

export interface ISettings {
    lang?: string;
    position?: string;
    offset?: number[];
    states?: ISettingsStates;
    updatedAt?: Date;
}
