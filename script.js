const myApiKey = process.env.MY_API_KEY;
const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;

window.addEventListener('DOMContentLoaded', () => {
	// Optional: Clear only if data is outdated
	const storedData = JSON.parse(localStorage.getItem('userInfo'));
	if (storedData && isDataExpired(storedData.timestamp)) {
		localStorage.clear();
	}
});

// GET DOM ELEMENTS
const userInput = document.getElementById('userInput');
const loader = document.getElementById('load');
const weatherForm = document.getElementById('weatherForm');

// Get user input
async function getWeatherData(input) {
	loader.style.display = 'flex';

	const storedData = JSON.parse(localStorage.getItem('userInfo'));

	// 🔍 Check if stored data is still fresh (10 minutes)
	if (
		storedData &&
		storedData.city.toLowerCase() === input.toLowerCase() &&
		!isDataExpired(storedData.timestamp)
	) {
		console.log('Using cached weather data (still fresh).');
		loader.style.display = 'none';
		return displayWeatherInfo();
	}

	// 🌤 Fetch new weather data
	const weatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${myApiKey}&units=metric`;

	try {
		const response = await fetch(weatherEndpoint);
		if (!response.ok) throw new Error('City not found or API error');

		const data = await response.json();
		const weatherData = data.weather[0];
		const mainData = data.main;
		const windData = data.wind;
		const iconCode = data.weather[0].icon;
		const query = weatherData.description;

		const imageUrl = await fetchImage(query);

		const userInfo = {
			city: input,
			temperature: mainData.temp,
			miniTemp: mainData.feels_like,
			weather: weatherData.main,
			description: weatherData.description,
			wind: windData.speed,
			humidity: mainData.humidity,
			icon: iconCode,
			timestamp: Date.now(), // Store the time when data was fetched
		};

		// 💾 Save new weather data
		localStorage.setItem('userInfo', JSON.stringify(userInfo));
		loader.style.display = 'none';

		displayWeatherInfo();
	} catch (error) {
		loader.style.display = 'none';
		console.log('Error fetching data:', error);
		alert(
			'Error fetching weather data. Please check your connection or try again.'
		);
	}
}

// Get image for background display
async function fetchImage(query) {
	const cachedImage = JSON.parse(localStorage.getItem('bgImage'));

	if (cachedImage && cachedImage.query === query) {
		console.log('Using cached image.');
		return cachedImage.imageUrl;
	}

	const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${query}&client_id=${UNSPLASH_ACCESS_KEY}`;
	try {
		const response = await fetch(url);
		const data = await response.json();
		const imageUrl = data.urls.regular;

		// Save new image with query
		localStorage.setItem('bgImage', JSON.stringify({ query, imageUrl }));
		return imageUrl;
	} catch (error) {
		console.error('Error fetching image:', error);
		return null;
	}
}

// 🕒 Function to check if data is expired (older than 10 minutes)
function isDataExpired(timestamp) {
	const TEN_MINUTES = 10 * 60 * 1000;
	return Date.now() - timestamp > TEN_MINUTES;
}

//  Display The weather Info
function displayWeatherInfo() {
	const userInfo = JSON.parse(localStorage.getItem('userInfo'));
	const bgImage = JSON.parse(localStorage.getItem('bgImage'));

	if (!userInfo) return;

	weatherForm.style.display = 'none';
	document.getElementById('overlay').classList.add('active');

	// Create close button (Material Symbols)
	const closeBtn = document.createElement('span');
	closeBtn.className = 'material-symbols-outlined close-btn';
	closeBtn.textContent = 'close';
	document.body.appendChild(closeBtn);

	// Close button functionality
	closeBtn.addEventListener('click', () => {
		weatherCard.remove();
		document.getElementById('overlay').classList.remove('active');
		weatherForm.style.display = 'block'; // Show the form again
		userInput.value = '';
		closeBtn.remove(); // Remove the close button
	});

	// Creating the weather card
	const weatherCard = document.createElement('div');
	weatherCard.className = 'weathercard';
	weatherCard.id = 'weatherCard';

	weatherCard.innerHTML = `
        <img src="" alt="" id="weathericon">
        <div class="image">
            <img id="weather-img" src="${
							bgImage ? bgImage.imageUrl : ''
						}" alt="">
        </div>
        <div class="weather-info">
            <div class="info-left">
                <div class="city">
                    <label class="title" for="city">City</label>
                    <h2 class="cityname" id="cityName">${userInfo.city}</h2>
                </div>
                <div class="temperature">
                    <label class="title" for="temperature">Temperature</label>
                    <p class="temp" id="temp">
                        ${userInfo.temperature}℃ 
                        <label class="title" for="mini-temp">Feels like</label>
                        <span class="mini-info" id="feelsLike">${
													userInfo.miniTemp
												}℃</span>
                    </p>
                </div>
                <div class="weather">
                    <label class="title" for="weather">Weather</label>
                    <p id="weather">
                        ${userInfo.weather}
                        <span class="mini-info" id="description">${
													userInfo.description
												}</span>
                    </p>
                </div>
            </div>
            <div class="info-right">
                <label class="title" for="wind">Wind Speed</label>
                <p id="wind">${userInfo.wind}m/s</p>
                <label class="title" for="Humidity">Humidity</label>
                <p id="humidity">${userInfo.humidity}%</p>
            </div>
        </div>`;

	document.body.appendChild(weatherCard);
	document.getElementById(
		'weathericon'
	).src = `https://openweathermap.org/img/wn/${userInfo.icon}@2x.png`;
}

function getUserCity() {
	const city = userInput.value.trim();
	if (!city) {
		alert('Please enter a city name');
		return;
	}
	getWeatherData(city);
}

weatherForm.addEventListener('submit', (e) => {
	e.preventDefault();
	getUserCity();
});
