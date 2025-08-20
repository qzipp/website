import { type ProcessInfo } from "$lib/types/ProcessInfo";
import { writable, type Writable } from "svelte/store";

export type Processes = ProcessInfo;

let __pid = 0;
export const Processes = (() => {
  const store = writable<Processes[]>([]);

  return {
    set: store.set,
    subscribe: store.subscribe,
    update: store.update,
    
    kill_all: () => store.update(() => ([])),
    kill: (pid: number) => store.update((p) => p.filter((pc) => pc.pid !== pid)),

    pid: () => __pid,
    new_pid: () => __pid++,

    new: (process: Omit<ProcessInfo, "pid">) => {
      store.update((p) => ([
        ...p,
        {
          ...process,
          pid: Processes.new_pid()
        }
      ]));
    }
  }
})();

export default Processes;