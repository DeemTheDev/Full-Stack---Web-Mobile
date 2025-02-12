"use client";
import React, { useState, useEffect } from "react";
import { getUsersWithDonations } from "@/db/index";
import { UserWithDonations } from "@/types/type";
import { RefreshCcw } from "lucide-react";
import { useSearchParams } from "next/navigation";

const CurrentUsers = () => {
  const [users, setUsers] = useState<UserWithDonations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsersWithDonations();
      setUsers(data);
    } catch (err) {
      setError("Failed to load users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchUsers();
      setError(null); // Clear any previous errors
    } finally {
      setRefreshing(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="bg-base-100 rounded-xl shadow-sm p-4 space-y-4">
        <div className="h-8 w-48 bg-base-200 rounded animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-base-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-base-100 rounded-xl shadow-sm p-4">
        <div className="text-error text-center">{error}</div>
        <button
          onClick={handleRefresh}
          className="btn btn-ghost btn-sm mt-2"
          disabled={refreshing}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="bg-base-100 rounded-xl shadow-sm p-4">
        <div className="text-center">No users found</div>
      </div>
    );
  }

  if (filteredUsers.length === 0 && searchQuery) {
    return (
      <div className="bg-base-100 rounded-xl shadow-sm p-4">
        <div className="text-center">
          No users found matching "{searchQuery}"
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-xl shadow-sm p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Current Users</h3>
        <div className="flex items-center gap-2">
          {searchQuery && (
            <span className="text-sm text-gray-600">
              Showing {filteredUsers.length} of {users.length} users
            </span>
          )}
          <button
            onClick={handleRefresh}
            className="btn btn-ghost btn-sm p-1"
            disabled={refreshing}
            title="Refresh data"
          >
            <RefreshCcw
              className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="table w-full mb-8">
            <thead className="sticky top-0 bg-base-100 z-10">
              <tr className="border-b">
                <th className="bg-base-100 text-xl text-emerald-700">ID</th>
                <th className="bg-base-100 text-xl text-emerald-700">Name</th>
                <th className="bg-base-100 text-xl text-emerald-700">Email</th>
                <th className="bg-base-100 text-right text-xl text-emerald-500">
                  Total Donations
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-base-200">
                  <td className="font-medium">{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className="text-right">
                    R {user.total_donations?.toLocaleString() ?? "0"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CurrentUsers;
