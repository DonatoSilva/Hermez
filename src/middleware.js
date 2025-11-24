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
        locals.dataUser = null
        locals.userExistsAPI = true
        
        if (userId) {
            /// obteniendo los datos del usuario
            const token = await auth().getToken({
                template: 'jwt-back-hermez'
            })
            const res = await fetch(`${URL_LOCAL_BACKEND}/${API_USERS}/me/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            
            const responseData = await res.json()
            const data = Array.isArray(responseData) ? responseData[0] : responseData
            locals.dataUser = data
            
            const hasUserDataCookie = cookies.get('data-user')?.value
            if (hasUserDataCookie !== userId) {
                let userExists = false

                try {
                    if (res.status === 404 || !res.ok) {
                        userExists = false
                    } else if (data.userid !== userId || !data.gender || !data.phone || !data.age) {
                        userExists = false
                    } else {
                        userExists = true
                        /// guardamos la existencia del usuario en la cookie para evitar futuras consultas
                        cookies.set('data-user', userId, { path: '/', maxAge: 60 * 60 * 24 * 15 }) // 15 days
                    }

                } catch (e) {
                    userExists = false
                }

                locals.userExistsAPI = userExists
            }
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