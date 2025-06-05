import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server'

const isProtectedRoute = createRouteMatcher(['/(.*)'])
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/forgot-password', "/404"])
const isAPIRoute = createRouteMatcher(['/api(.*)'])

export const onRequest = clerkMiddleware((auth, context) => {
    const { userId } = auth()

    if (isAPIRoute(context.request)) {
        return
    }

    if (!userId && isPublicRoute(context.request)) {
        return
    }

    if (!userId && isProtectedRoute(context.request)) {
        return context.redirect('/sign-in')
    }
})