<script lang="ts">
  const { children } = $props();
</script>

<style lang="scss">
  :global(html) {
    color: #fff;
    font-family: "Times New Roman";
    background: url("/pattern1.png");
  }
  :global(body) {
    text-align: center;

    margin-left:auto;
    margin-right:auto;
    width: 800px;
  }
</style>

{@render children()}