import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import servicescar from '../../assets/servicescar.jpg';
import tecpro from '../../assets/tecpro.jpg';
import Map from "../Map/Map";
import { LocationContext } from '../../Context/LocationContext';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api'; 


export default function Services() {

    const { coordinates } = useContext(LocationContext);
    const navigate = useNavigate();

    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [showCard, setShowCard] = useState(false);
    const [serviceQuantity, setServiceQuantity] = useState(1);
    const [typeOfWinch, setTypeOfWinch] = useState(null);
    const [tireSize, setTierSize] = useState(null);
    const [bettaryType, setBettaryType] = useState(null);
    const [fuelType, setFuelType] = useState(null);
    const [typeOfOil, settypeOfOil] = useState(null);
    const [technicals, setTechnicals] = useState(null);
    const [nearestTechnical, setNearestTechnical] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [isCanceled, setIsCanceled] = useState(false);
    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);
    const isCheckingDoneRef = useRef(false); // To prevent double-execution




    const isSubmittingRef = useRef(false); // Using ref to prevent multiple submissions

    // Function to handle service selection
    const startStatusCheck = () => {
        isCheckingDoneRef.current = false;
        setShowLoadingModal(true);

        intervalRef.current = setInterval(() => {
            checkStatusRequest();
        }, 30000); // every 30s

        timeoutRef.current = setTimeout(() => {
            if (!isCheckingDoneRef.current) {
                console.log("5 minutes passed — no response.");
                stopStatusCheck();
                setIsCanceled(true);
                setShowCard(true);
            }
        }, 300000); // 5 minutes
    };

    // Function to stop the status check
    const stopStatusCheck = () => {
        clearInterval(intervalRef.current);
        clearTimeout(timeoutRef.current);
        isCheckingDoneRef.current = true;
        setShowLoadingModal(false);
    };

    // Function to handle map close
    useEffect(() => {
        getServices();

        if (selectedService && coordinates) {
            getAllTechnicals(selectedService.id, coordinates[1], coordinates[0]);
            getNearestTechnical(selectedService.id, coordinates[1], coordinates[0]);
        }

        return () => {
            clearInterval(intervalRef.current);
            clearTimeout(timeoutRef.current);
            setShowLoadingModal(false);
        };
    }, [selectedService, coordinates]);


    // Function to fetch all services
    async function getServices() {
        try {
            const token = localStorage.getItem('UserToken');
            if (!token) {
                alert('Error: Token missing');
                return;
            }
            const { data } = await axiosInstance.get(`https://carcareapp.runasp.net/api/ServiceTypes/GetAll`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Set only the first 5 services
            setServices(data.slice(0, 5));
        } catch (error) {
            console.error("Error fetching services:", error);
            alert("Failed to fetch services. Please try again.");
        }
    }

    // Function to fetch service by ID
    async function getServiceById(id) {
        try {
            const token = localStorage.getItem('UserToken');
            if (!token) {
                alert('Error: Token missing');
                return;
            }
            const { data } = await axiosInstance.get(`https://carcareapp.runasp.net/api/ServiceTypes/GetServiceType/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setSelectedService(data);
            setSelectedOption(null);
        } catch (error) {
            console.error(`Error fetching service with ID ${id}:`, error);
            alert("Failed to fetch service. Please try again.");
        }
    }

    // Function to handle service selection and price
    const handlePriceChange = (event) => {
        const selectedType = event.target.id;
        const price = event.target.getAttribute('data-price');

        // Validation check
        if (!selectedType || !price) {
            alert('⚠️ Please choose both a price and a type.');
            return;
        }

        setSelectedOption({
            type: selectedType,
            price: price,
        });

        // Set specific values based on selectedService ID
        if (selectedService?.id === 1) setTypeOfWinch(selectedType);
        if (selectedService?.id === 2) setTierSize(selectedType);
        if (selectedService?.id === 3) setFuelType(selectedType);
        if (selectedService?.id === 4) setBettaryType(selectedType);
        if (selectedService?.id === 5) settypeOfOil(selectedType);
    };

    // Function to handle technician selection
    const handleSelectTechnician = (technicianId) => {
        localStorage.setItem("selectedTechnicianId", technicianId);
        console.log("Selected Technician:", technicianId);
        // Removed handleContinue() from here to avoid double calls
    };

    // Function to handle the continue button click
    const handleContinue = async () => {
        console.log("handleContinue triggered");

        if (isSubmittingRef.current) return;
        isSubmittingRef.current = true;

        if (!selectedService) {
            alert("⚠️ Please select a service.");
            isSubmittingRef.current = false;
            return;
        }

        // ✅ Check for price/type before location
        if (!selectedOption || !selectedOption.type || !selectedOption.price) {
            alert("⚠️ Please choose both a price and a type before selecting location.");
            isSubmittingRef.current = false;
            return;
        }

        if (!coordinates) {
            alert("📍 Please choose a location on the map before proceeding.");
            isSubmittingRef.current = false;
            return;
        }

        const selectedTechnicianId = localStorage.getItem("selectedTechnicianId");
        if (!selectedTechnicianId) {
            alert("🧑‍🔧 No technician selected. Please choose a service and location first.");
            isSubmittingRef.current = false;
            return;
        }

        const token = localStorage.getItem("UserToken");

        const selectedServiceData = {
            serviceTypeId: Number(selectedService.id),
            servicePrice: Number(selectedOption.price),
            userLatitude: parseFloat(coordinates[0]),
            userLongitude: parseFloat(coordinates[1]),
            techId: selectedTechnicianId,
        };

        if (selectedService.id === 1) selectedServiceData.typeOfWinch = typeOfWinch;
        if (selectedService.id === 2) {
            selectedServiceData.serviceQuantity = parseInt(serviceQuantity);
            selectedServiceData.tireSize = tireSize;
        }
        if (selectedService.id === 3) {
            selectedServiceData.serviceQuantity = parseInt(serviceQuantity);
            selectedServiceData.fuelType = fuelType;
        }
        if (selectedService.id === 4) {
            selectedServiceData.serviceQuantity = parseInt(serviceQuantity);
            selectedServiceData.bettaryType = bettaryType;
        }
        if (selectedService.id === 5) selectedServiceData.typeOfOil = typeOfOil;

        console.log("Final Selected Data:", selectedServiceData);

        try {
            const response = await axiosInstance.post(
                "https://carcareapp.runasp.net/api/ServiceRequest/CreateRequestManually",
                selectedServiceData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log('Response:', response.data);
            if (response.status === 200) {
                const { clientSecret, paymentIntentId } = response.data;
                localStorage.setItem("clientSecret", clientSecret);
                localStorage.setItem("paymentIntentId", paymentIntentId);
                localStorage.setItem("RequestId", response.data.id);
                localStorage.setItem("ServiceId", response.data.serviceTypeId);
                localStorage.setItem("ServicePrice", response.data.servicePrice);

                alert("✅ Service request created successfully!");
                localStorage.removeItem("selectedTechnicianId");
            } else {
                alert("❌ Failed to create service request: " + response.data.message);
            }
        } catch (error) {
            console.error("Error sending service request:", error);
            alert("❌ An error occurred. Please try again.");
        }

        isSubmittingRef.current = false;
        setShowMap(false);
        setShowCard(true);
    };


    // Function to fetch all technicians based on service ID and coordinates
    async function getAllTechnicals(serviceId, longitude, latitude) {
        try {
            const token = localStorage.getItem('UserToken');
            if (!token) {
                alert('Error: User token is missing');
                return;
            }

            const { data } = await axiosInstance.get(
                `https://carcareapp.runasp.net/api/ServiceRequest/GetAvailableTechincals?serviceid=${serviceId}&userlongitude=${longitude}&userlatitude=${latitude}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (Array.isArray(data) && data.length === 0) {
                alert('🚫 No available technicians at the moment. Please try again later.');
            }

            setTechnicals(data);
            console.log("Available technicians:", data);
        } catch (error) {
            console.error('Error fetching technicians:', error);
        }
    }

    // Function to fetch the nearest technician based on service ID and coordinates
    async function getNearestTechnical(serviceId, longitude, latitude) {
        try {
            const token = localStorage.getItem('UserToken');
            if (!token) {
                alert('Error: User token is missing');
                return;
            }

            let { data } = await axiosInstance.get(`https://carcareapp.runasp.net/api/ServiceRequest/GetNearestTechincals?serviceId=${serviceId}&UserLatitude=${latitude}&UserLongitude=${longitude}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-type': 'application-json',
                }
            });

            setNearestTechnical(data);
            console.log("Nearest technician:", data);
        } catch (error) {
            console.error('Error fetching nearest technician:', error);
            if (error.response) {
                console.log("Status:", error.response.status);
                console.log("Data:", error.response.data);
                console.log("Headers:", error.response.headers);
            }
        }
    }

    // Function to handle fetching the nearest technician
    const handleGetNearestTechnical = async () => {
        if (selectedService && coordinates) {
            const nearest = await getNearestTechnical(selectedService.id, coordinates[1], coordinates[0]);
            setNearestTechnical(nearest);
        }
    };

    // Function to check the status of a service request using the user's token
    async function checkStatusRequest() {
        if (isCheckingDoneRef.current) return;

        const token = localStorage.getItem('UserToken');
        const RequestId = localStorage.getItem('RequestId');

        try {
            const response = await axiosInstance.get(`https://carcareapp.runasp.net/api/ServiceRequest/CheckStatus/${RequestId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const status = response.data.status; // Make sure your API response has this structure
            console.log('Current status:', status);

            if (status === 'InProgress') {
                console.log('Status is InProgress — navigating to payment.');
                stopStatusCheck();
                navigate('/payment');
            } else if (status === 'Canceled') {
                console.log('Status is Canceled — return to previous step.');
                stopStatusCheck();
                setIsCanceled(true);
                setShowCard(true);
            } else if (status === 'Pending') {
                console.log('Pending status — continue checking...');
                // Do nothing
            }
        } catch (error) {
            console.error('Error checking status:', error);
            stopStatusCheck();
        }
    }

    // Function to update the technician in the service request
    async function updateTechnical(technicalId) {
        try {
            const token = localStorage.getItem('UserToken');
            const serviceId = localStorage.getItem('ServiceId');
            const requestId = localStorage.getItem('RequestId');

            if (!token || !technicalId || !serviceId || !requestId) {
                alert('Missing required data.');
                return;
            }

            const { data } = await axiosInstance.put(
                `https://carcareapp.runasp.net/api/ServiceRequest/Update-Technical-in-Request?RequestId=${requestId}&ServiceId=${serviceId}&TechnicalId=${technicalId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Technician updated:', data);
            alert('Technician updated successfully!');

            // Reset & restart checking
            isCheckingDoneRef.current = false;
            startStatusCheck();

        } catch (error) {
            console.error('Error updating technician:', error);
        }
    }


    // Function to handle the request button click
    const handleRequestClick = async () => {
        setLoading(true);
        // logic to create request
        startStatusCheck();
        setLoading(false);
    };



    return (
        <div className=" min-h-screen">
            {/* Services Section */}
            <div className="bg-gray-200 py-12 px-6 lg:px-20">
                <div className="flex flex-col lg:flex-row items-center gap-10">

                    {/* Image */}
                    <div className="w-full lg:w-1/2" data-aos="fade-right" data-aos-delay="400" data-aos-duration="1000">
                        <img src={servicescar} alt="Our Services" className="w-full h-auto rounded-xl shadow-lg" />
                    </div>

                    {/* Text */}
                    <div className="w-full lg:w-1/2" data-aos="fade-left" data-aos-delay="600" data-aos-duration="1000">
                        <h2 className="text-3xl font-bold text-[#0B4261] mb-4">Our Services</h2>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            Care Car offers reliable and professional roadside assistance services including winch, tire repair, fuel delivery, and more.
                            You can request services instantly, pay after completion, or subscribe to our affordable annual plans for complete peace of mind on the road.
                        </p>
                    </div>

                </div>
            </div>

            <div>
                <h1 className='text-4xl font-bold text-[#0B4261] text-center font-serif mt-28 '>Services CarCare</h1>
                {/* show services */}
                <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mt-10 py-14 px-14">
                    {services.map((service) => (
                        <div key={service.id} className="max-w-sm">
                            {selectedService && selectedService.id === service.id ? (
                                <div className="p-4 border rounded-lg shadow-lg bg-white">
                                    <h3 className="text-2xl font-semibold">{selectedService.name}</h3>
                                    <img src={selectedService.pictureUrl} className="mt-4 w-full h-[200px] max-w-md" alt={selectedService.name} />

                                    {/* serivce id 1 winch */}
                                    {selectedService.id === 1 && (
                                        <div className="mt-6 p-4 border rounded-lg shadow-lg bg-white">
                                            <h1 className="text-xl font-bold text-[#0B4261]">Winch Type</h1>
                                            <p className="text-[#0B4261] text-lg font-semibold mt-2">Choose the Winch type:</p>
                                            <div className='mt-5'>
                                                <input type="radio" id='electric' name="winch-type" data-price="500" onChange={handlePriceChange} />
                                                <label htmlFor="electric" className='ml-2 text-xl font-bold'>Electric - 500 EGP</label>
                                            </div>
                                            <div>
                                                <input type="radio" id='hydraulic' name="winch-type" data-price="1000" onChange={handlePriceChange} />
                                                <label htmlFor="hydraulic" className='ml-2 text-xl font-bold'>Hydraulic - 1000 EGP</label>
                                            </div>
                                        </div>
                                    )}

                                    {/* Tire Size options for Service 2 */}
                                    {selectedService.id === 2 && (
                                        <div className="mt-6 p-4 border rounded-lg shadow-lg bg-white">
                                            <h1 className="text-xl font-bold text-[#0B4261]">Tire Size</h1>
                                            <p className="text-[#0B4261] text-lg font-semibold mt-2">Choose the tire size:</p>

                                            <div className='mt-5'>
                                                <input type="radio" id='smallcars' name="tire-size" data-price="300" onClick={handlePriceChange} />
                                                <label htmlFor="smallcars" className='ml-2 text-xl font-semibold'>Small Cars</label>
                                                <p className='text-gray-500'>13 to 16 inches</p>
                                                <p className='text-gray-500 text-right'>300 EGP</p>
                                            </div>
                                            <div>
                                                <input type="radio" id='sedans' name="tire-size" data-price="400" onClick={handlePriceChange} />
                                                <label htmlFor="sedans" className='ml-2 text-xl font-semibold'>Sedans and Hatchbacks</label>
                                                <p className='text-gray-500'>15 to 18 inches</p>
                                                <p className='text-gray-500 text-right'>400 EGP</p>
                                            </div>
                                            <div>
                                                <input type="radio" id='suvs' name="tire-size" data-price="500" onClick={handlePriceChange} />
                                                <label htmlFor="suvs" className='ml-2 text-xl font-semibold'>SUVs and Trucks</label>
                                                <p className='text-gray-500'>17 to 22 inches</p>
                                                <p className='text-gray-500 text-right'>500 EGP</p>
                                            </div>
                                            <div>
                                                <input type="radio" id='sportscars' name="tire-size" data-price="600" onClick={handlePriceChange} />
                                                <label htmlFor="sportscars" className='ml-2 text-xl font-semibold'>Sports Cars</label>
                                                <p className='text-gray-500'>18 to 20 inches</p>
                                                <p className='text-gray-500 text-right'>600 EGP</p>
                                            </div>

                                            {/* Input Range for Service Quantity */}
                                            <div className="mt-6">
                                                <label htmlFor="serviceQuantity" className="block text-lg font-semibold text-[#0B4261]">
                                                    Select Quantity
                                                </label>
                                                <input type="range" id="serviceQuantity" name="serviceQuantity" min="1" max="4" value={serviceQuantity} onChange={(e) => setServiceQuantity(e.target.value)} className="w-full mt-2" />
                                                <p className="text-center text-lg font-semibold text-gray-700">Selected: {serviceQuantity}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* fuel type options for Service  3*/}
                                    {selectedService.id === 3 && (
                                        <div className="mt-6 p-4 border rounded-lg shadow-lg bg-white">
                                            <h1 className="text-xl font-bold text-[#0B4261] ">Fuel type</h1>
                                            <p className="text-[#0B4261] text-lg font-semibold mt-2">Choose the Fuel type:</p>
                                            <div className='mt-5'>
                                                <input type="radio" id='Regularbenzine' name="tire-size" data-price="300" onClick={handlePriceChange} />
                                                <label htmlFor="Regularbenzine" className='ml-2 text-xl font-semibold'>Regular benzine</label>
                                                <p className=' text-gray-500 '>vehicles with low to mid performance</p>
                                                <p className=' text-gray-500 text-right'>300 EGP</p>
                                            </div>
                                            <div>
                                                <input type="radio" id='Mid-GradeBenzine' name="tire-size" data-price="400" onClick={handlePriceChange} />
                                                <label htmlFor="Mid-GradeBenzine" className='ml-2 text-xl font-semibold'>Mid-Grade Benzine</label>
                                                <p className=' text-gray-500 '>Fuel with higher octone</p>
                                                <p className=' text-gray-500 text-right'>400 EGP</p>
                                            </div>
                                            <div>
                                                <input type="radio" id='suvs' name="PremiumGasolinebenzine" data-price="500" onClick={handlePriceChange} />
                                                <label htmlFor="PremiumGasolinebenzine" className='ml-2 text-xl font-semibold'>Premium Gasoline benzine</label>
                                                <p className=' text-gray-500 '>High performance and luxury cars</p>
                                                <p className=' text-gray-500 text-right'>500 EGP</p>
                                            </div>
                                            <div>
                                                <input type="radio" id='Gas' name="tire-size" data-price="600" onClick={handlePriceChange} />
                                                <label htmlFor="Gas" className='ml-2 text-xl font-semibold'>Gas</label>
                                                <p className=' text-gray-500 '>Retrolfitted pessenger cars</p>
                                                <p className=' text-gray-500 text-right'>600 EGP</p>
                                            </div>

                                            {/* Input for fuel Quantity */}
                                            <div className="mt-6">
                                                <label htmlFor="serviceQuantity" className="block text-lg font-semibold text-[#0B4261]">
                                                    Select Quantity
                                                </label>
                                                <input type="range" id="serviceQuantity" name="serviceQuantity" min="1" max="100" value={serviceQuantity} onChange={(e) => setServiceQuantity(e.target.value)} className="w-full mt-2" />
                                                <p className="text-center text-lg font-semibold text-gray-700">Selected: {serviceQuantity}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* batteries options for Service 4 */}
                                    {selectedService.id === 4 && (
                                        <div className="mt-6 p-4 border rounded-lg shadow-lg bg-white">
                                            <h1 className="text-xl font-bold text-[#0B4261]">Bettary Type</h1>
                                            <p className="text-[#0B4261] text-lg font-semibold">Choose the Bettary Type:</p>
                                            <div className='mt-5'>
                                                <input type="radio" id='smallcars' name="tire-size" data-price="300" onClick={handlePriceChange} />
                                                <label htmlFor="smallcars" className='ml-2 text-xl font-semibold'>Flooded</label>
                                                <p className=' text-gray-500 '>afforadble and widely available</p>
                                                <p className=' text-gray-500 text-right'>300 EGP</p>
                                            </div>
                                            <div>
                                                <input type="radio" id='sedans' name="tire-size" data-price="400" onClick={handlePriceChange} />
                                                <label htmlFor="sedans" className='ml-2 text-xl font-semibold'>AGM</label>
                                                <p className=' text-gray-500 '>provides better performance and durabilit</p>
                                                <p className=' text-gray-500 text-right'>400 EGP</p>
                                            </div>
                                            <div>
                                                <input type="radio" id='suvs' name="tire-size" data-price="500" onClick={handlePriceChange} />
                                                <label htmlFor="suvs" className='ml-2 text-xl font-semibold'>EFB</label>
                                                <p className=' text-gray-500 '>Handles frequently charging and discharging cycle</p>
                                                <p className=' text-gray-500 text-right'>500 EGP</p>
                                            </div>
                                            <div>
                                                <input type="radio" id='sportscars' name="tire-size" data-price="600" onClick={handlePriceChange} />
                                                <label htmlFor="sportscars" className='ml-2 text-xl font-semibold'>Gel Cell</label>
                                                <p className=' text-gray-500 '>Resistant to vibration and deeb discharging</p>
                                                <p className=' text-gray-500 text-right'>600 EGP</p>
                                            </div>

                                            {/* Input for Battery Quantity */}
                                            <div className="mt-6">
                                                <label htmlFor="serviceQuantity" className="block text-lg font-semibold text-[#0B4261]">
                                                    Select Quantity
                                                </label>
                                                <input type="range" id="serviceQuantity" name="serviceQuantity" min="1" max="4" value={serviceQuantity} onChange={(e) => setServiceQuantity(e.target.value)} className="w-full mt-2" />
                                                <p className="text-center text-lg font-semibold text-gray-700">Selected: {serviceQuantity}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* oil options for Service 5 */}
                                    {selectedService.id === 5 && (
                                        <div className="mt-6 p-4 border rounded-lg shadow-lg bg-white">
                                            <h1 className="text-xl font-bold text-[#0B4261]">Change Oil</h1>
                                            <p className="text-[#0B4261] text-lg font-semibold">Choose the Oil Type:</p>
                                            <div className='mt-5'>
                                                <input type="radio" id='SyntheticOil' name="tire-size" data-price="300" onClick={handlePriceChange} />
                                                <label htmlFor="SyntheticOil" className='ml-2 text-xl font-semibold'>Synthetic Oil</label>
                                                <p className=' text-gray-500 '>afforadble and widely available</p>
                                                <p className=' text-gray-500 text-right'>300 EGP</p>
                                            </div>
                                            <div>
                                                <input type="radio" id='EngineOil' name="tire-size" data-price="400" onClick={handlePriceChange} />
                                                <label htmlFor="EngineOil" className='ml-2 text-xl font-semibold'>Engine Oil</label>
                                                <p className=' text-gray-500 '>provides better performance and durabilit</p>
                                                <p className=' text-gray-500 text-right'>400 EGP</p>
                                            </div>
                                            <div>
                                                <input type="radio" id='SyntheticBlendOil' name="tire-size" data-price="500" onClick={handlePriceChange} />
                                                <label htmlFor="SyntheticBlendOil" className='ml-2 text-xl font-semibold'>Synthetic Blend Oil</label>
                                                <p className=' text-gray-500 '>Handles frequently charging and discharging cycle</p>
                                                <p className=' text-gray-500 text-right'>500 EGP</p>
                                            </div>
                                            <div>
                                                <input type="radio" id='HighMileageOil' name="tire-size" data-price="600" onClick={handlePriceChange} />
                                                <label htmlFor="HighMileageOil" className='ml-2 text-xl font-semibold'>High Mileage Oil</label>
                                                <p className=' text-gray-500 '>Resistant to vibration and deeb discharging</p>
                                                <p className=' text-gray-500 text-right'>600 EGP</p>
                                            </div>
                                        </div>
                                    )}

                                    <p className="mt-3 text-xl font-bold">
                                        Selected Price: <span className="text-green-600">{selectedOption ? `${selectedOption.price} EGP` : ''}</span>
                                    </p>

                                    <button onClick={() => setShowMap(true)} className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800 mr-3">Continue</button>
                                    <button onClick={() => setSelectedService(null)} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800">Close</button>
                                </div>

                            ) : (
                                <div className="bg-white border border-gray-300 rounded-lg shadow-xl hover:scale-105 transition-transform duration-300">
                                    {/*show services */}
                                    <div className='bg-teal-500 rounded-t-lg overflow-hidden'>
                                        <img src={service.pictureUrl} alt={service.name} className="mt-4 w-full h-[200px] filter brightness-50 saturate-200 hue-rotate-180" />
                                        </div>  

                                        <div className='p-5 bg-gray-200 h-[180px]'>          
                                       <h5 className="mb-2 text-2xl font-bold tracking-tight text-[#0B4261]">
                                        {service.name}
                                    </h5>
                                    <p className="mb-3 font-normal text-lg text-[#0B4261]">
                                        {service.description}
                                    </p>
                                    <button
                                        onClick={() => getServiceById(service.id)}
                                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-[#0B4261] rounded-lg hover:bg-blue-800">
                                        Create Request
                                    </button>
                                </div>
                                </div>
                    )}
                </div>
                    ))}
            </div>

            {/* Show Map */}
            {showMap && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full h-[95vh] flex flex-col relative">
                        <h2 className="text-2xl font-bold mb-4">Map View</h2>
                        <div className="flex-1 overflow-hidden">
                            <Map className="w-full h-full" />
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowMap(false)} className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800">Close</button>

                            {coordinates && (
                                <div className="mt-4 text-center text-[#0B4261] font-semibold">
                                    Selected Location: {coordinates[0]}, {coordinates[1]}
                                </div>
                            )}

                            <button onClick={() => setShowCard(true)} className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800">Continue</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading Modal */}
            {showLoadingModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-80 text-center">
                        <div className="mb-4">
                            <div className="w-12 h-12 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Processing Request</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">Please wait while we confirm technician availability.</p>
                    </div>
                </div>
            )}


            {/* Show Card */}
            {showCard && technicals.length > 0 && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 p-6 overflow-y-auto max-h-[80vh]">
                        <h2 className="text-xl font-semibold text-center mb-4">Available Technicians</h2>

                        {technicals.map((technician, index) => (
                            <div key={technician.id || index} className="border-b pb-4 mb-4 last:border-none last:pb-0">
                                <div className="flex items-center gap-4">
                                    <img className="w-16 h-16 rounded-full shadow-lg" src={tecpro} alt="Technician" />
                                    <div>
                                        <h5 className="text-lg font-medium text-gray-900 dark:text-white">{technician.fullName}</h5>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">📞 {technician.phoneNumber}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">🛠 {technician.serviceName}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">📍 Distance: {technician.distance?.toFixed(2)} meters</p>
                                    </div>
                                </div>
                                <div className="flex mt-3">
                                    <button
                                        className={`px-4 py-2 text-white ${loading ? 'bg-gray-500' : 'bg-blue-700'} rounded-lg hover:bg-blue-800`}
                                        onClick={async () => {
                                            setLoading(true);

                                            if (isCanceled) {
                                                // Only update technician
                                                await updateTechnical(technician.id);
                                            } else {
                                                // Only for new request flow
                                                await handleSelectTechnician(technician.id);
                                                await handleContinue();
                                            }

                                            handleRequestClick(); // Starts 5-minute status check
                                            setShowCard(false);
                                            setLoading(false);
                                        }}
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : isCanceled ? 'Update' : 'Request'}
                                    </button>


                                </div>
                            </div>
                        ))}

                        {/* Button to Fetch Nearest Technician */}
                        <button
                            onClick={handleGetNearestTechnical}
                            className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800"
                        >
                            Show Nearest Technician
                        </button>

                        {/* Display the Nearest Technician if Available */}
                        {nearestTechnical && (
                            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">Nearest Technician</h3>
                                <div className="flex items-center gap-4 mt-2">
                                    <img className="w-16 h-16 rounded-full shadow-lg" src={tecpro} alt="Technician" />
                                    <div>
                                        <h5 className="text-lg font-medium text-gray-900 dark:text-white">{nearestTechnical.fullName}</h5>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">📞 {nearestTechnical.phoneNumber}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">🛠 {nearestTechnical.serviceName}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">📍 Distance: {nearestTechnical.distance?.toFixed(2)} meters</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button onClick={() => setShowCard(false)} className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800">
                            Close
                        </button>
                    </div>
                </div>
            )}

        </div >
        </div >
    );
}
