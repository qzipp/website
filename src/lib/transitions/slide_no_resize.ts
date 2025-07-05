import { ass_easing } from "$transitions/ass_easing"

export function slide_no_resize(node: Element, {
  delay = 0,
  duration = 150,
  easing = ass_easing,
  reverse = false,
  axis = "y",
  origin = "bottom left"
} = {}) {
  return {
    delay,
    duration,
    easing,
    css: (t: number) => {
      let distance = reverse ? -100 : 100
      let translate_value = distance * (1 - t)

      let transform = axis === "x"
        ? `translateX(${translate_value}%) scaleX(${t}) scaleY(${t})`
        : `translateY(${translate_value}%) scaleY(${t}) scaleX(${t})`

      return `transform: ${transform}; overflow: hidden; transform-origin: ${origin};`
    }
  }
}