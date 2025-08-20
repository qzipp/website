import { onMount } from "svelte";
import { readable } from "svelte/store";
import dayjs from "dayjs";
import timezone_plugin from "dayjs/plugin/timezone";
import utc_plugin from "dayjs/plugin/utc";
import { browser } from "$app/environment";
import timezone from "$lib/timezone";

import Loaded from "./Loaded";

dayjs.extend(utc_plugin);
dayjs.extend(timezone_plugin);

let date = new Date();
let Clock = readable({
  date: date,
  dayjs: dayjs(date).tz(timezone)
}, (set) => {
  if(!browser) {
    set({
      date: new Date(),
      dayjs: dayjs(new Date()).tz(timezone)
    });
  } 
  const interval_id = setInterval(() => {
    let date = new Date();
    let clock = {
      date: date,
      dayjs: dayjs(date).tz(timezone)
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