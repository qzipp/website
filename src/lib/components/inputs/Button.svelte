<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  const {
    children,
    ...rest
  }: {
    children?: Snippet,
  } & HTMLAttributes<HTMLButtonElement> = $props();
</script>

<button {...rest}>{@render children?.()}</button>

<style lang="scss">
  button {
    appearance: unset;

    padding: var(--padding, 2px 4px);
    border: 0;
    background: #353535;
    color: #fff;
    box-shadow: inset -1px -1px #0a0a0a,inset 1px 1px #797979,inset -2px -2px #242424,inset 2px 2px #5d5d5d;
    border-radius: 0px;
    box-sizing: border-box;
  
    cursor: pointer;
  
    &:active, &.active {
      border-color: #3b3b3b;
      border-style: inset;
      background: #2f2f2f;

      box-shadow: inset -1px -1px #414141,inset 1px 1px #0a0a0a,inset -2px -2px #383838,inset 2px 2px #242424;
    }
  }
</style>