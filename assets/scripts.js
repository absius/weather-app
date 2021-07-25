var zip = "";
var city = "";
var state = "";
var geocode = {
  lat: 0,
  lon: 0,
  city: "",
};

function saveToHistory(data) {
  var historyDiv = document.getElementById("history");

  var storageArray = JSON.parse(localStorage.getItem("history"));
  if (!storageArray) {
    storageArray = [];
  }
  var inHistory = false;
  for (i = 0; i < storageArray.length; i++) {
    if (
      storageArray[i].lat === geocode.lat &&
      storageArray[i].lon === geocode.lon
    ) {
      inHistory = true;
    }
  }
  if (!inHistory) {
    var button = document.createElement("button");
    button.innerHTML = city.toUpperCase();
    button.setAttribute("data-lon", geocode.lon);
    button.setAttribute("data-lat", geocode.lat);
    button.id = geocode.city;
    button.setAttribute(
      "onclick",
      "getWeatherfromHistory(" +
        geocode.lon +
        "," +
        geocode.lat +
        ",'" +
        geocode.city +
        "')"
    );
    historyDiv.appendChild(button);
    storageArray.push(geocode);
    localStorage.setItem("history", JSON.stringify(storageArray));
  }
}

function makeHistory() {
  var historyDiv = document.getElementById("history");
  historyDiv.innerHTML = "";

  var storageArray = JSON.parse(localStorage.getItem("history"));
  if (!storageArray) {
    storageArray = [];
  }

  for (i = 0; i < storageArray.length; i++) {
    var button = document.createElement("button");
    button.innerHTML = storageArray[i].city.toUpperCase();
    button.setAttribute("data-lon", storageArray[i].lon);
    button.setAttribute("data-lat", storageArray[i].lat);
    button.id = storageArray[i].city;
    button.setAttribute(
      "onclick",
      "getWeatherfromHistory(" +
        storageArray[i].lon +
        "," +
        storageArray[i].lat +
        ",'" +
        storageArray[i].city +
        "')"
    );
    historyDiv.appendChild(button);
  }
}

function getWeatherfromHistory(lon, lat, city) {
  geocode.lat = lat;
  geocode.lon = lon;
  var button = document.getElementById(city);
  geocode.city = button.id;
  getWeather(geocode);
}

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
      saveToHistory(data);
      var infoDiv = document.getElementById("city-info");
      var loc = document.createElement("h1");
      loc.innerHTML =
        geocode.city.toUpperCase() + " </br>" + moment().format("MM/DD/YYYY");
      var temp = document.createElement("div");
      temp.innerHTML = "Temp: " + data.current.temp + " " + "&#176;F";
      var wind = document.createElement("div");
      wind.innerHTML = "Wind: " + data.current.wind_speed + " mph";
      var hum = document.createElement("div");
      hum.innerHTML = "Humidity: " + data.current.humidity + "%";
      var uvi = document.createElement("div");
      if (data.current.uvi < 3) {
        uvi.classList.add("favor");
      } else if (data.current.uvi >= 3 && data.current.uvi < 8) {
        uvi.classList.add("mod");
      } else {
        uvi.classList.add("severe");
      }
      uvi.innerHTML = "UV Index: " + data.current.uvi;
      var icon = document.createElement("img");
      icon.src =
        "http://openweathermap.org/img/wn/" +
        data.current.weather[0].icon +
        "@2x.png";
      icon.alt = "weather_icon";
      infoDiv.innerHTML = "";
      infoDiv.appendChild(loc);
      infoDiv.appendChild(icon);
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
      geocode.city = city;
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
      geocode.city = data.name;
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
    if (daily[i + 1].uvi < 3) {
      uvi.classList.add("favor");
    } else if (daily[i + 1].uvi >= 3 && daily[i + 1].uvi < 8) {
      uvi.classList.add("mod");
    } else {
      uvi.classList.add("severe");
    }

    var icon = document.createElement("img");
    icon.src =
      "http://openweathermap.org/img/wn/" +
      daily[i + 1].weather[0].icon +
      "@2x.png";
    icon.alt = "weather_icon";
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

makeHistory();
