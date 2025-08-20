<script lang="ts">
  import { onMount } from "svelte";
  import Window from "$components/core/ui/Window.svelte";
  
  import Button from "$components/inputs/Button.svelte";

  let element: Window;
  let iframe: HTMLIFrameElement;

  const title_template = "kittyOS Internet Explorer";

  export const meta: AppMeta = $state({
    title: title_template,
    icon: "/icons/msie2-4.png",

    window: {
      width: 480,
      height: 320,
    }
  });

  const home = "kitty:paw";

  let input_url = $state(home);

  const search = (url: string = input_url) => {
    url = url.replace("kitty:", "/kie/");
    iframe.src = url;
  }

  //todo, be more verbose, change out iframe maybe? just make the user know why shit is happening

  onMount(() => {
    search();
  });
</script>

  <div class="container">
    <div class="row">
      <input class="input" type="text" placeholder="http://example.com/" bind:value={input_url} onkeydown={(e) => e.key == "Enter" && (search())}>
      <Button --padding="2px" aria-label="search" onclick={() => search()}>
        <div class="search-icon"></div>
      </Button>
    </div>
    <iframe title="web content" bind:this={iframe} sandbox="true" src="about:blank"></iframe>
  </div>

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
    & .search-icon {
      background-image: url("/icons/magnifying_glass_4-0.png") !important;
      background-repeat: no-repeat !important;
      image-rendering: pixelated;
      height: 16px;
      width: 16px;
    }
  }
</style>