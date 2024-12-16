"use client"; 

import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react"; // Correct import

function DashboardPage() {
  const [qrData, setQrData] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);

  useEffect(() => {
    // Fetch employeeData from localStorage
    const rawData = localStorage.getItem("employeeData");
    if (rawData) {
      const employee = JSON.parse(rawData);
      setEmployeeData(employee);

      // Transform the data for QR code
      const transformedData = {
        email: employee.email,
        name: employee.name,
        employeeNumber: employee.employeeId,
        phoneNumber: employee.phoneNumber,
        familyMembers: employee.familyMembers.map((member) => ({
          name: member.name,
          relation: member.relation,
        })),
      };

      // Set the transformed data for QR code
      setQrData(JSON.stringify(transformedData));
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Employee Details</h1>

      {employeeData ? (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
          {/* Employee Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Personal Information</h2>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-800">{employeeData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Employee ID</p>
                <p className="font-medium text-gray-800">{employeeData.employeeId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{employeeData.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium text-gray-800">{employeeData.phoneNumber}</p>
              </div>
            </div>
          </div>

          {/* Family Members */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Family Members</h2>
            <div className="mt-4">
              {employeeData.familyMembers.map((member, index) => (
                <div
                  key={member._id}
                  className="flex justify-between items-center bg-gray-100 p-3 rounded-md mb-2"
                >
                  <div>
                    <p className="font-medium text-gray-800">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.relation}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-500">{member.status}</p>
                </div>
              ))}
            </div>
          </div>

          {/* QR Code */}
          {qrData && (
            <div className="flex flex-col items-center">
              <QRCodeCanvas
                value={qrData} // QR code content
                size={200} // Size of the QR code
                bgColor="#ffffff" // Background color
                fgColor="#000000" // Foreground color
              />
              <p className="mt-4 text-sm text-gray-500">
                Scan this QR code to permit employee.
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500">Loading Employee Details...</p>
      )}
    </div>
  );
}

export default DashboardPage;
