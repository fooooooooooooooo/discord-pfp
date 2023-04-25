export function $<T extends HTMLElement>(selector: string, parent?: HTMLElement): T | null {
  return (parent ? parent : document).querySelector(selector);
}

export function $$<T extends HTMLElement>(selector: string, parent?: HTMLElement): T[] | null {
  return Array.prototype.slice.call((parent ? parent : document).querySelectorAll(selector));
}
