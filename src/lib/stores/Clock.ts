import { onMount } from "svelte";
import { readable } from "svelte/store";
import dayjs from "dayjs";
import { browser } from "$app/environment";

import Loaded from "./Loaded";

let date = new Date();
let Clock = readable({
  date: date,
  dayjs: dayjs(date)
}, (set) => {
  if(!browser) {
    set({
      date: new Date(),
      dayjs: dayjs(new Date())
    });
  } 
  const interval_id = setInterval(() => {
    let date = new Date();
    let clock = {
      date: date,
      dayjs: dayjs(date)
    }
    set(clock);
  }, 1000);

  Loaded.update((p) => ({
    ...p,
    clock: true,
  }))

  return () => {
    clearInterval(interval_id);
  }
});

export default Clock;