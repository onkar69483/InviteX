"use client"
import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const QRCodeScanner = () => {
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState(null);
  const [attendance, setAttendance] = useState({});
  const videoRef = useRef(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    codeReader
      .decodeOnceFromVideoDevice(
        undefined,
        videoRef.current,
        { video: { facingMode: "environment" } }
      )
      .then((result) => {
        const parsedData = JSON.parse(result.text); // Parse JSON data from the QR code
        setQrData(parsedData);
        setAttendance(
          parsedData.familyMembers.reduce((acc, member) => {
            acc[member.name] = false; // Initialize all family members as not present
            return acc;
          }, {})
        );
      })
      .catch((err) => {
        setError(
          err.name === "NotAllowedError"
            ? "Camera access denied. Please enable it in browser settings."
            : "QR Code scanning failed"
        );
      });

    return () => {
      codeReader.reset(); // Clean up when the component is unmounted
    };
  }, []);

  const handleAttendanceChange = (name) => {
    setAttendance((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = () => {
    console.log("Attendance Submitted:", attendance);
    alert("Attendance has been submitted successfully!");
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-br from-blue-600 to-indigo-900 text-white">
      {/* Header */}
      <header className="w-full py-4 bg-opacity-75 backdrop-blur-md shadow-lg text-center">
        <h1 className="text-3xl font-extrabold tracking-wider">InviteX Admin Scanner</h1>
        <p className="text-sm text-gray-200 mt-2">
          Streamlined event management made easy
        </p>
      </header>

      {/* QR Scanner Section */}
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4">
        {!qrData && (
          <div className="relative w-full h-[70vh] max-w-md bg-gray-200 rounded-lg overflow-hidden shadow-lg">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
            ></video>
            <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center">
              <div className="w-48 h-48 border-4 border-dashed border-white rounded-lg animate-pulse"></div>
            </div>
          </div>
        )}

        {qrData && (
          <div className="w-full max-w-md mt-6 p-4 bg-white text-black rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-center mb-4">Employee Details</h2>

            <p className="text-lg font-semibold">Name: {qrData.name}</p>
            <p className="text-lg font-semibold">Employee Number: {qrData.employeeNumber}</p>

            <div className="mt-4">
              <h3 className="text-lg font-bold mb-2">Family Members:</h3>
              {qrData.familyMembers.map((member) => (
                <div key={member.name} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={member.name}
                    checked={attendance[member.name] || false}
                    onChange={() => handleAttendanceChange(member.name)}
                    className="mr-2 w-5 h-5"
                  />
                  <label htmlFor={member.name} className="text-lg">
                    {member.name} ({member.relation})
                  </label>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
            >
              Submit Attendance
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center mt-6">
            <p>{error}</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-4 bg-opacity-75 backdrop-blur-md shadow-lg text-center">
        <p className="text-sm text-gray-200">
          © {new Date().getFullYear()} InviteX • All Rights Reserved
        </p>
      </footer>
    </div>
  );
};

export default QRCodeScanner;

