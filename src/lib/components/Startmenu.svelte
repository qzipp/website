<script lang="ts">
  import Loaded from "$src/lib/stores/Loaded";
  import { slide_no_resize } from "$transitions/slide_no_resize";
  import WindowManager from "$components/WindowManager.svelte";
  
  import Fanart from "$executables/fanart/index.svelte";
  import { sleep } from "$utils/sleep";

  let visible = $state(false);

  export const close = () => visible = false;
  export const open = () => visible = true;
  export const toggle = () => visible = !visible;

  const props: {
    manager: WindowManager;
  } = $props();
</script>

{#if visible && $Loaded.taskbar}
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div transition:slide_no_resize={{duration: 200, reverse: false, axis: "y"}} class="start-menu" tabindex="0">
  <div class="os-brand">
    kittyOS
  </div>
  <div class="menu-items">
    <!-- 
         Windows Update, 
         Programs, 
         Favorites,
         Documents,
         Settings,
         Find,
         Help,
         Run,
         Log Off Useracc...,
         Shut Down... 
    -->
    {#snippet menu_item({ 
      icon = "",
      name = "",
      click = (event: MouseEvent, close: () => void) => { close(); } 
    } = {})}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div role="button" tabindex="0" class="item" onclick={(e) => {
      click(e, close);
    }}>
      <img alt="icon" src={icon} class="icon">
      <div class="text">{name}</div>
    </div>
    {/snippet}

    {@render menu_item({
      icon: "/icons/directory_open_cabinet_fc-2.png",
      name: "fanart",
      click: (_, close) => {
        props.manager.run(Fanart)
        close();
      }
    })}
    {@render menu_item({
      icon: "/icons/paint_old-0.png",
      name: "art"
    })}
    <hr>
    {@render menu_item({
      icon: "/icons/application_hourglass-0.png",
      name: "run...",
      click: (_, close) => {
        alert("not implemented")
        //start_executable(Run);
        //close();
      }
    })}
    <hr>
    {@render menu_item({
      icon: "/icons/shut_down_cool-4.png",
      name: "shut down",
      click: async (_, close) => {
        const audio = new Audio("/sfx/tada.flac");
        $Loaded.desktop = false;
        $Loaded.taskbar = false;

        props.manager.kill_all();
        audio.play();

        await sleep(2500);
        document.body.innerHTML = "" 
        
        await sleep(2000);

        // yes im lazy
        document.body.innerHTML = `<h1 class="monogram" style="text-align: center; line-height: 30px; font-size: 40px; color: #fc7d01; transform: translateY(-10dvh);">It's now safe to turn off<br> your computer.</h1>`;

        close();
      }
    })}
  </div>
</div>
{/if}

<style lang="scss">
  .start-menu {
    z-index: 3;
    position: absolute;
    bottom: 28px;
    left: 0;

    min-height: 50px;
    width: 200px;
    
    display: flex;
    flex-direction: row;

    background: #1c1c1c;
    border: 1px outset #5d5d5d;
    padding: 2px;
    //box-shadow: var(--default-box-shadow);

    & .os-brand {
      display: flex;
      flex-direction: row;
      align-items: center;

      padding: 4px 2px;
      box-sizing: border-box;
      font-weight: 600;
      font-size: 14px;

      background: linear-gradient(180deg, #7b00ff 0%, #37007f 50%);

      writing-mode: vertical-lr;
      transform: rotate(180deg);
    }

    & .menu-items {
      display: flex;
      flex-direction: column;
      flex: 1;
      & hr {
        margin-top: 2px;
        margin-bottom: 2px;
        margin-right: 0px;
        margin-left: 2px;
        box-sizing: border-box;
        border: 1px inset #414141;
      }
      & .item {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex: 1;

        gap: 7px;

        padding: 5px;
        
        height: 100%;
        max-height: 28px;

        cursor: pointer;
        &:hover, &:active {
          background: #37007f;
        }

        & .icon {
          height: 32px;
          width: 32px;
          image-rendering: pixelated;
        }
      }
    }
  }
</style>