<script lang="ts">
  import { onMount } from "svelte";
  import Window from "$components/core/ui/Window.svelte";
  import { Settings, type SettingsStorage, type SettingValue } from "$stores/Settings";
  import { get, writable, type Writable } from "svelte/store";

  let element: Window;

  let title_template = "control panel";

  export const meta: AppMeta = $state({
    title: title_template,
    icon: "/icons/directory_control_panel-1.png",

    window: {
      width: 400,
      height: 300,

      scrollable: true
    }
  });

  // yes this is awful plz shut up now ok
</script>

<div class="tempui">temporary ui!!</div>
  {#each Object.entries($Settings) as [key, value]}
    {key}
    {#if typeof value === "string"}
    <input type="text" placeholder={typeof value} onblur={(event) => {
      let input = (event.target as HTMLInputElement);
      Settings.setting(key, input.value)
    }} value={value}>

    {:else if typeof value === "boolean"}
    <input type="checkbox" placeholder={typeof value} onchange={(event) => {
      let input = (event.target as HTMLInputElement);
      Settings.setting(key, input.checked)
    }} checked={value}>
    {:else}idk
    {/if}
    <br>
  {/each}

<style lang="scss">
  .tempui {
    color: #fff;
    text-align: center;
    background: repeating-linear-gradient(30deg, #775803 0em, #775803 1em, #000 1em, #000 2em);
  }
</style>