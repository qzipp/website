<script lang="ts">
  import { get } from "svelte/store";
  import { clock_format, clock_show_seconds } from "$lib/settings";

  import Clock from "$stores/Clock";
  import Loaded from "$stores/Loaded";
  import Processes from "$stores/Processes"
  import Startmenu from "./Startmenu.svelte";
  import WindowManager from "./WindowManager.svelte";

  const props: {
    manager: WindowManager
  } = $props();

  let start_menu: Startmenu;
</script>

<Startmenu bind:this={start_menu} manager={props.manager} />
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
{#if $Loaded.taskbar}<div class="taskbar" tabindex="0">
  <button class="start" onclick={() => start_menu.toggle()}>
    <img src="/icon.png" data-pixel alt="" width="16" height="16" /> 
    <div class="alt">start</div>
  </button>
  <div class="processes">
  {#each $Processes as process_store}
    {@const process = get(process_store)}
    <!-- only GUI/window processes -->
    {#if process.window !== undefined && !process.killed}
    <button class="row" onclick={() => { process.window?.actions.minimize(); }}>
      <img class="icon" src={process.icon ?? "/icons/executable-1.png"} alt="" />
      <div class="text">{process.title}</div>
    </button>
    {/if}
  {/each}
  </div>

  <div class="tray">
    <div class="time">
      {$Clock.dayjs.format($clock_format.toUpperCase() == "US" 
        ? `hh:mm${$clock_show_seconds ? ":ss" : ""} A`
        : `HH:mm${$clock_show_seconds ? ":ss" : ""}` 
      )}
    </div>
  </div>
</div>{/if}

<style lang="scss">
    .taskbar {
    z-index: 5;
    position: relative;
    display: flex;
    gap: 3px;
    flex-direction: row;

    box-sizing: border-box;

    width: 100%;
    height: 28px;

    padding: 3px;
    background: #181818;

    border-top: #3f3f3f 2px solid;

    & .start {
      padding: 0 4px;
      display: flex;
      flex-direction: row;

      align-items: center;

      gap: 3px;
      & .alt {
        font-weight: bold;
        font-size: 11px;
      }
    }

    & .processes {
      display: flex;
      flex-direction: row;
      gap: 4px;
      overflow: auto;

      & .row {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 4px;

        max-width: 128px;

        & .icon {
          image-rendering: pixelated;
          width: 16px;
          height: 16px;
        }
        & .text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    & .tray {
      margin-left: auto;
      padding: 4px;

      display: flex;
      flex-direction: row;
      align-items: center;

      border: 1px inset #3c3c3c;
      font-size: 11px;

      min-width: 50px;
      & .time {
        margin-left: auto;
        text-wrap: nowrap;
      }
    }
  }
</style>