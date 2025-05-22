import React, { useState, useEffect } from "react";
import {
  getPortfolio,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} from "../services/api";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { generateUrl } from "../utils/imageUrl";

const PortfolioPage = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    technologies: "",
    images: [],
  });
  const [imagePreview, setImagePreview] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await getPortfolio();
      setPortfolioItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Portfolioni yuklashda xatolik:", error);
      setError("Portfolioni yuklashda xatolik yuz berdi");
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setIsEditMode(true);
      setSelectedItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        technologies: item.technologies.join(", "),
        images: [],
      });
      setImagePreview(item.images);
    } else {
      setIsEditMode(false);
      setSelectedItem(null);
      setFormData({
        name: "",
        description: "",
        technologies: "",
        images: [],
      });
      setImagePreview([]);
    }
    setIsModalOpen(true);
    setError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData({
        ...formData,
        images: files,
      });

      // Preview images
      const previews = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result);
          if (previews.length === files.length) {
            setImagePreview(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Create form data for file upload
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    submitData.append("technologies", formData.technologies);

    if (formData.images.length > 0) {
      formData.images.forEach((image) => {
        submitData.append("images", image);
      });
    }

    // Debug: formData ni console ga chiqarish
    console.log("Portfolio form data being sent:");
    for (let [key, value] of submitData.entries()) {
      console.log(key, value);
    }

    try {
      if (isEditMode) {
        await updatePortfolio(selectedItem._id, submitData);
        setSuccess("Portfolio elementi muvaffaqiyatli yangilandi");
      } else {
        await createPortfolio(submitData);
        setSuccess("Yangi portfolio elementi muvaffaqiyatli qo'shildi");
      }

      // Refetch portfolio
      fetchPortfolio();
      handleCloseModal();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Portfolioni saqlashda xatolik:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Portfolioni saqlashda xatolik yuz berdi");
      }
    }
  };
  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Siz rostdan ham bu portfolio elementni o'chirmoqchimisiz?"
      )
    ) {
      try {
        await deletePortfolio(id);
        setPortfolioItems(portfolioItems.filter((item) => item._id !== id));
        setSuccess("Portfolio elementi muvaffaqiyatli o'chirildi");

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } catch (error) {
        console.error("Portfolioni o'chirishda xatolik:", error);
        setError("Portfolioni o'chirishda xatolik yuz berdi");
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Portfolio</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bajarilgan ishlar portfoliosini boshqarish
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center"
        >
          <FaPlus className="mr-2" /> Yangi portfolio
        </button>
      </div>

      {error && (
        <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 mb-6 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-900 dark:text-green-200">
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center">
          <p>Yuklanmoqda...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {portfolioItems.length === 0 ? (
            <div className="p-6 text-center bg-white rounded-lg shadow-md dark:bg-slate-800">
              <p className="text-gray-600 dark:text-gray-400">
                Portfolio elementlari mavjud emas.
              </p>
              <button
                onClick={() => handleOpenModal()}
                className="mt-4 btn-primary"
              >
                Yangi portfolio qo'shish
              </button>
            </div>
          ) : (
            portfolioItems.map((item) => (
              <div
                key={item._id}
                className="p-6 bg-white rounded-lg shadow-md dark:bg-slate-800"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-2/3 md:pr-6">
                    <h2 className="mb-2 text-xl font-bold">{item.name}</h2>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>

                    <div className="mb-4">
                      <h3 className="mb-2 font-semibold">Texnologiyalar:</h3>
                      <div className="flex flex-wrap gap-2">
                        {item.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3">
                    <div className="grid grid-cols-2 gap-2">
                      {item.images.map((image, index) => (
                        <img
                          key={index}
                          src={generateUrl(image)}
                          alt={`${item.name} screenshot ${index + 1}`}
                          className="object-cover w-full h-24 rounded"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-4 border-t pt-4 dark:border-slate-700">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="flex items-center mr-2 btn-secondary"
                  >
                    <FaEdit className="mr-1" /> Tahrirlash
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex items-center btn-danger"
                  >
                    <FaTrash className="mr-1" /> O'chirish
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Portfolio Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="relative w-full max-w-2xl p-6 mx-4 bg-white rounded-lg shadow-xl dark:bg-slate-800">
            <button
              onClick={handleCloseModal}
              className="absolute p-1 text-gray-500 top-2 right-2 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              &times;
            </button>
            <h2 className="mb-4 text-xl font-bold">
              {isEditMode
                ? "Portfolio elementini tahrirlash"
                : "Yangi portfolio qo'shish"}
            </h2>

            {error && (
              <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="form-label">
                  Nomi
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="form-label">
                  Tavsif
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="form-input"
                ></textarea>
              </div>

              <div className="mb-4">
                <label htmlFor="technologies" className="form-label">
                  Texnologiyalar (vergul bilan ajratilgan)
                </label>
                <input
                  type="text"
                  id="technologies"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="images" className="form-label">
                  Rasmlar (kamida 1 ta, ko'pi bilan 3 ta)
                </label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  onChange={handleImageChange}
                  accept="image/*"
                  multiple
                  className="form-input"
                  required={!isEditMode}
                />

                {imagePreview.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {imagePreview.map((preview, index) => (
                      <img
                        key={index}
                        src={generateUrl(preview)}
                        alt={`Preview ${index + 1}`}
                        className="object-cover w-full h-24 rounded"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="mr-2 btn-secondary"
                >
                  Bekor qilish
                </button>
                <button type="submit" className="btn-primary">
                  {isEditMode ? "Saqlash" : "Qo'shish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
