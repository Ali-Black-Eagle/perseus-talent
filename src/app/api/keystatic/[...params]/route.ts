import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../../keystatic.config";
import { isAdminEnabled } from "@/lib/admin";

export const dynamic = "force-dynamic";

// Created on first use, not when the file is loaded: in GitHub mode Keystatic throws if its secrets are missing,
// and that must show up as an error in the admin, not as a failed site build.
let handler: ReturnType<typeof makeRouteHandler> | undefined;
function getHandler() {
  handler ??= makeRouteHandler({ config });
  return handler;
}

function guard(method: "GET" | "POST") {
  return async (req: Request): Promise<Response> => {
    if (!isAdminEnabled()) {
      return new Response("Not found", {
        status: 404,
        headers: { "X-Robots-Tag": "noindex, nofollow" },
      });
    }
    return getHandler()[method](req);
  };
}

export const GET = guard("GET");
export const POST = guard("POST");
