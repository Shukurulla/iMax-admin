import React, { useState, useEffect } from "react";
import {
  getAboutInfo,
  updateAboutInfo,
  addTeamMember,
  deleteTeamMember,
} from "../services/api";
import { FaUserPlus, FaTrash } from "react-icons/fa";
import { generateUrl } from "../utils/imageUrl";

const AboutPage = () => {
  const [aboutInfo, setAboutInfo] = useState({
    history: "",
    mission: "",
    team: [],
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamMemberData, setTeamMemberData] = useState({
    name: "",
    position: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchAboutInfo();
  }, []);

  const fetchAboutInfo = async () => {
    try {
      const response = await getAboutInfo();
      setAboutInfo(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Ma'lumotlarni yuklashda xatolik:", error);
      setError("Ma'lumotlarni yuklashda xatolik yuz berdi");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAboutInfo({
      ...aboutInfo,
      [name]: value,
    });
  };

  const handleSaveAboutInfo = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      await updateAboutInfo({
        history: aboutInfo.history,
        mission: aboutInfo.mission,
      });
      setSuccess("Ma'lumotlar muvaffaqiyatli saqlandi");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Ma'lumotlarni saqlashda xatolik:", error);
      setError("Ma'lumotlarni saqlashda xatolik yuz berdi");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTeamMemberChange = (e) => {
    const { name, value } = e.target;
    setTeamMemberData({
      ...teamMemberData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTeamMemberData({
        ...teamMemberData,
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

  const handleAddTeamMember = async (e) => {
    e.preventDefault();
    setError(null);

    // Create form data for file upload
    const submitData = new FormData();
    submitData.append("name", teamMemberData.name);
    submitData.append("position", teamMemberData.position);
    if (teamMemberData.image) {
      submitData.append("image", teamMemberData.image);
    }

    try {
      await addTeamMember(submitData);
      setSuccess("Jamoa a'zosi muvaffaqiyatli qo'shildi");

      // Refetch about info
      fetchAboutInfo();
      setIsTeamModalOpen(false);

      // Reset form
      setTeamMemberData({
        name: "",
        position: "",
        image: null,
      });
      setImagePreview(null);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Jamoa a'zosini qo'shishda xatolik:", error);
      setError("Jamoa a'zosini qo'shishda xatolik yuz berdi");
    }
  };

  const handleDeleteTeamMember = async (id) => {
    if (
      window.confirm("Siz rostdan ham bu jamoa a'zosini o'chirmoqchimisiz?")
    ) {
      try {
        await deleteTeamMember(id);
        setSuccess("Jamoa a'zosi muvaffaqiyatli o'chirildi");

        // Refetch about info
        fetchAboutInfo();

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } catch (error) {
        console.error("Jamoa a'zosini o'chirishda xatolik:", error);
        setError("Jamoa a'zosini o'chirishda xatolik yuz berdi");
      }
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Biz Haqimizda</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Kompaniya ma'lumotlarini boshqarish
        </p>
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
        <div className="space-y-6">
          {/* About Info Form */}
          <div className="p-6 bg-white rounded-lg shadow-md dark:bg-slate-800">
            <h2 className="mb-4 text-xl font-semibold">
              Kompaniya Ma'lumotlari
            </h2>
            <form onSubmit={handleSaveAboutInfo}>
              <div className="mb-4">
                <label htmlFor="history" className="form-label">
                  Kompaniya Tarixi
                </label>
                <textarea
                  id="history"
                  name="history"
                  value={aboutInfo.history}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="form-input"
                ></textarea>
              </div>

              <div className="mb-6">
                <label htmlFor="mission" className="form-label">
                  Missiya va Maqsadlar
                </label>
                <textarea
                  id="mission"
                  name="mission"
                  value={aboutInfo.mission}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="form-input"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary"
                >
                  {isSaving ? "Saqlanmoqda..." : "Saqlash"}
                </button>
              </div>
            </form>
          </div>

          {/* Team Members */}
          <div className="p-6 bg-white rounded-lg shadow-md dark:bg-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Jamoa A'zolari</h2>
              <button
                onClick={() => setIsTeamModalOpen(true)}
                className="btn-primary flex items-center"
              >
                <FaUserPlus className="mr-2" /> A'zo qo'shish
              </button>
            </div>

            {aboutInfo.team.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">
                Jamoa a'zolari mavjud emas.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {aboutInfo.team.map((member) => (
                  <div
                    key={member._id}
                    className="p-4 border border-gray-200 rounded-lg dark:border-slate-700"
                  >
                    <img
                      src={generateUrl(member.image)}
                      alt={member.name}
                      className="object-cover w-full h-40 mb-3 rounded"
                    />
                    <h3 className="mb-1 text-lg font-semibold">
                      {member.name}
                    </h3>
                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                      {member.position}
                    </p>
                    <button
                      onClick={() => handleDeleteTeamMember(member._id)}
                      className="flex items-center w-full justify-center btn-danger"
                    >
                      <FaTrash className="mr-1" /> O'chirish
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Team Member Modal */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="relative w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl dark:bg-slate-800">
            <button
              onClick={() => setIsTeamModalOpen(false)}
              className="absolute p-1 text-gray-500 top-2 right-2 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              &times;
            </button>
            <h2 className="mb-4 text-xl font-bold">Jamoa A'zosini Qo'shish</h2>

            {error && (
              <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleAddTeamMember}>
              <div className="mb-4">
                <label htmlFor="name" className="form-label">
                  Ism
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={teamMemberData.name}
                  onChange={handleTeamMemberChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="position" className="form-label">
                  Lavozim
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={teamMemberData.position}
                  onChange={handleTeamMemberChange}
                  required
                  className="form-input"
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
                  required
                  className="form-input"
                />

                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="object-cover w-full h-40 rounded"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className="mr-2 btn-secondary"
                >
                  Bekor qilish
                </button>
                <button type="submit" className="btn-primary">
                  Qo'shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutPage;
