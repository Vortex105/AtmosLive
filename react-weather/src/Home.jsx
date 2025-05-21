import React from 'react';
import { useState } from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import { format } from 'date-fns';
import './Home.css';
import HourCard from './HourCard';

const Home = ({ address, weatherData, forecastData }) => {
	const [hourData, setHourData] = useState(
		forecastData.forecastday[0].hour.slice(0, 10)
	);

	const now = new Date();
	const formattedDate = format(now, 'dd MMMM, yyyy');
	const formattedTime = format(now, 'HH:mm');
	return (
		<>
			<div className="main">
				<div className="weatherDisplay">
					<div className="topInfo">
						<div className="location">
							<FaLocationDot />
							<p>{`${address.area}, ${address.state}`}</p>
						</div>
						<div className="dateTime">
							<p>{formattedDate}</p>
							<p>{formattedTime}</p>
						</div>
					</div>
					<div className="currentWeather">
						<p className="weatherName">{weatherData.condition.text}</p>
						<hr />
						<div className="weatherTimes">
							{hourData &&
								hourData.map((hour, index) => {
									return (
										<HourCard
											key={index}
											hourData={hour}
											currentTime={formattedTime}
										/>
									);
								})}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;
