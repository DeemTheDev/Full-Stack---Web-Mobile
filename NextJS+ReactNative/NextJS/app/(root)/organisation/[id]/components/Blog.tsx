import React, { useEffect, useState } from "react";
import { createBlogPost, deleteBlogPost, getBlogPosts } from "@/db";
import { BlogPost } from "@/types/type";
import {
  PencilLine,
  Upload,
  Trash2,
  AlertCircle,
  MoreVertical,
} from "lucide-react";

const BlogManagement = ({ id }: { id: string }) => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({
    content: "",
    type: "Post", // Default type
  });
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const postTypes = ["Post", "Request Donation", "Event"];

  // Fetch blog posts
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const data = await getBlogPosts(id);
        setBlogPosts(data);
      } catch (err) {
        setError("Failed to load blog posts");
        console.error("Error fetching blog posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);

    try {
      const response = await createBlogPost({
        ...newPost,
        orgId: id,
        createdAt: new Date().toISOString(),
      });

      setBlogPosts((prev) => [response, ...prev]);
      setNewPost({ content: "", type: "Post" });
    } catch (err) {
      setError("Failed to create blog post");
      console.error("Error creating blog post:", err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      setDeleteLoading(postId);
      try {
        await deleteBlogPost(postId);
        setBlogPosts((prev) => prev.filter((post) => post.id !== postId));
        setOpenMenuId(null);
      } catch (err) {
        setError("Failed to delete blog post");
        console.error("Error deleting blog post:", err);
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const handleTypeSelect = (type: string) => {
    setNewPost((prev) => ({ ...prev, type }));
    setIsDropdownOpen(false);
  };

  if (loading) {
    return (
      <div className="flex h-[90vh] w-[65vh] max-w-sm flex-col gap-4">
        <div className="skeleton h-[40vh] w-full"></div>
        <div className="skeleton h-10 w-full"></div>
        <div className="skeleton h-10 w-full"></div>
      </div>
    );
  }

  return (
    <div className="ml-15 w-full min-w-[620px] max-w-4xl mx-auto space-y-6 p-4">
      {/* Create New Blog Post Section */}
      <div className="bg-base-100 rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-xl font-semibold">Create New Blog Post</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn w-full max-w-xs text-left"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {newPost.type}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-emerald-950 rounded-box z-[1] w-52 p-2 shadow"
              >
                {postTypes.map((type) => (
                  <li key={type}>
                    <a onClick={() => handleTypeSelect(type)}>{type}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="form-control">
            <textarea
              className="textarea  textarea-accent h-32"
              placeholder="Write your blog post here..."
              value={newPost.content}
              onChange={(e) =>
                setNewPost((prev) => ({ ...prev, content: e.target.value }))
              }
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitLoading}
            >
              {submitLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Publishing...
                </>
              ) : (
                <>
                  <Upload size={16} className="mr-2" />
                  Publish Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Blog History Section */}
      <div className="bg-base-100 rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-xl font-semibold">Blog History</h2>

        <div className="space-y-6">
          {blogPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-base-200/50 rounded-lg">
              <p className="text-base-content/70 text-lg">No blog posts yet</p>
              <p className="text-sm text-base-content/50 mt-2">
                Create your first post to get started
              </p>
            </div>
          ) : (
            blogPosts.map((post) => (
              <div
                key={post.id}
                className="bg-base-100 border border-base-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`badge ${
                          post.type === "Event"
                            ? "badge-accent"
                            : post.type === "Request Donation"
                            ? "badge-secondary"
                            : "badge-primary"
                        } font-medium`}
                      >
                        {post.type}
                      </span>
                      <span className="text-sm text-base-content/60">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-base-content/90 text-base leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === post.id ? null : post.id)
                      }
                      className="btn btn-ghost btn-sm btn-circle"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {openMenuId === post.id && (
                      <>
                        <div
                          className="fixed inset-0 z-20"
                          onClick={() => setOpenMenuId(null)}
                        />
                        <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-base-100 ring-1 ring-base-content/10 z-30 overflow-hidden">
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-base-200 disabled:opacity-50 disabled:hover:bg-transparent transition-colors duration-200"
                            disabled={deleteLoading === post.id}
                          >
                            {deleteLoading === post.id ? (
                              <span className="loading loading-spinner loading-sm mr-2"></span>
                            ) : (
                              <Trash2 size={16} className="mr-2" />
                            )}
                            <span className="font-medium">
                              {deleteLoading === post.id
                                ? "Deleting..."
                                : "Delete Post"}
                            </span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;
