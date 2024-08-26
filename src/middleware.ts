import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest){
  const uriPath = request.nextUrl.pathname;

  if(uriPath === "/"){
    return NextResponse.redirect(new URL("/profile",request.nextUrl));
  }
}

export const config = {
  matcher:[
    "/"
  ]
}