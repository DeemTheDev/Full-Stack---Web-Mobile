import React from "react";
import { auth } from "@/auth";
import AddOrganisation from "./components/AddOrganisation";
import CurrentUsers from "./components/CurrentUsers";
import CurrentOrganisations from "./components/CurrentOrganisations";

const Admin = async () => {
  const session = await auth();
  return (
    <div className="h-auto p-6">
      {session?.user?.email == "ziaeetechnologies@gmail.com" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Add Organisation Form */}
          <div className="lg:col-span-1">
            <AddOrganisation />
          </div>

          {/* Right Column - Current Users and Organisations Tables */}
          <div className="lg:col-span-1 space-y-6">
            <CurrentUsers />
            <div className="p-5" />
            <CurrentOrganisations />
          </div>
        </div>
      ) : (
        <div className="text-center p-8 h-[90vh]">
          <p className="text-xl text-red-500">Not a valid Admin!</p>
        </div>
      )}
    </div>
  );
};

export default Admin;
