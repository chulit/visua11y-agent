export const WIDGET_SIZE_PRESETS = {
  default: 58,
  medium: 50,
  small: 42,
} as const;

export const WIDGET_PANEL_WIDTHS = {
  default: 500,
  medium: 440,
  small: 380,
} as const;

export type WidgetSizePreset = keyof typeof WIDGET_SIZE_PRESETS;
export type WidgetSizeInput = WidgetSizePreset | number | string | null | undefined;

const MIN_WIDGET_SIZE = 40;
const MIN_PANEL_WIDTH = 360;

export interface WidgetSizeResult {
  size: number;
  preset: WidgetSizePreset | null;
  panelWidth: number;
}

const DEFAULT_WIDGET_SIZE: WidgetSizeResult = {
  size: WIDGET_SIZE_PRESETS.default,
  preset: 'default',
  panelWidth: WIDGET_PANEL_WIDTHS.default,
};

export function resolveWidgetSize(value?: WidgetSizeInput): WidgetSizeResult {
  if (typeof value === 'number' && Number.isFinite(value)) {
    const size = normalizeSize(value);
    const preset = getPresetForSize(size);
    return {
      size,
      preset,
      panelWidth: computePanelWidth(preset, size),
    };
  }

  if (typeof value === 'string') {
    const sanitized = value.trim().toLowerCase();
    if (sanitized in WIDGET_SIZE_PRESETS) {
      const preset = sanitized as WidgetSizePreset;
      return {
        size: WIDGET_SIZE_PRESETS[preset],
        preset,
        panelWidth: WIDGET_PANEL_WIDTHS[preset],
      };
    }

    const parsed = Number(sanitized);
    if (!Number.isNaN(parsed)) {
      const size = normalizeSize(parsed);
      const preset = getPresetForSize(size);
      return {
        size,
        preset,
        panelWidth: computePanelWidth(preset, size),
      };
    }
  }

  return { ...DEFAULT_WIDGET_SIZE };
}

function normalizeSize(value: number): number {
  return Math.max(MIN_WIDGET_SIZE, Math.round(value));
}

function getPresetForSize(size: number): WidgetSizePreset | null {
  return (
    (Object.entries(WIDGET_SIZE_PRESETS).find(([, presetSize]) => presetSize === size)?.[0] as
      | WidgetSizePreset
      | undefined) ?? null
  );
}

function computePanelWidth(preset: WidgetSizePreset | null, buttonSize: number): number {
  if (preset) {
    return WIDGET_PANEL_WIDTHS[preset];
  }

  const scale = buttonSize / WIDGET_SIZE_PRESETS.default;
  const width = Math.round(WIDGET_PANEL_WIDTHS.default * scale);
  return Math.max(MIN_PANEL_WIDTH, width);
}
