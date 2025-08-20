import type Window from "$components/core/ui/Window.svelte"
import type { Component, SvelteComponent } from "svelte";

export type Exports = { meta: AppMeta } 

export type WindowComponent = Component<any, Exports, any> 

export type ProcessInfo = {
  pid: number,

  app?: SvelteComponent<any, any, any> & Exports & { $$bindings: any; }|undefined,
  window?: Window,
  component: WindowComponent,
}