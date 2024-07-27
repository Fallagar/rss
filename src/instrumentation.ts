import axios from "axios";
const { NEXT_SERVER_URL, UPDATE_DB_INTERVAL } = process.env;
const timeout = UPDATE_DB_INTERVAL || 300000;

export function register() {
    setInterval(async () => {
        try {
            console.log(123);
            await axios.get(`${NEXT_SERVER_URL}/api/fetch-rss`);
        } catch (error: any) {
            console.log(error?.message);
        }
    }, Number(timeout));
}
