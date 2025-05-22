import React from 'react';
import { useState } from 'react';
import { FaArrowRight, FaWind } from 'react-icons/fa6';
import './Home.css';
import axios from 'axios';

const Sidebar = ({ weatherData, forecastData, setCoordinates }) => {
	const [userInput, setUserInput] = useState('');
	const windDirectionMap = {
		N: 'North',
		NNE: 'North-Northeast',
		NE: 'Northeast',
		ENE: 'East-Northeast',
		E: 'East',
		ESE: 'East-Southeast',
		SE: 'Southeast',
		SSE: 'South-Southeast',
		S: 'South',
		SSW: 'South-Southwest',
		SW: 'Southwest',
		WSW: 'West-Southwest',
		W: 'West',
		WNW: 'West-Northwest',
		NW: 'Northwest',
		NNW: 'North-Northwest',
	};

	const updateWeatherData = async () => {
		try {
			const response = await axios.get(
				`https://nominatim.openstreetmap.org/search?q=${userInput}&format=json`
			);
			const data = response.data;
			const newLat = data[0].lat;
			const newLon = data[0].lon;
			const newCoords = {
				latitude: newLat,
				longitude: newLon,
			};
			setCoordinates(newCoords);
			console.log(`${newLat} ${newLon}`);
		} catch (err) {
			console.log(err.message);
		}
	};

	const fullDirection = windDirectionMap[weatherData.wind_dir] || 'Unknown';

	return (
		<div className="sideBar">
			<form
				action=""
				className="checkWeather"
				onSubmit={(e) => {
					e.preventDefault();
					updateWeatherData();
					setUserInput('');
				}}
			>
				<label htmlFor="inputWeather">Input City</label>
				<input
					type="text"
					name=""
					id="inputWeather"
					className="inputWeather"
					placeholder="Search City..."
					value={userInput}
					onChange={(e) => {
						setUserInput(e.target.value);
					}}
				/>
				<button>
					<FaArrowRight style={{ fontSize: '1.2rem' }} />
				</button>
			</form>

			<div className="tempDetails">
				<p className="temp">{`${weatherData.temp_c}℃`}</p>
				<p className="windSpeed">
					<FaWind style={{ fontSize: '1.2rem', marginRight: '0.5rem' }} />
					<span className="lightText">{`${fullDirection}, ${weatherData.wind_kph} km/h`}</span>
				</p>
			</div>

			<hr />

			<div className="nextDays">
				<h3>The Next Days Forecast</h3>
				<div className="selectDays">
					<button>4 days</button>
					<button>8 days</button>
					<button>12 days</button>
				</div>
				<div className="weatherDates">
					{forecastData?.forecastday.map((day) => {
						const date = new Date(day.date);
						const dayName = date.toLocaleDateString('en-US', {
							weekday: 'long',
						});

						return (
							<div className="forecast-day" key={day.date}>
								<p>{dayName}</p>
								<img src={day.day.condition.icon} alt="weather icon" />
								<p>{day.day.avgtemp_c}℃</p>
							</div>
						);
					})}
				</div>

				<div className="weatherDates"></div>
			</div>
		</div>
	);
};

export default Sidebar;
