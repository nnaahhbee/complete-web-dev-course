import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import getOrCreateDB from './models/server/dbSetup'
import getOrCreateStorage from './models/server/storageSetup'
 
// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    //create the database
    await Promise.all([
        getOrCreateDB(),
        getOrCreateStorage()
    ])
  return NextResponse.next()
}
 
/*matching paths - match all request paths except for the ones that starts with:
-api
-next/static
-next/image
-favicon.com
*/
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon\\.ico).*)',
  ],
}