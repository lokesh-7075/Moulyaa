import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function CreateGuidePost() {

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // HANDLE IMAGE SELECT
  // =========================
  const handleImages = (e) => {

    const files = Array.from(e.target.files);

    setImages(files);

    const previewUrls = files.map(file => URL.createObjectURL(file));
    setPreview(previewUrls);
  };

  // =========================
  // CREATE POST
  // =========================
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!title || !description) {
      alert("Title and Description required");
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);

      images.forEach(img => {
        formData.append("visitImages", img);
      });

      await API.post("/guide-posts/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Post created successfully 🚀");

      navigate("/guide-dashboard");

    } catch (error) {
      console.error(error);
      alert("Error creating post");
    } finally {
      setLoading(false);
    }

  };

  return (

    <div className="min-h-screen bg-white flex justify-center items-center p-6">

      <div className="w-full max-w-2xl bg-white border rounded-2xl shadow-lg p-8">

        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          📸 Create Guide Post
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              placeholder="Describe your tour experience..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* FILE INPUT */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Upload Images
            </label>

            <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer hover:bg-gray-50 transition">
              <span className="text-gray-500">Click to upload images</span>
              <input
                type="file"
                multiple
                onChange={handleImages}
                className="hidden"
              />
            </label>
          </div>

          {/* PREVIEW */}
          {preview.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Preview</p>
              <div className="grid grid-cols-3 gap-3">
                {preview.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={img}
                      className="h-24 w-full object-cover rounded-lg border"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Posting..." : "Create Post"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default CreateGuidePost;