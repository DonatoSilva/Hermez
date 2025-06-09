import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server'
const isProtectedRoute = createRouteMatcher(['/(.*)'])
const isPublicRoute = createRouteMatcher(["/404"])
const isAuthRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/forgot-password'])

const isAPIRoute = createRouteMatcher(['/api(.*)'])


/**
 * @type {import("astro").MiddlewareHandler}
 */
// `context` and `next` are automatically typed
export const onRequest = clerkMiddleware(
    async (auth, { request, redirect }) => {
        const { locals, userId, orgId } = auth()


        if (userId && isProtectedRoute(request)) {
            if (request.url.includes('/select-organization')) {
                return
            }

            if (!orgId) {
                return redirect('/select-organization')
            }

            return
        }

        if (isAPIRoute(request) || isPublicRoute(request)) {
            return
        }

        if (!userId && isAuthRoute(request)) {
            return
        }

        if (userId && isAuthRoute(request)) {
            return redirect('/')
        }

        if (!userId && isProtectedRoute(request)) {
            return redirect('/sign-in')
        }
    })