import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Protect /host/* routes — redirect to login if no session cookie
  const session = request.cookies.get("__session");
  const isHostRoute = request.nextUrl.pathname.startsWith("/host");

  if (isHostRoute && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/host/:path*"],
};
