"use client";
import React, { useEffect, useState } from "react";
import { getDonationById } from "@/db/index";
import { DonationHistory } from "@/types/type";
import { formatDate } from "@/lib/utils";

const Donations = ({ id }: { id: string }) => {
  const [donations, setDonations] = useState<DonationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const data = await getDonationById(id);

        setDonations(data);
      } catch (err) {
        setError("Failed to load donations");
        console.error("Error fetching donations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[90vh] w-[900px] flex-col gap-4">
        <div className="skeleton h-[400px] w-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[90vh]">
        <div className="text-red-500 text-center p-4">{error}</div>
      </div>
    );
  }

  if (donations.length === 0) {
    return (
      <div className="h-[90vh]">
        <div className="text-center p-4">
          No donations found for this organization.
        </div>
      </div>
    );
  }

  const calculateTotal = () => {
    return donations.reduce(
      (sum, donation) => sum + parseFloat(donation.amount),
      0
    );
  };
  return (
    <div className="container mx-auto p-4 h-[90vh]">
      <h2 className="text-2xl font-bold mb-4">Donation History</h2>
      <div className="overflow-x-auto">
        <table className="table min-w-full  border ">
          <thead>
            <tr className="">
              <th className="px-6 py-3 border-b text-left">ID</th>
              <th className="px-6 py-3 border-b text-left">Date</th>
              <th className="px-6 py-3 border-b text-left">Amount</th>
              <th className="px-6 py-3 border-b text-left">Donor Reference</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.id} className="hover:bg-accent">
                <td className="px-6 py-4 border-b">{donation.id}</td>
                <td className="px-6 py-4 border-b">
                  {formatDate(donation.date)}
                </td>
                <td className="px-6 py-4 border-b">
                  R{donation.amount.toString()}
                </td>
                <td className="px-6 py-4 border-b">{donation.donor_id}</td>
              </tr>
            ))}
            <tr className="badge-ghost font-semibold">
              <td className="px-6 py-4 border-b">Total Donations</td>
              <td className="px-6 py-4 border-b">{donations.length}</td>
              <td className="px-6 py-4 border-b text-green-600">
                R
                {calculateTotal().toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>

              <td className="px-6 py-4 border-b"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Donations;
