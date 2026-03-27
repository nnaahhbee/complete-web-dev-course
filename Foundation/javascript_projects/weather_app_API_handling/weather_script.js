document.addEventListener('DOMContentLoaded', () => {
  const cityInput = document.getElementById("city-input");
  const getWeatherBtn = document.getElementById("get-weather-btn");
  const weatherInfo = document.getElementById("weather-info");
  const cityNameDisplay = document.getElementById("city-name");
  const temperatureDisplay = document.getElementById("temperature");
  const descriptionDisplay = document.getElementById("description");
  const errorMessage = document.getElementById("error-message");

  const API_KEY = "165983d744c341b36a32b369f00e4ec0";

    getWeatherBtn.addEventListener("click", async () => {
        const city = cityInput.value.trim();
        if(!city) return;

        try{
        const data =  await fetchWeatherData(city)
        displayWeatherData(data);

        } catch(error){
          showError();  
        }

    });

   async function fetchWeatherData(city){
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

    const response = await fetch(url);
    console.log(typeof response);
    console.log("RESPONSE", response);

    if(!response.ok){
      throw new Error("City not found");
    }

    const data = await response.json();
    return data;
   }

    function displayWeatherData(data){
      console.log(data);
      const {name, main, weather} = data;
      cityNameDisplay.textContent = name;
      temperatureDisplay.textContent = `Temperature: ${main.temp}`;
      descriptionDisplay.textContent = `Weather: ${weather[0].description}`

      //remove hidden class
      weatherInfo.classList.remove('hidden');
      errorMessage.classList.add('hidden');

    }

    function showError(){
      weatherInfo.classList.remove('hidden');
      errorMessage.classList.add('hidden');
    }
});