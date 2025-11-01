import { handleOrganizationSelect } from "./organizationManager.js"

document.addEventListener("astro:page-load", () => {
    // Solo ejecuta si la URL tiene el queryParam "org"
    const url = new URL(window.location.href)
    if (url.searchParams.has("org")) {
        const orgId = document.documentElement.getAttribute("data-org-id")
        if (orgId) {
            handleOrganizationSelect(orgId)
        }
    }
})
