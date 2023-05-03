import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import { join } from 'path';

type User = {
  id: string;
  avatar: string;
  avatar_url: string;
  discriminator: string;
};

if (process.env.NODE_ENV === 'development') {
  config({ path: '../.env' });
}

if (!process.env.DISCORD_TOKEN) {
  console.error('ERROR: no discord token');

  process.exit(1);
}

const PORT = process.env.PORT || 3000;

const HEADERS = {
  Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
};

function getDefaultAvatar(discriminator: number) {
  let defaults = [
    '6debd47ed13483642cf09e832ed0bc1b',
    '322c936a8c8be1b803cd94861bdfa868',
    'dd4dbc0016779df1378e7812eabaa04d',
    '0e291f67c9274a1abdddeb3fd919cbaa',
    '1cbd08c76f8af6dddce02c5138971129',
  ];

  return `https://discordapp.com/assets/${defaults[discriminator % 5]}.png`;
}

async function getUser(id: string): Promise<[User | null, number]> {
  try {
    let response = await fetch(`https://discord.com/api/users/${id}`, { headers: HEADERS });

    if (response.status < 200 || response.status >= 300) {
      return [null, response.status];
    }

    let data = await response.json();

    const user: User = data;

    // Resolve avatar hash to working image url
    if (user.avatar) {
      user.avatar_url = `https://cdn.discordapp.com/avatars/${id}/${user.avatar}`;
    } else {
      user.avatar_url = getDefaultAvatar(Number.parseInt(user.discriminator));
    }

    return [user, response.status];
  } catch (e) {
    console.error('request failed:', e);

    return [null, 500];
  }
}

async function run_server() {
  const app = express();

  app.use(cors());

  app.get('/avatar/', async (req, response) => {
    let id = req.query.id;

    if (!id || typeof id !== 'string') {
      response.sendStatus(400);

      return;
    }

    const [user, status] = await getUser(id);

    if (!user) {
      response.sendStatus(status);

      return;
    }

    response.redirect(user.avatar_url);
  });

  app.get('/api/', async (req, response) => {
    let id = req.query.id;

    if (!id || typeof id !== 'string') {
      response.sendStatus(400);

      return;
    }

    let [user, status] = await getUser(id);

    if (!user) {
      response.sendStatus(status);

      return;
    }

    response.json(user);
  });

  app.use(express.static(join(__dirname, 'public')));

  app.listen(PORT, () => {
    console.info(`listening on port \`${PORT}\``);
  });
}

run_server();
