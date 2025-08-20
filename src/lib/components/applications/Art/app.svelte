<script lang="ts">
  import { onMount } from "svelte";
  import Window from "$components/core/ui/Window.svelte";
  import Button from "$components/inputs/Button.svelte";
  import Modals from "$stores/Modals";

  let element: Window;

  type Art = {
    date: string,
    info: string,
    filename: string
  }
  
  let title_template = "photopaw - C:/art/";

  export const meta: AppMeta = $state({
    title: title_template,
    icon: "/qicons/photopaw-0.png",

    window: {
      width: 480,
      height: 320,

      resize: true,
    }
  });


  const art_fetch = fetch("/api/art").then(async (data) => await data.json());
  art_fetch.then((data) => (meta.title = `${title_template} (${data.count})`));

  let search = $state("");

  let art_selected: Art|undefined = $state();
</script>

{#if art_selected}
  <Button onclick={() => (art_selected = undefined)}>go back</Button>
  <div class="view-art">
    <img src={`/art/${art_selected.filename}`} alt="art">
    <span class="author">{art_selected.date}{art_selected.info.length > 0 ? ", " : ""}{art_selected.info}</span>
  </div>
  {:else}
  <div class="fanart-body">    
    <input class="search" type="text" bind:value={search} placeholder="search by my a">
    {#await art_fetch}
    loading...
    {:then data}
    {@const results = (data.files as Art[]).filter((art) => art.filename.toLowerCase().includes(search.toLowerCase()))}
    <div class="gallery">
      {#each results as art}
      <button onclick={() => (art_selected = art)} class="image" style:--image={`url(/art/${art.filename})`}>
        <img src={`/art/${art.filename}`} loading="lazy" alt="art">
        <div class="hover-info">
          <div class="content">
            <span class="author">{art.date}{art.info.length > 0 ? ", " : ""}{art.info}</span>
          </div>
        </div>
      </button>
      {:else}
        <div class="empty">
          <h1>no art found</h1>
          <div>:&lt;</div>
        </div>
      {/each}
    </div>
    {/await}
  </div>
{/if}
  
<style lang="scss">
  .view-art {
    display: flex;
    flex-direction: column;
    gap: 4px;
    height: 100%;

    & img {
      width: 100%;
      object-fit: contain;
      height: 80%;
    }
  }
  
  .fanart-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
    height: 100%;
    & .gallery {
      overflow: auto;
      height: 100%;
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      grid-auto-rows: max-content;
      align-items: start;
      gap: 4px;

      & .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
  
      & .image {
        all: unset;
        position: relative;

        cursor: pointer;

        display: flex;
        flex-direction: column;
        gap: 2px;
        height: 100%;

        overflow: hidden;

        &::before {
          content: "";
          position: absolute;
          bottom: 0;
          top: 0;
          right: 0;
          left: 0;
          z-index: -1;

          filter: blur(25px);
          transform: scale(2);
          background: var(--image);
          background-size: cover;
          background-position: 50% 50%;
        }

        & img {
          all: unset;

          vertical-align: bottom;
          object-fit: contain;
          width: 100%;
          height: 100%;
        }
        
        & .hover-info {
          position: absolute;
          bottom: 0;
          left: 0;
          
          visibility: hidden;
          opacity: 0;
          transition: opacity 0.2s ease, visibility 0.2s ease;
          
          width: 100%;
          height: 50%;
          background: linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, transparent 100%);

          display: flex;

          padding: 0.25em;
          & .content {
            width: 100%;
            margin-top: auto;
            display: flex;
            flex-direction: column;
            & .author {
              margin: 0 auto;
            }
          }
        }
        &:hover, &:active {
          & .hover-info {
            opacity: 1;
            visibility: visible;
          }
        }
      }
    }
  }
</style>