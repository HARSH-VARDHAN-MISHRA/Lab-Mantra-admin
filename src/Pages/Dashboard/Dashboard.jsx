import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [reverseAddress, setReverseAddress] = useState(null);
  const [error, setError] = useState(null);

  const forwardGeocode = async () => {
    setError(null);
    try {
      const response = await axios.get('https://trueway-geocoding.p.rapidapi.com/Geocode', {
        params: { address: address, language: 'en' },
        headers: {
          'x-rapidapi-host': 'trueway-geocoding.p.rapidapi.com',
          'x-rapidapi-key': '75ad2dad64msh17034f06cc47c06p18295bjsn18e367df005b'
        }
      });
        console.log("forward Geo Code",response.data)

      if (response.data.results.length > 0) {
        const { location } = response.data.results[0];
        setCoordinates(location);
      } else {
        setError('Unable to retrieve coordinates');
      }
    } catch (err) {
      setError('Error retrieving coordinates');
    }
  };

  const reverseGeocode = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          setError(null);
          try {
            const response = await axios.get('https://trueway-geocoding.p.rapidapi.com/ReverseGeocode', {
              params: { location: `${latitude},${longitude}`, language: 'en' },
              headers: {
                'x-rapidapi-host': 'trueway-geocoding.p.rapidapi.com',
                'x-rapidapi-key': '75ad2dad64msh17034f06cc47c06p18295bjsn18e367df005b'
              }
            });
            console.log("Reverse Geo Code",response.data)
            if (response.data.results.length > 0) {
              setReverseAddress(response.data.results[0]);
              console.log(response.data.results[0])
            } else {
              setError('Unable to retrieve address');
            }
          } catch (err) {
            setError('Error retrieving address');
          }
        },
        (err) => {
          setError('Unable to retrieve your location');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Geocoding Example</h1>
      <div className="mb-5">
        <h2>Forward Geocoding</h2>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Enter address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button onClick={forwardGeocode} className="btn btn-primary">
          Get Coordinates
        </button>
        {coordinates && (
          <div className="mt-4">
            <p>Latitude: {coordinates.lat}</p>
            <p>Longitude: {coordinates.lng}</p>
          </div>
        )}
      </div>

      <div>
        <h2>Reverse Geocoding</h2>
        <button onClick={reverseGeocode} className="btn btn-secondary">
          Get Current Location Address
        </button>
        {/* {reverseAddress && (
          <div className="mt-4">
            <p>Address: {reverseAddress}</p>
          </div>
        )} */}
      </div>

      {error && <p className="mt-4 text-danger">{error}</p>}
    </div>
  );
};

export default Dashboard;
