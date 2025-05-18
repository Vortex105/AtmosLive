import { useState, useEffect } from 'react';
import Home from './Home';
import Sidebar from './Sidebar';
import './App.css';
import { useRef } from 'react';

function App() {
	const [coordinates, setCoordinates] = useState({});
	const [address, setAddress] = useState({});
	const mounted = useRef(false);

	const getUserLocation = () => {
		if (!navigator.geolocation) {
			alert('Geolocation is not supported');
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
		if (!mounted) {
			mounted.current = true;
			return;
		}
		const getPlacename = async (lat, lon) => {
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
			//console.log(data)
		};

		if (coordinates != '') {
			getPlacename(coordinates.latitude, coordinates.longitude);
		}
	}, [coordinates]);

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
