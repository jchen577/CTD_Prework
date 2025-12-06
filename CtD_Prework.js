let weatherData;
let params;
let lat = 37.7749; //Default to San Francisco coordinates
let long = -122.4194;
let setLoc = false;

async function getLocation() {
  //Get current location of user
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        lat = position.coords.latitude;
        long = position.coords.longitude;
        setLoc = true;
        resolve(position);
      },
      (error) => {
        console.error("No location found", error);
        resolve(error);
      },
    );
  });
}

async function requestWeather() {
  await getLocation(); //Using user's location, call upon the meteo API
  params = {
    latitude: lat,
    longitude: long,
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
  //console.log("Raw API Data: ", data);

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
  //console.log("Formatted weatherData:", weatherData);
  return weatherData;
}

async function returnCurrentTemp() {
  //Change the output of the temperature page
  await requestWeather();
  setThermometerHeight(
    (((weatherData.current.temperature_2m * 9) / 5 + 32).toFixed(2) / 100) *
      190,
  );
  if (setLoc) {
    document.getElementById("tempOutput").textContent =
      "The temperature near you is : " +
      weatherData.current.temperature_2m +
      "°C" +
      " or : " +
      ((weatherData.current.temperature_2m * 9) / 5 + 32).toFixed(2) +
      "°F";
  } else {
    document.getElementById("tempOutput").textContent =
      "The temperature at San Francisco is : " +
      weatherData.current.temperature_2m +
      "°C" +
      " or : " +
      ((weatherData.current.temperature_2m * 9) / 5 + 32).toFixed(2) +
      "°F";
  }
}

async function returnCurrentConditions() {
  //Change the otput of the conditions page
  await requestWeather();
  let rain = "not";
  let snow = "not";
  if (weatherData.current.rain == true) {
    rain = "";
  }
  if (weatherData.current.snow == true) {
    snow = "";
  }
  if (setLoc) {
    document.getElementById("conditionsOutput").textContent =
      "It is currently " +
      rain +
      " raining and it is " +
      snow +
      " snowing near you!";
  } else {
    document.getElementById("conditionsOutput").textContent =
      "It is currently " +
      rain +
      " raining and it is " +
      snow +
      " snowing in San Francisco!";
  }
}

function returnCurrentLoc() {
  document.getElementById("outputLoc").textContent =
    "The weather in your area of {Latitude: " +
    params.latitude +
    " Longitude: " +
    params.longitude +
    "}";
}

function setThermometerHeight(px) {
  document.getElementById("thermometer").style.height =
    String(Math.floor(px)) + "px";
}
