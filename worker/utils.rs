use serde::{Deserialize, Serialize};
use worker::{console_log, Fetch, Headers, Method, Request, RequestInit, Response};

#[cfg(feature = "console_error_panic_hook")]
pub fn set_panic_hook() {
  console_error_panic_hook::set_once();
}

#[cfg(not(feature = "console_error_panic_hook"))]
#[inline]
pub fn set_panic_hook() {}

pub fn get_default_avatar(id: u64) -> String {
  format!("http://cdn.discord.com/embed/avatars/{}.png", (id >> 22) % 6)
}

#[derive(Deserialize)]
pub struct PartialDiscordUser {
  pub id: String,
  pub avatar: Option<String>,
}

#[derive(Deserialize)]
pub struct DiscordUser {
  pub id: String,
  pub username: String,
  pub avatar: Option<String>,
  pub discriminator: String,
  pub public_flags: u32,
  pub premium_type: Option<u32>,
  pub flags: u32,
  pub banner: Option<String>,
  pub accent_color: Option<u32>,
  pub global_name: Option<String>,
  pub avatar_decoration_data: Option<AvatarDecorationData>,
  pub banner_color: Option<String>,
  pub bot: Option<bool>,
}

#[derive(Serialize, Deserialize)]
pub struct AvatarDecorationData {
  pub asset: String,
  pub sku_id: String,
}

#[derive(Serialize)]
pub struct User {
  pub id: String,
  pub username: String,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub avatar: Option<String>,
  pub avatar_url: String,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub discriminator: Option<u16>,
  pub public_flags: u32,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub premium_type: Option<u32>,
  pub flags: u32,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub banner: Option<String>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub accent_color: Option<u32>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub global_name: Option<String>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub avatar_decoration_data: Option<AvatarDecorationData>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub banner_color: Option<String>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub bot: Option<bool>,
}

async fn req_user(token: &str, id: &str) -> Result<Response, Error> {
  let mut headers = Headers::new();
  headers.set("Authorization", &format!("Bot {token}"))?;

  let url = format!("https://discord.com/api/users/{id}");

  let mut req_init = RequestInit::default();
  let req_init = req_init.with_headers(headers).with_method(Method::Get);
  let req = Request::new_with_init(&url, req_init)?;

  let mut res = Fetch::Request(req).send().await?;

  #[cfg(debug_assertions)]
  console_log!("{:?}", res.headers());

  if !(200..=299).contains(&res.status_code()) {
    return Err(Error::http(&mut res).await);
  }

  Ok(res)
}

pub async fn get_user_avatar(token: &str, id: &str) -> Result<String, Error> {
  let mut res = req_user(token, id).await?;

  let user: PartialDiscordUser = res.json().await?;

  let avatar_url = get_avatar(&user.id, &user.avatar);

  Ok(avatar_url)
}

fn get_avatar(id: &str, avatar: &Option<String>) -> String {
  match avatar {
    Some(avatar) => format!("https://cdn.discordapp.com/avatars/{id}/{avatar}.png"),
    None => get_default_avatar(id.parse().unwrap_or(0)),
  }
}

pub async fn get_user(token: &str, id: &str) -> Result<User, Error> {
  let mut res = req_user(token, id).await?;

  let user: DiscordUser = res.json().await?;

  let avatar_url = get_avatar(&user.id, &user.avatar);
  let discriminator: Option<u16> = user.discriminator.parse().ok().filter(|d| *d != 0);

  Ok(User {
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    avatar_url,
    discriminator,
    public_flags: user.public_flags,
    premium_type: user.premium_type,
    flags: user.flags,
    banner: user.banner,
    accent_color: user.accent_color,
    global_name: user.global_name,
    avatar_decoration_data: user.avatar_decoration_data,
    banner_color: user.banner_color,
    bot: user.bot,
  })
}

#[derive(thiserror::Error, Debug)]
pub enum Error {
  #[error("worker error: {0}")]
  Worker(#[from] worker::Error),
  #[error("discord error: {0}")]
  Discord(String),
  #[error("user not found")]
  NotFound,
}

impl Error {
  pub async fn http(res: &mut Response) -> Error {
    let status = res.status_code();

    if status == 404 {
      return Error::NotFound;
    }

    let text = res.text().await.ok();

    match text {
      Some(text) => Error::Discord(format!("{}: {}", status, text)),
      None => Error::Discord(format!("{}", status)),
    }
  }
}
