<script lang="ts">
  import { get, writable } from "svelte/store";
  import { onMount, type Snippet } from "svelte";
  
  import { slide_no_resize } from "$transitions/slide_no_resize";
  import type { WindowActions } from "$types/WindowActions";
  import Button from "$components/inputs/Button.svelte";

  const props: {
    icon?: string,
    title: string,

    width?: number,
    height?: number,

    resize?: boolean,
    closed?: boolean,
    scrollable?: boolean,

    children?: Snippet,

    actions?: WindowActions,

    z_index?: number
  } = $props();

  // svelte-ignore non_reactive_update
  let Window: Element;
  // svelte-ignore non_reactive_update
  let Titlebar: HTMLDivElement;

  let to_resize = $state(false);

  let to_move = $state(false);
  let window_pos = $state({
    x: 0,
    y: 0,
  });

  let minimized = $state(false);

  let maximized = $state(false);
  let maximizing = $state(false);
  let window_size = $state({
    width: props.width ?? 240,
    height: props.height ?? 40,
  });

  let focus = $state(true);

  let mouse_click = $state({
    ended: false,
    once: false,
    offset_x: 0,
    offset_y: 0,
    origin_x: 0,
    origin_y: 0,
  })

  export function minimize() {
    minimized = !minimized;
  }
  export function maximize() {
    maximizing = true;
    maximized = !maximized;
    setTimeout(() => maximizing = false, 150);
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

  const resize = (mouse_pos: { x: number, y: number }) => {
    if(!Window) return;
    if(maximized) return;
    if(!to_resize) return; 
    
    window_size.height = Math.round((mouse_pos.y - window_pos.y));
    window_size.width = Math.round((mouse_pos.x - window_pos.x));
  };

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

    window_pos.y = mouse_pos.y - mouse_click.offset_y;
    window_pos.x = mouse_pos.x - mouse_click.offset_x;
  };

  onMount(() => {
    if(Window) {
      const window_rect = Window.parentElement?.getBoundingClientRect();
      if(window_rect) {
        window_pos.x = Math.round((window_rect?.width / 2) - (window_size.width / 2));
        window_pos.y = Math.round((window_rect?.height / 2) - (window_size.height / 2));
      
        // for actually being able to grab the damn window, if the screen too small for it
        let offset_size_y = window_rect.height - window_size.height;
        console.log(offset_size_y, window_pos.y, window_rect.height)
        if(offset_size_y < 0) window_pos.y += Math.abs(offset_size_y);
      }

      const in_window = (event: FocusEvent) => Window && Window.contains(event.target as Element) ? true : false;
      document.addEventListener("focusin", (event) => (focus = in_window(event)));
      document.addEventListener("focusout", (event) => (focus = in_window(event)));

      document.addEventListener("mouseup", (event) => {
        if(event.button !== 0) return;
        reset();
        to_move = false;
        to_resize = false;
        document.body.style.cursor = "auto";
      })
      document.addEventListener("touchend", () => {
        reset();
        to_move = false;
        to_resize = false;
        document.body.style.cursor = "auto";
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
          mouse_click.offset_x = mouse_pos.x - window_pos.x;
          mouse_click.offset_y = mouse_pos.y - window_pos.y;
        }

        if(to_move) {
          move(mouse_pos);
        } else if(to_resize) {
          resize(mouse_pos);
        }
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
          mouse_click.offset_x = touch_pos.x - window_pos.x;
          mouse_click.offset_y = touch_pos.y - window_pos.y;
        }

        if(to_move) {
          move(touch_pos);
        } else if(to_resize) {
          resize(touch_pos);
        }
      });
    }

    
    return () => {
      window_pos.x = 0;
      window_pos.y = 0;
      reset();
    };
  });
</script>

