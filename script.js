function getCitiesFromStorage(){
    const cities=localStorage.getItem("cities");
    return cities ? JSON.parse(cities) : [];
}

function saveCitiesToStorage(cities){
    localStorage.setItem("cities", JSON.stringify(cities));
}
const sugg = document.getElementById("suggestions");
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("weatherForm");
    const cityInput = document.getElementById("cityInput");
    const weatherInfo = document.getElementById("weatherInfo");
    const cityName = document.getElementById("cityName");
    const temperature = document.getElementById("temperature");
    const description = document.getElementById("description");
    const wind = document.getElementById("wind_spead");
    const pressure = document.getElementById("pressure");
   
   
    const apiKey = "06c95b403344d9c03709bed5b2179ac9"; 
    const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

 

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let city = cityInput.value.trim().toLowerCase();      

        if (!city) return;        
        city=city.charAt(0).toUpperCase() + city.slice(1);
        try {
            const response = await fetch(`${apiUrl}?q=${city}&lang=ru&units=metric&appid=${apiKey}`);          
            if (!response.ok) throw new Error("City not found");

            const data = await response.json();
            console.log(data);
       
            cityName.textContent = `Погода в городе ${data.name}`;
            temperature.textContent = `Температура: ${data.main.temp}°C`;
            description.textContent = `Cостояние: ${data.weather[0].description}`;
            wind.textContent= `Скорость ветра: ${data.wind.speed} м/с`;
            let res=Math.floor(data.main.pressure*0.75006);
            pressure.textContent= `Давление: ${res} мм рт.ст.`;
            updateBackground(data.weather[0].main);
            weatherInfo.classList.remove("hidden");

            let cities=getCitiesFromStorage();
            if(!cities.includes(city)){
                cities.push(city);
                saveCitiesToStorage(cities);
            }
        } catch (error) {
            alert("Ошибка: " + error.message);
        }
        cityInput.value="";
        function updateBackground(condition) {
            let imageUrl;
            switch (condition.toLowerCase()) {
                case "clear":
                    imageUrl = "sunny.jpg";
                    break;
                case "clouds":
                    imageUrl = "clouds.jpg";
                    break;
                case "rain":
                    imageUrl = "rainy.jpg";
                    break;
                case "snow":
                    imageUrl = "snowy.jpg";
                    break;
                default:
                    imageUrl = "default.jpg";
            }
          
            document.querySelector(".background").style.backgroundImage = `url('images/${imageUrl}')`;
        }; 
   
    })



});

 

  function showSuggestions(matches) {
            sugg.innerHTML = ''; 
            if (matches.length > 0) {
                sugg.classList.remove('hidden');
                matches.forEach(city => {
                    const div = document.createElement('div');
                    div.classList.add('suggestion-item');
                    div.textContent = city;
                    div.addEventListener('click', () => {
                        cityInput.value = city;
                        sugg.classList.add('hidden');
                        // form.dispatchEvent(new Event('submit'));
                    });
                    sugg.appendChild(div);
                });
            } else {
                sugg.classList.add('hidden');
            }
        };
    

        cityInput.addEventListener("input", () => {
          
            const searchTerm = cityInput.value.trim().toLowerCase();
            if(searchTerm.length>0){
                const cities = getCitiesFromStorage();
                console.log(cities);
                const matchingCities = cities.filter(city => city.toLowerCase().startsWith(searchTerm)).sort();
                showSuggestions(matchingCities);
            }else{
                sugg.classList.add('hidden');
            }
           
        });
        cityInput.addEventListener("focus", () => {
            if(!weatherInfo.classList.contains("hidden"))
            weatherInfo.classList.add("hidden");
        });