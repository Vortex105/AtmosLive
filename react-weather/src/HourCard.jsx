import React from 'react';

const HourCard = ({ hourData, currentTime }) => {
	const time = new Date(hourData.time).toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});

	const nowHrs = currentTime.toString().slice(0, 2);
	const activeHrs = time.slice(0, 2);
	return (
		<div className={nowHrs == activeHrs ? 'active' : ''}>
			<p className="currentTime">{time}</p>
			<hr />
			<p className="icon">
				<img src={hourData.condition.icon} alt="weatherIcon" />
			</p>
			<p className="temperature">{hourData.temp_c}℃</p>
		</div>
	);
};

export default HourCard;
