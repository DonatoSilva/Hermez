import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server'
import { API_USERS, URL_LOCAL_BACKEND } from 'astro:env/client'
import { ID_ORG_CLIENT, ID_ORG_DOMICILIARY } from 'astro:env/server'
const isProtectedRoute = createRouteMatcher(['/(.*)'])
const isPublicRoute = createRouteMatcher(['/404'])
const isAuthRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/forgot-password'])

const isAPIRoute = createRouteMatcher(['/api(.*)'])


/**
 * @type {import("astro").MiddlewareHandler}
 */
// `context` and `next` are automatically typed
export const onRequest = clerkMiddleware(
    async (auth, { locals, request, redirect, cookies }) => {
        const { userId, sessionClaims } = auth()
        const url = request.url
        locals.userExistsAPI = true

        const hasUserDataCookie = cookies.get('data-user')?.value

        if (userId && hasUserDataCookie !== userId) {
            let userExists = false

            try {
                const url = `${URL_LOCAL_BACKEND}/${API_USERS}/me`
                console.log(`Fetching user data from: ${url}`)
                const res = await fetch(url)
                userExists = res.status !== 404

                /// guardamos la existencia del usuario en la cookie para evitar futuras consultas
                if (userExists) cookies.set('data-user', userId, { path: '/', maxAge: 60 * 60 * 24 * 15 }) // 15 days;
            } catch (e) {
                userExists = false
            }

            locals.userExistsAPI = userExists
        }

        switch (sessionClaims?.o?.id) {
            case ID_ORG_CLIENT:
                locals.userRole = 'User'
                break
            case ID_ORG_DOMICILIARY:
                locals.userRole = 'Domiciliary'
                break
            default:
                locals.userRole = null
        }

        if (url) {
            const urlObj = new URL(url)
            const orgParam = urlObj.searchParams.get('org')
            if (!locals.userRole) {
                locals.orgId = ID_ORG_CLIENT
            } else if (orgParam) {
                if (orgParam === 'User') {
                    locals.orgId = ID_ORG_CLIENT
                }

                if (orgParam === 'Domiciliary') {
                    locals.orgId = ID_ORG_DOMICILIARY
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