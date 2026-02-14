import { useEffect, useState } from 'react';
import api from '../../redux/api/apiService';
import Spinner from '../../components/common/Spinner';
import { FiActivity, FiUsers, FiShoppingCart, FiDollarSign, FiFilter, FiAlertTriangle } from 'react-icons/fi';

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('public');
  const [loading, setLoading] = useState(true);
  const [publicData, setPublicData] = useState(null);
  const [landingPages, setLandingPages] = useState([]);
  const [selectedLandingPage, setSelectedLandingPage] = useState('');
  const [landingData, setLandingData] = useState(null);
  const [trafficFlags, setTrafficFlags] = useState([]);
  const [dateRange, setDateRange] = useState({
    label: 'Last 30 Days',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date().toISOString()
  });

  const dateRanges = [
    { label: 'Today', days: 0 },
    { label: 'Yesterday', days: 1, type: 'yesterday' },
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'This Month', type: 'month' }
  ];

  const handleDateFilterChange = (range) => {
    let start = new Date();
    let end = new Date();
    
    if (range.type === 'month') {
      start = new Date(end.getFullYear(), end.getMonth(), 1);
    } else if (range.type === 'yesterday') {
      start.setDate(end.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
    } else {
      start.setDate(end.getDate() - range.days);
      if (range.days === 0) start.setHours(0, 0, 0, 0);
    }

    setDateRange({
      label: range.label,
      startDate: start.toISOString(),
      endDate: end.toISOString()
    });
  };

  useEffect(() => {
    fetchPublicData();
    fetchLandingPages();
    fetchTrafficFlags();
  }, [dateRange]);

  useEffect(() => {
    if (selectedLandingPage) {
      fetchLandingData(selectedLandingPage);
    }
  }, [selectedLandingPage, dateRange]);

  const fetchPublicData = async () => {
    try {
      const { data } = await api.get(`/api/analytics/public/dashboard?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
      setPublicData(data);
    } catch (error) {
      console.error('Failed to fetch public analytics', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLandingPages = async () => {
    try {
      const { data } = await api.get('/api/landing-pages/admin/all');
      console.log('Fetched Landing Pages:', data);
      setLandingPages(data.landingPages);
      if (data.landingPages?.length > 0) {
        setSelectedLandingPage(data.landingPages[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch landing pages', error);
    }
  };

  const fetchLandingData = async (id) => {
    try {
      const { data } = await api.get(`/api/analytics/landing/${id}?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
      setLandingData(data);
    } catch (error) {
      console.error('Failed to fetch landing analytics', error);
    }
  };

  const fetchTrafficFlags = async () => {
    try {
      const { data } = await api.get('/api/analytics/flags');
      setTrafficFlags(data.data);
    } catch (error) {
      console.error('Failed to fetch traffic flags', error);
    }
  };

  if (loading) return <div className="flex justify-center p-12 bg-black min-h-screen"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-black py-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-white mb-8 text-glow">Analytics Dashboard</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab('public')}
            className={`pb-4 px-4 font-medium transition-colors ${
              activeTab === 'public'
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Public Website
          </button>
          <button
            onClick={() => setActiveTab('landing')}
            className={`pb-4 px-4 font-medium transition-colors ${
              activeTab === 'landing'
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Landing Pages
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-4 px-4 font-medium transition-colors ${
              activeTab === 'security'
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Security & Fraud
          </button>
        </div>

        {/* Date Filter */}
        <div className="mb-8 flex justify-end">
          <div className="bg-white/5 rounded-lg border border-white/10 p-2 flex space-x-2">
            {dateRanges.map((range) => (
              <button
                key={range.label}
                onClick={() => handleDateFilterChange(range)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                  dateRange.label === range.label
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/50'
                    : 'text-gray-400 hover:bg-white/10'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Public Analytics Content */}
        {activeTab === 'public' && publicData && (
          <div className="space-y-8 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Sessions"
                value={publicData.stats.totalSessions}
                icon={<FiActivity />}
                color="blue"
              />
              <StatCard
                title="Unique Visitors"
                value={publicData.stats.uniqueVisitors}
                icon={<FiUsers />}
                color="purple"
              />
              <StatCard
                title="Total Views"
                value={publicData.funnel.views}
                icon={<FiActivity />}
                color="green"
              />
              <StatCard
                title="Purchases"
                value={publicData.funnel.purchases}
                icon={<FiDollarSign />}
                color="yellow"
              />
            </div>

            {/* Funnel */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 shadow-neon-blue">
              <h3 className="text-lg font-bold text-white mb-6">Conversion Funnel ({dateRange.label})</h3>
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
                <FunnelStep label="Page Views" value={publicData.funnel.views} color="bg-blue-500" />
                <div className="hidden md:block text-gray-600">→</div>
                <FunnelStep label="Add to Cart" value={publicData.funnel.addToCarts} color="bg-purple-500" />
                <div className="hidden md:block text-gray-600">→</div>
                <FunnelStep label="Checkout" value={publicData.funnel.checkouts} color="bg-orange-500" />
                <div className="hidden md:block text-gray-600">→</div>
                <FunnelStep label="Purchase" value={publicData.funnel.purchases} color="bg-green-500" />
              </div>
            </div>
          </div>
        )}

        {/* Landing Analytics Content */}
        {activeTab === 'landing' && (
          <div className="space-y-8 animate-fade-in">
            {/* Selector */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center space-x-4">
              <FiFilter className="text-gray-400" />
              <select
                value={selectedLandingPage}
                onChange={(e) => setSelectedLandingPage(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base bg-black/50 border border-white/20 text-white focus:outline-none focus:border-primary-500 sm:text-sm rounded-md"
              >
                {landingPages.map((lp) => (
                  <option key={lp._id} value={lp._id}>{lp.title} ({lp.slug})</option>
                ))}
              </select>
            </div>

            {landingData && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <StatCard title="Total Visits" value={landingData.stats.visits} icon={<FiUsers />} color="blue" />
                  <StatCard title="CTA Clicks" value={landingData.stats.clicks} icon={<FiShoppingCart />} color="purple" />
                  <StatCard title="Leads Generated" value={landingData.stats.leads} icon={<FiDollarSign />} color="green" />
                  <StatCard title="Conversion Rate" value={`${landingData.stats.conversionRate}%`} icon={<FiActivity />} color="yellow" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 p-6 rounded-xl border border-white/10 shadow-neon-blue">
                    <h3 className="text-lg font-bold text-white mb-4">Traffic Sources</h3>
                    <div className="space-y-3">
                      {Object.entries(landingData.sources).map(([source, count]) => (
                        <div key={source} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
                          <span className="text-gray-300 capitalize">{source || 'Direct / None'}</span>
                          <span className="font-mono font-medium text-primary-400">{count}</span>
                        </div>
                      ))}
                      {Object.keys(landingData.sources)?.length === 0 && (
                        <p className="text-gray-500 text-sm">No source data available yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Security Content */}
        {activeTab === 'security' && (
          <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-neon-blue animate-fade-in">
            <div className="px-6 py-4 border-b border-white/10 bg-red-500/10">
              <h3 className="text-lg font-bold text-red-400 flex items-center">
                <FiAlertTriangle className="mr-2" /> Suspicious Activity Log
              </h3>
            </div>
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">IP Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {trafficFlags.map((flag) => (
                  <tr key={flag._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(flag.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{flag.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-sm ${
                        flag.severity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
                        flag.severity === 'high' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' :
                        'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                      }`}>
                        {flag.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                      {flag.ipHash.substring(0, 12)}...
                    </td>
                  </tr>
                ))}
                {trafficFlags?.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      No suspicious activity detected.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
    green: 'bg-green-500/20 text-green-400 border-green-500/50',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  };

  return (
    <div className="bg-white/5 p-6 rounded-xl border border-white/10 flex items-center space-x-4 hover:shadow-neon-blue transition-shadow">
      <div className={`p-3 rounded-lg border ${colors[color]}`}>
        <div className="w-6 h-6">{icon}</div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

const FunnelStep = ({ label, value, color }) => (
  <div className="flex-1 w-full text-center p-4 bg-white/5 rounded-lg border border-white/10">
    <div className="text-sm font-medium text-gray-400 mb-2">{label}</div>
    <div className={`text-2xl font-bold ${color.replace('bg-', 'text-').replace('500', '400')}`}>{value}</div>
    <div className={`h-2 w-full ${color} rounded-full mt-2 opacity-20`}>
      <div className={`h-full ${color} rounded-full shadow-[0_0_10px_rgba(var(--${color.replace('bg-', '')}-500),0.5)]`} style={{ width: '100%' }}></div>
    </div>
  </div>
);

export default AnalyticsDashboard;
