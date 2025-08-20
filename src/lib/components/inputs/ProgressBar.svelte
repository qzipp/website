<script lang="ts">
  const {
    value,
    ...rest
  }: {
    value?: number|string,
  } & Record<string, unknown> = $props();
</script>

<div {...rest} class={`progress ${value ? `` : `unset`}`} style:--value={`${value}${value?.toString().includes("%") ? "" : "%"}`}>
  {#if value}<div class="text">{value}{value?.toString().includes("%") ? "" : "%"}</div>{/if}
  <div class="value">
    <div class="bg"></div>
  </div>
</div>

<style lang="scss">
  .progress {
    --width: 128px;
    appearance: none;
    position: relative;
    
    border: 1px inset #5d5d5d;
    background: #353535;
    color: #fff;
    box-sizing: border-box;

    height: 16px;
    width: var(--width);

    &.unset .value {
      background: linear-gradient(90deg, #adee6e 0%, #51a200 45%, #51a200 55%, #adee6e 100%);
      background-size: 200% 100%;

      animation: random 3s linear 0s infinite forwards;

      @keyframes random {
        0% {
          background-position: 0% 0%;
        }

        100% {
          background-position: 200% 0%;
        }
      }
    }

    & .text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      text-shadow: 1px 1px 0px #000000;
    }

    & .value {
      & .bg {
        background-size: 100% 100%;
        height: 100%;
        width: 100%;
        background: linear-gradient(90deg, #adee6e 0%, #51a200 clamp(100%, calc(100% + (100% - var(--value))), 200%));
      }

      height: 100%;
      width: var(--value);
      overflow: hidden;
    }
  }
</style>