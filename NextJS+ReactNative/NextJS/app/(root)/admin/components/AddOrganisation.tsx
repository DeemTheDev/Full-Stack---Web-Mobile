"use client";
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Mail,
  Globe,
  Building2,
  Check,
  X,
  Key,
  Copy,
  RefreshCw,
} from "lucide-react";
import { createOrganisationWithAuth } from "@/db";
import { useRouter } from "next/navigation";

const AddOrganisation = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    address: "",
    website: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  // Generate a random password
  const generatePassword = () => {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData((prev) => ({ ...prev, password }));
  };

  // Watch for success state and show toast
  useEffect(() => {
    if (isSuccess) {
      // Reset success state after toast duration
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 3000); // Toast will show for 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  // Generate password on initial load
  useEffect(() => {
    generatePassword();
  }, []);

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(formData.password);
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy password:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full max-w-sm flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="skeleton h-42 w-42 shrink-0 rounded-full"></div>
          <div className="flex flex-col gap-4">
            <div className="skeleton h-4 w-64"></div>
            <div className="skeleton h-4 w-80"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createOrganisationWithAuth(formData);
      setIsSuccess(true);
      // Use router.refresh() inside setTimeout to ensure form submission is complete
      setTimeout(() => {
        router.refresh();
      }, 0);
    } catch (err) {
      console.error("Error creating organisation:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <form onSubmit={handleSubmit}>
          {/* Basic Info Section */}
          <div className="bg-base-100 rounded-xl shadow-sm p-4 space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text "
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Organisation Name"
                  className="input input-accent w-full pl-8"
                  required
                />
                <Building2
                  size={16}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Email Address"
                  className="input input-accent w-full pl-8"
                  required
                />
                <Mail
                  size={16}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              <div className="relative">
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      website: e.target.value,
                    }))
                  }
                  placeholder="Website URL"
                  className="input input-accent w-full pl-8"
                />
                <Globe
                  size={16}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-base-100 rounded-xl shadow-sm p-4 space-y-4">
            <h3 className="text-lg font-medium">About</h3>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Tell us about your organization..."
              className="textarea textarea-accent w-full h-32"
            />
          </div>

          {/* Address Section */}
          <div className="bg-base-100 rounded-xl shadow-sm p-4 space-y-4">
            <h3 className="text-lg font-medium">Location</h3>
            <div className="relative">
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
                placeholder="Enter organization address"
                className="input input-accent w-full pl-8"
                required
              />
              <MapPin
                size={16}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          {/* Generate Logins Section */}
          <div className="bg-base-100 rounded-xl shadow-sm p-4 space-y-4">
            <h3 className="text-lg font-medium">Generated Login Credentials</h3>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  className="input input-accent w-full pl-8 bg-emerald-950"
                  readOnly
                />
                <Mail
                  size={16}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={formData.password}
                  className="input input-accent w-full pl-8 pr-20"
                  readOnly
                />
                <Key
                  size={16}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="btn btn-ghost btn-sm p-1"
                    title="Generate new password"
                  >
                    <RefreshCw size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={copyPassword}
                    className="btn btn-ghost btn-sm p-1"
                    title={passwordCopied ? "Copied!" : "Copy password"}
                  >
                    <Copy
                      size={16}
                      className={passwordCopied ? "text-green-500" : ""}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: "",
                  email: "",
                  description: "",
                  address: "",
                  website: "",
                  password: "",
                });
                generatePassword();
              }}
              className="btn btn-ghost"
              disabled={loading}
            >
              <X size={16} className="mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Adding...
                </>
              ) : (
                <>
                  <Check size={16} className="mr-2" />
                  Add Organisation
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Toast */}
      {isSuccess && (
        <div className="fixed bottom-4 right-4 flex items-center bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-500 ease-in-out z-50">
          <Check size={20} className="mr-2" />
          <span>Organisation added successfully!</span>
        </div>
      )}
    </>
  );
};

export default AddOrganisation;
