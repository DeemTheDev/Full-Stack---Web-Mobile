import {
  getOrganisation,
  updateOrganisationProfileImage,
  updateOrganisationUrlDetails,
} from "@/db";
import { Organisation } from "@/types/type";
import React, { useEffect, useRef, useState } from "react";
import { Camera, Check, Globe, Mail, X } from "lucide-react";

const Avatar = ({ id }: { id: string }) => {
  const [organisation, setOrganisation] = useState<Organisation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [editedFields, setEditedFields] = useState({
    email: "",
    website: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchOrganisation = async () => {
      try {
        const data = await getOrganisation(id);
        setOrganisation(data);
        setEditedFields({
          email: data.email || "",
          website: data.website || "",
        });
      } catch (err) {
        setError("Failed to load organisation");
        console.error("Error fetching organisation:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganisation();
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUpdateLoading(true);

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/auth/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const { url } = await response.json();

      // Update organisation with new image URL
      await updateOrganisationProfileImage(Number(id), url);

      setOrganisation((prev) =>
        prev ? { ...prev, profile_image_url: url } : null
      );
    } catch (err) {
      setError("Failed to upload image");
      console.error("Error uploading image:", err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDetailsUpdate = async () => {
    if (!organisation) return;

    setUpdateLoading(true);
    try {
      await updateOrganisationUrlDetails(Number(id), {
        email: editedFields.email,
        website: editedFields.website,
      });

      setOrganisation((prev) =>
        prev
          ? {
              ...prev,
              email: editedFields.email,
              website: editedFields.website,
            }
          : null
      );

      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile details");
      console.error("Error updating profile details:", err);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full max-w-sm flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="skeleton h-24 w-24 shrink-0 rounded-full"></div>
          <div className="flex flex-col gap-4">
            <div className="skeleton h-4 w-32"></div>
            <div className="skeleton h-4 w-40"></div>
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
      <div className="bg-base-200 text-base-content rounded-lg p-4">
        <span>Organisation not found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 p-4 bg-base-100 rounded-xl shadow-sm">
      <div className="relative group">
        <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-primary/20">
          <img
            src={organisation.profile_image_url || "/placeholder-avatar.png"}
            alt={`${organisation.name}'s profile`}
            className="w-full h-full object-cover"
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-white 
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200
                   hover:bg-primary/90"
          disabled={updateLoading}
        >
          {updateLoading ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <Camera size={16} />
          )}
        </button>
      </div>

      <div className="flex flex-col items-center md:items-start gap-2">
        <h2 className="text-xl font-semibold text-base-content">
          {organisation.name}
        </h2>

        {isEditing ? (
          <div className="flex flex-col gap-2 w-full max-w-xs">
            <div className="relative">
              <input
                type="email"
                placeholder="Enter email address"
                value={editedFields.email}
                onChange={(e) =>
                  setEditedFields((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="input input-bordered input-sm w-full pl-8"
              />
              <Mail
                size={16}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="relative">
              <input
                type="url"
                placeholder="Enter website URL"
                value={editedFields.website}
                onChange={(e) =>
                  setEditedFields((prev) => ({
                    ...prev,
                    website: e.target.value,
                  }))
                }
                className="input input-bordered input-sm w-full pl-8"
              />
              <Globe
                size={16}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="btn btn-sm btn-ghost"
                disabled={updateLoading}
              >
                <X size={16} />
              </button>
              <button
                onClick={handleDetailsUpdate}
                className="btn btn-sm btn-primary"
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <Check size={16} />
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 text-sm text-base-content/70 hover:text-primary transition-colors"
            >
              <Mail size={16} />
              {organisation.email || "Add email address"}
            </button>

            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 text-sm text-base-content/70 hover:text-primary transition-colors"
            >
              <Globe size={16} />
              {organisation.website || "Add website"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Avatar;
