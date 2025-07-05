<script lang="ts">
  import { get } from "svelte/store";
  import { onMount, type Snippet } from "svelte";
  
  import { slide_no_resize } from "$transitions/slide_no_resize";
  import type { WindowActions } from "$types/WindowActions";
  import { new_process } from "$utils/new_process.svelte";
  import Processes from "$stores/Processes"
  import { getContext } from "svelte";

  const props: {
    icon?: string,
    title: string,

    width?: number,
    height?: number,

    resize?: boolean,
    closed?: boolean,
    scrollable?: boolean,

    children?: Snippet,

    // events
    actions?: WindowActions,
  } = $props();

  // svelte-ignore non_reactive_update
  let Window: Element;
  // svelte-ignore non_reactive_update
  let Titlebar: HTMLDivElement;

  let process = new_process((pid) => ({
    pid: pid,
    icon: props.icon,
    title: props.title,
    killed: false,
    window: {
      actions: { minimize, maximize, close }
    }
  }));

  process.subscribe((p) => {
    if(p.killed) {
      if(Window) Window.remove();
    }
  })

  let to_move = $state(false);
  let window_pos = $state({
    top: 0,
    left: 0,
  });

  let minimized = $state(false);
  let maximized = $state(false);
  let maximizing = $state(false);
  let window_size = $state({
    width: props.width ?? 240,
    height: props.height ?? 40,
  });

  let focus = $state(false);

  let mouse_click = $state({
    ended: false,
    once: false,
    offset_x: 0,
    offset_y: 0,
    origin_x: 0,
    origin_y: 0,
  })

  function minimize() {
    minimized = !minimized;
  }
  function maximize() {
    maximizing = true;
    maximized = !maximized;
    setTimeout(() => maximizing = false, 150);
  }
  function close() {
    $process.killed = true;
    Processes.update((pc) => {
      let id = pc.findIndex((p) => $process.pid === get(p).pid)
      console.log("a", id);
      if(id >= 0) pc.splice(id, 1)
      return pc;
    })
    // awful.
  }


  const reset = () => {
    mouse_click.origin_x = 0;
    mouse_click.origin_y = 0;
    mouse_click.offset_x = 0;
    mouse_click.offset_y = 0;
    mouse_click.ended = false;
    mouse_click.once = false;
    
    return;
  }

  const move = (mouse_pos: { x: number, y: number }) => {
    if(!Window) return;
    if(maximized) return;
    if(!to_move) return; 

    const desktop_rect = Window.parentElement?.getBoundingClientRect();
    if(
      (mouse_pos.y < 0 || mouse_pos.x < 0)
      ||
      (mouse_pos.y > (desktop_rect?.height ?? window.screen.height) || mouse_pos.x > (desktop_rect?.width ?? window.screen.width))
    ) {
      return;
    }

    window_pos.top = mouse_pos.y - mouse_click.offset_y;
    window_pos.left = mouse_pos.x - mouse_click.offset_x;
  };

  $effect(() => {
    if(props.title || props.icon) {
      if(process) process.update((pc) => {
        return {
          ...pc,
          title: props.title, 
          icon: props.icon, 
        }
      })
    }
  });

  onMount(() => {
    if(Window) {

      const is_focused = (event: FocusEvent) => Window && Window.contains(event.target as Element) ? (focus = true) : (focus = false);
      document.addEventListener("focusin", is_focused);
      document.addEventListener("focusout", is_focused);

      document.addEventListener("mouseup", (event) => {
        if(event.button !== 0) return;
        reset();
        to_move = false;
      })
      document.addEventListener("touchend", () => {
        reset();
        to_move = false;
      })

      document.addEventListener("mousemove", (event) => {
        if(event.button !== 0) return;
        const mouse_pos = {
          x: event.clientX,
          y: event.clientY
        }

        if(!mouse_click.once && !mouse_click.ended) {
          mouse_click.once = true;
          mouse_click.origin_x = mouse_pos.x;
          mouse_click.origin_y = mouse_pos.y;
          mouse_click.offset_x = mouse_pos.x - window_pos.left;
          mouse_click.offset_y = mouse_pos.y - window_pos.top;
        }

        move(mouse_pos);
      });
      document.addEventListener("touchmove", (event) => {
        const touch_pos = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY
        }
        
        if(!mouse_click.once && !mouse_click.ended) {
          mouse_click.once = true;
          mouse_click.origin_x = touch_pos.x;
          mouse_click.origin_y = touch_pos.y;
          mouse_click.offset_x = touch_pos.x - window_pos.left;
          mouse_click.offset_y = touch_pos.y - window_pos.top;
        }

        move(touch_pos);
      });
    }

    
    return () => {
      window_pos.left = 0;
      window_pos.top = 0;
      reset();

      close();
    };
  });
