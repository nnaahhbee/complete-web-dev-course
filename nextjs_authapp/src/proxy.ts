import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  //Check if the user is trying to access a public path (login or signup) and has a token
  const isPublicPath = path === '/login'|| path === '/signup' 
  const token = request.cookies.get('token')?.value || ''

  //If the user is trying to access a public path and has a token, redirect them to the home page
  if(isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  //If the user is trying to access a private path and does not have a token, redirect them to the login page
  if(!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

}
 
//Matcher function to match the route you want to proxy
export const config = {
  matcher: [
    '/',
    '/profile',
    '/profile/:path*',
    '/login',
    '/signup',
  ],
}