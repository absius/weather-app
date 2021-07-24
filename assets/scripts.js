var zip = "";
var city = "";
var state = "";
var geocode = {
  lat: 0,
  lon: 0,
};

function getWeather(geocode) {
  fetch(
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      geocode.lat +
      "&lon=" +
      geocode.lon +
      "&units=imperial&appid=b9a648eb4d4c892d016c255f23ad0fb7"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var historyDiv = document.getElementById("history");
      var button = document.createElement("button");
      button.innerHTML = city.toUpperCase();
      historyDiv.appendChild(button);
      var infoDiv = document.getElementById("city-info");
      var loc = document.createElement("h1");
      loc.innerHTML = city.toUpperCase();
      var temp = document.createElement("div");
      temp.innerHTML = "Temp: " + data.current.temp + " " + "&#176;F";
      var wind = document.createElement("div");
      wind.innerHTML = "Wind: " + data.current.wind_speed + " mph";
      var hum = document.createElement("div");
      hum.innerHTML = "Humidity: " + data.current.humidity + "%";
      var uvi = document.createElement("div");
      uvi.innerHTML = "UV Index: " + data.current.uvi;
      infoDiv.innerHTML = "";
      infoDiv.appendChild(loc);
      infoDiv.appendChild(temp);
      infoDiv.appendChild(wind);
      infoDiv.appendChild(hum);
      infoDiv.appendChild(uvi);
    });
}

function getLocationCityState(city, state, callback) {
  fetch(
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
      city +
      "," +
      state +
      ",US&appid=b9a648eb4d4c892d016c255f23ad0fb7"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      geocode.lat = data[0].lat;
      geocode.lon = data[0].lon;
      callback(geocode);
    });
}

function getLocationZip(zip, callback) {
  fetch(
    "http://api.openweathermap.org/geo/1.0/zip?zip=" +
      zip +
      ",US&appid=b9a648eb4d4c892d016c255f23ad0fb7"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      geocode.lat = data.lat;
      geocode.lon = data.lon;
      city = data.name;
      callback(geocode);
    });
}

function getWeatherbyLocation() {
  city = "";
  state = "";
  var input = document.getElementById("location").value;
  if (!isNaN(input)) {
    zip = input;
    getLocationZip(zip, function (results) {
      getWeather(results);
    });
  } else {
    var locArr = input.split(",");
    city = locArr[0].trim();
    state = locArr[1].trim();
    getLocationCityState(city, state, function (results) {
      getWeather(results);
    });
  }
}
