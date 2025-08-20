<script lang="ts">
  import { onMount } from "svelte";
    import Button from "../../inputs/Button.svelte";
    import Processes from "$src/lib/stores/Processes";
  
  const { pid } = $props();

  let title_template = "welcome";

  export const meta: AppMeta = $state({
    title: title_template,
    icon: "/icon.png",

    window: {
      width: 480,
      height: 290,
    }
  });

  const mark_as_visited = () => {
    Processes.kill(Number(pid));
    localStorage.setItem("welcome-1_2_3-alpha", "true")
  }
</script>

<div>
  <div class="row">
  <img src="/welcomebanner.png" alt="cool banner yea">
  <div class="info-panel">

<div class="info">
<h1 style="margin: 7px 0;">welcome to 1.2.3-alpha!</h1>
sorry for the long wait, i was losing interest in this project for a bit, don't worry though, i'll finish it.

i've fixed a lot of problems with how i had first written my window manager, boot sequence and so on. now it's easy for me to develop "apps" in too!!!

you can check out the source at <a href="https://github.com/qzipp/website">my github</a>, i plan to open my own git website as i dont really like github.

ive also added <b>control panel</b> (wip), <b>task manager</b>, <b>art (aka my own art)</b> 

for now, enjoy my stupid website :333 
</div>

  <div class="buttons">
    <Button onclick={() => mark_as_visited()}>ok bye weirdo</Button>
    <Button onclick={() => mark_as_visited()}>baiiiiiii</Button>
  </div>
  </div>
  </div>
</div>
  
<style lang="scss">
  .row {
    display: flex;
    flex-direction: row;
    gap: 8px;



    a, a:link {
      color: #b881e2;
    }
    a:visited, a:active {
      color: #733d9c;
    }

  }

  .info-panel {
    display: flex;
    flex-direction: column;
  }
  .info {
    word-wrap: break-word;
    white-space: pre-wrap;
  }

  .buttons {
    margin-top: auto;
    display: flex;
    flex-direction: row;
    gap: 4px;
    :global(:first-child) {
      margin-left: auto;
    }
  }
</style>