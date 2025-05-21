import { useState, useEffect } from 'react';
import Home from './Home';
import Sidebar from './Sidebar';
import './App.css';
import { myApiKey, UNSPLASH_ACCESS_KEY } from './config';
import Loader from './Loader';
import axios from 'axios';

function App() {
	const [coordinates, setCoordinates] = useState({});
	const [address, setAddress] = useState({});
	const [weatherData, setWeatherData] = useState();
	const [forecastData, setForecastData] = useState();
	const [gottenData, setGottenData] = useState(true);
	const [bgUrl, setBgUrl] = useState('');

	const getUserCoordinates = () => {
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
		if (!weatherData) return;
		try {
			axios
				.get(
					`https://api.unsplash.com/photos/random?orientation=landscape&query=${weatherData.condition.text}&client_id=${UNSPLASH_ACCESS_KEY}`
				)
				.then((response) => response.data)
				.then((data) => setBgUrl(data.urls.regular));
		} catch (err) {
			console.log(err.message);
		}
	}, [weatherData]);

	useEffect(() => {
		if (bgUrl == '') return;
		document.body.style.backgroundImage = `url(${bgUrl})`;
	}, [bgUrl]);

	useEffect(() => {
		getUserCoordinates();
	}, []);

	useEffect(() => {
		if (!coordinates.latitude || !coordinates.longitude) return;
		const getPlacename = async (lat, lon) => {
			try {
				console.log('Retrying');
				const response = await axios.get(
					`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
				);
				const data = response.data;
				console.log(data);
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
				const response = await axios.get(
					`https://api.weatherapi.com/v1/forecast.json?key=${myApiKey}&q=${stateName.toLowerCase()}&days=3&aqi=no&alerts=no`
				);
				const data = await response.data;
				console.log(data.forecast);
				console.log(data.current);
				setWeatherData(data.current);
				setForecastData(data.forecast);
				setGottenData(false);
			} catch (err) {
				console.log(err.message);
			}
		};

		getWeatherData();
	}, [address]);

	return (
		<>
			{gottenData && <Loader />}
			{bgUrl && (
				<div className="container">
					<Home
						address={address}
						weatherData={weatherData}
						forecastData={forecastData}
					/>
					<Sidebar
						weatherData={weatherData}
						forecastData={forecastData}
						setCoordinates={setCoordinates}
					/>
				</div>
			)}
		</>
	);
}

export default App;
