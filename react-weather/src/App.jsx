import { useState, useEffect } from 'react';
import Home from './Home';
import Sidebar from './Sidebar';
import './App.css';
import { myApiKey } from './config';

function App() {
	const [coordinates, setCoordinates] = useState({});
	const [address, setAddress] = useState({});
	const [weatherData, setWeatherData] = useState({});

	const getUserLocation = () => {
		if (!navigator.geolocation) {
			alert('Please allow access to location');
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const coords = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				};
				setCoordinates(coords);
				console.log(coords);
			},
			(error) => {
				console.log(error.message);
			}
		);
	};

	useEffect(() => {
		getUserLocation();
	}, []);

	useEffect(() => {
		if (!coordinates.latitude || !coordinates.longitude) return;
		const getPlacename = async (lat, lon) => {
			try {
				const response = await fetch(
					`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
				);
				const data = await response.json();
				console.log(data.address.county);
				console.log(data.address.state);

				setAddress({
					area: data.address.county,
					state: data.address.state,
				});
			} catch (err) {
				console.log(err.message);
			}
		};

		getPlacename(coordinates.latitude, coordinates.longitude);
	}, [coordinates]);

	useEffect(() => {
		if (!address.state) return;

		let stateName = address.state.split(' ')[0];
		const getWeatherData = async () => {
			try {
				const response = await fetch(
					`https://api.weatherapi.com/v1/forecast.json?key=${myApiKey}&q=${stateName.toLowerCase()}&days=3&aqi=no&alerts=no`
				);
				const data = await response.json();
				console.log(data.forecast);
			} catch (err) {
				console.log(err.message);
			}
		};

		getWeatherData();
	}, [address]);

	return (
		<>
			<div className="container">
				<Home address={address} />
				<Sidebar />
			</div>
		</>
	);
}

export default App;
