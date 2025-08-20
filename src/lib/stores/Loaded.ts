import { writable } from "svelte/store";

let Loaded = writable({
  clock: false,
  desktop: false,
  taskbar: false,
  
  bios: false,
  boot: false,
});

export default Loaded;