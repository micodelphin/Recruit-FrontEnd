import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyApplication, getNESARecord } from "../../services/api";
import { useAuth } from "../../context/authContex";
import toast from "react-hot-toast";

const statusConfig = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700 border-yellow-300",
    icon: "⏳",
    message:
      "Your application has been received and is waiting to be reviewed.",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    color: "bg-blue-100 text-blue-700 border-blue-300",
    icon: "🔍",
    message: "Your application is currently being reviewed by our HR team.",
  },
  APPROVED: {
    label: "Approved",
    color: "bg-green-100 text-green-700 border-green-300",
    icon: "✅",
    message: "Congratulations! Your application has been approved.",
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-red-100 text-red-700 border-red-300",
    icon: "❌",
    message: "Unfortunately your application was not successful this time.",
  },
};

const ApplicationStatus = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const [application, setApplication] = useState(null);
  const [nesaData, setNesaData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await getMyApplication();
        console.log("Application data:", res.data.data); // add this
        setApplication(res.data.data);
      } catch (error) {
        if (error.response?.status === 404) {
          navigate("/apply");
        } else {
          toast.error("Error fetching your application.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 text-lg">Loading your application...</p>
      </div>
    );
  }

  const status = application?.status;
  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Application
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Welcome back, {user?.firstName}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>

        {/* Status Card */}
        <div className={`border rounded-xl p-6 mb-6 ${config.color}`}>
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-3xl">{config.icon}</span>
            <div>
              <p className="font-semibold text-lg">Status: {config.label}</p>
              <p className="text-sm">{config.message}</p>
            </div>
          </div>

          {/* Show rejection reason */}
          {status === "REJECTED" && application?.reviewComment && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm font-medium text-red-700">
                Reason: {application.reviewComment}
              </p>
            </div>
          )}

          {/* Show reviewed by */}
          {application?.reviewer && (
            <p className="text-xs mt-3 opacity-70">
              Reviewed by: {application.reviewer.firstName}{" "}
              {application.reviewer.lastName}
            </p>
          )}
        </div>

        {/* Application Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <p className="font-medium text-gray-500">Full Name</p>
              <p>
                {application?.firstName} {application?.lastName}
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-500">National ID</p>
              <p>{application?.nationalId}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Gender</p>
              <p>{application?.gender}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Date of Birth</p>
              <p>
                {application?.dateOfBirth
                  ? new Date(application.dateOfBirth).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Phone</p>
              <p>{application?.phone || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Address</p>
              <p>{application?.address || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Province</p>
              <p>{application?.province || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">District</p>
              <p>{application?.district || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Academic Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Academic Information
          </h2>
          <div className="mb-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-bold ${
                application?.nesaResult === "PASS"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {application?.nesaResult === "PASS" ? "✅ PASS" : "❌ FAIL"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <p className="font-medium text-gray-500">School</p>
              <p>{application?.schoolName}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Combination</p>
              <p>{application?.combination}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Year of Completion</p>
              <p>{application?.yearOfCompletion}</p>
            </div>
          </div>

          {/* Grades */}
          <div className="mt-4">
            <p className="font-medium text-gray-500 text-sm mb-2">Grades</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Math", value: application?.mathematicsGrade },
                { label: "English", value: application?.englishGrade },
                { label: "Physics", value: application?.physicsGrade },
                { label: "Chemistry", value: application?.chemistryGrade },
                { label: "Biology", value: application?.biologyGrade },
              ]
                .filter((g) => g.value)
                .map((g) => (
                  <span
                    key={g.label}
                    className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full"
                  >
                    {g.label}: {g.value}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* CV Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            CV
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            📄 {application?.cvOriginalName || "CV uploaded"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Submitted on:{" "}
            {new Date(application?.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatus;
