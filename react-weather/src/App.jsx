import { useState, useEffect } from 'react';
import Home from './Home';
import Sidebar from './Sidebar';
import './App.css';
import { myApiKey, UNSPLASH_ACCESS_KEY } from './config';
import Loader from './Loader';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function App() {
	const [coordinates, setCoordinates] = useState({});
	const [address, setAddress] = useState({});
	const [weatherData, setWeatherData] = useState(() => {
		try {
			const savedData = localStorage.getItem('OfflineWeatherData');
			return savedData ? JSON.parse(savedData) : null;
		} catch (err) {
			console.error('Failed to parse saved weather data:', err);
			return null;
		}
	});

	const [forecastData, setForecastData] = useState(() => {
		try {
			const savedData = localStorage.getItem('OfflineForecastData');
			return savedData ? JSON.parse(savedData) : null;
		} catch (err) {
			console.error('Failed to parse saved forecast data:', err);
			return null;
		}
	});
	const [gottenData, setGottenData] = useState(true);
	const [bgUrl, setBgUrl] = useState('');
	const [statusMessage, setStatusMessage] = useState('Initializing...');
	const [locationError, setLocationError] = useState(null);

	const getUserCoordinates = () => {
		if (!navigator.geolocation) {
			alert('Please allow access to location');
			return;
		}

		setStatusMessage('Getting your location...');

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const coords = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				};
				setCoordinates(coords);
				localStorage.setItem('OfflineCoords', JSON.stringify(coords));
			},
			(error) => {
				console.log(error.message);
				setLocationError('Location access denied. Using saved data...');
				toast.error('Please enable location services or use search.');

				try {
					const savedCoords = localStorage.getItem('OfflineCoords');
					if (savedCoords) {
						setCoordinates(JSON.parse(savedCoords));
					}
				} catch (parseErr) {
					console.error('Failed to parse saved coordinates:', parseErr);
				}
			}
		);
	};

	useEffect(() => {
		if (!weatherData) return;
		async function getBg() {
			setStatusMessage('Loading background image...');

			try {
				const response = await axios.get(
					`https://api.unsplash.com/photos/random?orientation=landscape&query=${weatherData.condition.text}&client_id=${UNSPLASH_ACCESS_KEY}`
				);
				const data = await response.data;
				setBgUrl(data.urls.regular);
			} catch (err) {
				console.log(err.message);
				setBgUrl('./src/assets/bgImage.jpg'); // Force fallback
			}
		}

		getBg();
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
			setStatusMessage('Resolving your address...');

			try {
				const response = await axios.get(
					`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
				);
				const data = response.data;
				localStorage.setItem('OfflineLocation', JSON.stringify(data));

				setAddress({
					area: data.address.county,
					state: data.address.state,
				});
			} catch (err) {
				console.log(err.message);
				try {
					const savedData = localStorage.getItem('OfflineLocation');
					if (savedData) {
						const data = JSON.parse(savedData);
						if (data?.address) {
							setAddress({
								area: data.address.county || 'Unknown area',
								state: data.address.state || 'Unknown state',
							});
						}
					}
				} catch (parseErr) {
					console.error('Failed to parse saved location data:', parseErr);
				}
			}
		};

		getPlacename(coordinates.latitude, coordinates.longitude);
	}, [coordinates]);

	useEffect(() => {
		if (!address.state) return;

		let stateName = address.state.split(' ')[0];
		const getWeatherData = async () => {
			setStatusMessage('Fetching weather data...');

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
				localStorage.setItem(
					'OfflineWeatherData',
					JSON.stringify(data.current)
				);
				localStorage.setItem(
					'OfflineForecastData',
					JSON.stringify(data.forecast)
				);
			} catch (err) {
				console.log(err.message);
				setGottenData(false);
			}
		};

		getWeatherData();
	}, [address]);

	return (
		<>
			<Toaster position="top-right" />

			{gottenData && <Loader message={statusMessage} />}
			{locationError && <div className="location-error">{locationError}</div>}

			{!weatherData && (
				<button className="retry-btn" onClick={() => window.location.reload()}>
					Retry
				</button>
			)}

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
