import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getServices, getPortfolio, getContacts } from "../services/api";
import { FaCog, FaBriefcase, FaPhoneAlt } from "react-icons/fa";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    services: 0,
    portfolio: 0,
    newContacts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [servicesRes, portfolioRes, contactsRes] = await Promise.all([
          getServices(),
          getPortfolio(),
          getContacts(),
        ]);

        setStats({
          services: servicesRes.data.length,
          portfolio: portfolioRes.data.length,
          newContacts: contactsRes.data.filter(
            (contact) => contact.status === "Yangi"
          ).length,
        });
        setLoading(false);
      } catch (error) {
        console.error("Statistikani yuklashda xatolik:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ icon, title, value, linkTo, color }) => (
    <Link
      to={linkTo}
      className="p-6 transition-all bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg dark:bg-slate-800 dark:border-slate-700"
    >
      <div className="flex items-center">
        <div className={`p-3 mr-4 rounded-full ${color}`}>{icon}</div>
        <div>
          <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <h3 className="text-3xl font-bold">{value}</h3>
        </div>
      </div>
    </Link>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Admin panel statistikasi
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <p>Yuklanmoqda...</p>
        </div>
      ) : (
        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <StatCard
            icon={<FaCog className="text-2xl text-white" />}
            title="Xizmatlar"
            value={stats.services}
            linkTo="/services"
            color="bg-blue-600"
          />
          <StatCard
            icon={<FaBriefcase className="text-2xl text-white" />}
            title="Portfolio"
            value={stats.portfolio}
            linkTo="/portfolio"
            color="bg-green-600"
          />
          <StatCard
            icon={<FaPhoneAlt className="text-2xl text-white" />}
            title="Yangi Kontaktlar"
            value={stats.newContacts}
            linkTo="/contacts"
            color="bg-red-600"
          />
        </div>
      )}

      <div className="p-6 bg-white rounded-lg shadow-md dark:bg-slate-800">
        <h2 className="mb-4 text-xl font-semibold">
          Admin paneliga xush kelibsiz!
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          Bu yerda siz saytning barcha bo'limlarini boshqarishingiz mumkin.
          Yangi xizmatlar qo'shing, portfolio loyihalarini yangilang, va
          mijozlarning aloqa so'rovlariga javob bering.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <Link to="/services" className="btn-primary text-center">
            Xizmatlarni boshqarish
          </Link>
          <Link to="/portfolio" className="btn-primary text-center">
            Portfolioni boshqarish
          </Link>
          <Link to="/contacts" className="btn-primary text-center">
            Kontaktlarni ko'rish
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
