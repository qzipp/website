import { writable } from "svelte/store";

let Loaded = writable({
  clock: false,
  settings: false,
  intro: false,
  desktop: false,
  taskbar: false,
  boot: false,
});

export default Loaded;