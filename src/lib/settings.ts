import SettingsStore from "$stores/Settings";

export const clock_format = SettingsStore("clock_format", "US");
export const clock_show_seconds = SettingsStore("clock_show_seconds", "1");