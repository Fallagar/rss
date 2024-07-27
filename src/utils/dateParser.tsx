import { isValid, format } from "date-fns";

export default function dateParser(inputString: string): string | null {
    const formatString = "dd:MM:yyyy HH:mm";
    const date = new Date(inputString);
    if (!isValid(date)) {
        return null;
    }

    return format(date, formatString);
}
