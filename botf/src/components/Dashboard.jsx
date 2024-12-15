import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getAllUsers, getAllProperties } from "../utils/api";

function Dashboard() {
  const [userData, setUserData] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch both users and properties
    const fetchData = async () => {
      try {
        // Fetch User Data
        const users = await getAllUsers();
        const userChartData = users.reduce((acc, user) => {
          const role = user.role || "Unknown"; // Group by role
          acc[role] = (acc[role] || 0) + 1;
          return acc;
        }, {});
        setUserData(
          Object.keys(userChartData).map((key) => ({
            name: key,
            value: userChartData[key],
          }))
        );

        // Fetch Property Data
        const properties = await getAllProperties();
        const propertyChartData = properties.reduce((acc, property) => {
          const status = property.status || "Unknown"; // Group by status
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        setPropertyData(
          Object.keys(propertyChartData).map((key) => ({
            name: key,
            value: propertyChartData[key],
          }))
        );
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading data...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* User Analytics */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">User Analytics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4caf50" animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Property Analytics */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Property Analytics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={propertyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
