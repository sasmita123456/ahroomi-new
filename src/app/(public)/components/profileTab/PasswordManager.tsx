"use client";

import { useState, useCallback, useMemo } from "react";
import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordRequirement {
  text: string;
  met: boolean;
}

interface PasswordInputProps {
  id: string;
  label: string;
  name: keyof PasswordForm;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  placeholder?: string;
  required?: boolean;
}

// Reusable password input component
const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  label,
  name,
  value,
  onChange,
  error,
  showPassword,
  togglePasswordVisibility,
  placeholder,
  required = true,
}) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22a6dd] transition-all duration-300 ${
          error ? "border-red-300 focus:ring-red-500" : "focus:ring-[#22a6dd]"
        }`}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#22a6dd] rounded-full p-1"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
    {error && (
      <span
        id={`${id}-error`}
        className="text-sm text-red-600 flex items-center gap-1"
      >
        <FiAlertCircle className="w-4 h-4" aria-hidden="true" />
        {error}
      </span>
    )}
  </div>
);

export default function PasswordManager() {
  const [formData, setFormData] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoize password requirements to avoid recalculating on every render
  const passwordRequirements = useMemo<PasswordRequirement[]>(
    () => [
      { text: "At least 8 characters", met: formData.newPassword.length >= 8 },
      { text: "One uppercase letter", met: /[A-Z]/.test(formData.newPassword) },
      { text: "One number", met: /[0-9]/.test(formData.newPassword) },
      {
        text: "One special character",
        met: /[^A-Za-z0-9]/.test(formData.newPassword),
      },
    ],
    [formData.newPassword]
  );

  // Memoize password strength calculation
  const passwordStrength = useMemo(() => {
    const { newPassword } = formData;
    let strength = 0;
    if (newPassword.length >= 8) strength += 1;
    if (/[A-Z]/.test(newPassword)) strength += 1;
    if (/[0-9]/.test(newPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;
    return strength;
  }, [formData.newPassword]);

  // Memoize password strength color and text
  const passwordStrengthInfo = useMemo(() => {
    const strengthLevels = [
      { color: "bg-gray-200", text: "Very weak" },
      { color: "bg-red-500", text: "Weak" },
      { color: "bg-orange-500", text: "Fair" },
      { color: "bg-yellow-500", text: "Good" },
      { color: "bg-green-500", text: "Strong" },
    ];
    return strengthLevels[passwordStrength] || strengthLevels[0];
  }, [passwordStrength]);

  // Use useCallback to prevent unnecessary re-renders
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors]
  );

  const togglePasswordVisibility = useCallback(
    (field: keyof typeof showPasswords) => {
      setShowPasswords((prev) => ({
        ...prev,
        [field]: !prev[field],
      }));
    },
    []
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (!/(?=.*[A-Z])/.test(formData.newPassword)) {
      newErrors.newPassword = "Include at least one uppercase letter";
    } else if (!/(?=.*[0-9])/.test(formData.newPassword)) {
      newErrors.newPassword = "Include at least one number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      setIsSubmitting(true);

      try {
        // Simulate API call
        console.log("Password update submitted:", formData);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

        // Reset form on success
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Show success message
        alert("Password updated successfully!");
      } catch (error) {
        console.error("Error updating password:", error);
        alert("Failed to update password. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm]
  );

  return (
    <div className="">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Password Manager
          </h2>

          {/* Security Banner */}
          <div className="p-3 text-sm bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3">
              <FiLock className="w-4 h-4 text-blue-600" aria-hidden="true" />
              <p className="text-blue-700">
                Your password is encrypted and stored securely
              </p>
            </div>
          </div>
        </div>

        {/* Password Update Form */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
          {/* Form Header */}
          <div className="px-4 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-base font-bold text-gray-900">
              Update Your Password
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            {/* Password Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Current Password */}
              <PasswordInput
                id="current-password"
                label="Current Password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                error={errors.currentPassword}
                showPassword={showPasswords.current}
                togglePasswordVisibility={() =>
                  togglePasswordVisibility("current")
                }
                placeholder="Enter your current password"
              />

              {/* New Password */}
              <PasswordInput
                id="new-password"
                label="New Password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                error={errors.newPassword}
                showPassword={showPasswords.new}
                togglePasswordVisibility={() => togglePasswordVisibility("new")}
                placeholder="Enter new password"
              />

              {/* Confirm Password */}
              <PasswordInput
                id="confirm-password"
                label="Confirm New Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
                showPassword={showPasswords.confirm}
                togglePasswordVisibility={() =>
                  togglePasswordVisibility("confirm")
                }
                placeholder="Re-enter password"
              />
            </div>

            {/* Password Requirements - Full Width Below Grid */}
            {formData.newPassword && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">
                  Password Requirements:
                </h3>
                <ul className="space-y-2">
                  {passwordRequirements.map((req, index) => (
                    <li
                      key={index}
                      className={`flex items-center gap-2 text-sm ${
                        req.met ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      <FiCheck
                        className={`w-4 h-4 ${
                          req.met ? "text-green-600" : "text-gray-400"
                        }`}
                        aria-hidden="true"
                      />
                      {req.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Password Strength - Full Width Below Requirements */}
            {formData.newPassword && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Password strength</span>
                  <span
                    className={`font-semibold ${
                      passwordStrength === 4
                        ? "text-green-600"
                        : passwordStrength >= 2
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {passwordStrengthInfo.text}
                  </span>
                </div>
                <div
                  className="h-2 bg-gray-200 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={passwordStrength * 25}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Password strength: ${passwordStrengthInfo.text}`}
                >
                  <div
                    className={`${passwordStrengthInfo.color} h-full transition-all duration-300`}
                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button - Below All Other Elements */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`group cursor-pointer text-sm flex items-center gap-2 px-4 py-2.5 bg-[#f9c11c] text-gray-800 font-semibold rounded-lg shadow-md transition-colors ${
                  isSubmitting
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-[#e3af15]"
                }`}
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
