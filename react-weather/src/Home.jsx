import React from 'react';
import { useState } from 'react';
import { FaLocationDot, FaArrowRight } from 'react-icons/fa6';
import { format } from 'date-fns';
import './Home.css';

const Home = ({ address }) => {
	const [times, setTimes] = useState([
		{
			currentTime: '09:00',
			icon: '',
			temperature: '9℃',
		},
		{
			currentTime: '09:00',
			icon: '',
			temperature: '9℃',
		},
		{
			currentTime: '09:00',
			icon: '',
			temperature: '9℃',
		},
		{
			currentTime: '09:00',
			icon: '',
			temperature: '9℃',
		},
		{
			currentTime: '09:00',
			icon: '',
			temperature: '9℃',
		},
		{
			currentTime: '09:00',
			icon: '',
			temperature: '9℃',
		},
		{
			currentTime: '09:00',
			icon: '',
			temperature: '9℃',
		},
		{
			currentTime: '09:00',
			icon: '',
			temperature: '9℃',
		},
		{
			currentTime: '09:00',
			icon: '',
			temperature: '9℃',
		},
		{
			currentTime: '09:00',
			icon: '',
			temperature: '9℃',
		},
	]);

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
						<p className="weatherName">Heavy Rain</p>
						<hr />
						<div className="weatherTimes">
							{times.map((time, index) => {
								return (
									<div key={index}>
										<p className="currentTime">{time.currentTime}</p>
										<hr />
										<p className="icon">{time.icon}</p>
										<p className="temperature">{time.temperature}</p>
									</div>
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
