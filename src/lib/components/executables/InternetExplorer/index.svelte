<script lang="ts">
  import { onMount } from "svelte";
  import Window from "../../Window.svelte";
  
  import type { ExecutableStartEvent, ExecutableUpdateEvent, ExecutableCloseEvent } from "$src/lib/types/ExecutableEvents";
    import type { WindowActions } from "$src/lib/types/WindowActions";

  let element: Window;
  let iframe: HTMLIFrameElement;

  const icon = "/icons/msie2-4.png";
  let title_template = "kittyOS Internet Explorer";
  let title = $state(title_template);

  const width = 480;
  const height = 320;

  const home = "kitty:paw";

  let input_url = $state(home);

  const search = (url: string = input_url) => {
    url = url.replace("kitty:", "/kie/");
    iframe.src = url;
  }

  onMount(() => {
    search();
  });
</script>

<Window bind:this={element} title={title} icon={icon} resize
height={height} width={width}>
  <div class="container">
    <div class="row">
      <input class="input" type="text" bind:value={input_url} onkeydown={(e) => e.key == "Enter" && (search())}>
      <button class="search" aria-label="search" onclick={() => search()}></button>
    </div>
    <iframe title="web content" bind:this={iframe} src="about:blank"></iframe>
  </div>
</Window>

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    gap: 2px;

    height: 100%;
    width: 100%;
  }
  iframe {
    border: none;
    width: 100%;
    height: 100%;
  }

  .row {
    display: flex;
    flex-direction: row;
    gap: 2px;
    & .input {
      flex: 1;
    }
    & .search {
    background-image: url("/icons/magnifying_glass_4-0.png") !important;
    background-repeat: no-repeat !important;
    height: 16px;
    width: 16px;
    }
  }
</style>