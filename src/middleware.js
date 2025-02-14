import { defineMiddleware } from "astro:middleware"
import { firebase } from "./firebase/config"

/// si la aplicacion fuera mas grande seria optimo que el almacenamiento de estas rutas sea en un archivo aparte para mejorar el codigo, dividiendo responsabilidades (hasta el momento con esta app no es necesario, cuando lleue el dia la mejor opcion es por medio de un map)

const privateRoutes = ["/domicile/record"];
const publicRoutes = ["/domicile/signUp", "/domicile"];

export const onRequest = defineMiddleware(
    async ({ url, locals, redirect }, next) => {
        const domicile = firebase.auth.currentUser
        const isLoggedIn = !!firebase.auth.currentUser
        const currentPath = url.pathname

        locals.isLoggedIn = isLoggedIn;
        if (isLoggedIn) {
            locals.domicile = {
                email: domicile.email,
                emailVerified: domicile.emailVerified,
                displayName: domicile.displayName,
                uid: domicile.uid
            }
        }

        // Redirecciones condicionales
        if (privateRoutes.some(route => currentPath.startsWith(route)) && !locals.domicile) {
            return redirect("/domicile/");
        }

        if (privateRoutes.some(route => currentPath.startsWith(route)) && locals.domicile) {
            return next();
        }

        if (publicRoutes.some(route => currentPath.startsWith(route)) && locals.domicile) {
            return redirect("/");
        }

        return next();
    }
)