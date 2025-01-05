const apiKey = '322030cc761c9ba78b186bb3eb6321fb';
const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';

async function fetchWeather() {
  const location = document.getElementById('search-location').value;
  if (!location) {
    alert('Please enter a location');
    return;
  }

  try {
    const response = await fetch(`${apiUrl}?q=${location}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    if (data.cod === '200') {
      updateWeatherInfo(data);
    } else {
      alert('Location not found');
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    alert('Failed to fetch weather data');
  }
}

function updateWeatherInfo(data) {
  const { city, list } = data;
  document.getElementById('location').textContent = city.name;

  const currentWeather = list[0];
  document.getElementById('temperature').textContent = `${currentWeather.main.temp}°C`;
  document.getElementById('weatherType').textContent = currentWeather.weather[0].description;
  document.getElementById('highLow').textContent = `High: ${currentWeather.main.temp_max}°C Low: ${currentWeather.main.temp_min}°C`;
  document.getElementById('windHumid').textContent = `Wind: ${currentWeather.wind.speed} km/h Humidity: ${currentWeather.main.humidity}%`;

  const timeSlots = {
    '3am': getWeatherForTime(list, '03:00:00'),
    '6am': getWeatherForTime(list, '06:00:00'),
    '9am': getWeatherForTime(list, '09:00:00'),
    '12pm': getWeatherForTime(list, '12:00:00'),
    '3pm': getWeatherForTime(list, '15:00:00'),
    '6pm': getWeatherForTime(list, '18:00:00'),
    '9pm': getWeatherForTime(list, '21:00:00'),
  };

  updateBox('box1', '3am', timeSlots['3am']);
  updateBox('box2', '6am', timeSlots['6am']);
  updateBox('box3', '9am', timeSlots['9am']);
  updateBox('box4', '12pm', timeSlots['12pm']);
  updateBox('box5', '3pm', timeSlots['3pm']);
  updateBox('box6', '6pm', timeSlots['6pm']);
  updateBox('box7', '9pm', timeSlots['9pm']);
}

function updateBox(boxId, timeLabel, weather) {
  document.getElementById(boxId).innerHTML = `
    <p class="extraBold">${timeLabel}</p>
    <p>${weather.main.temp}°C</p>
    <p>${weather.weather[0].description}</p>
    <p>${weather.wind.speed} km/h</p>
    <p>${weather.main.humidity}%</p>
    
  `  ;
  

}

function getWeatherForTime(list, time) {
  return list.find(item => item.dt_txt.includes(time));
}

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  fetchWeather();
});
