import type Window from "$components/Window.svelte"

export type ProcessInfo = {
  pid: number,

  icon?: string,
  title: string,
  killed: boolean,
  
  window?: {
    actions: { minimize: () => void, maximize: () => void, close: () => void }
  }
}