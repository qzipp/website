<script lang="ts">
    import Button from "$src/lib/components/inputs/Button.svelte";
    import Logger from "$src/lib/stores/Logger";
  import Processes from "$src/lib/stores/Processes";
    import { tick } from "svelte";
    import { get } from "svelte/store";

  const title_template = "task manager";

  export const meta: AppMeta = $state({
    title: title_template,
    icon: "/icons/computer_taskmgr-1.png",

    window: {
      width: 480,
      height: 320,

      scrollable: true,
      resize: true
    }
  });
</script>

<div class="tempui">temporary ui!!</div>
<div>
  <Button onclick={() => Processes.kill_all()}>destroy all 💥💥💥</Button><br>
  {#await $Processes then _}<div>latest pid: {Processes.pid()}</div>{/await}
  <!-- no this isnt random, what we're doing is awaiting the next tick -->
  <!-- BEFORE showing the list of processes, as if you update for example.. -->
  <!-- this exact file, it will not show itself because (i pressume) of a timing issue -->
  {#await tick()}
  waiting for list...
  {:then}
  {#each $Processes as process}
    {@debug process}
    {#if process.app?.meta}
      <span>{process.pid}</span><img src={process.app?.meta?.icon} alt="img">{process.app?.meta.title} <Button onclick={() => process.window?.minimize()}>👁️</Button> <Button onclick={() => Processes.kill(process.pid)}>murder 🔪</Button><br>
    {/if}
  {/each}
  {/await}
</div>

<style lang="scss">
  .tempui {
    color: #fff;
    text-align: center;
    background: repeating-linear-gradient(30deg, #775803 0em, #775803 1em, #000 1em, #000 2em);
  }
</style>