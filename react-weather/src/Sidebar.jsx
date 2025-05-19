import React from 'react';
import { useState } from 'react';
import { FaArrowRight, FaWind } from 'react-icons/fa6';
import './Home.css';

const Sidebar = ({ weatherData, forecastData }) => {
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

	const fullDirection = windDirectionMap[weatherData.wind_dir] || 'Unknown';

	return (
		<div className="sideBar">
			<form action="" className="checkWeather">
				<label htmlFor="inputWeather">Input City</label>
				<input
					type="text"
					name=""
					id="inputWeather"
					className="inputWeather"
					placeholder="Search City..."
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
				<div className="weatherDates"></div>
			</div>
		</div>
	);
};

export default Sidebar;
