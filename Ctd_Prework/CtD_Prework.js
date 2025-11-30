import { fetchWeatherApi } from "openmeteo";

function requestWeather(){
    console.log("It's hot!")
    
}

const params = {
  latitude: 52.52,
  longitude: 13.41,
  hourly: "temperature_2m",
  current: ["temperature_2m", "rain"],
};

const url = "https://api.open-meteo.com/v1/forecast";
const responses = await fetchWeatherApi(url, params);

// Process first location. Add a for-loop for multiple locations or weather models
const response = responses[0];

// Attributes for timezone and location
const latitude = response.latitude();
const longitude = response.longitude();
const elevation = response.elevation();
const utcOffsetSeconds = response.utcOffsetSeconds();

console.log(
  `\nCoordinates: ${latitude}°N ${longitude}°E`,
  `\nElevation: ${elevation}m asl`,
  `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`
);

const current = response.current();
const hourly = response.hourly();

// Note: The order of weather variables in the URL query and the indices below need to match!
const weatherData = {
  current: {
    time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
    temperature_2m: current.variables(0).value(),
    rain: current.variables(1).value(),
  },
  hourly: {
    time: Array.from(
      {
        length:
          (Number(hourly.timeEnd()) - Number(hourly.time())) /
          hourly.interval(),
      },
      (_, i) =>
        new Date(
          (Number(hourly.time()) +
            i * hourly.interval() +
            utcOffsetSeconds) *
            1000
        )
    ),
    temperature_2m: hourly.variables(0).valuesArray(),
  },
};

// The 'weatherData' object now contains a simple structure, with arrays of datetimes and weather information
console.log(
  `\nCurrent time: ${weatherData.current.time}\n`,
  `\nCurrent temperature_2m: ${weatherData.current.temperature_2m}`,
  `\nCurrent rain: ${weatherData.current.rain}`
);

console.log("\nHourly data:\n", weatherData.hourly);
