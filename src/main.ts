import { createApp } from 'petite-vue';
import '../assets/style.css';
import { initTheme } from './theme';
import { createBadgeElements as getBadges, getFlagNames } from './utils';

if (document.readyState !== 'loading') {
  initTheme();
} else {
  window.addEventListener('DOMContentLoaded', () => {
    initTheme();
  });
}

type User = {
  id: string;
  username: string;
  avatar?: string;
  avatar_url: string;
  discriminator?: number;
  public_flags: number;
  premium_type: number;
  flags: number;
  banner?: string;
  accent_color?: number;
  global_name?: string;
  avatar_decoration_data?: string;
  banner_color?: string;
  bot?: boolean;
};

type State = {
  id: string;

  showUser: boolean;
  user?: User | null;
  oldUser: boolean;
  badges: [string, string][];

  showError: boolean;
  error: string;
};

function Icon(props: { name: string; icon: string }) {
  return {
    $template: '#icon-template',
    name: props.name,
    icon: props.icon,
  };
}

const initialState = {
  id: '',

  showUser: true,
  user: null,
  oldUser: false,
  badges: [],

  showError: false,
  error: '',

  onInput(this: State) {
    this.showError = false;
    this.error = '';
    this.id = this.id.replace(/\D/g, '');
  },

  async onSubmit(this: State) {
    this.showError = false;
    this.error = '';

    let user = await fetchUser(this.id);

    if (!user) {
      this.showUser = false;
      this.showError = true;
      this.error = 'failed to get user';
      this.user = null;
      return;
    }

    this.showUser = true;
    this.user = user as User;

    this.oldUser = !!(this.user.discriminator && this.user.discriminator !== 0);
    this.badges = getBadges(getFlagNames(this.user.public_flags));
  },
};

createApp({
  Icon,
  ...initialState,
}).mount();

async function fetchUser(id: string) {
  // for test
  return {
    id: '80088516616269824',
    username: 'danny',
    avatar: '890bf25cf34a6a164c5c6eee28430904',
    discriminator: 0,
    public_flags: 262912,
    premium_type: 2,
    flags: 262912,
    banner: null,
    accent_color: null,
    global_name: 'Danny',
    avatar_decoration_data: null,
    banner_color: null,
    avatar_url: 'https://cdn.discordapp.com/avatars/80088516616269824/890bf25cf34a6a164c5c6eee28430904',
  };

  if (!id) {
    return null;
  }

  try {
    let url = new URL(getBaseUrl());
    url.searchParams.set('id', id);

    let res = await fetch(url);

    if (res.status < 200 || res.status >= 300) {
      return null;
    }

    let user = await res.json();

    console.debug(user);

    return user;
  } catch (e) {
    console.error('failed to fetch user', e);
    return null;
  }
}

function getBaseUrl() {
  const l = window.location;
  const origin = `${l.protocol}//${l.hostname}`;

  return `${(import.meta as any).env?.DEV ? `${origin}:3000` : `${origin}:${l.port}`}/api`;
}
