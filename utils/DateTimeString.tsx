export const DateTimeStringFormat = (dateString: Date) => {

    const date = new Date(dateString);

    if (date.toISOString() === "0001-01-01T03:06:28.000Z") {

        return "00:00";
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2,"0");
    const year = date.getFullYear().toString();
    const hour = date.getHours().toString().padStart(2,"0");
    const minutes = date.getMinutes().toString().padStart(2,"0");

    return `${hour}:${minutes}` 

}