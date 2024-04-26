import { DEFAULT_ICON, FLAGS, FLAG_ICONS, FLAG_INFO, type FLAG_NAME } from './constants';

function getFlagNames(flagInt: number): FLAG_NAME[] {
  return FLAGS.filter(([id, _]) => flagInt & id).map(([_, name]) => name);
}

export function getBadges(flagInt: number): [string, string][] {
  const flags = getFlagNames(flagInt);
  return flags.map(flagId => {
    let icon = FLAG_ICONS[flagId];

    if (icon === '') {
      icon = DEFAULT_ICON;
    }

    const flagInfo = FLAG_INFO[flagId];

    return [flagInfo[0], icon];
  });
}

export function getBaseUrl() {
  let { protocol, hostname, port } = window.location;
  const origin = `${protocol}//${hostname}`;

  port = (import.meta as unknown as { env?: { DEV?: string } }).env?.DEV ? '8787' : port;

  return `${port === '80' || port === '443' ? origin : `${origin}:${port}`}/api`;
}
