import 'sanitize.css';
import 'sanitize.css/forms.css';
import 'sanitize.css/typography.css';
import 'virtual:uno.css';
import './style.css';

import { $ } from './fooquery';
import { initTheme } from './theme';
import { createBadgeElements, getFlagNames } from './utils';

let idInput: HTMLInputElement;

let upper: HTMLElement;
let theBox: HTMLElement;

let userName: HTMLElement;
let userId: HTMLElement;
let userDisc: HTMLElement;
let userAvatar: HTMLImageElement;
let userBadges: HTMLElement;

let error: HTMLElement;

function init() {
  initTheme();

  idInput = $('#id-input')!;
  idInput?.addEventListener('change', onInputChange);
  idInput?.addEventListener('input', onInputChange);
  idInput?.addEventListener('paste', onInputChange);

  $('#id-form')?.addEventListener('submit', onSubmit);

  upper = $('#upper')!;
  theBox = $('#the-box')!;

  userName = $('#user-name')!;
  userId = $('#user-id')!;
  userDisc = $('#user-disc')!;
  userAvatar = $('#user-avatar')!;
  userBadges = $('#user-badges')!;

  error = $('#error')!;
}

function onInputChange() {
  if (idInput) {
    idInput.value = idInput.value.replace(/\D/g, '');
  }
}

if (document.readyState !== 'loading') {
  init();
} else {
  window.addEventListener('DOMContentLoaded', () => {
    init();
  });
}

async function onSubmit(e: Event) {
  e.preventDefault();

  let user = await fetchUser(idInput?.value ?? '');

  if (!user) {
    error.textContent = 'failed to get user';
    error.classList.remove('hidden');
    return;
  }

  error.textContent = '';
  error.classList.add('hidden');

  userName.textContent = user.username;
  userDisc.textContent = user.discriminator;
  userId.textContent = user.id;
  userAvatar.src = user.avatar_url;

  let flags = getFlagNames(user.public_flags);

  let badges = createBadgeElements(flags);

  userBadges.replaceChildren(...badges);

  upper.classList.add('move');
  theBox.classList.remove('invisible');
  theBox.classList.add('visible');
}

async function fetchUser(id: string) {
  if (!id) {
    return null;
  }

  // return {
  //   id: '80088516616269824',
  //   banner: null,
  //   username: 'Danny',
  //   banner_color: null,
  //   global_name: null,
  //   accent_color: null,
  //   display_name: null,
  //   avatar: '39ec2502115271c24eb969018fcd8b55',
  //   avatar_decoration: null,
  //   discriminator: '0007',
  //   public_flags: 262912,
  //   flags: 262912,
  //   avatar_url: 'https://cdn.discordapp.com/avatars/80088516616269824/39ec2502115271c24eb969018fcd8b55',
  // };

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

  return `${import.meta.env.DEV ? `${origin}:3000` : `${origin}:${l.port}`}/api`;
}
