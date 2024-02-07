use serde_json::json;
use worker::{console_error, event, Context, Env, Request, Response, RouteContext, Router, Url};

mod utils;
use utils::{get_user, get_user_avatar, set_panic_hook, Error};

type WorkerResponse = Result<Response, worker::Error>;

#[event(fetch)]
pub async fn main(req: Request, env: Env, _ctx: Context) -> WorkerResponse {
  set_panic_hook();

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
    Ok(user) => Response::ok(json!(user).to_string()),
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
      Ok(url) => Response::redirect(url),
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
  Response::error("Internal Server Error", 500)
}

fn not_found() -> WorkerResponse {
  Response::error("Not Found", 404)
}
