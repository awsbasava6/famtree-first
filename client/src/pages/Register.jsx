
// client/src/pages/Register.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    country: "",
    state: "",
    district: "",
    taluk: "",
    village: "",
    pincode: "",
    phoneNumber: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  // Step 1 -> send OTP
  const handleSendOtp = async () => {
    if (!form.phoneNumber) return alert("Enter phone number");
    try {
      setLoading(true);
      // call backend with all form data
      const res = await axios.post(`${API_BASE}/api/auth/send-otp`, { ...form });
      if (res.data.success) {
        setServerMsg("OTP sent to your phone.");
        setStep(2);
      } else {
        alert(res.data.message || "Error sending OTP");
      }
    } catch (err) {
      console.error("send-otp error:", err);
      alert("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 -> verify OTP and create user
  const handleVerify = async () => {
    if (!form.otp) return alert("Enter OTP");
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/auth/verify-otp`, {
        phoneNumber: form.phoneNumber,
        otp: form.otp,
      });
      if (res.data.success) {
        const famTreeId = res.data.user?.famTreeId;
        alert(`✅ Successfully created account!\nYour FamTree ID: ${famTreeId}`);
        // store logged in user info as desired
        localStorage.setItem("userPhone", form.phoneNumber);
        localStorage.setItem("famTreeId", famTreeId);
        // navigate to dashboard or wherever you want
        navigate("/dashboard");
      } else {
        alert(res.data.message || "OTP verification failed");
      }
    } catch (err) {
      console.error("verify-otp error:", err);
      alert("Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-center mb-6">Create New Account</h2>

        {step === 1 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} className="border rounded px-3 py-2" />
              <input name="middleName" placeholder="Middle Name" value={form.middleName} onChange={handleChange} className="border rounded px-3 py-2" />
              <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} className="border rounded px-3 py-2 md:col-span-2" />
              <input name="country" placeholder="Country" value={form.country} onChange={handleChange} className="border rounded px-3 py-2" />
              <input name="state" placeholder="State" value={form.state} onChange={handleChange} className="border rounded px-3 py-2" />
              <input name="district" placeholder="District" value={form.district} onChange={handleChange} className="border rounded px-3 py-2" />
              <input name="taluk" placeholder="Taluk" value={form.taluk} onChange={handleChange} className="border rounded px-3 py-2" />
              <input name="village" placeholder="Village / Hobli / Area" value={form.village} onChange={handleChange} className="border rounded px-3 py-2" />
              <input name="pincode" placeholder="PIN Code" value={form.pincode} onChange={handleChange} className="border rounded px-3 py-2" />
              <input name="phoneNumber" placeholder="+91xxxxxxxxxx" value={form.phoneNumber} onChange={handleChange} className="border rounded px-3 py-2 md:col-span-2" />
            </div>

            <div className="mt-6 text-center">
              <button disabled={loading} onClick={handleSendOtp} className="bg-blue-600 text-white px-6 py-2 rounded">
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-center text-green-600 mb-4">{serverMsg}</p>
            <div className="max-w-sm mx-auto">
              <input name="otp" placeholder="Enter OTP" value={form.otp} onChange={handleChange} className="border rounded px-3 py-2 w-full mb-4 text-center" />
              <button disabled={loading} onClick={handleVerify} className="bg-green-600 text-white px-6 py-2 rounded w-full">
                {loading ? "Verifying..." : "Verify OTP & Create Account"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
