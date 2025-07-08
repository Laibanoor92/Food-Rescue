import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function VerifyEmail() {
  const { token: rawToken } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Clean the token by removing anything after a colon
        const token = rawToken.split(':')[0];
        console.log("Raw token from URL:", rawToken);
        console.log("Cleaned token for verification:", token);
        
        const response = await fetch(`http://localhost:5000/api/auth/verify-email/${token}`, { 
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();
        console.log("Verification response:", data);
        
        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
          setTimeout(() => navigate("/signin"), 2000);
        } else {
          setStatus("failed");
          setMessage(data.message || "Verification failed");
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        setStatus("failed");
        setMessage("An error occurred during verification");
      }
    };

    verifyEmail();
  }, [rawToken, navigate]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Email Verification</h2>
      
      {status === "verifying" && (
        <div className="text-center">
          <p>Verifying your email address...</p>
          <div className="mt-4 flex justify-center">
            {/* Loading spinner */}
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      )}
      
      {status === "success" && (
        <div className="text-center">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p>{message}</p>
          </div>
          <p className="mt-4">Redirecting to login page...</p>
        </div>
      )}
      
      {status === "failed" && (
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{message}</p>
          </div>
          <div className="mt-4">
            <Link to="/signin" className="text-blue-500 hover:underline">
              Return to login page
            </Link>
          </div>
        </div>
      )}
      
      {/* For debugging - remove in production */}
      {/* {process.env.NODE_ENV !== 'production' && (
        <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500">
          <p>Debug Info:</p>
          <p>Raw token: {rawToken}</p>
          <p>Token length: {rawToken?.length}</p>
          <p>Cleaned token: {rawToken?.split(':')[0]}</p>
        </div>
      )} */}
    </div>
  );
}

export default VerifyEmail;