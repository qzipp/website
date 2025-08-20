<script lang="ts">
  import "normalize.css";

  import "$src/app.scss";
  import { onMount } from "svelte";
  import Loaded from "$stores/Loaded";
  import { sleep } from "$utils/sleep";
  import version from "$lib/version";
  import { fade } from "svelte/transition";
  import { ass_easing } from "$transitions/ass_easing";

  import IEDetect from "$components/gates/IEDetect.svelte"

  import Clock from "$stores/Clock";
  import "$stores/Settings";
  import { is_audio_playback_available } from "$src/lib/utils/can_play_audio";
  import Logger from "$src/lib/stores/Logger";
  import Input from "$src/lib/std/Input"

  // to any poor soul reading this.. sorry
  
  let BIOS = $state({
    typing_lines: [] as boolean[],
    stdout: undefined as HTMLDivElement|undefined,
    show_logos: false,
    logs: [] as string[],

    type_line: async (line: number, text: string, delay_increment: number = 60, randomize: boolean = false) => {
      const pauser_replacement = "​";
      text = text.replaceAll(/(\\p)/g, pauser_replacement)

      const i = line;
      BIOS.typing_lines[i] = true;

      for (let l = 0; l < text.length; l++) {
        if(!BIOS.logs[i]) BIOS.logs[i] = "";
        BIOS.typing_lines[i] = true;
        BIOS.logs[i] += text[l];

        const delay = (randomize ? Math.random() : 1) * delay_increment;
        await sleep(delay);
      }
      BIOS.typing_lines[i] = false;
    },

    type: async (text: string, delay_increment: number = 60, randomize: boolean = false) => {
      const promise = (async () => {
        const i = BIOS.logs.push("") - 1;
        await BIOS.type_line(i, text, delay_increment, randomize);
        return i;
      })();

      return promise;
    },

    not_typing: async () => {
      let i = 0;
      return new Promise((resolve, reject) => {
        let interval = setInterval(() => {
          if(BIOS.typing_lines.every((b) => !b) || BIOS.typing_lines.length === 0) {
            clearInterval(interval);
            resolve(true);
          }
          if(i > (1024 * 256)) {
            clearInterval(interval);
            reject(false);
          }
          console.log(i);
          i++;
        }, 100)
      });
    },

    delete_line: async (line: number) => {
      await BIOS.not_typing();
      BIOS.logs.splice(line, 1);
    },
    clear: async () => {
      await BIOS.not_typing();
      BIOS.logs = [];
    }
  });

  let skip = false;
  Input.new()
  .handler(({ remove }) => {
    skip = true;
    remove();
  })
  .keybind({
    code: "Space",
    type: "keybind.down"
  })
  .pointer({
    device: "pointer.touch",
    type: "pointer.down"
  });

  onMount(async () => {
    // skip if loaded
    if(Object.values($Loaded).every((a) => a)) return;

    const beep_sfx = new Audio("/sfx/beep.flac");
    const boot_sfx = new Audio("/sfx/boot.flac");
    
    await BIOS.type("...", 100)

    if(skip) {
      await BIOS.type("skipped!", 20)
      $Loaded.bios = true;
      $Loaded.boot = true;
      $Loaded.taskbar = true;
      $Loaded.desktop = true;
    } else {
      beep_sfx.play();
  
      await sleep(1000);
      await BIOS.clear();
      await BIOS.type(`     Award Modular BIOS v4.51PGM, An Energy Star Ally`, 1);
      BIOS.show_logos = true;
      await BIOS.type(`     Copyright (C) 1984-2025, Award Software, Inc.`, 1);
  
      await sleep(1000);
      await BIOS.type(`\n`, 13);
      await sleep(800);
      await BIOS.type(`MS-15CK`, 13);
      await BIOS.type(`\n`, 13);
      await sleep(925);
      await BIOS.type(`CMOS Date : ${$Clock.dayjs.toISOString()}`, 2);
      await sleep(250);
      await BIOS.type(`Main Processor : AMD Ryzen 9 5900HX at 4.68 GHz`, 2);
      await sleep(235);
      await BIOS.type(`Memory Test : ${`\\p`.repeat(30)}64K ... ${`\\p`.repeat(40)}128M ... ${`\\p`.repeat(50)}16G ... OK`, 2);
      await sleep(745);
      await BIOS.type(`\n`, 23);
      await BIOS.type(`Detecting IDE Primary Master ... ${`\\p`.repeat(120)}WDC PC SN540 SDDPNPF-1T00-1032`, 2);
  
      await sleep(3000);
      $Loaded.bios = true;
  
      await sleep(500);
      boot_sfx.play();
      await sleep(5000);
      $Loaded.boot = true;
      await sleep(200);
      
      $Loaded.taskbar = true;
      $Loaded.desktop = true;

    }
  });

  let show_logger = Logger.show;
</script>

<IEDetect />

<svelte:head>
  <link rel="preload" href="/sfx/boot.flac" as="audio" type="audio/flac" />
  <link rel="preload" href="/sfx/beep.flac" as="audio" type="audio/flac" />
  <link rel="preload" href="/icon.png" as="image" type="image/png" />
  <link rel="preload" href="/boot.png" as="image" type="image/png" />
</svelte:head>

<div class="loading-screen">
  {#if !$Loaded.bios}
    {#if BIOS.show_logos}<img src="/qicons/energystar-award.png" class="bios-image award" data-pixel width="32" height="32" alt="">{/if}
    {#if BIOS.show_logos}<img src="/qicons/energystar.png" class="bios-image energystar" data-pixel width="150" height="92" alt="">{/if}
    <div class="logger monogram" bind:this={BIOS.stdout}>{BIOS.logs.join("\n")}</div>
  {:else}
    <div class="front" transition:fade={{ easing: ass_easing, duration: 680 }}>
      <img src="/boot.png" data-pixel width="64" height="64" class={`boot-logo ${`sskip`}`} alt="paw">
      <h1 class="os-name">kittyOS</h1>
    </div>
  {/if}
</div>

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
      
      overflow-y: scroll;
    }
    & .bios-image {
      position: absolute;
      top: 0px;
      &.award {
        left: 0;
      }
      &.energystar {
        right: 0;
      }
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

      & .os-name {
        margin: 0;
      }

      & .boot-logo:not(.skip) {
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
    }
  }
</style>