</script>

{#if !$process.killed && !minimized}
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div transition:slide_no_resize bind:this={Window}
style:height={maximized ? "100%" : `${window_size.height}px`}
style:width={maximized ? "100%" : `${window_size.width}px`}

style:top={maximized ? "0px" : `${window_pos.top}px`} 
style:left={maximized ? "0px" : `${window_pos.left}px`} 
class={[
  `window`, 
  maximized ? "maximized" : "", 
  maximizing ? "maximizing": "", 

  to_move ? `moving` : ``, 
  focus ? `focused` : ``, 

  props.scrollable ? `scroll` : ``, 
  props.resize ? `resize` : ``
]} tabindex="0">
  <div bind:this={Titlebar} role="toolbar" tabindex="0" 
  onmousedown={(event) => {
    if(event.target instanceof HTMLButtonElement) return;
    if(event.button !== 0) return;
    to_move = true;
    reset();
  }} 
  ontouchstart={(event) => {
    if(event.target instanceof HTMLButtonElement) return;
    to_move = true;
    reset();
  }} 
  class="titlebar">
    <img src={props.icon ? props.icon : "/icons/executable-1.png"} alt="icon" class="icon" />

    <div class="title">{props.title}</div>

    <div class="actions">
      <button aria-label="minimize" onclick={() => {
        if(props.actions && props.actions.minimize) if(!props.actions.minimize()) { return };
        minimize();
      }}></button>
      <button aria-label="maximize" onclick={() => {
        if(props.actions && props.actions.maximize) if(!props.actions.maximize()) { return }; 
        maximize();
      }}></button>
      <button aria-label="close" onclick={() => {
        if(props.actions && props.actions.close) if(!props.actions.close()) { return };
        close();
      }}></button>
    </div>
  </div>

  <div class="body">{#if props.children}{@render props.children()}{/if}</div>
</div>
{/if}

<style lang="scss">
  .window {
    overflow: hidden;

    &:focus {
      outline: none;
    }
    position: absolute;

    padding: 2px;
    border: 1px outset #5d5d5d;
    box-sizing: border-box;
    background: #181818;

    &.maximizing {
      transition: 
        top 0.15s linear, left 0.15s linear, 
        width 0.15s linear, height 0.15s linear, resize 0s linear;
      transform-origin: center;
    }

    min-height: 28px;
    min-width: 132px;

    &.maximized {
      padding: 0px;
      border: none;
    }

    &.moving {
      transition: unset;
    }

    &:not(.focused) { 
      & .titlebar {
      background: linear-gradient(270deg, #383838 0%, #111111 100%);
      }
    }
    
    & .titlebar {
      &:focus {
        outline: none;
      }
      display: flex;
      flex-direction: row;
      align-items: center;

      gap: 3px;
      
      padding: 2px;

      background: linear-gradient(270deg, #7b00ff 0%, #37007f 100%);

      & .icon {
        image-rendering: pixelated;
        width: 16px;
        height: 16px;
      }
      & .title {
        min-width: 48px;

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      & .actions {
        display: flex;
        flex-direction: row;
        gap: 2px;

        margin-left: auto;
        & button {
          height: 14px;
          min-width: 16px;

          @media (hover: none) {
            padding: 0 15px;
          }
        }
        & [aria-label="minimize"] {
          background-repeat: no-repeat;
          background-position: calc(50% - 1px) 9px;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='6' height='2' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23cacaca' d='M0 0h6v2H0z'/%3E%3C/svg%3E");
        }
        & [aria-label="maximize"] {
          background-repeat: no-repeat;
          background-position: center;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='9' height='9' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M9 0H0v9h9V0zM8 2H1v6h7V2z' fill='%23cacaca'/%3E%3C/svg%3E");
        }
        & [aria-label="close"] {
          background-repeat: no-repeat;
          background-position: center;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='8' height='7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 0h2v1h1v1h2V1h1V0h2v1H7v1H6v1H5v1h1v1h1v1h1v1H6V6H5V5H3v1H2v1H0V6h1V5h1V4h1V3H2V2H1V1H0V0z' fill='%23cacaca'/%3E%3C/svg%3E");
        }
      }
    }

    &.scroll .body {
      overflow: auto;
    }
    & .body {
      position: relative;
      max-height: calc(100% - 20px - 5px);
      height: 100%;
      &:not(:empty) {
        margin-top: 1px;
        padding: 2px;
      }
    }
  }
</style>