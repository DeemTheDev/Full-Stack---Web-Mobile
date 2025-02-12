"use client";
import { getOrganisation, logoutOrganisation } from "@/db";
import { Organisation } from "@/types/type";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Navbar = ({ id }: { id: string }) => {
  const [organisation, setOrganisation] = useState<Organisation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    await logoutOrganisation();
    router.push("/auth");
  };
  useEffect(() => {
    const fetchOrganisation = async () => {
      try {
        const data = await getOrganisation(id);
        setOrganisation(data);
      } catch (err) {
        setError("Failed to load organisation");
        console.error("Error fetching organisation:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganisation();
  }, [id]);

  if (loading) {
    return (
      <div className="navbar bg-base-300 text-neutral-content animate-pulse">
        <div className="flex-1">
          <div className="h-8 w-48 bg-base-300-focus rounded"></div>
        </div>
        <div className="flex-none gap-2">
          <div className="h-10 w-10 rounded-full bg-base-300-focus"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="navbar bg-base-300 text-neutral-content">
        <div className="flex-1">
          <span className="text-error">{error}</span>
        </div>
      </div>
    );
  }

  if (!organisation) {
    return (
      <div className="navbar bg-base-300 text-neutral-content ">
        <div className="flex-1">
          <span>Organisation not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="navbar bg-base-300 text-neutral-content ">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Hope - {organisation.name}</a>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt={`${organisation.name} profile`}
                src={organisation.profile_image_url}
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-neutral rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
