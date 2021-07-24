
    fetch(
        'https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&appid=b9a648eb4d4c892d016c255f23ad0fb7'
      )
        .then(function(response) {
            
          return response.json();
        })
        .then(function(data){
console.log(data);


        })
