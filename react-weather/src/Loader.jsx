import React from 'react';
import './App.css';

const Loader = ({ message = 'Loading...' }) => {
	return (
		<div className="wrapper">
			<div className="wave-ring-loader">
				<div className="wave-ring"></div>
				<div className="wave-ring"></div>
				<div className="wave-ring"></div>
			</div>
			<p className="loader-message">{message}</p>
		</div>
	);
};

export default Loader;
