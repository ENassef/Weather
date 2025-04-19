/*
 * Global Vars
 */

const weatherHtml = document.querySelector("#weather-row");
const searchInput = document.querySelector("#search");
const searchBtn = document.querySelector("#searchbtn");
const content = document.querySelector("#content");
const weatherBackgrounds = {
    Clear: "url(../../assets/videos/clear.gif)",
    Cloudy: "url(../../assets/videos/cloudy.gif)",
    Rain: "url(../../assets/videos/rain.gif)",
    Snow: "url(../../assets/videos/snow.gif)",
    Thunderstorm: "url(../../assets/videos/thunderstorm.gif)",
    Fog: "url(../../assets/videos/fog.gif)",
    Mist: "url(../../assets/videos/mist.gif)",
    Overcast: "url(../../assets/videos/overcast.gif)",
    default: "url(../../assets/images/banner.png)",
};

let apiKey = "a1c77ba7a1894494a91163636251604";

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

// geting date

const day = new Date().getDate();
const today = new Date().getDay();
const month = new Date().getMonth();

// geting location
(function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const cord = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };

                weatherData(apiKey, cord);
            },
            (error) => {
                console.error("Geolocation error:", error);
                weatherData(apiKey, "cairo"); // Fallback to default location
            }
        );
    } else {
        console.warn("Geolocation not supported");
        weatherData(apiKey, "cairo"); // Fallback to default location
    }
})();

// change the background
function updateBackground(conditionText) {
    const condition = conditionText.toLowerCase();
    let backgroundKey;

    switch (true) {
        case condition.includes("clear"):
        case condition.includes("sunny"):
            backgroundKey = "Clear"; // Assign Clear background
            break;
        case condition.includes("cloud"):
            backgroundKey = "Cloudy"; // Assign Cloudy background
            break;
        case condition.includes("rain"):
        case condition.includes("shower"):
            backgroundKey = "Rain"; // Assign Rain background
            break;
        case condition.includes("snow"):
            backgroundKey = "Snow"; // Assign Snow background
            break;
        case condition.includes("thunder"):
        case condition.includes("storm"):
            backgroundKey = "Thunderstorm"; // Assign Thunderstorm background
            break;
        case condition.includes("fog"):
            backgroundKey = "Fog"; // Assign Fog background
        case condition.includes("mist"):
            backgroundKey = "Mist"; // Assign Fog background
            break;
        case condition.includes("overcast"):
            backgroundKey = "Overcast"; // Assign Overcast background
            break;
        default:
            backgroundKey = "default"; // Assign default background
            break;
    }

    content.style.backgroundImage = weatherBackgrounds[backgroundKey];
    // console.log(weatherBackgrounds[backgroundKey]);
}

async function weatherData(key, searchValue) {
    let cartnoa = "";
    let apiUrl;

    if (
        typeof searchValue === "object" &&
        searchValue.latitude &&
        searchValue.longitude
    ) {
        apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${searchValue.latitude},${searchValue.longitude}&days=3`;
    } else {
        searchValue = searchValue || "cairo";
        apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${searchValue}&days=3`;
    }

    try {
        let dataRequest = await fetch(apiUrl);

        if (!dataRequest.ok) {
            throw new Error(`HTTP error! status: ${dataRequest.status}`);
        }

        let data = await dataRequest.json();

        if (!data.forecast || !data.forecast.forecastday) {
            throw new Error("Invalid data structure from API");
        }

        let forecastDays = data.forecast.forecastday;

        for (let i = 0; i < forecastDays.length; i++) {
            cartnoa += `
                <div class="col-lg-4 ps-0 pe-0 rounded">
                    <div class="title d-flex p-2 justify-content-between ps-3 pe-3">
                        <span>${days[(today + i) % 7]}</span>
                        <span>${day + i} ${months[month]}</span>
                    </div>
                    <div class="inner">
                        <p class="fs-4">${data.location.name}</p>
                        <div id="heat">
                            <p class="deg">${i == 0
                    ? data.current.temp_c
                    : forecastDays[i].day.maxtemp_c
                } <sup>o</sup> C</p>
                            <img src='${forecastDays[i].day.condition.icon
                }' alt="">
                        </div>
                        <p id="weather-status" class="text-primary fs-5 mt-2">${forecastDays[i].day.condition.text
                }</p>
                        <div class='d-flex'>
                            <span class="pe-2 me-3 d-flex align-items-center gap-2">
                                <img src="assets/images/icon-umberella.png" alt="">
                                ${forecastDays[i].day.daily_chance_of_rain}%
                            </span>
                            <span class="pe-2 me-3 d-flex align-items-center gap-2">
                                <img src="assets/images/icon-wind.png" alt="">
                                ${forecastDays[i].day.maxwind_kph}km/h
                            </span>
                            <span class="pe-2 me-3 d-flex align-items-center gap-2">
                                <img src="assets/images/icon-compass.png" alt="">
                                ${data.current.wind_dir}
                            </span>
                        </div>
                    </div>
                </div>
            `;
            if (i == 0) {
                updateBackground(forecastDays[i].day.condition.text);
            }
        }

        weatherHtml.innerHTML = cartnoa;
        return forecastDays;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        // weatherHtml.innerHTML = `<div class="col-12 text-center">Failed to load weather data. Please try again.</div>`;
        throw error;
    }
}

weatherData(apiKey)
    .then((data) => {
        console.log("Weather data received:", data);
    })
    .catch((error) => {
        console.error("Failed to get weather data:", error);
    });

searchInput.addEventListener("input", function () {
    weatherData(apiKey, searchInput.value)
        .then((data) => {
            console.log("Weather data received:", data);
        })
        .catch((error) => {
            console.error("Failed to get weather data:", error);
        });
});

searchBtn.addEventListener("click", function () {
    weatherData(apiKey, searchInput.value)
        .then((data) => {
            console.log("Weather data received:", data);
        })
        .catch((error) => {
            console.error("Failed to get weather data:", error);
        });
});
