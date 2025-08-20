<script lang="ts">
  import { get } from "svelte/store";
  import { Settings } from "$stores/Settings";

  import Clock from "$stores/Clock";
  import Loaded from "$stores/Loaded";
  import Processes from "$stores/Processes"
  import Startmenu from "$components/core/ui/Startmenu.svelte";
  import WindowManager from "$components/core/WindowManager.svelte";
  
  import Button from "$components/inputs/Button.svelte";

  const props: {
    manager: WindowManager
  } = $props();

  // svelte-ignore non_reactive_update
    let start_menu: Startmenu;
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
{#if $Loaded.taskbar}
<div class="taskbar-n-startmenu">
  <Startmenu bind:this={start_menu} manager={props.manager} />
  <div class="taskbar" tabindex="0">
    <Button --padding="1px 4px" onclick={() => start_menu.toggle()}>
      <div class="start">
        <img src="/icon.png" data-pixel alt="" width="16" height="16" /> 
        <div class="name">start</div>
      </div>
    </Button>
    <div class="processes">
    {#each $Processes as process}
      <!-- only GUI/window processes -->
      {#if process.app && process.app.meta && process.window !== undefined}
      {@const app = process.app}
      <Button style="min-width: 32px;"
      oncontextmenu={(event) => {
        console.log("AGOGT")
        event.preventDefault();
      }}
      onclick={() => { process.window?.minimize(); }}>
        <div class="row">
          <img class="icon" src={app?.meta?.icon ?? "/icons/executable-1.png"} alt="" />
          <div class="text">{app?.meta?.title}</div>
        </div>
      </Button>
      {/if}
    {/each}
    </div>
    
    <div class="tray">
      <div class="time">
        {$Clock.dayjs.format($Settings.clock_format_24h
          ? `HH:mm${$Settings.clock_show_seconds ? ":ss" : ""}` 
          : `hh:mm${$Settings.clock_show_seconds ? ":ss" : ""} A`
        )}
      </div>
    </div>
  </div>
</div>
{/if}

<style lang="scss">
  .taskbar-n-startmenu {
    position: relative;
  }
  .taskbar {
    z-index: 5;
    position: relative;
    display: flex;
    gap: 3px;
    flex-direction: row;

    box-sizing: border-box;

    width: 100%;
    min-height: 29px;

    padding: 3px;
    background: #181818;

    border-top: #3f3f3f 2px solid;

    & .start {
      display: flex;
      flex-direction: row;
      align-items: center;

      gap: 3px;
      & .name {
        font-weight: bold;
        font-size: 11px;
      }
    }

    & .processes {
      display: flex;
      flex-direction: row;
      gap: 1px;

      width: 100%;
      overflow-x: auto;

      & .row {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 4px;

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

      & .time {
        text-wrap: nowrap;
        margin: 0px 2px;
      }
    }
  }
</style>