import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from './Modal';
import Select from 'react-select'
import loginImage from '../static/login.png'
import logo from '../static/iqraorignal.png'
import { API_BASE_URL } from '../config';
const Register = ({ togglePage }) => {
    const navigate = useNavigate();

    const customStyles = {
        control: (base, state) => ({
            ...base,
            minHeight: '25px',
            borderColor: state.isFocused ? '#666' : '#172554',
            boxShadow: state.isFocused ? '0 0 0 1px #666' : 'none',
            '&:hover': {
                borderColor: state.isFocused ? '#666' : '#aaa'
            },
            borderRadius: '9999px',
        }),
        valueContainer: (base) => ({
            ...base,
            padding: '2px 8px',  
            fontSize: '11px',
            borderColor: '#172554',
            height: '25px',
        }),
        option: (base, state) => ({
            ...base,
            color: 'black', // Set text color to black
            backgroundColor: state.isFocused ? 'lightgray' : 'white',
            fontSize: '11px',


        }),
        multiValue: (base) => ({
            ...base,
            backgroundColor: 'rgba(0, 126, 255, 0.08)',
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: '#007eff',
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: '#007eff',
            ':hover': {
                backgroundColor: '#007eff',
                color: 'white',
            },
        }),
    };
    
    const options = [
        { value: 'python', label: 'Python' },
        { value: 'sql', label: 'SQL' },
        { value: 'javascript', label: 'Javascript' },
        { value: 'c-sharp', label: 'C#' },
        { value: 'html-css', label: 'HTML-CSS' },
        { value: 'salesforce-admin', label: 'Salesforce Admin' }

      ]
    // State variables for form data
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [degree, setDegree] = useState('');
    const [dateOfJoining, setDateOfJoining] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [city, setCity] = useState('');
    const [educationSSC, setEducationSSC] = useState('');
    const [educationHSC, setEducationHSC] = useState('');
    const [graduation, setGraduation] = useState('');
    const [passingYear, setPassingYear] = useState('');
    const [coursesPassed, setCoursesPassed] = useState([]);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [otp, setOtp] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isOTPValid, setIsOTPValid] = useState(false);
    

    const sendOTP = async () => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/generate-otp/`,
                { email },
                { timeout: 3000000 } // Set timeout to 120 seconds (120,000 ms)
            );
            if (response.data.message === 'OTP sent successfully.') {
                toast.success('OTP sent successfully.');
            } else {
                toast.error('Failed to send OTP.');
            }
        } catch (error) {
            // Log error details for debugging
            console.error('Error sending OTP:', error);
            if (error.code === 'ECONNABORTED') {
                toast.error('Request timed out. Please try again.');
            } else {
                toast.error('Failed to send OTP.');
            }
        }
    };
    
    const handleChange = (selectedOptions) => {
        // Extract values from selected options and store in the state
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setCoursesPassed(selectedValues);
    };
    const handleOpenModal = () => {
        if (validateFields()) {
            setIsModalOpen(true);
            sendOTP();
        }
    };
    const handleCloseModal = () => setIsModalOpen(false);
    const handleChangeOtp = (e) => setOtp(e.target.value);

    const validateFields = () => {
        let isValid = true;
        let messages = [];
    
        if (!email) {
            messages.push('Email is required.');
            isValid = false;
        }
        if (!password) {
            messages.push('Password is required.');
            isValid = false;
        }
        if (password.length < 8) {
            messages.push('Password must be at least 8 characters long.');
            isValid = false;
        }
        if (!firstName) {
            messages.push('First name is required.');
            isValid = false;
        }
        if (!lastName) {
            messages.push('Last name is required.');
            isValid = false;
        }
        if (!username) {
            messages.push('Username is required.');
            isValid = false;
        }
        if (!city) {
            messages.push('City is required.');
            isValid = false;
        }
        if (!degree) {
            messages.push('Degree is required.');
            isValid = false;
        }
        if (!gender) {
            messages.push('Gender is required.');
            isValid = false;
        }
        if (!dateOfJoining) {
            messages.push('Date of joining is required.');
            isValid = false;
        }
        if (!educationSSC) {
            messages.push('Education SSC percentage is required.');
            isValid = false;
        }
        if (!educationHSC) {
            messages.push('Education HSC percentage is required.');
            isValid = false;
        }
        if (!graduation) {
            messages.push('Graduation percentage is required.');
            isValid = false;
        }
        if (!passingYear) {
            messages.push('Passing year is required.');
            isValid = false;
        }
        if (!coursesPassed) {
            messages.push('Courses passed is required.');
            isValid = false;
        }
        if (!phone) {
            messages.push('Phone number is required.');
            isValid = false;
        }
        if (!phone.match(/^\d{10}$/)) {
            messages.push('Phone number must be 10 digits.');
            isValid = false;
        }
        if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)) {
            messages.push('Invalid email format.');
            isValid = false;
        }

        if (!isValid) {
            for(let i=0; i<messages.length; i++) {
            toast.error(messages[i]);
            } // Display all validation messages in a single toast
        }
        if (isValid){
            setIsVerified(true);
        }
        return isValid;
    };
    
    // Example function to verify OTP
    const verifyOtp = async () => {
        if (!otp) {
            toast.error('Please enter OTP.');
            return;
        }
        try {
            const response = await axios.post(`${API_BASE_URL}/verify-otp/`, { otp, email });
            if (response.data.message === 'OTP verified successfully.') {
                setEmailVerified(true);
                setIsOTPValid(true);
                toast.success('Email verified successfully!');
                handleCloseModal();
                
            } else {
                toast.error('Invalid OTP, please try again.');
            }
        } catch (error) {
            toast.error('Error verifying OTP.');
        }
    };

    // Handle the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset previous errors
        setError(null);

        const coursesPassedString = coursesPassed.join(', ');

        const userData = {
            username,
            email,
            password,
            first_name: firstName,
            last_name: lastName,
            profile:{
                date_of_joining: dateOfJoining,
                phone: phone,
                degree: degree,
                gender: gender,
                city: city,
                education_ssc: educationSSC,
                education_hsc: educationHSC,
                graduation: graduation,
                passing_year: passingYear,
                courses_passed: coursesPassedString
            }
        };

        try {
            // Make a POST request to the registration endpoint
            if (isVerified && isOTPValid) {
            const response = await axios.post(`${API_BASE_URL}/register/`, userData, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 201) {
                // Show success message using toast and redirect user
                toast.success('Registration successful! You can now log in.');
                togglePage(); // Redirect to login page or home

            } else {
                // Handle any other status codes as errors
                setError('Registration failed. Please try again.');
            }
        }
        } catch (err) {
            // Handle errors from the server or network issues
            const message = err.response?.data?.detail || 'Network error. Please try again.';
            setError(message);
            toast.error(message);
        
    }
    };

    return (
        <div className='w-full flex flex-col items-center justify-center bg-blue-950 '>
            
            <div className='w-full flex'>
            <div className="w-full  flex flex-col items-center justify-center   text-blue-950 rounded-full border-blue-950 px-8 ">

                <form className='lg:w-1/2 md:w-5/6 w-full sm:h-auto sm:overflow-hidden h-[90vh] max-h-[90vh] overflow-y-auto rounded-xl bg-white flex flex-col items- p-4' onSubmit={handleSubmit}>
                <p className='w-full text-xl text-blue-950 font-semibold mb-1  rounded-xl text-center'>Create your Account</p>
                    <div className='w-full  flex sm:flex-row flex-col  justify-evenly gap-5'>
                        <div className='sm:w-1/2 w-full '>
                            {/* Existing input fields for the first half */}
                            <div className="mb-2">
                                <label htmlFor="firstName" className="block text-xs font-semibold text-blue-950">First Name</label>
                                <input
                                    className='w-full h-8 px-3 text-xs font-semibold placeholder-gray-600 border rounded-full border-blue-950 focus:shadow-outline text-black'
                                    type="text"
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="gender" className="block text-xs font-semibold text-blue-950">Gender</label>
                                <select
                                    id="gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-full h-8 px-3 text-xs font-semibold placeholder-gray-600 border rounded-full border-blue-950 focus:shadow-outline text-black"
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div className="mb-2">
                                <label htmlFor="city" className="block text-xs font-semibold text-blue-950">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full h-8 px-3 text-xs font-semibold placeholder-gray-600 border rounded-full border-blue-950 focus:shadow-outline text-black"
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="email" className="block text-xs font-semibold text-blue-950">Email</label>
                                <input
                                    className='w-full h-8 px-3 text-xs font-semibold placeholder-gray-600 border rounded-full border-blue-950 focus:shadow-outline text-black'
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="phone" className="block text-xs font-semibold text-blue-950">Phone Number</label>
                                <input
                                    type="text"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full h-8 px-3 text-xs font-semibold placeholder-gray-600 border rounded-full border-blue-950 focus:shadow-outline text-black"
                                    required
                                />
                            </div>
                            <div className='w-full flex gap-2'>
                                <div className="mb-2 w-1/2">
                                    <label htmlFor="username" className="block text-xs font-semibold text-blue-950">Username</label>
                                    <input
                                        className='w-full h-8 px-3 text-xs font-semibold placeholder-gray-600 border rounded-full border-blue-950 focus:shadow-outline text-black'
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div> 
                                <div className="mb-2 w-1/2">
                                    <label htmlFor="password" className="block text-xs font-semibold text-blue-950">Password</label>
                                    <input
                                        className='w-full h-8 px-3 text-xs font-semibold placeholder-gray-600 border rounded-full border-blue-950 focus:shadow-outline text-black'
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            

                        </div>
                        <div className='sm:w-1/2 w-full max-w-lg'>
                            {/* New input fields */}
                            <div className="mb-2">
                                <label htmlFor="lastName" className="block text-xs font-semibold text-blue-950">Last Name</label>
                                <input
                                    className='w-full h-8 px-3 text-xs font-semibold placeholder-gray-600 border rounded-full border-blue-950 focus:shadow-outline text-black'
                                    type="text"
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="degree" className="block text-xs font-semibold text-blue-950">Qualification</label>
                                <input
                                    className='w-full h-8 px-3 text-xs font-semibold placeholder-gray-600 border rounded-full border-blue-950 focus:shadow-outline text-black'
                                    type="text"
                                    id="degree"
                                    value={degree}
                                    onChange={(e) => setDegree(e.target.value)}
                                    required
                                />
                            
                            </div>
                            <div className='w-full flex gap-2'>
                                <div className="mb-2">
                                    <label htmlFor="educationSSC" className="block text-xs font-semibold text-blue-950">SSC %</label>
                                    <input
                                        type="text"
                                        id="educationSSC"
                                        value={educationSSC}
                                        onChange={(e) => setEducationSSC(e.target.value)}
                                        className="w-full h-8 px-3 text-xs font-semibold placeholder-gray-600 border rounded-full border-blue-950 focus:shadow-outline text-black"
                                        required
                                    />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="educationHSC" className="block text-xs font-semibold text-blue-950"> HSC %</label>
                                    <input
                                        type="text"
                                        id="educationHSC"
                                        value={educationHSC}
                                        onChange={(e) => setEducationHSC(e.target.value)}
                                        className="w-full h-8 px-3 text-xs font-semibold placeholder-gray-600 border rounded-full border-blue-950 focus:shadow-outline text-black"
                                        required
                                    />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="graduation" className="block text-xs font-semibold text-blue-950">Graduation %</label>
                                    <input
                                        type="text"
                                        id="graduation"
                                        value={graduation}
                                        onChange={(e) => setGraduation(e.target.value)}
                                        className="w-full h-8 px-3 text-xs font-semibold placeholder-gray-600 border rounded-full border-blue-950 focus:shadow-outline text-black"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-2">
                                <label htmlFor="passingYear" className="block text-xs font-semibold text-blue-950">Passing Year</label>
                                <input
                                    type="text"
                                    id="passingYear"
                                    value={passingYear}
                                    onChange={(e) => setPassingYear(e.target.value)}
                                    className="w-full h-8 px-3 text-xs font-semibold placeholder-gray-600 border rounded-full border-blue-950 focus:shadow-outline text-black"
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="dateOfJoining" className="block text-xs font-semibold text-blue-950">Date of Joining Iqra Training</label>
                                <input
                                    type="date"
                                    id="dateOfJoining"
                                    value={dateOfJoining}
                                    onChange={(e) => setDateOfJoining(e.target.value)}
                                    className="w-full h-8 px-3 text-xs font-semibold placeholder-gray-600 border rounded-full border-blue-950 focus:shadow-outline text-black"
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="coursesPassed" className="block text-xs font-semibold text-blue-950">Courses Passed with Us</label>
                                
                                <Select options={options} isMulti     className="basic-multi-select" 
                                    styles={customStyles}
                                    onChange={handleChange}
                                    value={options.filter(option => coursesPassed.includes(option.value))}

                                />
                            </div>
                            
                        </div>
                        
                    </div>
                    <p className="w-full text-center text-blue-950 text-sm hover:underline cursor-pointer" onClick={togglePage}>
                          Already have an Account? Log In
                        </p>
                    {!emailVerified && 
                    <div className='w-full flex items-center justify-center'>
                    <button onClick={handleOpenModal} className="w-1/2 sm:w-1/3 my-2 py-2 px-4 text-[11px] sm:text-sm bg-blue-950 hover:bg-blue-700 rounded-full border-blue-950 text-white font-bold">
                        Verify Email
                    </button>
                    </div>
                }

                {emailVerified && 
                    <div className='w-full flex items-center justify-center'>
                        <button onClick={verifyOtp} className="w-1/3 mt-6 py-2 px-4 bg-blue-500 hover:bg-blue-700 rounded-full border-blue-950 text-white font-bold">
                              Register
                        </button>
                    </div>
                }

                {isModalOpen && (
                    <Modal onClose={handleCloseModal}>
                        <h3>Enter OTP sent to your email</h3>
                        <input 
                            type="text" 
                            value={otp} 
                            onChange={handleChangeOtp}
                            className="p-2 " 
                            placeholder="Enter OTP" 
                        />
                        <div className='w-full flex items-center justify-center'>
                        <button onClick={verifyOtp} className="w-1/3 mt-6 py-2 px-4 bg-blue-500 hover:bg-blue-700 rounded-full border-blue-950 text-white font-bold">
                            Verify OTP
                        </button>
                        </div>
                    </Modal>
                )}

                {error && <p className="mt-2 text-red-500">{error}</p>}
                </form>
                {error && <p className="mt-2 text-red-500">{error}</p>}
            </div>
            </div>
        </div>
    );
};

export default Register;
