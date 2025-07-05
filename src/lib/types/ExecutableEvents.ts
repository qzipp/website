import type Window from "$components/Window.svelte"

export type ExecutablePayload = {
  icon: string,
  title: string,

  element: Window
}
export type ExecutableStartEvent = ({}: ExecutablePayload) => void
export type ExecutableUpdateEvent = ({}: ExecutablePayload) => void
export type ExecutableCloseEvent = () => void