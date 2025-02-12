"use client";
import React, { useState, useEffect } from "react";
import { OrganisationWithDonations } from "@/types/type";
import { MoreVertical, Trash2, RefreshCcw } from "lucide-react";
import { getOrganisationsWithDonations, deleteOrganisation } from "@/db/index";
import { useSearchParams } from "next/navigation";

const CurrentOrganisations = () => {
  const [organisations, setOrganisations] = useState<
    OrganisationWithDonations[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    fetchOrganisations();
  }, []);

  const fetchOrganisations = async () => {
    try {
      const data = await getOrganisationsWithDonations();
      setOrganisations(data);
    } catch (err) {
      setError("Failed to load organisations");
      console.error("Error fetching organisations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchOrganisations();
      setError(null);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this organisation? This will also delete all related donations."
      )
    ) {
      setDeleteLoading(id);
      try {
        await deleteOrganisation(id);
        setOrganisations((prevOrgs) => prevOrgs.filter((org) => org.id !== id));
        setOpenMenuId(null);
      } catch (err) {
        console.error("Error deleting organisation:", err);
        setError("Failed to delete organisation");
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const filteredOrganisations = organisations.filter((org) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      org.name.toLowerCase().includes(search) ||
      org.email.toLowerCase().includes(search)
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

  if (!organisations.length) {
    return (
      <div className="bg-base-100 rounded-xl shadow-sm p-4">
        <div className="text-center">No organisations found</div>
      </div>
    );
  }

  if (filteredOrganisations.length === 0 && searchQuery) {
    return (
      <div className="bg-base-100 rounded-xl shadow-sm p-4">
        <div className="text-center">
          No organisations found matching "{searchQuery}"
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-xl shadow-sm p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Current Organisations</h3>
        <div className="flex items-center gap-2">
          {searchQuery && (
            <span className="text-sm text-gray-600">
              Showing {filteredOrganisations.length} of {organisations.length}{" "}
              organisations
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
                  Total Received
                </th>
                <th className="bg-base-100 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filteredOrganisations.map((org) => (
                <tr key={org.id} className="hover:bg-base-200">
                  <td className="font-medium">{org.id}</td>
                  <td>{org.name}</td>
                  <td>{org.email}</td>
                  <td className="text-right">
                    ${org.total_received?.toLocaleString() ?? "0"}
                  </td>
                  <td className="relative">
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === org.id ? null : org.id)
                      }
                      className="btn btn-ghost btn-sm p-1"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {openMenuId === org.id && (
                      <>
                        <div
                          className="fixed inset-0 z-20"
                          onClick={() => setOpenMenuId(null)}
                        />
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-base-100 ring-1 ring-black ring-opacity-5 z-30">
                          <button
                            onClick={() => handleDelete(org.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-base-200 rounded-md disabled:opacity-50"
                            disabled={deleteLoading === org.id}
                          >
                            {deleteLoading === org.id ? (
                              <span className="loading loading-spinner loading-sm mr-2"></span>
                            ) : (
                              <Trash2 size={16} className="mr-2" />
                            )}
                            {deleteLoading === org.id
                              ? "Deleting..."
                              : "Delete Organisation"}
                          </button>
                        </div>
                      </>
                    )}
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

export default CurrentOrganisations;
