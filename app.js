const express = require('express');
const cors = require('cors');
const app = express();
const request = require('request');
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'development') {
  const dotenv = require('dotenv');

  dotenv.config();
}

if (!process.env.DISCORD_TOKEN) {
  console.error('ERROR: no discord token');

  process.exit(1);
}

app.use(cors());

app.get('/avatar/', async function (req, response) {
  let id = req.query.id;

  const options = {
    url: 'https://discord.com/api/users/' + id,
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
    },
  };

  return request(options, function (err, res) {
    if (err) {
      console.error(err);

      response.sendStatus(404);
      return;
    }

    const data = JSON.parse(res.body);
    let avatar = '';

    if (data.avatar) {
      avatar = `https://cdn.discordapp.com/avatars/${id}/${data.avatar}`;
    } else {
      data.avatar = getDefaultAvatar(data.discriminator);
    }

    response.redirect(avatar);
  });
});

app.get('/api/', async function (req, response) {
  let id = req.query.id;

  let user = {
    id: id,
    username: '',
    avatar: '',
    discriminator: '',
    public_flags: '',
  };

  const options = {
    url: 'https://discord.com/api/users/' + id,
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
    },
  };

  return request(options, function (err, res) {
    if (err) {
      console.error(err);

      response.sendStatus(404);

      return;
    }

    console.debug(res);

    const data = JSON.parse(res.body);

    user.username = data.username;
    user.avatar = data.avatar;
    user.discriminator = data.discriminator;
    user.public_flags = data.public_flags;

    // Resolve avatar hash to working image url
    if (user.avatar) {
      let avatar = `https://cdn.discordapp.com/avatars/${id}/${user.avatar}`;
      user.avatar = avatar;
    } else {
      user.avatar = getDefaultAvatar(user.discriminator);
    }

    response.json(user);
  });
});

app.use(express.static('public'));

function getDefaultAvatar(discriminator) {
  let defaults = [
    '6debd47ed13483642cf09e832ed0bc1b',
    '322c936a8c8be1b803cd94861bdfa868',
    'dd4dbc0016779df1378e7812eabaa04d',
    '0e291f67c9274a1abdddeb3fd919cbaa',
    '1cbd08c76f8af6dddce02c5138971129',
  ];

  return `https://discordapp.com/assets/${defaults[discriminator % 5]}.png`;
}

app.listen(port, () => {
  console.info(`App listening on port: ${port}`);
});
