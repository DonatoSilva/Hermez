export const toJSON = (formData: FormData) => {
    const obj: Record<string, any> = {};
    for (const [k, v] of formData.entries()) {
        obj[k] = v;
    }
    if (obj.isFavorite !== undefined) {
        const val = obj.isFavorite;
        obj.isFavorite = val === true || val === 'true' || val === 'on' || val === '1';
    }
    return obj;
};