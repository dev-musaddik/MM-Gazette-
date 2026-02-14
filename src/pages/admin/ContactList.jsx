import { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCircle, Clock } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { toast } from 'react-hot-toast';

const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const res = await fetch('/api/contacts', {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setContacts(data);
            } else {
                if (res.status === 401) {
                    localStorage.removeItem('userInfo');
                    window.location.href = '/login';
                    return;
                }
                toast.error(data.message || 'Failed to fetch messages');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error loading messages');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const res = await fetch(`/api/contacts/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            });

            if (res.ok) {
                setContacts(contacts.filter(c => c._id !== id));
                toast.success('Message deleted');
            } else {
                toast.error('Failed to delete');
            }
        } catch (err) {
            toast.error('Error deleting message');
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const res = await fetch(`/api/contacts/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                setContacts(contacts.map(c => c._id === id ? { ...c, status: newStatus } : c));
                toast.success(`Marked as ${newStatus}`);
            }
        } catch (err) {
            toast.error('Error updating status');
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-display font-bold text-foreground">Messages</h1>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                        Total: {contacts.length}
                    </span>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">From</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Subject</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Date</th>
                                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">Loading messages...</td>
                                </tr>
                            ) : contacts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">No messages found.</td>
                                </tr>
                            ) : (
                                contacts.map((contact) => (
                                    <tr key={contact._id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                contact.status === 'New' ? 'bg-blue-500/10 text-blue-500' :
                                                contact.status === 'Read' ? 'bg-slate-500/10 text-slate-500' :
                                                'bg-green-500/10 text-green-500'
                                            }`}>
                                                {contact.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-foreground">{contact.name}</div>
                                            <div className="text-xs text-muted-foreground">{contact.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-foreground font-medium mb-1">{contact.subject}</div>
                                            <p className="text-xs text-muted-foreground line-clamp-1 max-w-xs">{contact.message}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            {new Date(contact.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {contact.status === 'New' && (
                                                    <button 
                                                        onClick={() => handleStatusUpdate(contact._id, 'Read')}
                                                        title="Mark as Read"
                                                        className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                    >
                                                        <Clock className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {contact.status !== 'Replied' && (
                                                     <button 
                                                        onClick={() => handleStatusUpdate(contact._id, 'Replied')}
                                                        title="Mark as Replied"
                                                        className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => handleDelete(contact._id)}
                                                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
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

export default ContactList;
