import { DEFAULT_ICON, FLAGS, FLAG_ICONS, FLAG_INFO, type FLAG_NAME } from './constants';

export function getFlagNames(flagInt: number): FLAG_NAME[] {
  return FLAGS.filter(([id, _]) => flagInt & id).map(([_, name]) => name);
}

export function createBadgeElements(flags: FLAG_NAME[]) {
  return flags.map(flagId => {
    let icon = FLAG_ICONS[flagId];

    if (icon === '') {
      icon = DEFAULT_ICON;
    }

    let flagInfo = FLAG_INFO[flagId];

    return createIconElement(flagInfo[0], icon);
  });
}

function createIconElement(name: string, icon: string) {
  let el = document.createElement('div');
  el.setAttribute('data-tooltip', name);

  let imgEl = document.createElement('img');
  imgEl.src = `./icons/${icon}`;
  imgEl.width = 32;
  imgEl.height = 32;
  imgEl.alt = `${name} badge`;

  el.appendChild(imgEl);

  return el;
}
