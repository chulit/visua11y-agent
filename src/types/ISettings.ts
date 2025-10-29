export interface ISettingsStates {
    fontSize?: number,
    contrast?: string,
    [key: string]: unknown;
}

export interface ISettings {
    lang?: string;
    states?: ISettingsStates;
    updatedAt?: Date;
}