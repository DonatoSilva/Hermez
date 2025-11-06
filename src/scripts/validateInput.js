export function validateEmail(email) {
    const re = /\S+@\S+\.\S+/
    return re.test(email)
}

export const validateInput = (input, alertText) => {
    if (!isEmpty(input, alertText)) return

    if (input.type === "number") {
        if (!isNumber(input)) return
    }

    if (input.type === "tel") {
        if (!isPhoneNumber(input)) return
    }

    return true
}


export const isEmpty = (input) => {
    if (!input.value.trim()) {
        input.focus()
        return false
    }

    return true
}

export const isNumber = (input) => {
    const re = /^\d+$/
    if (re.test(input)) {
        input.focus()
        return false
    }

    return true
}


export const isPhoneNumber = (phoneNumber) => {
    if (phoneNumber.value.trim().length !== 10) {
        phoneNumber.focus()
        alert("El número de celular debe tener 10 dígitos")
        return false
    }

    return true
}


