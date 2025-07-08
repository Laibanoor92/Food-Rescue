import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  GiftIcon, 
  ClockIcon, 
  TruckIcon, 
  CheckCircleIcon 
} from '@heroicons/react/outline';

const StatsCard = ({ icon, title, value, bgColor }) => (
  <div className={`${bgColor} rounded-lg shadow-md p-6 flex items-center`}>
    <div className="rounded-full bg-white p-3 mr-4">
      {icon}
    </div>
    <div>
      <p className="text-white text-lg font-medium">{title}</p>
      <h3 className="text-white text-3xl font-bold">{value}</h3>
    </div>
  </div>
);

const DashboardStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    picked: 0,
    delivered: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/donations/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching donation stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-40">Loading stats...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        icon={<GiftIcon className="h-6 w-6 text-green-600" />}
        title="Total Donations"
        value={stats.total}
        bgColor="bg-green-600"
      />
      <StatsCard
        icon={<ClockIcon className="h-6 w-6 text-yellow-600" />}
        title="Pending Donations"
        value={stats.pending}
        bgColor="bg-yellow-600"
      />
      <StatsCard
        icon={<TruckIcon className="h-6 w-6 text-blue-600" />}
        title="Picked Donations"
        value={stats.picked}
        bgColor="bg-blue-600"
      />
      <StatsCard
        icon={<CheckCircleIcon className="h-6 w-6 text-purple-600" />}
        title="Delivered Donations"
        value={stats.delivered}
        bgColor="bg-purple-600"
      />
    </div>
  );
};

export default DashboardStats;