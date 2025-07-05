<script lang="ts">
  import "normalize.css";

  import "$src/app.scss";
  import { onMount } from "svelte";
  import Loaded from "$stores/Loaded";
  import { sleep } from "$utils/sleep";
  import version from "$lib/version";
  import { fade } from "svelte/transition";
  import { ass_easing } from "$transitions/ass_easing";

  const { children } = $props();
  
  let logger: string[] = $state([]);
  // this is ugly
  const type = async (text: string, delay_increment: number = 60, randomize: boolean = false) => {
    const pauser_replacement = "​";
    text = text.replaceAll(/(\\p)/g, pauser_replacement)

    const i = logger.push("") - 1;

    for(let l = 0; l < text.length; l++) {
      logger[i] += text[l];

      const delay = (randomize ? Math.random() : 1) * delay_increment;
      await sleep(delay);
    }
  }

  let s = $state(1);
  let dot = $derived(s % 4);
  const s_interval = setInterval(() => s++, 500); // remove this later

  let show_logger = $state(true);

  let all_loaded = $derived($Loaded.settings && $Loaded.clock);

  let skip = $state(1);

  onMount(async () => {
    document.addEventListener("keydown", (e) => skip == 0 || e.key == " " ? (skip = 0) : (skip = 1));

    if(Object.values($Loaded).every((a) => a)) return;

    const audio = new Audio("/sfx/boot.flac");

    await type(`press space to skip${`\\p`.repeat(50)}.${`\\p`.repeat(50)}.${`\\p`.repeat(50)}.\n\n`, 15, true);
    await sleep(skip * 1000);
    if(skip !== 0) {

    await type(`  _   _ _   _         ___  ___ 
 | |_(_) |_| |_ _  _ / _ \\/ __|
 | / / |  _|  _| || | (_) \\__ \\
 |_\\_\\_|\\__|\\__|\\_, |\\___/|___/
                |__/   ${`${version}`.padStart(8, " ")}`, 15, true);
    await type(`haiii!`);
    await type(``);
    await type(`meow purr nya!`, 13);
    await type(``);
    await type(`making biscuits${`\\p`.repeat(10)}.${`\\p`.repeat(2)}.${`\\p`.repeat(6)}.`, 17);
    }

    show_logger = false;
    $Loaded.boot = true;

    await sleep(skip * 499);
    audio.play();
    
    await sleep(skip * 4333);
    $Loaded.intro = true;
    await sleep(900);
    $Loaded.taskbar = true;
    $Loaded.desktop = true;
    clearInterval(s_interval);
  });
</script>

{@render children()}
{#if !all_loaded}
<div class="loading-screen">
  {#if show_logger}<div class="logger monogram">{logger.join("\n")}</div>{/if}
  {#if !show_logger && $Loaded.boot && !all_loaded}<div class="front" transition:fade={{ easing: ass_easing, duration: 580 }}>
    <img src="/boot.png" data-pixel width="64" height="64" class="boot-logo" alt="paw">
    <h1 class="os" style="margin: 0;">kittyOS</h1>
    <div class="text-muted">loading{dot == 1 ? "." : dot == 2 ? ".." : dot == 3 ? "..." : ""}</div>
  </div>{/if}
</div>
{/if}

<style lang="scss">
  .loading-screen {
    z-index: 1337;
    position: fixed;
    background: #000;

    top: 0;
    left: 0;
    width: 100dvw;
    height: 100dvh;

    & .logger {
      z-index: 1338;

      position: fixed;
      top: 0;
      left: 0;
      width: 100dvw;
      height: 100dvh;
      
      white-space: pre;

      display: inline-block;
      color: #a7d812;
    }
    & .front {
      z-index: 1339;

      position: fixed;
      top: 0;
      left: 0;
      width: 100dvw;
      height: 100dvh;
      
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 2px;

      & .boot-logo {
        animation: meow 4s linear 0.75s 1 forwards;
        transform: scale(0) translateY(-32px);
        @keyframes meow {
          0% {
            transform: scale(0) translateY(-32px);
          }
          100% {
            transform: scale(1) translateY(0px);
          }
        }
      }
      & .text-muted {
        color: #bebebe;
      }
    }
  }
</style>