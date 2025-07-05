<script lang="ts">
  import "normalize.css";

  const { children } = $props();
</script>

{@render children()}

<style lang="scss">
  // 98.css fonts, thx
  @font-face {
    font-family: "Pixelated MS Sans Serif";
    src: url("/ms_sans_serif.woff") format("woff");
    src: url("/ms_sans_serif.woff2") format("woff2");
    font-weight: normal;
    font-style: normal;
  }
  
  @font-face {
    font-family: "Pixelated MS Sans Serif";
    src: url("/ms_sans_serif_bold.woff") format("woff");
    src: url("/ms_sans_serif_bold.woff2") format("woff2");
    font-weight: bold;
    font-style: normal;
  }
  
  :global(body) {
    font-family: "Pixelated MS Sans Serif";
    color: #fff;
    font-size: 11px;
  }
</style>