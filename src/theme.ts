import { $, $$ } from './fooquery';

const matchDarkScheme = () => window.matchMedia('(prefers-color-scheme: dark)');

type Theme = 'light' | 'dark';

function setTheme(theme: Theme, auto?: boolean) {
  document.documentElement.classList.remove('light', 'dark', 'auto');

  document.documentElement.classList.add(theme);

  if (auto) {
    document.documentElement.classList.add('auto');
  }
}

function updateTheme() {
  const theme = window.localStorage.getItem('theme') as Theme;

  if (theme) {
    setTheme(theme);

    return;
  }

  let prefersDark = matchDarkScheme().matches;

  setTheme(prefersDark ? 'dark' : 'light', true);
}

let toggles: HTMLInputElement[] = [];

export function initTheme() {
  const theme = window.localStorage.getItem('theme') as Theme;

  // set the initial selected theme
  if (theme) {
    let toggle = $<HTMLInputElement>(`#theme-toggle input[value='${theme}']`);

    if (toggle) {
      toggle.checked = true;
    }
  }

  toggles = $$<HTMLInputElement>('#theme-toggle input')!;

  // add listeners
  for (let i = 0; i < toggles.length; i++) {
    let toggle = toggles[i];

    toggle.addEventListener('click', e => {
      e.preventDefault();

      if (toggle.checked) {
        toggles.filter((_, index) => index != i).forEach(otherToggle => (otherToggle.checked = false));

        let theme = toggle.value;

        if (['dark', 'light'].includes(theme)) {
          window.localStorage.setItem('theme', theme);
        } else {
          window.localStorage.removeItem('theme');
        }

        updateTheme();
      }
    });
  }

  matchDarkScheme().addEventListener('change', _event => {
    updateTheme();
  });

  updateTheme();
}
