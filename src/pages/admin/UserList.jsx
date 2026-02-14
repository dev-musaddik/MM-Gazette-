import { useState, useEffect } from 'react';
import { Users, Search, Shield, Trash2, Edit } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const res = await fetch('/api/auth/admin/users', {
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`
                }
            });
            const data = await res.json();
            // Expected: { success: true, count: X, users: [...] }
            setUsers(data.users || data || []);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
      // Implement delete user logic if backend supports it
      if(!window.confirm("Are you sure?")) return;
      alert("Delete functionality coming soon / restricted for safety.");
    };

    const handleRoleUpdate = async (id, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        if (!window.confirm(`Change role to ${newRole}?`)) return;

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const res = await fetch(`/api/auth/admin/users/${id}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`
                },
                body: JSON.stringify({ role: newRole })
            });

            if (res.ok) {
                // Update local state
                setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
            } else {
                alert("Failed to update role");
            }
        } catch (err) {
            console.error("Error updating role", err);
        }
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold">Users</h1>
                    <p className="text-slate-400 mt-1">Manage registered users and roles.</p>
                </div>
            </div>

             {/* Search */}
             <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                    />
                </div>
            </div>

            <div className="glass-card overflow-hidden border border-white/10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="p-4 font-medium text-slate-400">User</th>
                                <th className="p-4 font-medium text-slate-400">Role</th>
                                <th className="p-4 font-medium text-slate-400">Joined</th>
                                <th className="p-4 font-medium text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                             {loading ? (
                                <tr><td colSpan="4" className="p-8 text-center text-slate-400">Loading users...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="4" className="p-8 text-center text-slate-400">No users found.</td></tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-white">{user.name}</div>
                                            <div className="text-xs text-slate-500">{user.email}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${user.role === 'admin' ? 'bg-accent/10 border-accent text-accent' : 'bg-white/5 border-white/10 text-slate-300'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-300 text-sm">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                             <button 
                                                onClick={() => handleRoleUpdate(user._id, user.role)}
                                                className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-accent transition-colors"
                                                title="Toggle Admin Role"
                                            >
                                                <Shield className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default UserList;
