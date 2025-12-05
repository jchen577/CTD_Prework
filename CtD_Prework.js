let weatherData;
let params;
let lat;
let long;

async function getLocation(){//Get current location of user
  return new Promise((resolve,reject)=>{
    navigator.geolocation.getCurrentPosition(
      (position) =>{
        lat = position.coords.latitude;
        long = position.coords.longitude;
        resolve(position);
      },
      (error) =>{
        console.error("No location found",error);
        reject(error);
      }
    ); 
  });
}

async function requestWeather() {
  await getLocation();//Using user's location, call upon the meteo API
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

async function returnCurrentTemp(){
  await requestWeather()
  document.getElementById("tempOutput").textContent =
    "The temparture is: " + weatherData.current.temperature_2m + "°C";
}

async function returnCurrentConditions(){
  await requestWeather()
  let rain = "not"
  let snow = "not"
  if(weatherData.current.rain == true){
    rain = ""
  }
  if(weatherData.current.snow == true){
    snow = ""
  }
  document.getElementById("conditionsOutput").textContent =
    "It is currently " + rain + " raining!\nAnd it is " + snow + " snowing!";
}

function returnCurrentLoc() {
  document.getElementById("outputLoc").textContent =
    "The weather in your area of {Latitude: " + params.latitude+ " Longitude: " + params.longitude + "}";
}
