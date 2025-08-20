<script lang="ts">
  import { onMount, tick } from "svelte";

  import Logger from "$stores/Logger";
  let show_logger = Logger.show;

  let Logs: HTMLDivElement;

  Logger.subscribe(async () => {
    if(Logs && (Logs.scrollHeight - Logs.scrollTop) <= (Logs.clientHeight + 5)) {
      await tick();
      Logs.scrollTo(0, Logs.scrollHeight);
    }
  })
  onMount(async () => {
    await tick();
    Logs.scrollTo(0, Logs.scrollHeight);
  })
</script>

<div class="logs-overlay">
  <div class="logs monogram" bind:this={Logs}>
    {#each $Logger as log}
      <div class="log">[{log.category}] {log.message}</div>
    {/each}
  </div>
  <div class="tip monogram">
    <span class="title">[logs]</span>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <span class="exit" onclick={() => $show_logger = !show_logger}>[F1] exit/open</span>
  </div>
</div>

<style lang="scss">
  .logs-overlay {
    display: flex;
    flex-direction: column;
    
    position: absolute;
    top: 0;
    left: 0;

    height: 100dvh;
    width: 100dvw;
    z-index: 500;
    
    background: #000;
    & .tip {
      background: #008080;
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 14px;
      @media (hover: none) {
        height: 25px;
      }
  
      & > * {
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 0px 6px;
      }
  
      & .title {
        background: #80007f;
      }
  
      & .exit {
        background: #00aeae;
      }
    }
    & .logs {
      .log {
        white-space: pre;
        user-select: text;
      }
  
      //white-space: pre;
  
      display: inline-block;
      color: #fff;
      height: 100%;
  
      overflow-y: scroll;
    }
  }
</style>