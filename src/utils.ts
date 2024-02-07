import { DEFAULT_ICON, FLAGS, FLAG_ICONS, FLAG_INFO, type FLAG_NAME } from './constants';

export function getFlagNames(flagInt: number): FLAG_NAME[] {
  return FLAGS.filter(([id, _]) => flagInt & id).map(([_, name]) => name);
}

export function createBadgeElements(flags: FLAG_NAME[]): [string, string][] {
  return flags.map(flagId => {
    let icon = FLAG_ICONS[flagId];

    if (icon === '') {
      icon = DEFAULT_ICON;
    }

    let flagInfo = FLAG_INFO[flagId];

    return [flagInfo[0], icon];
  });
}
