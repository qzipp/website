<script lang="ts">
  import { mount, onMount, unmount, type Component } from "svelte";

  let z_index = 0;
  let WindowManager: Element;

  function run_executable(application: Component, manager: Element) {
    const kill = () => unmount(executable);

    let executable = mount(application, { target: manager, props: { kill: kill } });

    return {
      kill: () => kill
    }
  }

  export function run(component: Component) {
    run_executable(component, WindowManager)
  }
  
  export function kill_all() {
    if(WindowManager) WindowManager.innerHTML = "";
  }

  onMount(() => {
    if(WindowManager) {
      WindowManager.addEventListener("focusin", (event) => {
        if(!WindowManager) return; // can this lsp figure out that we already check for this..
        if(!event.target) return;

        for (const node of WindowManager.children) {
          const div_node = node as HTMLDivElement;
          if(!div_node.contains(event.target as Element)) continue;

          z_index++;
          div_node.style.zIndex = `${z_index}`;
        }
      });
    }

    return () => {
      if(WindowManager) WindowManager.innerHTML = "";
    }
  })
</script>

<div bind:this={WindowManager} class="windows"></div>

<style lang="scss">
  .windows {
    z-index: 2;

    pointer-events: none;

    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
      
    & > :global(*) {
      pointer-events: auto;
    }
  }
</style>