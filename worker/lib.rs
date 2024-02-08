use serde_json::json;
use worker::{console_error, event, Context, Env, Headers, Method, Request, Response, RouteContext, Router, Url};

mod utils;
use utils::{get_user, get_user_avatar, set_panic_hook, Error};

const CORS_ORIGIN: &str = "*";
const CORS_HEADERS: &str = "Content-Type";
const CORS_METHODS: &str = "GET, OPTIONS";

type WorkerResponse = Result<Response, worker::Error>;

#[event(fetch)]
pub async fn main(req: Request, env: Env, _ctx: Context) -> WorkerResponse {
  set_panic_hook();

  if req.method() == Method::Options {
    return Ok(Response::empty()?.with_headers(cors_headers()).with_status(200));
  }

  let router = Router::new();

  router
    .get_async("/api/:id", get_api)
    .get_async("/avatar/:id", get_avatar)
    .run(req, env)
    .await
}

async fn get_api(_req: Request, ctx: RouteContext<()>) -> WorkerResponse {
  let id = match ctx.param("id") {
    Some(id) => id,
    None => return not_found(),
  };

  let token = ctx.env.secret("DISCORD_TOKEN")?.to_string();

  match get_user(&token, id).await {
    Ok(user) => Ok(Response::ok(json!(user).to_string())?.with_headers(cors_headers())),
    Err(Error::NotFound) => not_found(),
    Err(err) => error(err),
  }
}

async fn get_avatar(_req: Request, ctx: RouteContext<()>) -> WorkerResponse {
  let id = match ctx.param("id") {
    Some(id) => id,
    None => return not_found(),
  };

  let token = ctx.env.secret("DISCORD_TOKEN")?.to_string();

  match get_user_avatar(&token, id).await {
    Ok(avatar) => match Url::parse(&avatar) {
      Ok(url) => Ok(Response::redirect(url)?.with_headers(cors_headers())),
      Err(err) => {
        console_error!("Url error: {err:?}");
        internal_server_error()
      }
    },
    Err(Error::NotFound) => not_found(),
    Err(err) => error(err),
  }
}

fn error(err: Error) -> WorkerResponse {
  console_error!("Error: {err:?}");
  internal_server_error()
}

fn internal_server_error() -> WorkerResponse {
  Ok(Response::empty()?.with_status(500).with_headers(cors_headers()))
}

fn not_found() -> WorkerResponse {
  Ok(Response::empty()?.with_status(404).with_headers(cors_headers()))
}

fn cors_headers() -> Headers {
  let mut headers = Headers::new();
  headers.append("Access-Control-Allow-Origin", CORS_ORIGIN).unwrap();
  headers.append("Access-Control-Allow-Headers", CORS_HEADERS).unwrap();
  headers.append("Access-Control-Allow-Methods", CORS_METHODS).unwrap();
  headers
}
