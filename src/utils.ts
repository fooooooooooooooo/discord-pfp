import { DEFAULT_ICON, FLAGS, FLAG_ICONS, FLAG_INFO, type FLAG_NAME } from './constants';

export function getFlagNames(flagInt: number) {
  let flagNames: FLAG_NAME[] = [];

  for (const [id, name] of FLAGS) {
    if (flagInt & id) {
      console.debug(flagInt, 'has flag', id, name);

      flagNames.push(name);
    }
  }

  return flagNames;
}

export function createBadgesElement(flags: FLAG_NAME[]) {
  let container = document.createElement('div');

  flags.forEach(flagId => {
    let icon = FLAG_ICONS[flagId];

    if (icon === '') {
      icon = DEFAULT_ICON;
    }

    let flagInfo = FLAG_INFO[flagId];

    let iconEl = createIconElement(flagInfo[0], icon);

    container.appendChild(iconEl);
  });

  return container;
}

function createIconElement(name: string, icon: string) {
  let el = document.createElement('div');
  el.setAttribute('data-tooltip', name);

  let imgEl = document.createElement('img');
  imgEl.src = `./icons/${icon}`;

  el.appendChild(imgEl);

  return el;
}
