import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server'

const isProtectedRoute = createRouteMatcher(['/(.*)'])
const isPublicRoute = createRouteMatcher(["/404"])
const isAuthRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/forgot-password'])

const isAPIRoute = createRouteMatcher(['/api(.*)'])

export const onRequest = clerkMiddleware((auth, context) => {
    const { userId } = auth()

    if (isAPIRoute(context.request) || isPublicRoute(context.request)) {
        return
    }

    if (!userId && isAuthRoute(context.request)) {
        return
    }

    if (userId && isAuthRoute(context.request)) {
        return context.redirect('/')
    }

    if (!userId && isProtectedRoute(context.request)) {
        return context.redirect('/sign-in')
    }
})