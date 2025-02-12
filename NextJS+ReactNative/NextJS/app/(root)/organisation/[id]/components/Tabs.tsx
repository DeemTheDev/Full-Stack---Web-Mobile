"use client";
import React, { useState } from "react";
import Blog from "./Blog";
import Profile from "./Profile";
import Donations from "./Donations";

type TabType = "donations" | "blog" | "profile";

const Tabs = ({ id }: { id: string }) => {
  const [activeTab, setActiveTab] = useState<TabType>("donations");

  const renderContent = () => {
    switch (activeTab) {
      case "donations":
        return <Donations id={id} />;
      case "blog":
        return <Blog id={id} />;
      case "profile":
        return <Profile id={id} />;
      default:
        return <Donations id={id} />;
    }
  };

  return (
    <div className="w-full h-auto">
      <div className="flex justify-center mb-4">
        <div className="inline-flex tabs tabs-boxed" role="tablist">
          <button
            role="tab"
            className={`tab w-32 ${
              activeTab === "donations" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("donations")}
          >
            Donations
          </button>
          <button
            role="tab"
            className={`tab w-32 ${activeTab === "blog" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("blog")}
          >
            Blog
          </button>
          <button
            role="tab"
            className={`tab w-32 ${
              activeTab === "profile" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
        </div>
      </div>

      <div className="mt-4">{renderContent()}</div>
    </div>
  );
};

export default Tabs;
