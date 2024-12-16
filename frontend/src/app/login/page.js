"use client"
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();

  // API Endpoints
  const SEND_OTP_API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/otp/send-otp`;
  const VERIFY_OTP_API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/otp/verify-otp`;

  const handleSendOtp = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.post(SEND_OTP_API, { employeeNumber, phoneNumber });

      if (response.data.message === 'OTP sent successfully') {
        setOtpSent(true);
        setSuccess('OTP sent successfully.');
      } else {
        setError(response.data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      const errorMessage = err.response ? err.response.data.message : err.message;
      setError(errorMessage || 'Error sending OTP. Please try again.');
      console.log('Error: ', errorMessage);  
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(VERIFY_OTP_API, { employeeNumber, phoneNumber, otp });

      if (response.data.message === 'OTP verified successfully') {
        setSuccess('OTP verified successfully. You are logged in!');

        // Store employee data in localStorage
        const employeeData = response.data.employee;
        localStorage.setItem('employeeData', JSON.stringify(employeeData));  // Store as string

        // Redirect to the dashboard page after successful login
        router.push('/dashboard');  

      } else {
        setError(response.data.message || 'OTP verification failed.');
      }
    } catch (err) {
      
      const errorMessage = err.response ? err.response.data.message : err.message;
      setError(errorMessage || 'Error verifying OTP. Please try again.');
      console.log('Error: ', errorMessage);  
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Employee Login</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

        {!otpSent ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Employee Number</label>
              <input
                type="text"
                value={employeeNumber}
                onChange={(e) => setEmployeeNumber(e.target.value)}
                className="mt-1 px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter employee number"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
                required
              />
            </div>
            <button
              onClick={handleSendOtp}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
              disabled={loading || !employeeNumber || !phoneNumber} 
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter OTP"
                required
              />
            </div>
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition disabled:opacity-50"
              disabled={loading || !otp} 
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
