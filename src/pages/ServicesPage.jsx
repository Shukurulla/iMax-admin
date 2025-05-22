import React, { useState, useEffect } from "react";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../services/api";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { generateUrl } from "../utils/imageUrl";

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await getServices();
      setServices(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Xizmatlarni yuklashda xatolik:", error);
      setError("Xizmatlarni yuklashda xatolik yuz berdi");
      setLoading(false);
    }
  };

  const handleOpenModal = (service = null) => {
    if (service) {
      setIsEditMode(true);
      setSelectedService(service);
      setFormData({
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        image: null,
      });
      setImagePreview(service.image);
    } else {
      setIsEditMode(false);
      setSelectedService(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        duration: "",
        image: null,
      });
      setImagePreview(null);
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
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });

      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Create form data for file upload
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    submitData.append("price", formData.price);
    submitData.append("duration", formData.duration);

    if (formData.image) {
      submitData.append("image", formData.image);
    }

    // Debug: formData ni console ga chiqarish
    console.log("Form data being sent:");
    for (let [key, value] of submitData.entries()) {
      console.log(key, value);
    }

    try {
      if (isEditMode) {
        await updateService(selectedService._id, submitData);
        setSuccess("Xizmat muvaffaqiyatli yangilandi");
      } else {
        await createService(submitData);
        setSuccess("Yangi xizmat muvaffaqiyatli qo'shildi");
      }

      // Refetch services
      fetchServices();
      handleCloseModal();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Xizmatni saqlashda xatolik:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Xizmatni saqlashda xatolik yuz berdi");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Siz rostdan ham bu xizmatni o'chirmoqchimisiz?")) {
      try {
        await deleteService(id);
        setServices(services.filter((service) => service._id !== id));
        setSuccess("Xizmat muvaffaqiyatli o'chirildi");

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } catch (error) {
        console.error("Xizmatni o'chirishda xatolik:", error);
        setError("Xizmatni o'chirishda xatolik yuz berdi");
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Xizmatlar</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Xizmatlarni boshqarish
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center"
        >
          <FaPlus className="mr-2" /> Yangi xizmat
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
        <div className="w-full overflow-hidden bg-white rounded-lg shadow-md dark:bg-slate-800">
          {services.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Xizmatlar mavjud emas.
              </p>
              <button
                onClick={() => handleOpenModal()}
                className="mt-4 btn-primary"
              >
                Yangi xizmat qo'shish
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">
                    Rasm
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">
                    Nomi
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">
                    Narxi
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-300">
                    Muddat
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-700 uppercase dark:text-gray-300">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {services.map((service) => (
                  <tr
                    key={service._id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={generateUrl(service.image)}
                        alt={service.name}
                        className="object-cover w-10 h-10 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                        {service.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {service.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {service.duration}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenModal(service)}
                        className="p-2 mr-2 text-blue-600 rounded-full hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(service._id)}
                        className="p-2 text-red-600 rounded-full hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="relative w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl dark:bg-slate-800">
            <button
              onClick={handleCloseModal}
              className="absolute p-1 text-gray-500 top-2 right-2 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              &times;
            </button>
            <h2 className="mb-4 text-xl font-bold">
              {isEditMode ? "Xizmatni tahrirlash" : "Yangi xizmat qo'shish"}
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
                  rows="3"
                  className="form-input"
                ></textarea>
              </div>

              <div className="mb-4">
                <label htmlFor="price" className="form-label">
                  Narxi
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="1 000 000 so'm dan"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="duration" className="form-label">
                  Muddat
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="2-3 hafta"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="image" className="form-label">
                  Rasm
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="form-input"
                  required={!isEditMode}
                />

                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="object-cover w-full h-32 rounded"
                    />
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

export default ServicesPage;
