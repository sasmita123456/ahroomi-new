"use client";

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { userService } from '@/services/user.service';
import { FiSearch, FiEdit, FiUserCheck, FiUserX, FiPlus, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const UserListPage = () => {
  const { isAuthenticated, user } = useAdminAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  // Only allow SUPER_ADMIN to access this page
  useEffect(() => {
    if (isAuthenticated !== null && isAuthenticated === false) {
      router.push('/login');
    } else if (isAuthenticated && user && user.role !== 'SUPER_ADMIN') {
      // Redirect non-super admins to dashboard
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, user, router]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      if (isAuthenticated && user?.role === 'SUPER_ADMIN') {
        try {
          setLoading(true);
          const response = await userService.getAllUsers();
          
          if (response.outcome) {
            setUsers(response.data || []);
            setFilteredUsers(response.data || []);
          } else {
            setError(response.message || 'Failed to fetch users');
          }
        } catch (err: any) {
          console.error('Error fetching users:', err);
          // Check if it's an authentication error
          if (err.response?.status === 401 || err.response?.status === 403) {
            router.push('/login');
          } else {
            setError('Error fetching users');
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAuthenticated, user, router]);

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      setFilteredUsers(
        users.filter(user => 
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.role.toLowerCase().includes(term)
        )
      );
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await userService.updateUserStatus(userId, !currentStatus);

      if (response.outcome) {
        // Update local state
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u._id === userId ? { ...u, isActive: !currentStatus } : u
          )
        );
        setFilteredUsers(prevUsers => 
          prevUsers.map(u => 
            u._id === userId ? { ...u, isActive: !currentStatus } : u
          )
        );
      }
    } catch (err: any) {
      console.error('Error updating user status:', err);
      // Handle authentication errors
      if (err.response?.status === 401 || err.response?.status === 403) {
        router.push('/login');
      }
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await userService.updateUserRole(userId, newRole);

      if (response.outcome) {
        // Update local state
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u._id === userId ? { ...u, role: newRole } : u
          )
        );
        setFilteredUsers(prevUsers => 
          prevUsers.map(u => 
            u._id === userId ? { ...u, role: newRole } : u
          )
        );
      }
    } catch (err: any) {
      console.error('Error updating user role:', err);
      // Handle authentication errors
      if (err.response?.status === 401 || err.response?.status === 403) {
        router.push('/login');
      }
    }
  };

  const toggleExpand = (userId: string) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== 'SUPER_ADMIN') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
          <p className="text-gray-600 mt-2">Only Super Admin can access this page</p>
          <button 
            onClick={() => router.push('/admin/dashboard')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <FiPlus />
            <span>Add User</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <React.Fragment key={user._id}>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-800 font-medium">
                                  {user.name.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800' : 
                              user.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' : 
                              user.role === 'CMS' ? 'bg-green-100 text-green-800' : 
                              'bg-gray-100 text-gray-800'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <FiEdit className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => toggleUserStatus(user._id, user.isActive)}
                              className={user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                            >
                              {user.isActive ? <FiUserX className="h-5 w-5" /> : <FiUserCheck className="h-5 w-5" />}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => toggleExpand(user._id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            {expandedUser === user._id ? <FiChevronUp /> : <FiChevronDown />}
                          </button>
                        </td>
                      </tr>
                      {expandedUser === user._id && (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">User Details</h4>
                                <div className="mt-2 space-y-1 text-sm text-gray-600">
                                  <p><span className="font-medium">ID:</span> {user._id}</p>
                                  <p><span className="font-medium">Email:</span> {user.email}</p>
                                  <p><span className="font-medium">Role:</span> 
                                    <select 
                                      value={user.role}
                                      onChange={(e) => updateUserRole(user._id, e.target.value)}
                                      className="ml-2 border rounded px-2 py-1 text-xs"
                                      disabled={user._id === user._id && user.role === 'SUPER_ADMIN'} // Prevent SUPER_ADMIN from changing their own role
                                    >
                                      <option value="ADMIN">ADMIN</option>
                                      <option value="CMS">CMS</option>
                                      {user.role !== 'SUPER_ADMIN' && <option value="SUPER_ADMIN">SUPER_ADMIN</option>}
                                    </select>
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">Account Info</h4>
                                <div className="mt-2 space-y-1 text-sm text-gray-600">
                                  <p><span className="font-medium">Created:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
                                  <p><span className="font-medium">Updated:</span> {new Date(user.updatedAt).toLocaleDateString()}</p>
                                  <p><span className="font-medium">Status:</span> 
                                    <span className={user.isActive ? 'text-green-600' : 'text-red-600'}>
                                      {user.isActive ? ' Active' : ' Inactive'}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-10">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserListPage;