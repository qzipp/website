import Processes from "$stores/Processes";
import type { ProcessInfo } from "$types/ProcessInfo";
import { onMount } from "svelte";
import { get, writable } from "svelte/store";

let __pid = 0;
export const new_process = (process: (pid: number) => ProcessInfo) => {
  const proc_store = writable(process(__pid++));
 
  Processes.update((pc) => {
    return [...pc, proc_store];
  })

  return proc_store;
}