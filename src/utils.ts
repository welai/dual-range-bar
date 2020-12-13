/** Fast set styles for a HTML element, tricky AnyScript */
export function setStyle(htmlElement: HTMLElement, styleSpec: Partial<CSSStyleDeclaration>) {
  (<any>Object).assign(htmlElement.style, styleSpec)
}

/** Return a calculated value of deltaY from a WheelEvent,
 * since Firefox would return `deltaMode === 0x02` or `deltaMode === 0x03` */
export function getDeltaY(event: WheelEvent) {
  const r = event.deltaMode === 0x01 ? 16 : 1
  return event.deltaY * r
}