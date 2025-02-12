import React from "react";
import GalleryGrid from "./GalleryGrid";
import Avatar from "./Avatar";
import EditInfo from "./EditInfo";

const Profile = ({ id }: { id: string }) => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Avatar Section - Full Width */}
      <section className=" w-full">
        <Avatar id={id} />
      </section>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Gallery */}
        <section className="w-full h-full">
          <div className="bg-base-100 rounded-xl shadow-sm h-full">
            <h2 className="text-xl font-semibold p-4 border-b">Gallery</h2>
            <GalleryGrid id={id} />
          </div>
        </section>

        {/* Right Column - Edit Info */}
        <section className="w-full h-full">
          <div className="bg-base-100 rounded-xl shadow-sm h-full">
            <h2 className="text-xl font-semibold p-4 border-b">
              Organization Details
            </h2>
            <EditInfo id={id} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
