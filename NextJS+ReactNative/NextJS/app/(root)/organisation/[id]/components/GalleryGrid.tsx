import { deleteOrganisationImage, getOrganisationImages } from "@/db";
import { OrganisationImage } from "@/types/type";
import React, { useEffect, useRef, useState } from "react";
import { Trash2, ZoomIn, X, Upload } from "lucide-react";

const GalleryGrid = ({ id }: { id: string }) => {
  const [organisationImages, setOrganisationsImages] = useState<
    OrganisationImage[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<OrganisationImage | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "delete">("view");
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchOrganisationImages = async () => {
      try {
        const data = await getOrganisationImages(id);
        setOrganisationsImages(data || []);
        if (error || !organisationImages || organisationImages.length === 0) {
          return;
        }
      } catch (err) {
        setError(
          "Failed to Retrieve Organisation Images / No Images Uploaded !"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOrganisationImages();
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("image", file);
      formData.append("organisationId", id);

      const response = await fetch("/api/auth/upload/organisation", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const { url } = await response.json();

      // Add the new image to the database and update local state
      const updatedImages = await getOrganisationImages(id);
      setOrganisationsImages(updatedImages || []);

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError("Failed to upload image");
      console.error("Error uploading image:", err);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleImageClick = (image: OrganisationImage) => {
    setSelectedImage(image);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, image: OrganisationImage) => {
    e.stopPropagation();
    setSelectedImage(image);
    setModalMode("delete");
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedImage) return;

    try {
      setLoading(true);
      await deleteOrganisationImage(selectedImage.id);

      setOrganisationsImages((prev) =>
        prev.filter((img) => img.id !== selectedImage.id)
      );
      setIsModalOpen(false);
      setSelectedImage(null);
    } catch (err) {
      setError("Failed to delete image");
      console.error("Failed to delete image:", err);
    } finally {
      setLoading(false);
    }
  };

  const UploadButton = () => (
    <div
      onClick={() => fileInputRef.current?.click()}
      className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
    >
      <div className="flex flex-col items-center gap-2 text-gray-500 hover:text-primary">
        {uploadLoading ? (
          <span className="loading loading-spinner loading-md"></span>
        ) : (
          <>
            <Upload size={24} />
            <span className="text-sm font-medium">Upload Image</span>
          </>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex w-full max-w-2xl flex-col gap-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="skeleton h-4 w-48"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="skeleton aspect-square w-full rounded-lg"></div>
              <div className="skeleton h-3 w-24"></div>
              <div className="skeleton h-3 w-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !organisationImages || organisationImages.length === 0) {
    return (
      <div className="h-[500px] p-4">
        <div className="flex flex-col items-center justify-center gap-4 w-full max-w-[700px] mx-auto">
          <div className="text-red-500 text-center p-4">
            {error ? error : "No Images Found! Please Upload Below"}
          </div>
          <div className="w-48">
            <UploadButton />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-[500px] overflow-y-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-[700px]">
          {organisationImages.map((image) => (
            <div
              key={image.id}
              onClick={() => handleImageClick(image)}
              className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 cursor-pointer group"
            >
              <img
                src={image.image_url}
                alt={`Organization image ${image.id}`}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors">
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleDeleteClick(e, image)}
                    className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageClick(image);
                    }}
                    className="p-1.5 bg-blue-500 rounded-full text-white hover:bg-blue-600"
                  >
                    <ZoomIn size={16} />
                  </button>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-xs text-white">
                  Added: {new Date(image.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}

          <UploadButton />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {isModalOpen && selectedImage && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              <X size={16} />
            </button>

            {modalMode === "view" ? (
              <div className="mt-4">
                <img
                  src={selectedImage.image_url}
                  alt={`Organization image ${selectedImage.id}`}
                  className="w-full rounded-lg"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Added:{" "}
                  {new Date(selectedImage.created_at).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <div className="mt-4">
                <h3 className="font-bold text-lg">Delete Image</h3>
                <p className="py-4">
                  Are you sure you want to delete this image? This action cannot
                  be undone.
                </p>
                <div className="modal-action">
                  <button
                    onClick={handleDelete}
                    className="btn btn-error"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      "Delete"
                    )}
                  </button>
                  <button onClick={() => setIsModalOpen(false)} className="btn">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setIsModalOpen(false)}>close</button>
          </form>
        </dialog>
      )}
    </>
  );
};

export default GalleryGrid;
