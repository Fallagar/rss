const axios = require("axios");

axios
    .get("http://localhost:3000/api/start-cron")
    .then((response) => {
        console.log("Cron job started:", response.data);
    })
    .catch((error) => {
        console.error("Error starting cron job:", error);
    });
