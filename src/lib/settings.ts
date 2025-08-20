import { type SettingsStorage } from "$stores/Settings";

export const default_settings = {
  clock_format_24h: false as boolean,
  clock_show_seconds: true as boolean,
  font: "windows" as "windows"|"monospace",
} satisfies SettingsStorage;