import 'sanitize.css';
import 'sanitize.css/forms.css';
import 'sanitize.css/typography.css';
import 'virtual:uno.css';
import './style.css';

import { initTheme } from './theme';
import { $ } from './fooquery';
import { createBadgesElement, getFlagNames } from './utils';

let idInput: HTMLInputElement;

let upper: HTMLElement;
let theBox: HTMLElement;

let userName: HTMLElement;
let userId: HTMLElement;
let userDisc: HTMLElement;
let userAvatar: HTMLImageElement;
let userBadges: HTMLElement;

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

function onSubmit(e: Event) {
  e.preventDefault();

  let user = fetchUser(idInput?.value ?? '');

  userName.textContent = user.username;
  userDisc.textContent = user.discriminator;
  userId.textContent = user.id;
  userAvatar.src = user.avatar;

  let flags = getFlagNames(user.public_flags);

  let badgesEl = createBadgesElement(flags);

  userBadges.replaceChildren(badgesEl);

  upper.classList.add('move');
  theBox.classList.remove('invisible');
  theBox.classList.add('visible');
}

function fetchUser(_id: string) {
  let user = {
    id: '570114669801373727',
    username: 'bvoo',
    avatar: 'https://cdn.discordapp.com/avatars/570114669801373727/512cf035be3110f6f7ff5b76ec8d8793',
    discriminator: '0047',
    public_flags: 128,
  };

  return user;
}
