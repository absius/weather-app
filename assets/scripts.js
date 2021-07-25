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
      loc.innerHTML = city.toUpperCase() + " " + moment().format("MM/DD/YYYY");
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
      getForecast(data.daily);
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

function getForecast(daily) {
  var cardDiv = document.getElementById("forecast");
  var h2 = document.createElement("h2");
  h2.innerHTML = "5 Day Forecast";

  cardDiv.innerHTML = "";
  cardDiv.appendChild(h2);
  var date = moment().format("MM/DD/YYYY");
  for (var i = 0; i < 5; i++) {
    var card = document.createElement("div");
    card.id = "card" + i;
    card.classList.add("card");
    var cardBody = document.createElement("div");
    var img = document.createElement("img");
    img.classList.add("card-img-top");
    cardBody.classList.add("card-body");
    var title = document.createElement("h5");
    title.classList.add("card-title");
    title.innerHTML = moment()
      .add(i + 1, "days")
      .format("MM/DD/YYYY");
    var temp = document.createElement("p");
    temp.classList.add("card-text");
    temp.innerHTML = "Temp: " + daily[i + 1].temp.day + " " + "&#176;F";
    var wind = document.createElement("p");
    wind.classList.add("card-text");
    wind.innerHTML = "Wind: " + daily[i + 1].wind_speed + " mph";
    var hum = document.createElement("p");
    hum.classList.add("card-text");
    hum.innerHTML = "Humidity: " + daily[i + 1].humidity + "%";
    var uvi = document.createElement("p");
    uvi.classList.add("card-text");
    var icon = document.createElement("img");
    icon.src =
      "http://openweathermap.org/img/wn/" +
      daily[i + 1].weather[0].icon +
      "@2x.png";
    uvi.innerHTML = "UV Index: " + daily[i + 1].uvi;
    cardBody.appendChild(title);
    cardBody.appendChild(icon);
    cardBody.appendChild(temp);
    cardBody.appendChild(wind);
    cardBody.appendChild(hum);
    cardBody.appendChild(uvi);
    card.appendChild(cardBody);
    card.appendChild(img);
    cardDiv.appendChild(card);
  }
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
