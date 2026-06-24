import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");
  
  if (isAuthPage && isLoggedIn) {
    return Response.redirect(new URL("/", req.nextUrl));
  }
});

// Match all request paths except API, static assets, images, and favicon
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
