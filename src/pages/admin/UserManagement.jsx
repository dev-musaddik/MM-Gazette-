import { useEffect, useState } from 'react';
import api from '../../redux/api/apiService';
import { useLanguage } from '../../i18n/LanguageContext';
import Spinner from '../../components/common/Spinner';
import { FiSearch, FiShield, FiUser } from 'react-icons/fi';

/**
 * User Management Page (Admin)
 * View and manage all users, update roles
 */
const UserManagement = () => {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    if (searchTerm) {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/auth/admin/users');
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }

    setUpdatingUserId(userId);
    try {
      await api.put(`/api/auth/admin/users/${userId}/role`, { role: newRole });
      
      // Update local state
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
      
      alert('User role updated successfully!');
    } catch (error) {
      console.error('Failed to update user role:', error);
      alert('Failed to update user role. Please try again.');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-white mb-2 text-glow">
            {t('userManagement')}
          </h1>
          <p className="text-gray-400">
            Manage user accounts and permissions
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 text-white placeholder-gray-500 transition-colors"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">{users.length}</div>
            <div className="text-sm text-gray-400">Total Users</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-orange-400">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <div className="text-sm text-gray-400">Admins</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 col-span-2 sm:col-span-1">
            <div className="text-2xl font-bold text-primary-400">
              {users.filter(u => u.role === 'user').length}
            </div>
            <div className="text-sm text-gray-400">Regular Users</div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-neon-blue">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-primary-500/20 rounded-full flex items-center justify-center border border-primary-500/50">
                            <span className="text-primary-400 font-bold text-lg">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-3 sm:ml-4">
                            <div className="text-sm font-medium text-white">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 sm:hidden">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{user.email}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium border ${
                            user.role === 'admin'
                              ? 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                              : 'bg-primary-500/20 text-primary-400 border-primary-500/50'
                          }`}
                        >
                          {user.role === 'admin' ? (
                            <FiShield className="w-3 h-3 mr-1" />
                          ) : (
                            <FiUser className="w-3 h-3 mr-1" />
                          )}
                          {user.role}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {updatingUserId === user._id ? (
                          <Spinner size="sm" />
                        ) : (
                          <button
                            onClick={() =>
                              handleRoleUpdate(
                                user._id,
                                user.role === 'admin' ? 'user' : 'admin'
                              )
                            }
                            className={`px-3 py-1.5 rounded text-xs sm:text-sm font-medium transition border ${
                              user.role === 'admin'
                                ? 'bg-primary-500/10 text-primary-400 border-primary-500/30 hover:bg-primary-500/20'
                                : 'bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-orange-500/20'
                            }`}
                          >
                            {user.role === 'admin' ? 'Demote' : 'Promote'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Count */}
        {searchTerm && (
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
