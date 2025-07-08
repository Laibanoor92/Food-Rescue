// 

"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState("email") // email, otp, resetPassword
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [formError, setFormError] = useState("")
  const [remainingTime, setRemainingTime] = useState(0)

  // Set your API URL here
  const API_URL = "http://localhost:5000"

  // Handle email submission to request OTP
  async function handleEmailSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    setFormError("")

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Request failed")
      }

      setRemainingTime(10 * 60) // 10 minutes in seconds
      startTimer()
      
      toast.success("OTP Sent", {
        description: "Please check your email for the verification code"
      })
      
      setStep("otp")
    } catch (error) {
      // Don't reveal if email exists or not for security
      toast.info("Request Submitted", {
        description: "If an account exists with that email, we've sent a verification code."
      })
      
      console.error("Error sending OTP:", error)
      setFormError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Start countdown timer
  const startTimer = () => {
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Handle OTP verification
  async function handleOtpSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    setFormError("")

    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Invalid or expired OTP")
      }

      toast.success("OTP Verified", {
        description: "Please set your new password"
      })
      
      setStep("resetPassword")
    } catch (error) {
      toast.error("Verification Failed", {
        description: error.message || "Invalid or expired OTP"
      })
      setFormError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle password reset
  async function handlePasswordReset(event) {
    event.preventDefault()
    setIsLoading(true)
    setFormError("")

    // Validate passwords
    if (newPassword.length < 6) {
      setFormError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setFormError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed")
      }

      toast.success("Password Reset Successful", {
        description: "Your password has been reset successfully"
      })
      
      navigate("/signin")
    } catch (error) {
      toast.error("Password Reset Failed", {
        description: error.message || "Please try again later"
      })
      setFormError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Format remaining time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  // Resend OTP
  const handleResendOtp = async () => {
    if (remainingTime > 0) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP")
      }

      setRemainingTime(10 * 60)
      startTimer()

      toast.success("OTP Resent", {
        description: "Please check your email for the new verification code"
      })
    } catch (error) {
      toast.error("Failed to Resend OTP", {
        description: error.message || "Please try again later"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="mt-2 text-sm text-gray-600">
            {step === "email" && "Enter your email to receive a verification code"}
            {step === "otp" && "Enter the verification code sent to your email"}
            {step === "resetPassword" && "Create a new password for your account"}
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {formError && (
            <div className="px-6 pt-6 pb-0">
              <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded text-sm text-red-700">
                {formError}
              </div>
            </div>
          )}
          
          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="p-6 space-y-6">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </Label>
                <Input 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email" 
                  placeholder="john@example.com" 
                  required 
                  className="w-full"
                />
              </div>
              
              <div className="pt-2">
                <Button
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending code...
                    </span>
                  ) : "Send Verification Code"}
                </Button>
              </div>
            </form>
          )}
          
          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="p-6 space-y-6">
              <div>
                <Label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </Label>
                <Input 
                  id="otp" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code" 
                  required 
                  maxLength={6}
                  className="w-full text-center text-lg tracking-widest font-medium"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    {remainingTime > 0 ? (
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Code expires in {formatTime(remainingTime)}
                      </span>
                    ) : (
                      <span className="text-red-500">Code has expired</span>
                    )}
                  </p>
                  <button 
                    type="button"
                    onClick={handleResendOtp}
                    disabled={remainingTime > 0 || isLoading}
                    className="text-xs text-green-600 hover:text-green-800 disabled:text-gray-400"
                  >
                    Resend code
                  </button>
                </div>
              </div>
              
              <div className="space-y-3 pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
                  disabled={isLoading || remainingTime === 0}
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-md transition-colors" 
                  onClick={() => setStep("email")}
                >
                  Back to Email
                </Button>
              </div>
            </form>
          )}
          
          {step === "resetPassword" && (
            <form onSubmit={handlePasswordReset} className="p-6 space-y-6">
              <div>
                <Label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </Label>
                <Input 
                  id="newPassword" 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password" 
                  required 
                  className="w-full"
                />
                <p className="mt-1 text-xs text-gray-500 flex items-center">
                  <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Password must be at least 6 characters
                </p>
              </div>
              
              <div>
                <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </Label>
                <Input 
                  id="confirmPassword" 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password" 
                  required 
                  className="w-full"
                />
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            </form>
          )}
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              {step === "email" && (
                <>
                  Remember your password?{" "}
                  <Link to="/signin" className="font-medium text-green-600 hover:underline">
                    Sign in
                  </Link>
                </>
              )}
              
              {(step === "otp" || step === "resetPassword") && (
                <Link to="/signin" className="font-medium text-green-600 hover:underline">
                  Back to Sign in
                </Link>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}