import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { supabase } from '../../services/supabaseClient';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { TrendingUp, PackageCheck } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatCard = ({ title, value, valueLabel }) => {
  const radius = 60;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;

  const icon = title.toLowerCase().includes('stok') ? (
    <PackageCheck className="w-6 h-6 text-indigo-500" />
  ) : (
    <TrendingUp className="w-6 h-6 text-cyan-500" />
  );

  return (
    <div className="relative overflow-hidden bg-white shadow-xl hover:shadow-2xl transition rounded-2xl p-6 w-full flex flex-col items-center border border-gray-100">
      <div className="relative z-10 flex items-center gap-2 text-gray-800 mb-4">
        {icon}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <div className="relative z-10 w-36 h-36 mb-4">
        <svg width="100%" height="100%">
          <circle
            stroke="url(#grad1)"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={0}
            strokeLinecap="round"
            r={normalizedRadius}
            cx="50%"
            cy="50%"
            className="transition-all duration-700"
          />
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900">{value}</span>
          <span className="text-sm text-gray-500">{valueLabel}</span>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [salesChartPeriod, setSalesChartPeriod] = useState('monthly');
  const [revenueChartPeriod, setRevenueChartPeriod] = useState('monthly');
  const [totalStok, setTotalStok] = useState(0);
  const [pesananBaru, setPesananBaru] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const { data: produk } = await supabase.from('products').select('stok');
    const { data: orders } = await supabase.from('orders').select('status');

    if (produk) {
      const total = produk.reduce((acc, item) => acc + (item.stok || 0), 0);
      setTotalStok(total);
    }

    if (orders) {
      const belumSelesai = orders.filter(order => order.status !== 'selesai');
      setPesananBaru(belumSelesai.length);
    }
  };

  const monthlySalesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    datasets: [{
      label: 'Stok Terjual',
      data: [65, 59, 80, 81, 56, 55, 40, 70, 60, 90, 85, 95],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }]
  };

  const yearlySalesData = {
    labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
    datasets: [{
      label: 'Stok Terjual',
      data: [1500, 1800, 2200, 2500, 2800, 3200],
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1,
    }]
  };

  const monthlyRevenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    datasets: [{
      label: 'Pendapatan',
      data: [15000000, 18000000, 22000000, 19000000, 25000000, 23000000, 20000000, 27000000, 24000000, 30000000, 28000000, 32000000],
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    }]
  };

  const yearlyRevenueData = {
    labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
    datasets: [{
      label: 'Pendapatan',
      data: [180000000, 220000000, 250000000, 280000000, 320000000, 350000000],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }]
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);

  const chartOptions = (title, isCurrency = false) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: title },
      tooltip: {
        callbacks: {
          label: context =>
            isCurrency ? `${context.dataset.label}: ${formatCurrency(context.raw)}` :
              `${context.dataset.label}: ${context.raw} Barang`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 10 },
          callback: isCurrency
            ? (value) => formatCurrency(value)
            : undefined
        }
      },
      x: { ticks: { font: { size: 10 } } }
    }
  });

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard title="Stok Tersedia" value={totalStok} valueLabel="Item" />
        <StatCard title="Total Pesanan Baru" value={pesananBaru} valueLabel="Pesanan" />
      </div>

      <div className="bg-white p-5 rounded-lg shadow-md mb-8 hover:shadow-xl transition">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-0">Jumlah Stok Produk Terjual</h2>
          <div className="flex space-x-2">
            <button onClick={() => setSalesChartPeriod('monthly')} className={`py-2 px-4 rounded-md text-sm sm:text-base font-medium transition ${salesChartPeriod === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Per Bulan</button>
            <button onClick={() => setSalesChartPeriod('yearly')} className={`py-2 px-4 rounded-md text-sm sm:text-base font-medium transition ${salesChartPeriod === 'yearly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Per Tahun</button>
          </div>
        </div>
        <div className="h-64 sm:h-80">
          <Bar
            data={salesChartPeriod === 'monthly' ? monthlySalesData : yearlySalesData}
            options={chartOptions('Jumlah Stok Produk Terjual', false)}
          />
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-0">Total Pendapatan</h2>
          <div className="flex space-x-2">
            <button onClick={() => setRevenueChartPeriod('monthly')} className={`py-2 px-4 rounded-md text-sm sm:text-base font-medium transition ${revenueChartPeriod === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Per Bulan</button>
            <button onClick={() => setRevenueChartPeriod('yearly')} className={`py-2 px-4 rounded-md text-sm sm:text-base font-medium transition ${revenueChartPeriod === 'yearly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Per Tahun</button>
          </div>
        </div>
        <div className="h-64 sm:h-80">
          <Bar
            data={revenueChartPeriod === 'monthly' ? monthlyRevenueData : yearlyRevenueData}
            options={chartOptions('Total Pendapatan', true)}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
