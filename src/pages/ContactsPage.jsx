import React, { useState, useEffect } from "react";
import {
  getContacts,
  updateContactStatus,
  deleteContact,
} from "../services/api";
import { FaPhoneAlt, FaCheck, FaTrash } from "react-icons/fa";

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await getContacts();
      setContacts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Kontaktlarni yuklashda xatolik:", error);
      setError("Kontaktlarni yuklashda xatolik yuz berdi");
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id) => {
    try {
      await updateContactStatus(id);

      // Update local state
      setContacts(
        contacts.map((contact) =>
          contact._id === id ? { ...contact, status: "Bog'lanildi" } : contact
        )
      );

      setSuccess("Kontakt holati muvaffaqiyatli yangilandi");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Kontakt holatini yangilashda xatolik:", error);
      setError("Kontakt holatini yangilashda xatolik yuz berdi");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Siz rostdan ham bu kontaktni o'chirmoqchimisiz?")) {
      try {
        await deleteContact(id);

        // Update local state
        setContacts(contacts.filter((contact) => contact._id !== id));

        setSuccess("Kontakt muvaffaqiyatli o'chirildi");

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } catch (error) {
        console.error("Kontaktni o'chirishda xatolik:", error);
        setError("Kontaktni o'chirishda xatolik yuz berdi");
      }
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Kontaktlar</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Mijozlardan kelgan aloqa so'rovlari
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
        <div className="w-full overflow-hidden bg-white rounded-lg shadow-md dark:bg-slate-800">
          {contacts.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Kontaktlar mavjud emas.
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-700 uppercase dark:text-gray-300">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {contacts.map((contact) => (
                  <tr
                    key={contact._id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">
                        {contact.name || "Nomsiz"}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {contact.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                          contact.status === "Yangi"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {contact.status === "Yangi" && (
                        <button
                          onClick={() => handleUpdateStatus(contact._id)}
                          className="p-2 mr-2 text-blue-600 rounded-full hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900"
                          title="Bog'lanildi deb belgilash"
                        >
                          <FaCheck />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(contact._id)}
                        className="p-2 text-red-600 rounded-full hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900"
                        title="O'chirish"
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
    </div>
  );
};

export default ContactsPage;
