import React, { useEffect, useState, useRef } from "react";
import {
  getOrganisation,
  getOrganisationSocial,
  updateOrganisationAddress,
  updateOrganisationDescription,
  updateOrganisationSocial,
} from "@/db";
import { Organisation, OrganisationSocial } from "@/types/type";
import {
  Camera,
  Check,
  X,
  Mail,
  Globe,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  PencilLine,
} from "lucide-react";

const EditInfo = ({ id }: { id: string }) => {
  const [organisation, setOrganisation] = useState<Organisation | null>(null);
  const [socialLinks, setSocialLinks] = useState<OrganisationSocial | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editSection, setEditSection] = useState<string | null>(null);
  const [editedFields, setEditedFields] = useState({
    email: "",
    website: "",
    description: "",
    address: "",
    socialLinks: {
      facebook_url: "",
      twitter_url: "",
      instagram_url: "",
    } as OrganisationSocial,
  });
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    fetchOrganisationData();
  }, []);

  // Toast timer cleanup
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Database Quesry

  const fetchOrganisationData = async () => {
    try {
      const [orgData, socialData] = await Promise.all([
        getOrganisation(id),
        getOrganisationSocial(Number(id)),
      ]);

      setOrganisation(orgData);
      setSocialLinks(socialData);

      // Update edited fields with current values
      setEditedFields((prev) => ({
        ...prev,
        socialLinks: {
          facebook_url: socialData?.facebook_url || "",
          twitter_url: socialData?.twitter_url || "",
          instagram_url: socialData?.instagram_url || "",
        },
      }));
    } catch (err) {
      setError("Failed to load organisation data");
      console.error("Error fetching organisation data:", err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    // First hide any existing toast
    setToast((prev) => ({ ...prev, show: false }));

    // Set a small timeout before showing the new toast
    setTimeout(() => {
      setToast({
        show: true,
        message,
        type,
      });
    }, 100);
  };

  const handleDescriptionUpdate = async () => {
    try {
      await updateOrganisationDescription(
        organisation!.id,
        editedFields.description
      );
      setEditSection(null);
      await fetchOrganisationData();
      showToast("Description updated successfully");
    } catch (error) {
      console.error("Failed to update description:", error);
      showToast("Failed to update description", "error");
    }
  };

  const handleAddressUpdate = async () => {
    try {
      await updateOrganisationAddress(organisation!.id, editedFields.address);
      setEditSection(null);
      await fetchOrganisationData();
      showToast("Address updated successfully");
    } catch (error) {
      console.error("Failed to update address:", error);
      showToast("Failed to update address", "error");
    }
  };

  const handleSocialUpdate = async () => {
    try {
      await updateOrganisationSocial(
        organisation!.id,
        editedFields.socialLinks
      );
      setEditSection(null);
      await fetchOrganisationData();
      showToast("Social media links updated successfully");
    } catch (error) {
      console.error("Failed to update social links:", error);
      showToast("Failed to update social media links", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex w-full max-w-sm flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="skeleton h-42 w-full shrink-0 rounded-full"></div>
          <div className="flex flex-col gap-4">
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!organisation) {
    return (
      <div className="navbar bg-primary text-neutral-content rounded-2xl">
        <div className="flex-1">
          <span>Organisation not found</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* Previous Avatar Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 p-4 bg-base-100 rounded-xl shadow-sm">
          {/* ... previous avatar code ... */}
        </div>

        {/* Description Section */}
        <div className="bg-base-100 rounded-xl shadow-sm p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">About</h3>
            <button
              onClick={() =>
                setEditSection(
                  editSection === "description" ? null : "description"
                )
              }
              className="btn btn-ghost btn-sm"
            >
              <PencilLine size={16} />
            </button>
          </div>

          {editSection === "description" ? (
            <div className="space-y-2">
              <textarea
                value={editedFields.description}
                onChange={(e) =>
                  setEditedFields((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Tell us about your organization..."
                className="textarea textarea-bordered w-full h-32"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditSection(null)}
                  className="btn btn-ghost btn-sm"
                >
                  <X size={16} />
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    handleDescriptionUpdate();
                    fetchOrganisationData();
                  }}
                >
                  <Check size={16} />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-base-content/70">
              {organisation?.description || "No description provided"}
            </p>
          )}
        </div>

        {/* Address Section */}
        <div className="bg-base-100 rounded-xl shadow-sm p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Location</h3>
            <button
              onClick={() =>
                setEditSection(editSection === "address" ? null : "address")
              }
              className="btn btn-ghost btn-sm"
            >
              <PencilLine size={16} />
            </button>
          </div>

          {editSection === "address" ? (
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={editedFields.address}
                  onChange={(e) =>
                    setEditedFields((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  placeholder="Enter organization address"
                  className="input input-bordered w-full pl-8"
                />
                <MapPin
                  size={16}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditSection(null)}
                  className="btn btn-ghost btn-sm"
                >
                  <X size={16} />
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    handleAddressUpdate();
                    fetchOrganisationData();
                  }}
                >
                  <Check size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-base-content/70">
              <MapPin size={16} />
              <span>{organisation?.address || "No address provided"}</span>
            </div>
          )}
        </div>

        {/* Social Media Section */}
        <div className="bg-base-100 rounded-xl shadow-sm p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Social Media</h3>
            <button
              onClick={() =>
                setEditSection(editSection === "social" ? null : "social")
              }
              className="btn btn-ghost btn-sm"
            >
              <PencilLine size={16} />
            </button>
          </div>

          {editSection === "social" ? (
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="url"
                  value={editedFields.socialLinks.facebook_url || ""}
                  onChange={(e) =>
                    setEditedFields((prev) => ({
                      ...prev,
                      socialLinks: {
                        ...prev.socialLinks,
                        facebook_url: e.target.value,
                      },
                    }))
                  }
                  placeholder="Facebook URL"
                  className="input input-bordered w-full pl-8"
                />
                <Facebook
                  size={16}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              <div className="relative">
                <input
                  type="url"
                  value={editedFields.socialLinks.twitter_url || ""}
                  onChange={(e) =>
                    setEditedFields((prev) => ({
                      ...prev,
                      socialLinks: {
                        ...prev.socialLinks,
                        twitter_url: e.target.value,
                      },
                    }))
                  }
                  placeholder="Twitter URL"
                  className="input input-bordered w-full pl-8"
                />
                <Twitter
                  size={16}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              <div className="relative">
                <input
                  type="url"
                  value={editedFields.socialLinks.instagram_url || ""}
                  onChange={(e) =>
                    setEditedFields((prev) => ({
                      ...prev,
                      socialLinks: {
                        ...prev.socialLinks,
                        instagram_url: e.target.value,
                      },
                    }))
                  }
                  placeholder="Instagram URL"
                  className="input input-bordered w-full pl-8"
                />
                <Instagram
                  size={16}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditSection(null)}
                  className="btn btn-ghost btn-sm"
                >
                  <X size={16} />
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleSocialUpdate}
                >
                  <Check size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {socialLinks && (
                <>
                  {socialLinks.facebook_url && (
                    <a
                      href={socialLinks.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-base-content/70 hover:text-primary transition-colors"
                    >
                      <Facebook size={16} />
                      Facebook
                    </a>
                  )}
                  {socialLinks.twitter_url && (
                    <a
                      href={socialLinks.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-base-content/70 hover:text-primary transition-colors"
                    >
                      <Twitter size={16} />
                      Twitter
                    </a>
                  )}
                  {socialLinks.instagram_url && (
                    <a
                      href={socialLinks.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-base-content/70 hover:text-primary transition-colors"
                    >
                      <Instagram size={16} />
                      Instagram
                    </a>
                  )}
                </>
              )}
              {(!socialLinks ||
                (!socialLinks.facebook_url &&
                  !socialLinks.twitter_url &&
                  !socialLinks.instagram_url)) && (
                <span className="text-base-content/70">
                  No social media links provided
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      {toast.show && (
        <div
          className={`fixed bottom-4 right-4 flex items-center px-4 py-2 rounded-lg shadow-lg 
    transform transition-all duration-300 ease-in-out z-50
    ${toast.show ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}
    ${
      toast.type === "success"
        ? "bg-green-500 text-white"
        : "bg-red-500 text-white"
    }`}
        >
          {toast.type === "success" ? (
            <Check size={20} className="mr-2" />
          ) : (
            <X size={20} className="mr-2" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </>
  );
};
export default EditInfo;
