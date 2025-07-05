<script lang="ts">
  import IEDetect from "$components/IEDetect.svelte"

  import Processes from "$stores/Processes";
  import Loaded from "$stores/Loaded"
  import version from "$lib/version";
  
  import { mount, onMount, unmount, type Component } from "svelte";
  import Taskbar from "$components/Taskbar.svelte";

  import WindowManager from "$components/WindowManager.svelte";

  import InternetExplorer from "$executables/InternetExplorer/index.svelte"
  import Fanart from "$executables/fanart/index.svelte";

  // svelte-ignore non_reactive_update
  let manager: WindowManager;

  let z_index = $state(0);
  onMount(() => {
    Loaded.subscribe((data) => {
      // if(data.desktop && manager) manager.run(Fanart);
    });
  })
</script>	

<IEDetect />

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div class="desktop" tabindex="0">
  {#if $Loaded.desktop}<div class="files">
    {#snippet desktop_file({
      icon = "",
      name = "",
      click = (event: MouseEvent) => {}
    } = {})}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div class="file" role="button" tabindex="0" onclick={click}>
        <img alt="icon" src={icon} class="icon">
        <div class="filename">{name}</div>
      </div>
    {/snippet}

    {@render desktop_file({
      icon: "/icons/computer_explorer_cool-5.png",
      name: "My Computer",
    })}
    {@render desktop_file({
      icon: "/icons/msie1-2.png",
      name: "Internet Explorer",
      click: () => {
        manager.run(InternetExplorer)
      }
    })}



  </div>{/if}
  <div class="version-debug">kittyOS {version}<br>development copy<br>bugs may exist</div>

  <WindowManager bind:this={manager} />
</div>

<Taskbar manager={manager} />

<style lang="scss">
  .desktop {
    background: #4e316f;
    position: relative;
    height: 100%;
    width: 100%;

    & .files {
      z-index: 1;

      padding: 2px;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;

      width: 0;

      gap: 8px;

      height: calc(100dvh - 28px);

      position: relative;

      & .file {
        display: flex;
        flex-direction: column;
        align-items: center;

        width: 70.5px;
        min-height: 49px;
        max-height: 62px;

        gap: 5px;
        cursor: pointer;

        & .filename {
          text-align: center;
        }

        & .icon {
          height: 32px;
          width: 32px;
          image-rendering: pixelated;
        }
      }
    }

    & .version-debug {
      position: absolute;
      bottom: 2px;
      right: 2px;

      font-weight: bold;
      text-align: right;

      text-shadow: 2px 2px 0px #000;
    }
  }
</style>