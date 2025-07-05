import { get, writable } from "svelte/store";
import { browser } from '$app/environment';
import Loaded from "./Loaded";

function SettingsStore(key: string, default_value: any) {
  if(!key) key = "tmp";
  key = `settings.${key}`
  const store = writable(default_value);
  const { subscribe, set } = store;

  if(browser && localStorage[key]) {
    try {
      set(JSON.parse(localStorage[key]));
    } catch(e) {
      set(localStorage[key]);
    }
  }
  
  if(browser && (
    localStorage[key] === "" || String(localStorage[key]) === "undefined"
  )) { 
    localStorage[key] = default_value
    set(default_value);
  }
  
  Loaded.update((p) => ({
    ...p,
    settings: true,
  }))

  return {
    subscribe,
    set: (n: any) => {
      browser && (localStorage[key] = JSON.stringify(n));
      set(n);
    },
    update: (cb: (value: any) => {}) => {
      const updatedStore = cb(get(store));

      browser && (localStorage[key] = JSON.stringify(updatedStore));
      set(updatedStore);
    }
  };
};

export default SettingsStore;