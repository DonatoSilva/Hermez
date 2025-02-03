import { defineMiddleware } from "astro:middleware"
import { firebase } from "./firebase/config"

const privateRoutes = ['/domicile/record', '/record']
const notProtected = ['/domicile/signUp', '/domicile']

export const onRequest = defineMiddleware(
    async ({ url, locals, redirect }, next) => {
        const isLoggedIn = !!firebase.auth.currentUser
        const domicile = firebase.auth.currentUser

        locals.isLoggedIn = isLoggedIn;

        if (isLoggedIn) {
            locals.domicile = {
                email: domicile.email,
                emailVerified: domicile.emailVerified
            }
        }

        if (!isLoggedIn && privateRoutes.includes(url.pathname)) {
            return redirect('/')
        }

        if (isLoggedIn && notProtected.includes(url.pathname)) {
            return redirect('/')
        }

        return next();
    }
)