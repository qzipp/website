<script lang="ts">
  import { onMount } from "svelte";
  import Window from "$components/Window.svelte";

  let element: Window;

  const icon = "/qicons/photopaw-0.png";
  let title_template = "photopaw - C:/fanart/";
  let title = $state(title_template);

  const width = 400;
  const height = 300;

  const fanart_fetch = fetch("/api/fanart").then(async (data) => await data.json());
  fanart_fetch.then((data) => title = `${title_template} (${data.count})`);
</script>

<Window bind:this={element} title={title} icon={icon} scrollable 
height={height} width={width}>
  {#await fanart_fetch}
  loading...
  {:then data}
    <div class="gallery">
    {#each data.files as art}
      <div class="image">
        <img src={`fanart/${art}`} loading="lazy" alt="">
        <span>{art.split(".")[0].split("-")[0]}</span>
      </div>
    {/each}
    </div>
  {/await}
</Window>

<style lang="scss">
  .gallery {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: max-content;
    align-items: center;
    gap: 5px;

    & .image {
      display: flex;
      flex-direction: column;
    }

    & img {
      all: unset;

      vertical-align: bottom;
      object-fit: contain;
      width: 100%;
      height: 100%;
    }
  }
</style>