{#if true}
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_positive_tabindex -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div transition:slide_no_resize bind:this={Window}
style:height={maximized ? "100%" : `${window_size.height}px`}
style:width={maximized ? "100%" : `${window_size.width}px`}

style:top={maximized ? "0px" : `${window_pos.y}px`} 
style:left={maximized ? "0px" : `${window_pos.x}px`} 

style:z-index={props.z_index}

class={[
  `window`, 
  minimized ? "minimized" : "", 

  maximized ? "maximized" : "", 
  maximizing ? "maximizing": "", 

  to_move ? `moving` : ``, 
  focus ? `focused` : ``, 

  props.scrollable ? `scroll` : ``, 
  props.resize ? `resize` : ``
]} tabindex="1">
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
    <img src={props.icon ? props.icon : "/icons/executable-1.png"} alt="icon" class="icon" draggable="false" />

    <div class="title">{props.title}</div>

    <div class="actions">
      <Button aria-label="minimize" onclick={() => {
        if(props.actions && props.actions.minimize) if(!props.actions.minimize()) { return };
        minimize();
      }}></Button>
      <Button aria-label="maximize" onclick={() => {
        if(props.actions && props.actions.maximize) if(!props.actions.maximize()) { return }; 
        maximize();
      }}></Button>
      <Button aria-label="close" onclick={() => {
        if(props.actions && props.actions.close) if(!props.actions.close()) { return };
      }}></Button>
    </div>
  </div>

  <div class="body">{#if props.children}{@render props.children()}{/if}</div>
  {#if props.resize}
    <div class="resize-corner"
    onmousedown={(event) => {
      document.body.style.cursor = "se-resize";
      to_resize = true;
    }}
    ontouchstart={(event) => {
      document.body.style.cursor = "se-resize";
      to_resize = true;
    }}>
      
    </div>
  {/if}
</div>
{/if}

<style lang="scss">
  .window {
    @media (hover: none) {
      min-height: 31px;
      min-width: 189px;
    }
      
    &:focus {
      outline: none;
    }
    position: absolute;

    padding: 4px;
    box-shadow: inset -1px -1px #0a0a0a,inset 1px 1px #797979,inset -2px -2px #242424,inset 2px 2px #5d5d5d;
    box-sizing: border-box;
    background: #181818;

    &.maximizing {
      transition: 
        top 0.15s linear, left 0.15s linear, 
        width 0.15s linear, height 0.15s linear;
      transform-origin: center;
    }

    &.minimized {
      display: none;
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
      
      padding: 1px 2px;

      background: linear-gradient(270deg, #7b00ff 0%, #37007f 100%);

      @media (hover: none) {
        padding: 3px;
        gap: 6px;
      }
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
        gap: 1px;
        margin-left: auto;

        @media (hover: none) {
          gap: 3spx;
        }
        & :global(button) {
          height: 14px;
          min-width: 16px;

          @media (hover: none) {
            height: 18px;
            padding: 0px 16px;
          }
        }
        & :global([aria-label="minimize"]) {
          background-repeat: no-repeat;
          background-position: calc(50% - 1px) 9px;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='6' height='2' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23cacaca' d='M0 0h6v2H0z'/%3E%3C/svg%3E");
        }
        & :global([aria-label="maximize"]) {
          background-repeat: no-repeat;
          background-position: center;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='9' height='9' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M9 0H0v9h9V0zM8 2H1v6h7V2z' fill='%23cacaca'/%3E%3C/svg%3E");
        }
        & :global([aria-label="close"]) {
          background-repeat: no-repeat;
          background-position: center;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='8' height='7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 0h2v1h1v1h2V1h1V0h2v1H7v1H6v1H5v1h1v1h1v1h1v1H6V6H5V5H3v1H2v1H0V6h1V5h1V4h1V3H2V2H1V1H0V0z' fill='%23cacaca'/%3E%3C/svg%3E");
        }
      }
    }

    & .body {
      --titlebar-offset-y: 4px;
      @media (hover: none) {
        --titlebar-offset-y: 9px;
      }
      position: relative;
      max-height: calc(100% - 20px - var(--titlebar-offset-y));
      height: 100%;
      
      overflow: hidden;

      &:not(:empty) {
        margin-top: 1px;
        padding: 2px;
      }

      user-select: text;
    }
    &.scroll .body {
      overflow: auto;
    }

    & .resize-corner {
      background: url("/qicons/resize-icon.png");
      image-rendering: pixelated;

      position: absolute;
      height: 12px;
      width: 12px;
      
      bottom: 0px;
      right: 0px;

      cursor: se-resize;
    }
  }
</style>