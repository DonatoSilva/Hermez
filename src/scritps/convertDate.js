export function convertDate(date) {
    // 1. Separamos por coma para eliminar el día de la semana.
    const parts = date.split(",");
    if (parts.length < 2) {
        throw new Error("Formato de fecha incorrecto");
    }

    const datePart = parts[1].trim(); // "14 de febrero de 2025"

    // 2. Separamos la parte de la fecha por espacios.
    const dateParts = datePart.split(" ");
    // Se espera: [ "14", "de", "febrero", "de", "2025" ]
    if (dateParts.length < 5) {
        throw new Error("Formato de fecha inesperado");
    }

    const day = dateParts[0];
    const monthName = dateParts[2].toLowerCase();
    const year = dateParts[4];

    // 3. Mapeamos el nombre del mes a número.
    const months = {
        enero: "01",
        febrero: "02",
        marzo: "03",
        abril: "04",
        mayo: "05",
        junio: "06",
        julio: "07",
        agosto: "08",
        septiembre: "09",
        octubre: "10",
        noviembre: "11",
        diciembre: "12",
    };

    const month = months[monthName];
    if (!month) {
        throw new Error("Mes no reconocido: " + monthName);
    }

    // 4. Formateamos el día con dos dígitos.
    const formattedDay = day.padStart(2, "0");

    // 5. Componemos la fecha en formato YYYY-MM-DD.
    const formattedDate = `${year}-${month}-${formattedDay}`;

    return formattedDate;
}

export const createDateCorrect = (fechaValue) => {
    const offsetMinutos = new Date().getTimezoneOffset();

    const [year, month, day] = fechaValue.split("-").map(Number);

    const fecha = new Date(year, month - 1, day, 12, 0, 0);

    fecha.setMinutes(fecha.getMinutes() - offsetMinutos);

    return fecha;
};