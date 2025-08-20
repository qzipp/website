<script lang="ts">
  import { onMount, tick } from "svelte";
  import Modals from "$stores/Modals";
  import Window from "$components/core/ui/Window.svelte"
  import type { WindowComponent } from "$types/ProcessInfo";
  import Processes from "$stores/Processes";

  // very intended
  // svelte-ignore non_reactive_update
  let z_index = 0;
  let WindowManager: Element;

  //experimental

  export function run(component: WindowComponent) {
    z_index++;
    Processes.new({
      app: undefined,
      window: undefined,
      component: component
    });
  }

  // rewrite this z-index focus system.. one day

  onMount(() => {
    WindowManager.addEventListener("focusin", (event) => {
      if(!WindowManager) return; 
      if(!event.target) return;
  
      for(const node of WindowManager.children) {
        const div_node = node as HTMLDivElement;
        if(!div_node.contains(event.target as Element)) continue;
  
        z_index++;
        div_node.style.zIndex = `${z_index}`;
      }
    });

    return async () => {
      Processes.kill_all();
    }
  })
</script>

<div bind:this={WindowManager} class="windows">
  {#each $Processes as proccess (proccess.pid)}
    {@const app = proccess.app}
    {#if app?.meta}
      <Window title={app?.meta?.title} icon={app.meta?.icon} 
      {...app?.meta?.window}
      actions={{ 
        close: () => { Processes.kill(proccess.pid); return true; }
      }}
      z_index={0}
      bind:this={proccess.window}>
        <proccess.component pid={proccess.pid} bind:this={proccess.app} />
      </Window>
    {:else} 
      <!-- we will not render this -->
      <div style="display: none;">
        <proccess.component bind:this={proccess.app} />
      </div>
    {/if}
  {/each}
</div>

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