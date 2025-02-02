export function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

export const isEmpty = (input, alertText) => {
    if (!input.value.trim()) {
        input.focus();
        alert(alertText);
        return false;
    }

    return true;
};