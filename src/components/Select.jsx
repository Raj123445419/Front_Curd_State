    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import ReactSelect from 'react-select';

    function Select() {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);

    // 1. Load Countries on initial render
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/countries/')
        .then(response => {
            const formattedData = response.data.map(c => ({ value: c.id, label: c.name }));
            setCountries(formattedData);
        })
        .catch(error => console.error("Error fetching countries:", error));
    }, []);

    // 2. Load States when a Country is selected
    const handleCountryChange = (selectedOption) => {
        setSelectedCountry(selectedOption);
        setSelectedState(null);
        setSelectedCity(null);
        setStates([]);
        setCities([]);

        if (selectedOption) {
        axios.get(`http://127.0.0.1:8000/api/states/?country=${selectedOption.value}`)
            .then(response => {
            const formattedData = response.data.map(s => ({ value: s.id, label: s.name }));
            setStates(formattedData);
            })
            .catch(error => console.error("Error fetching states:", error));
        }
    };

    // 3. Load Cities when a State is selected
    const handleStateChange = (selectedOption) => {
        setSelectedState(selectedOption);
        setSelectedCity(null);
        setCities([]);

        if (selectedOption) {
        axios.get(`http://127.0.0.1:8000/api/cities/?state=${selectedOption.value}`)
            .then(response => {
            const formattedData = response.data.map(ct => ({ value: ct.id, label: ct.name }));
            setCities(formattedData);
            })
            .catch(error => console.error("Error fetching cities:", error));
        }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      country: selectedCountry ? selectedCountry.value : null,
      state: selectedState ? selectedState.value : null,
      city: selectedCity ? selectedCity.value : null
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/submit/', payload);
      alert(response.data.message);
      
      // Optional: Form reset karne ke liye
      setSelectedCountry(null);
      setSelectedState(null);
      setSelectedCity(null);
      setStates([]);
      setCities([]);
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data!");
    }
  };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96 space-y-4">
            <h2 className="text-xl font-bold text-gray-700 text-center mb-4">Select Location</h2>

            {/* Country Dropdown with Search */}
            <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Country</label>
            <ReactSelect 
                options={countries}
                value={selectedCountry}
                onChange={handleCountryChange}
                placeholder="Search or select country..."
                isClearable
            />
            </div>

            {/* State Dropdown (Visible only if Country is selected) */}
            {selectedCountry && (
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">State</label>
                <ReactSelect 
                options={states}
                value={selectedState}
                onChange={handleStateChange}
                placeholder="Search or select state..."
                isClearable
                />
            </div>
            )}

            {/* City Dropdown (Visible only if State is selected) */}
            {selectedState && (
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">City</label>
                <ReactSelect 
                options={cities}
                value={selectedCity}
                onChange={(option) => setSelectedCity(option)}
                placeholder="Search or select city..."
                isClearable
                />
            </div>
            )}

            {/* Submit Button (Visible only if City is selected) */}
            {selectedCity && (
            <button 
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition font-medium"
            >
                Submit
            </button>
            )}
        </form>
        </div>
    );
    }

    export default Select;