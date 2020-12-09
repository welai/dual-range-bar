export function setStyle(htmlElement: HTMLElement, styleSpec: Partial<CSSStyleDeclaration>) {
  (<any>Object).assign(htmlElement.style, styleSpec)
}