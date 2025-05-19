import React from 'react';
import { FaArrowRight, FaCloudShowersWater } from 'react-icons/fa6';
import './Home.css';

const Sidebar = () => {
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
				<p className="temp">11℃</p>
				<p className="windSpeed">
					<FaCloudShowersWater
						style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}
					/>
					<span className="lightText">Northwest, 38.9 km/h</span>
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
