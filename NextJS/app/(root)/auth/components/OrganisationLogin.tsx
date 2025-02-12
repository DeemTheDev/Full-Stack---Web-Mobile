"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Shield } from "lucide-react";
import { verifyOrganisationLogin } from "@/db";

const OrganisationLogin = () => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await verifyOrganisationLogin(
        credentials.email,
        credentials.password
      );

      if (result.success && result.organisationId) {
        router.push(`/organisation/${result.organisationId}`);
      } else {
        setError(result.error || "An error occurred during login");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md">
        <div className="bg-base-100 rounded-xl shadow-sm p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">
              {isAdmin ? "Admin Access" : "Organisation Login"}
            </h2>
            <p className="text-base-content/70 mt-2">
              {isAdmin
                ? "Access the admin dashboard via GitHub"
                : "Login to access your organisation dashboard"}
            </p>
          </div>

          {/* Toggle Button */}
          <div className="flex justify-center">
            <div className="join">
              <button
                className={`join-item btn ${!isAdmin ? "btn-active" : ""}`}
                onClick={() => setIsAdmin(false)}
              >
                <User className="w-4 h-4 mr-2" />
                Organisation
              </button>
              <button
                className={`join-item btn ${isAdmin ? "btn-active" : ""}`}
                onClick={() => setIsAdmin(true)}
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </button>
            </div>
          </div>

          {isAdmin ? (
            <div className="flex justify-center pt-4">
              <Link
                href="/admin"
                className="btn btn-primary bg-red-500 hover:bg-red-600 border-red-500 w-full max-w-xs"
              >
                <Shield className="w-5 h-5 mr-2" />
                Access Admin Dashboard
              </Link>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={credentials.email}
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="input input-bordered w-full pl-10"
                    placeholder="Enter your organisation email"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="input input-bordered w-full pl-10"
                    placeholder="Enter your password"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganisationLogin;
