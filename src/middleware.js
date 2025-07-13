import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server'
import { ID_ORG_CLIENT, ID_ORG_DOMICILIARY } from 'astro:env/server'
const isProtectedRoute = createRouteMatcher(['/(.*)'])
const isPublicRoute = createRouteMatcher(["/404"])
const isAuthRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/forgot-password'])

const isAPIRoute = createRouteMatcher(['/api(.*)'])


/**
 * @type {import("astro").MiddlewareHandler}
 */
// `context` and `next` are automatically typed
export const onRequest = clerkMiddleware(
    async (auth, { locals, request, redirect }) => {
        const { userId, sessionClaims } = auth()
        const url = request.url


        switch (sessionClaims?.o?.id) {
            case ID_ORG_CLIENT:
                locals.userRole = 'User';
                break;
            case ID_ORG_DOMICILIARY:
                locals.userRole = 'Domiciliary';
                break;
            default:
                locals.userRole = null;
        }

        if (url) {
            // Extract organization ID from the URL
            const urlObj = new URL(url)
            const orgParam = urlObj.searchParams.get('org')
            if (!locals.userRole) {
                locals.orgId = ID_ORG_CLIENT;
            } else if (orgParam) {
                if (orgParam === 'User') {
                    locals.orgId = ID_ORG_CLIENT;
                }

                if (orgParam === 'Domiciliary') {
                    locals.orgId = ID_ORG_DOMICILIARY;
                }
            } else {
                locals.orgId = null
            }
        }

        if (userId && isAuthRoute(request)) {
            return redirect('/')
        }

        if (userId && isProtectedRoute(request)) {
            return
        }

        if (isAPIRoute(request) || isPublicRoute(request)) {
            return
        }

        if (!userId && isAuthRoute(request)) {
            return
        }



        if (!userId && isProtectedRoute(request)) {
            return redirect('/sign-in')
        }
    })