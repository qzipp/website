//todo: fancy schmancy logger
import { writable } from "svelte/store"

export type Log = {
  category: string,
  timestamp: number,
  message: string
}
export type Logs = Log[]

const Logger = (() => {
  let show = writable<boolean>(false);
  const store = writable<Logs>([]);

  const out = (log: Log) => {
    console.log(`<kittyOS-${log.category}> ${log.message}`)
  }
  
  const add = (txt: string, category: string) => {
    const log: Log = {
      category: category,
      timestamp: Date.now(),
      message: txt
    };

    store.update((logs) => ([
      ...logs, log
    ]))
    out(log);
  }

  return {
    show: show,

    set: store.set,
    subscribe: store.subscribe,
    update: store.update,

    debug: (txt: string) => {
      add(txt, "debug");
    }
  }
})();

export default Logger;