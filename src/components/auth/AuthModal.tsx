"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Lock, Mail, User, Check, Sparkles, Smile, RefreshCw, ArrowLeft } from "lucide-react";
import { registerUser, loginUser, verifyUserEmail, resetPassword, User as StorageUser } from "@/utils/storage";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, initialTab = "login" }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register" | "otp" | "forgot" | "reset">("login");
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("Prefer not to say");
  
  // OTP Flow
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [otpPurpose, setOtpPurpose] = useState<"register" | "forgot">("register");

  // UX status
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [copiedMsg, setCopiedMsg] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setError("");
      setSuccessMsg("");
      // Reset forms
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  }, [isOpen, initialTab]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (!isOpen) return null;

  // Generate 6-digit OTP
  const triggerOtpSend = (purpose: "register" | "forgot") => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpPurpose(purpose);
    setCountdown(30); // 30s resend delay
    setTab("otp");
    setSuccessMsg(`We've sent a 6-digit code to ${email}.`);
    setError("");
  };

  // Password evaluation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: "Empty", color: "bg-gray-200" };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

    if (score <= 2) return { score: 1, label: "Weak", color: "bg-red-400" };
    if (score === 3 || score === 4) return { score: 2, label: "Medium", color: "bg-orange-400" };
    if (score === 5) return { score: 3, label: "Strong", color: "bg-emerald-400" };
    return { score: 4, label: "Very Strong", color: "bg-[#8BC34A]" };
  };

  const suggestPassword = () => {
    const prefixes = ["Rose", "Tulip", "Ribbon", "Petal", "Blossom", "Pookie", "Daisy", "Hamper"];
    const middles = ["Pink", "Sweet", "Cute", "Soft", "Heart", "Love", "Gold", "Bow"];
    const suffixes = ["!", "@", "#", "$", "*"];
    const num = Math.floor(Math.random() * 90 + 10); // 10-99
    const pref = prefixes[Math.floor(Math.random() * prefixes.length)];
    const mid = middles[Math.floor(Math.random() * middles.length)];
    const suff = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    const suggested = `${pref}-${mid}-${num}${suff}`;
    setPassword(suggested);
    setConfirmPassword(suggested);
    
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  // Handle Registration
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!name.trim()) return setError("Please enter your name");
    if (!email.trim()) return setError("Please enter email");
    if (password.length < 8) return setError("Password must be at least 8 characters long");
    if (password !== confirmPassword) return setError("Passwords do not match");

    const regResult = registerUser({
      name,
      email,
      password,
      gender,
      isVerified: false,
      provider: "local"
    });

    if (!regResult.success) {
      setError(regResult.error || "Registration failed");
    } else {
      triggerOtpSend("register");
    }
  };

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) return setError("Please fill all fields");

    const result = loginUser(email, password);
    if (!result.success) {
      if (result.error === "EMAIL_NOT_VERIFIED") {
        // User registered but didn't verify. Trigger OTP again
        triggerOtpSend("register");
      } else {
        setError(result.error || "Login failed");
      }
    } else {
      // Show success micro-animation or welcome back toast
      onClose();
    }
  };

  // Handle OTP input
  const handleOtpChange = (index: number, val: string) => {
    if (isNaN(Number(val))) return;
    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    // Auto focus next box
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpVerify = () => {
    const code = otp.join("");
    if (code.length < 6) return setError("Please enter the full 6-digit code");

    if (code !== generatedOtp) {
      return setError("Invalid verification code! Try again.");
    }

    if (otpPurpose === "register") {
      verifyUserEmail(email);
      loginUser(email, password); // Auto login
      setSuccessMsg("Account verified successfully! 🎉");
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      // forgot password verification success, take to reset screen
      setTab("reset");
      setError("");
      setSuccessMsg("Email verified! Please enter your new password.");
      setPassword("");
      setConfirmPassword("");
    }
  };

  // Handle Social Sign In Mock
  const handleSocialLogin = (provider: "google" | "facebook" | "apple") => {
    const mockEmail = `happy.customer@${provider}.com`;
    loginUser(mockEmail, undefined, true);
    onClose();
  };

  // Handle Forgot Password
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setError("Please enter your registered email");
    triggerOtpSend("forgot");
  };

  // Handle Reset Password Submit
  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return setError("Password must be at least 8 characters");
    if (password !== confirmPassword) return setError("Passwords do not match");

    const success = resetPassword(email, password);
    if (success) {
      setSuccessMsg("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        setTab("login");
        setSuccessMsg("");
        setPassword("");
        setConfirmPassword("");
      }, 2000);
    } else {
      setError("Something went wrong. Please try again.");
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl border border-[#FDE2EC] shadow-xl overflow-hidden relative"
      >
        {/* Header decoration */}
        <div className="h-2 bg-gradient-to-r from-[#D6336C] via-[#F06292] to-[#D6336C]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#4A2C33]/60 hover:text-[#D6336C] hover:bg-[#FFF7FA] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8">
          {/* Logo / Wordmark */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-quicksand font-bold text-[#D6336C] flex items-center justify-center gap-1.5">
              its.kirkiri <span className="text-sm">💕</span>
            </h2>
            <p className="text-xs font-poppins text-[#4A2C33]/70 mt-1">
              Your sweet corner for handmade goodies
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-xl font-poppins border border-red-100">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 bg-[#FFF7FA] text-[#D6336C] text-xs rounded-xl font-poppins border border-[#FDE2EC] flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#8BC34A]" />
              {successMsg}
            </div>
          )}

          {/* TAB CONTENT: LOGIN */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold font-poppins text-[#4A2C33] mb-1.5">
                  Email ID
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A2C33]/50" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FFF7FA] border border-[#FDE2EC] rounded-2xl text-sm font-poppins text-[#4A2C33] placeholder-[#4A2C33]/40 focus:outline-none focus:ring-2 focus:ring-[#F06292]/30"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold font-poppins text-[#4A2C33]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setTab("forgot")}
                    className="text-xs font-semibold font-poppins text-[#D6336C] hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A2C33]/50" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#FFF7FA] border border-[#FDE2EC] rounded-2xl text-sm font-poppins text-[#4A2C33] placeholder-[#4A2C33]/40 focus:outline-none focus:ring-2 focus:ring-[#F06292]/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4A2C33]/50 hover:text-[#D6336C] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#D6336C] hover:bg-[#C2185B] text-white font-quicksand font-bold text-sm rounded-2xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                Sign In
              </button>

              <div className="text-center text-xs font-poppins text-[#4A2C33]/60 mt-4">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setTab("register")}
                  className="font-bold text-[#D6336C] hover:underline"
                >
                  Sign Up
                </button>
              </div>

              {/* Social login divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#FDE2EC]" />
                </div>
                <span className="relative bg-white px-3 text-[10px] uppercase font-poppins font-semibold text-[#4A2C33]/50">
                  or continue with
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSocialLogin("google")}
                  className="py-2.5 border border-[#FDE2EC] bg-[#FFF7FA] hover:bg-white rounded-2xl text-[11px] font-semibold font-poppins text-[#4A2C33] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin("facebook")}
                  className="py-2.5 border border-[#FDE2EC] bg-[#FFF7FA] hover:bg-white rounded-2xl text-[11px] font-semibold font-poppins text-[#4A2C33] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Facebook</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin("apple")}
                  className="py-2.5 border border-[#FDE2EC] bg-[#FFF7FA] hover:bg-white rounded-2xl text-[11px] font-semibold font-poppins text-[#4A2C33] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Apple</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB CONTENT: REGISTER */}
          {tab === "register" && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold font-poppins text-[#4A2C33] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A2C33]/50" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Kirtika"
                    className="w-full pl-10 pr-4 py-2 bg-[#FFF7FA] border border-[#FDE2EC] rounded-2xl text-sm font-poppins text-[#4A2C33] placeholder-[#4A2C33]/40 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold font-poppins text-[#4A2C33] mb-1">
                  Email ID
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A2C33]/50" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full pl-10 pr-4 py-2 bg-[#FFF7FA] border border-[#FDE2EC] rounded-2xl text-sm font-poppins text-[#4A2C33] placeholder-[#4A2C33]/40 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold font-poppins text-[#4A2C33]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={suggestPassword}
                    className="text-[11px] font-bold font-poppins text-[#D6336C] hover:underline flex items-center gap-0.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Suggest Strong
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A2C33]/50" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full pl-10 pr-10 py-2 bg-[#FFF7FA] border border-[#FDE2EC] rounded-2xl text-sm font-poppins text-[#4A2C33] placeholder-[#4A2C33]/40 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4A2C33]/50 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength meter */}
                {password && (
                  <div className="mt-1.5 space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-poppins">
                      <span className="text-[#4A2C33]/60">Strength:</span>
                      <span className="font-bold text-[#4A2C33]">{strength.label}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-full flex-1 mr-0.5 last:mr-0 transition-colors duration-300 ${
                            i < strength.score ? strength.color : "bg-gray-100"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] font-poppins text-[#4A2C33]/50 leading-tight">
                      Tip: Use 12+ characters with letters, numbers, and symbols (e.g. `Flower-Cart5!`).
                    </p>
                  </div>
                )}
                {copiedMsg && (
                  <span className="text-[10px] font-poppins font-medium text-[#8BC34A] mt-0.5 block">
                    Suggested password filled in password fields! 🎉
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold font-poppins text-[#4A2C33] mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A2C33]/50" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-4 py-2 bg-[#FFF7FA] border border-[#FDE2EC] rounded-2xl text-sm font-poppins text-[#4A2C33] placeholder-[#4A2C33]/40 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold font-poppins text-[#4A2C33] mb-1">
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Female", "Male", "Other"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g === "Other" ? "Prefer not to say" : g)}
                      className={`py-1.5 border text-xs rounded-xl font-poppins font-medium transition-all cursor-pointer ${
                        (gender === g || (g === "Other" && gender === "Prefer not to say"))
                          ? "bg-[#FDE2EC] border-[#F06292] text-[#D6336C]"
                          : "border-[#FDE2EC] bg-[#FFF7FA] text-[#4A2C33]/70 hover:bg-white"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#D6336C] hover:bg-[#C2185B] text-white font-quicksand font-bold text-sm rounded-2xl shadow-md transition-all active:scale-[0.98] mt-2 cursor-pointer"
              >
                Create Account
              </button>

              <div className="text-center text-xs font-poppins text-[#4A2C33]/60 mt-3">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className="font-bold text-[#D6336C] hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* TAB CONTENT: FORGOT PASSWORD */}
          {tab === "forgot" && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className="text-xs font-semibold font-poppins text-[#D6336C] hover:underline flex items-center gap-1 mb-4"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </button>
                <label className="block text-xs font-semibold font-poppins text-[#4A2C33] mb-1.5">
                  Enter your registered Email ID
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A2C33]/50" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FFF7FA] border border-[#FDE2EC] rounded-2xl text-sm font-poppins text-[#4A2C33] placeholder-[#4A2C33]/40 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#D6336C] hover:bg-[#C2185B] text-white font-quicksand font-bold text-sm rounded-2xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                Send Reset Code
              </button>
            </form>
          )}

          {/* TAB CONTENT: EMAIL OTP VERIFICATION */}
          {tab === "otp" && (
            <div className="space-y-5">
              <div className="text-center font-poppins">
                <p className="text-xs text-[#4A2C33]/70">
                  Enter the 6-digit code we sent to:
                </p>
                <p className="text-sm font-semibold text-[#D6336C] mt-0.5">{email}</p>
              </div>

              {/* DEMO TOOLTIP - Displaying OTP on screen for mock prototype testing */}
              <div className="p-3 bg-[#FFF7FA] border border-[#FDE2EC] rounded-2xl text-center">
                <p className="text-[10px] font-bold font-poppins uppercase tracking-wider text-[#D6336C]/70">
                  Prototype Demo OTP Code:
                </p>
                <p className="text-2xl font-quicksand font-extrabold text-[#D6336C] select-all tracking-widest mt-1">
                  {generatedOtp}
                </p>
                <p className="text-[9px] font-poppins text-[#4A2C33]/50 mt-1">
                  (Simply type or copy this code to verify)
                </p>
              </div>

              <div className="flex justify-between gap-1.5 max-w-xs mx-auto">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-12 border border-[#FDE2EC] bg-[#FFF7FA] rounded-xl text-center text-lg font-bold font-quicksand text-[#D6336C] focus:outline-none focus:ring-2 focus:ring-[#F06292]/30"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleOtpVerify}
                className="w-full py-3 bg-[#D6336C] hover:bg-[#C2185B] text-white font-quicksand font-bold text-sm rounded-2xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                Verify Code
              </button>

              <div className="flex justify-between items-center px-1 text-xs font-poppins">
                <button
                  type="button"
                  onClick={() => {
                    const newMail = prompt("Enter corrected Email ID:", email);
                    if (newMail && newMail.includes("@")) {
                      setEmail(newMail);
                      setSuccessMsg(`Changed email to ${newMail}. Send a new OTP.`);
                      setCountdown(0);
                    }
                  }}
                  className="font-bold text-[#4A2C33]/60 hover:text-[#D6336C] hover:underline"
                >
                  Change Email ID
                </button>
                
                <button
                  type="button"
                  disabled={countdown > 0}
                  onClick={() => triggerOtpSend(otpPurpose)}
                  className={`font-bold flex items-center gap-1 ${
                    countdown > 0 
                      ? "text-[#4A2C33]/30 cursor-not-allowed" 
                      : "text-[#D6336C] hover:underline cursor-pointer"
                  }`}
                >
                  <RefreshCw className={`w-3 h-3 ${countdown > 0 ? "" : "animate-spin-slow"}`} />
                  {countdown > 0 ? `Resend (${countdown}s)` : "Resend Code"}
                </button>
              </div>
            </div>
          )}

          {/* TAB CONTENT: RESET PASSWORD */}
          {tab === "reset" && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <p className="text-xs font-poppins text-[#4A2C33]/60">
                Please set your new password below.
              </p>
              
              <div>
                <label className="block text-xs font-semibold font-poppins text-[#4A2C33] mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A2C33]/50" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-4 py-2 bg-[#FFF7FA] border border-[#FDE2EC] rounded-2xl text-sm font-poppins text-[#4A2C33]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold font-poppins text-[#4A2C33] mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A2C33]/50" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-10 pr-4 py-2 bg-[#FFF7FA] border border-[#FDE2EC] rounded-2xl text-sm font-poppins text-[#4A2C33]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#D6336C] hover:bg-[#C2185B] text-white font-quicksand font-bold text-sm rounded-2xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                Reset Password
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
