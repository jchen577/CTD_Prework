let weatherData;
let params;

async function requestWeather() {
  params = {
    latitude: 52.52,
    longitude: 13.41,
    hourly: "temperature_2m",
    current: ["temperature_2m", "rain", "showers", "snowfall", "precipitation"],
  };

  const url =
    `https://api.open-meteo.com/v1/forecast?` +
    new URLSearchParams({
      latitude: params.latitude,
      longitude: params.longitude,
      hourly: params.hourly,
      current: params.current.join(","),
    });

  const response = await fetch(url);
  const data = await response.json();
  console.log("Raw API Data: ", data);

  weatherData = {
    current: {
      time: data.current.time,
      temperature_2m: data.current.temperature_2m,
      rain: data.current.rain,
      showers: data.current.showers,
      snowfall: data.current.snowfall,
      precipitation: data.current.precipitation,
    },
    hourly: {
      time: data.hourly.time,
      temperature_2m: data.hourly.temperature_2m,
    },
  };
  console.log("Formatted weatherData:", weatherData);
  return weatherData;
}

function returnLat() {
  document.getElementById("outputLat").textContent =
    "Latitude: " + params.latitude;
}
