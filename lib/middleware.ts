import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./auth"

export function middleware(request: NextRequest) {
  // Check if the request is for a protected route
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    try {
      verifyToken(token)
      return NextResponse.next()
    } catch (error) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
