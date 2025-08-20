import { browser } from "$app/environment";
import { default_settings } from "$lib/settings"; 
import { get, writable, type Writable } from "svelte/store";

export const storage_item_keyname = "setting-kittyOS";

export type SettingKey = string; 
export type SettingValue = string|boolean|number|undefined|object;
export type SettingsStorage = {[key: SettingKey]: SettingValue};
export type SettingsStorageDefault<T> = {
  [K in keyof T]: T[K]
};

export const Settings = (() => {
  let settings: SettingsStorageDefault<typeof default_settings> = default_settings; 
  if(browser) {
    try {
      let raw = localStorage.getItem(storage_item_keyname);
      if(raw && raw.length > 0) {
        let data = JSON.parse(raw);
        
        Object.entries(data).forEach(([key, value]) => {
          // ts pmo
          //@ts-ignore
          if(key in settings) settings[key] = value;
        })
      }
    } catch(e) {
      console.error("could not get localstorage settings:", e)
    }
  }

  const store = writable(settings);

  store.subscribe((s) => {
    if(browser) {
      let data: SettingsStorage = {};
      for(let [key, value] of Object.entries(s)) {
        data[key] = value;
      }

      localStorage.setItem(storage_item_keyname, JSON.stringify(data));
    }
  })

  return {
    set: store.set,
    subscribe: store.subscribe,
    update: store.update,

    setting: (key: SettingKey, value: SettingValue) => {
	    store.update((s) => ({
			  ...s,
			  [key]: value
		  }));
    }
  }
})();