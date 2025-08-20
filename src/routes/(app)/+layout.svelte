<script lang="ts">
  import { onMount } from "svelte";

  import "normalize.css";

  import "$src/app.scss";
  import "$stores/Settings";

  import IEDetect from "$components/gates/IEDetect.svelte";
  import Boot from "$components/core/Boot.svelte";
  import Logs from "$src/lib/components/core/Logs.svelte";

  import Loaded from "$stores/Loaded";
  import Logger from "$stores/Logger";
  import Input from "$std/Input";
    import { Settings } from "$stores/Settings";

  const { children } = $props();

  onMount(() => {
    Input.mount();
    return () => {
      Input.reset();
    };
  });

  let show_logger = Logger.show;

  // global keybind assignment
  Input.new()
  .handler(({ type }) => {
    $show_logger = !$show_logger
  })
  .keybind({
    type: "keybind.down", 
    code: "F1"
  })

  if($Settings.font === "monospace") {
    document.body.classList.add("mono")
  }
</script>

<IEDetect />

{@render children()}
{#if !$Loaded.boot}
  <Boot />
{/if}

{#if $show_logger}
  <Logs />
{/if}

<style lang="scss"></style>