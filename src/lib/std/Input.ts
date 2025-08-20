import { browser } from "$app/environment";
import { onMount } from "svelte";

// the use of native Typescript Enums are avoided because:
// you can't use it directly like:
// > some.function(.HeyImAnEnum, "other", "arguments")
// you have to import the enum, which is ugly, 
// and this way is better in my biased opinion.
//                                               :3

export type KeybindType = "keybind.up"|"keybind.down"; 
export type KeybindCode = string;
export type KeybindModifier = "keybind.shift"|"keybind.alt"|"keybind.ctrl"|"keybind.meta";
export type Keybind = {
  hits: number
  type: KeybindType,
  code?: KeybindCode,
  modifier?: KeybindModifier
}
export type Keybinds = Keybind[];

export type PointerType = "pointer.up"|"pointer.down"|"pointer.move";
export type PointerDevice = "pointer.mouse"|"pointer.touch"|"pointer.all";
export type Pointer = {
  hits: number
  type: PointerType,
  device: PointerDevice,
};
export type Pointers = Pointer[];

export type InputHandler = ({}: {
  hits: number,
  type: KeybindType,
  event: KeyboardEvent|Event,
  remove: () => void
}|{
  hits: number,
  type: PointerType,
  device: PointerDevice,
  event: MouseEvent|Event,
  remove: () => void
}) => void;

export type Input = {
  pointers: Pointers,
  keybinds: Keybinds,
  handler: InputHandler,
};

export type Inputs = Input[];


const Input = (() => {
  let is_mounted = false;
  
  let inputs: Inputs = [];

  // yes this is too complex, sorry
  const keypress = (event: KeyboardEvent, key_input: KeybindType) => {
    for(let [input_index, input] of inputs.entries()) {
      for(let [keybind_index, keybind] of input.keybinds.entries()) {
        if(
          keybind.type == key_input &&
          (!keybind.code || keybind.code === event.code)
        ) {
          const event_modifiers = { shift: event.shiftKey, alt: event.altKey, ctrl: event.ctrlKey, meta: event.metaKey };
          if(
            keybind.modifier === "keybind.shift" && event_modifiers.shift ||
            keybind.modifier === "keybind.ctrl"  && event_modifiers.ctrl  ||
            keybind.modifier === "keybind.meta"  && event_modifiers.meta  ||
            keybind.modifier === "keybind.alt"   && event_modifiers.alt   ||
            
            keybind.modifier === undefined && Object.values(event_modifiers).every((m) => !m)
          ) {
            keybind.hits++;
            input.keybinds[keybind_index].hits = keybind.hits;

            input.handler({
              hits: keybind.hits,
              type: keybind.type,
              event: event,
              remove: () => inputs.splice(input_index, 1)
            });
          }
        }
      }
    }
  }

  return {
    reset: () => inputs = [],

    new: () => {
      const save = () => {
        inputs[index] = input
        return self;
      };

      const input: Input = {
        pointers: [],
        keybinds: [],
        handler: () => {}
      };

      inputs.push(input);
      const index = inputs.length-1;

      const self = {
        handler: (handler: InputHandler) => {
          input.handler = handler;
          return save();
        },
        keybind: (keybind: Omit<Keybind, "hits">) => {
          input.keybinds.push({
            hits: 0,
            ...keybind
          });
          return save();
        },
        pointer: (pointer: Omit<Pointer, "hits">) => {
          input.pointers.push({
            hits: 0,
            ...pointer
          });
          return save();
        },

        listen: () => {
          const _handler = input.handler;

          const promise = new Promise((resolve, reject) => {
            input.handler = (...args) => {
              resolve(true);
              _handler(...args);
            }
          });
          return promise;
        },

        remove: (index: number) => {
          inputs.splice(index, 1);
        },
      };

      return self;
    },

    // this is used in (app)/+layout.svelte
    mount: () => {
      if(is_mounted) return;
      is_mounted = true;

      if(browser) {
        document.addEventListener("keyup", (event) => keypress(event, "keybind.up"));
        document.addEventListener("keydown", (event) => keypress(event, "keybind.down"));
        // document.addEventListener("mouseup", (event) => keypress(event, "pointer.up"));
        // document.addEventListener("mousedown", (event) => keypress(event, "pointer.down"));
        // document.addEventListener("mousemove", (event) => keypress(event, "pointer.move"));
      }

      return () => {
        Input.reset();
        is_mounted = false;
      }
    }
  }
})();

export default Input;