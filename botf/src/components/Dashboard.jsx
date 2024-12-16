import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getAllUsers, getAllProperties } from "../utils/api";

function Dashboard() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmails, setUserEmails] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getAllUsers();
        const emails = users.map((user) => user.email || "Unknown");
        setUserEmails(emails);

        const userRoles = users.reduce((acc, user) => {
          const role = user.role || "Unknown";
          acc[role] = (acc[role] || 0) + 1;
          return acc;
        }, {});

        const properties = await getAllProperties();
        const propertyStatuses = properties.reduce((acc, property) => {
          const status = property.status || "Unknown";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        const combinedData = [];
        const allKeys = new Set([...Object.keys(userRoles), ...Object.keys(propertyStatuses)]);
        allKeys.forEach((key) => {
          combinedData.push({
            name: key,
            Users: userRoles[key] || 0,
            Properties: propertyStatuses[key] || 0,
          });
        });

        setChartData(combinedData);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUserClick = async (email) => {
    setSelectedUser(email);
    try {
      const properties = await getAllProperties();
      const userProperties = properties.filter((property) => property.userEmail === email);

      const propertyStatuses = userProperties.reduce((acc, property) => {
        const status = property.status || "Unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const userData = Object.keys(propertyStatuses).map((status) => ({
        name: status,
        Properties: propertyStatuses[status],
      }));

      setSelectedUserData(userData);
    } catch (err) {
      setError("Failed to fetch user-specific properties");
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading data...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Enhanced Dashboard</h1>

      {/* Combined Bar Chart */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
          User and Property Trends
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="Users" fill="#4caf50" barSize={30} />
            <Bar dataKey="Properties" fill="#3b82f6" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* User Email List */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">User Emails</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {userEmails.map((email) => (
            <button
              key={email}
              onClick={() => handleUserClick(email)}
              className={`p-4 text-center rounded-lg shadow-md ${
                selectedUser === email ? "bg-blue-500 text-white" : "bg-gray-100"
              } hover:bg-blue-200`}
            >
              {email}
            </button>
          ))}
        </div>
      </div>

      {/* Selected User Properties */}
      {selectedUser && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Properties for {selectedUser}
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={selectedUserData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "10px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="Properties" fill="#ff7300" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
