import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContex";
import { getNIDAProfile, getNESARecord, submitApplication } from "../../services/api";
import toast from "react-hot-toast";

const ApplicationForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Steps: 1 = NIDA verification, 2 = NESA verification, 3 = CV upload and submit
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // NIDA data
  const [nationalId, setNationalId] = useState("");
  const [nidaData, setNidaData] = useState(null);
  const [nidaError, setNidaError] = useState("");

  // NESA data
  const [studentId, setStudentId] = useState("");
  const [nesaData, setNesaData] = useState(null);
  const [nesaError, setNesaError] = useState("");

  // CV file
  const [cvFile, setCvFile] = useState(null);
  const [cvError, setCvError] = useState("");

//   // Check if applicant already submitted
//   useEffect(() => {
//     const checkExisting = async () => {
//       try {
//         const { getMyApplication } = await import("../../services/api");
//         await getMyApplication();
//         // If it succeeds they already have an application
//         toast("You have already submitted an application.");
//         navigate("/my-application");
//       } catch (error) {
//         // 404 means no application yet — good, they can proceed
//       }
//     };
//     checkExisting();
//   }, []);

  // Step 1 — Verify National ID with NIDA
  const handleVerifyNIDA = async () => {
    setNidaError("");

    if (!nationalId.trim()) {
      setNidaError("National ID is required.");
      return;
    }
    if (!/^\d{16}$/.test(nationalId)) {
      setNidaError("National ID must be exactly 16 digits.");
      return;
    }

    setLoading(true);
    try {
      const res = await getNIDAProfile(nationalId);
      setNidaData(res.data.data);
      toast.success("Identity verified successfully!");
      setStep(2);
    } catch (error) {
      const message =
        error.response?.data?.message || "National ID not found.";
      setNidaError(message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — Verify Student ID with NESA
  const handleVerifyNESA = async () => {
    setNesaError("");

    if (!studentId.trim()) {
      setNesaError("Student ID is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await getNESARecord(studentId, nationalId);
      setNesaData(res.data.data);
      toast.success("Academic records fetched successfully!");
      setStep(3);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "No academic record found. Check your Student ID.";
      setNesaError(message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3 — Submit application
  const handleSubmit = async () => {
    setCvError("");

    if (!cvFile) {
      setCvError("Please upload your CV.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      // NIDA fields
      formData.append("nationalId", nidaData.nationalId);
      formData.append("firstName", nidaData.fullName.split(" ")[0]);
      formData.append("lastName", nidaData.fullName.split(" ").slice(1).join(" "));
      formData.append("dateOfBirth", nidaData.dob);
      formData.append("gender", nidaData.gender);
      formData.append("phone", nidaData.phone || "");
      formData.append("address", nidaData.address);
      formData.append("province", nidaData.province);
      formData.append("district", nidaData.district);

      formData.append("schoolName", nesaData.school);
      formData.append("combination", nesaData.option);
      formData.append("yearOfCompletion", nesaData.yearCompleted);
      formData.append("nesaResult", nesaData.result);

    
      const grades = nesaData.grades;
      formData.append("mathematicsGrade", grades.Mathematics || "");
      formData.append("englishGrade", grades.English || "");
      formData.append("physicsGrade", grades.Physics || "");
      formData.append("chemistryGrade", grades.Chemistry || "");
      formData.append("biologyGrade", grades.Biology || "");


      formData.append("cv", cvFile);

      await submitApplication(formData);
      toast.success("Application submitted successfully!");
      navigate("/my-application");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to submit application.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Progress bar
  const steps = ["Verify Identity", "Academic Records", "Submit Application"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
           Application
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          Complete all steps to submit your application
        </p>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-10">
          {steps.map((label, index) => {
            const stepNumber = index + 1;
            const isCompleted = step > stepNumber;
            const isCurrent = step === stepNumber;

            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all
                    ${isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : isCurrent
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "bg-white border-gray-300 text-gray-400 dark:bg-gray-800 dark:border-gray-600"
                    }`}
                >
                  {isCompleted ? "✓" : stepNumber}
                </div>
                <p
                  className={`text-xs mt-2 text-center ${
                    isCurrent
                      ? "text-indigo-600 font-semibold"
                      : isCompleted
                      ? "text-green-500"
                      : "text-gray-400"
                  }`}
                >
                  {label}
                </p>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden sm:block absolute h-0.5 w-full top-5 left-1/2 ${
                      isCompleted ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">

          {/* ── STEP 1: NIDA Verification ── */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
                Step 1 — Verify Your Identity
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Enter your 16-digit National ID to fetch your personal information.
              </p>

              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                National ID
              </label>
              <input
                type="text"
                value={nationalId}
                onChange={(e) => {
                  setNationalId(e.target.value);
                  setNidaError("");
                }}
                maxLength={16}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white ${
                  nidaError
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter your 16-digit National ID"
              />
              {nidaError && (
                <p className="text-red-500 text-xs mt-1">{nidaError}</p>
              )}

              <button
                onClick={handleVerifyNIDA}
                disabled={loading}
                className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify Identity"}
              </button>
            </div>
          )}

          {/* ── STEP 2: NESA Verification ── */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
                Step 2 — Academic Records
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Enter your Student ID to fetch your academic records.
              </p>

              {/* Show NIDA data as read-only */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
                <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                  ✓ Identity Verified
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <p><span className="font-medium">Name:</span> {nidaData?.fullName}</p>
                  <p><span className="font-medium">Gender:</span> {nidaData?.gender}</p>
                  <p><span className="font-medium">DOB:</span> {nidaData?.dob?.split("T")[0]}</p>
                  <p><span className="font-medium">Phone:</span> {nidaData?.phone}</p>
                  <p><span className="font-medium">Father's Name:</span> {nidaData?.fatherName}</p>
                  <p><span className="font-medium">Mother's Name:</span> {nidaData?.motherName}</p>
                  <p><span className="font-medium">Province:</span> {nidaData?.province}</p>
                  <p><span className="font-medium">District:</span> {nidaData?.district}</p>
                  <p><span className="font-medium">Address:</span> {nidaData?.address}</p>
                </div>
              </div>

              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Student ID
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => {
                  setStudentId(e.target.value);
                  setNesaError("");
                }}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white ${
                  nesaError
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter your Student ID"
              />
              {nesaError && (
                <p className="text-red-500 text-xs mt-1">{nesaError}</p>
              )}

              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyNESA}
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-60"
                >
                  {loading ? "Fetching..." : "Fetch Academic Records"}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: CV Upload and Submit ── */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
                Step 3 — Upload CV & Submit
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Review your information and upload your CV to complete the application.
              </p>

              {/* NIDA Summary */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                  ✓ Personal Information
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                 <p><span className="font-medium">Name:</span> {nidaData?.fullName}</p>
                  <p><span className="font-medium">Gender:</span> {nidaData?.gender}</p>
                  <p><span className="font-medium">DOB:</span> {nidaData?.dob?.split("T")[0]}</p>
                  <p><span className="font-medium">Phone:</span> {nidaData?.phone}</p>
                  <p><span className="font-medium">Father's Name:</span> {nidaData?.fatherName}</p>
                  <p><span className="font-medium">Mother's Name:</span> {nidaData?.motherName}</p>
                  <p><span className="font-medium">Province:</span> {nidaData?.province}</p>
                  <p><span className="font-medium">District:</span> {nidaData?.district}</p>
                  <p><span className="font-medium">Address:</span> {nidaData?.address}</p>
                </div>
              </div>

              {/* NESA Summary */}
              {/* NESA Summary */}
{/* Show NESA data as read-only */}
<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
  <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">
    ✓ Academic Records Verified
  </p>

  {/* Result Badge */}
  <div className="mb-3">
    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
      nesaData?.result === 'PASS'
        ? 'bg-green-100 text-green-700'
        : 'bg-red-100 text-red-700'
    }`}>
      {nesaData?.result === 'PASS' ? '✅ PASS' : '❌ FAIL'}
    </span>
  </div>

  <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
    <p><span className="font-medium">Name:</span> {nesaData?.fullName}</p>
    <p><span className="font-medium">School:</span> {nesaData?.school}</p>
    <p><span className="font-medium">Option:</span> {nesaData?.option}</p>
    <p><span className="font-medium">Year:</span> {nesaData?.yearCompleted}</p>
  </div>

  {/* Grades */}
  <div className="mt-3">
    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      Grades:
    </p>
    <div className="flex flex-wrap gap-2">
      {Object.entries(nesaData?.grades || {}).map(([subject, grade]) => (
        <span
          key={subject}
          className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 text-xs px-2 py-1 rounded-full"
        >
          {subject}: {grade}
        </span>
      ))}
    </div>
  </div>
</div>


              {/* CV Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Upload CV
                </label>
                <p className="text-xs text-gray-400 mb-2">
                  PDF or Word document only. Max size 5MB.
                </p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    setCvFile(e.target.files[0]);
                    setCvError("");
                  }}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-700 dark:text-gray-300 dark:bg-gray-700"
                />
                {cvFile && (
                  <p className="text-green-600 text-xs mt-1">
                    ✓ {cvFile.name} selected
                  </p>
                )}
                {cvError && (
                  <p className="text-red-500 text-xs mt-1">{cvError}</p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;