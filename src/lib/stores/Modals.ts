import { type ProcessInfo } from "$lib/types/ProcessInfo";
import { writable, type Writable } from "svelte/store";

export type ModalItemAction = {
  type: "button"
  name: string,
  disabled: boolean,

  click: (event: MouseEvent) => void
}|{
  type: "input",
  placeholder: string,
  disabled: boolean,

  // some are very useless.. but do i care? not really
  input_type: "text"|"url"|"number"
    |"password"|"email"
    |"checkbox"|"color"|"radio"|"range"
    |"date"|"month"|"week"|"time"
    |"file"|"image"
    |"reset"|"submit"

  input: (event: InputEvent) => void
};

export type ModalItem = {
  title: string,
  details: string

  actions?: ModalItemAction[]
};

const Modals = (() => {
  const store = writable<ModalItem[]>([]);

  return {
    set: store.set,
    subscribe: store.subscribe,
    update: store.update,
    
    new: (modal: ModalItem) => {
      store.update((m) => ([
        ...m,
        modal
      ]));
    },
  }
})();

export default Modals;