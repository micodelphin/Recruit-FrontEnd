import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/shared/Sidebar";
import { getApplicationById, reviewApplication } from "../../services/api";
import {
  FaFileAlt,
  FaSearch,
  FaArrowLeft,
  FaDownload,
  FaEye,
} from "react-icons/fa";
import toast from "react-hot-toast";

const hrLinks = [
  { path: "/hr/dashboard", label: "Dashboard", icon: <FaFileAlt /> },
  { path: "/hr/applications", label: "Applications", icon: <FaSearch /> },
];

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-700",
  UNDER_REVIEW: "bg-blue-100 text-blue-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cvUrl, setCvUrl] = useState(null);
  const [cvLoading, setCvLoading] = useState(false);

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [showReviewBox, setShowReviewBox] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showCV, setShowCV] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await getApplicationById(id);
        setApplication(res.data.data);
      } catch (error) {
        toast.error("Application not found.");
        navigate("/hr/applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [id]);

  useEffect(() => {
  return () => {
    if (cvUrl) {
      URL.revokeObjectURL(cvUrl);
    }
  };
}, [cvUrl]);

  const handleReview = async () => {
    setCommentError("");
    if (selectedStatus === "REJECTED" && !reviewComment.trim()) {
      setCommentError("A reason is required when rejecting an application.");
      return;
    }
    setReviewing(true);
    try {
      await reviewApplication(id, { status: selectedStatus, reviewComment });
      toast.success(
        `Application ${selectedStatus.toLowerCase().replace("_", " ")} successfully.`,
      );
      navigate("/hr/applications");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error reviewing application.",
      );
    } finally {
      setReviewing(false);
    }
  };

  const openReview = (status) => {
    setSelectedStatus(status);
    setReviewComment("");
    setCommentError("");
    setShowReviewBox(true);
  };

  const handleViewCV = async () => {
  if (cvUrl) {
    setShowCV(true);
    return;
  }

  setCvLoading(true);

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:8000/api/applications/${id}/cv`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      toast.error("Error loading CV.");
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    setCvUrl(url);
    setShowCV(true);
  } catch (error) {
    console.error(error);
    toast.error("Error loading CV.");
  } finally {
    setCvLoading(false);
  }
};

  const handleDownloadCV = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/applications/${id}/cv`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        toast.error("Error downloading CV.");
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = application?.cvOriginalName || "cv.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Error downloading CV.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading application...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar links={hrLinks} />

      <div className="ml-64 flex-1 p-8">
        {/* Back button */}
        <button
          onClick={() => navigate("/hr/applications")}
          className="flex items-center space-x-2 text-indigo-600 hover:underline mb-6"
        >
          <FaArrowLeft />
          <span>Back to Applications</span>
        </button>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {application?.firstName} {application?.lastName}
            </h1>
            <p className="text-gray-500 text-sm">
              Applied on {new Date(application?.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[application?.status]}`}
          >
            {application?.status}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">National ID</p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {application?.nationalId}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Gender</p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {application?.gender}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Date of Birth</p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {new Date(application?.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {application?.phone || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Address</p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {application?.address}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Province</p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {application?.province}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">District</p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {application?.district}
                  </p>
                </div>
              </div>
            </div>

            {/* Academic Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Academic Information
              </h2>
              <div className="mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    application?.nesaResult === "PASS"
                      ? "bg-green-100 text-green-700"
                      : application?.nesaResult === "FAIL"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {application?.nesaResult === "PASS"
                    ? "✅ PASS"
                    : application?.nesaResult === "FAIL"
                      ? "❌ FAIL"
                      : "N/A"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-500">School</p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {application?.schoolName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Combination</p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {application?.combination}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Year of Completion</p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {application?.yearOfCompletion}
                  </p>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-2">Grades</p>
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

          {/* Right Column */}
          <div className="space-y-6">
            {/* CV Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                CV
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                📄 {application?.cvOriginalName || "CV file"}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleViewCV}
                  disabled={cvLoading}
                  className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm disabled:opacity-60"
                >
                  <FaEye />
                  <span>{cvLoading ? "Loading..." : "View CV"}</span>
                </button>
                <button
                  onClick={handleDownloadCV}
                  className="flex items-center space-x-1 text-sm text-indigo-600 hover:underline"
                >
                  <FaDownload />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Review Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Review Application
              </h2>
              {application?.reviewComment && (
                <div className="mb-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">
                    Previous comment:
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {application.reviewComment}
                  </p>
                </div>
              )}
              {!showReviewBox ? (
                <div className="space-y-2">
                  <button
                    onClick={() => openReview("UNDER_REVIEW")}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition text-sm"
                  >
                    Mark as Under Review
                  </button>
                  <button
                    onClick={() => openReview("APPROVED")}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => openReview("REJECTED")}
                    className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition text-sm"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {selectedStatus === "REJECTED"
                      ? "Reason for rejection (required)"
                      : "Comment (optional)"}
                  </p>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => {
                      setReviewComment(e.target.value);
                      setCommentError("");
                    }}
                    rows={3}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white ${
                      commentError
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder={
                      selectedStatus === "REJECTED"
                        ? "Enter rejection reason..."
                        : "Enter optional comment..."
                    }
                  />
                  {commentError && (
                    <p className="text-red-500 text-xs mt-1">{commentError}</p>
                  )}
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => setShowReviewBox(false)}
                      className="flex-1 border border-gray-300 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReview}
                      disabled={reviewing}
                      className={`flex-1 text-white py-2 rounded-lg transition text-sm disabled:opacity-60 ${
                        selectedStatus === "REJECTED"
                          ? "bg-red-500 hover:bg-red-600"
                          : selectedStatus === "APPROVED"
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      {reviewing
                        ? "Saving..."
                        : `Confirm ${selectedStatus.replace("_", " ")}`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CV Modal */}
      {showCV && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl h-5/6 flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <FaFileAlt className="text-indigo-600" />
                <p className="font-medium text-gray-800 dark:text-white text-sm">
                  {application?.cvOriginalName || "CV file"}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowCV(false)}
                  className="text-gray-500 hover:text-red-500 transition text-xl font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="flex-1 p-4">
              <iframe
  src={cvUrl || `http://localhost:8000/api/applications/${id}/cv`}
  className="w-full h-full rounded-lg"
  title="CV Preview"
/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetail;
