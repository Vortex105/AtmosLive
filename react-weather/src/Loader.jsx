import React from 'react';
import './App.css';

const Loader = () => {
	return (
		<div className="wrapper">
			<div className="wave-ring-loader">
				<div className="wave-ring"></div>
				<div className="wave-ring"></div>
				<div className="wave-ring"></div>
			</div>
		</div>
	);
};

export default Loader;
