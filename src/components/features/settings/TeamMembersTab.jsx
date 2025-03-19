import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Toaster, toast } from 'sonner';
import { registerUser, getAdminSettings, updateUserDetails, toggleUserStatus } from '@/services/api';
import { Eye, EyeOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
const TeamMembersTab = ({ adminSettings, setAdminSettings }) => {
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'Member',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle adding a new team member
  const handleAddTeamMember = async () => {
    if (newMember.password !== newMember.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const response = await registerUser(newMember);
      toast.success('Team member added successfully!');
      setIsAddMemberModalOpen(false);
      setNewMember({ name: '', email: '', role: 'Member', password: '', confirmPassword: '' });

      // Refresh admin settings to include the new member
      const updatedAdminSettings = await getAdminSettings();
      setAdminSettings(updatedAdminSettings);
    } catch (error) {
      console.error('Failed to add team member:', error);
      toast.error('Failed to add team member. Please try again.');
    }
  };

  // Handle editing a user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // Handle updating user role
  const handleUpdateUserDetails = async () => {
    try {
        const response = await updateUserDetails(selectedUser.userId, {
          name: selectedUser.name,
          email: selectedUser.email,
          role: selectedUser.role,
          isActive: selectedUser.isActive,
        });
        toast.success('User details updated successfully');
        setIsEditModalOpen(false);
  
        // Refresh admin settings
        const updatedAdminSettings = await getAdminSettings();
        setAdminSettings(updatedAdminSettings);
      } catch (error) {
        console.error('Failed to update user details:', error);
        toast.error('Failed to update user details. Please try again.');
      }
  };

  // Handle toggling user status
  const handleToggleUserStatus = async (userId, isActive) => {
    try {
      const response = await toggleUserStatus(userId, { isActive });
      toast.success(`User ${isActive ? 'enabled' : 'disabled'} successfully`);

      // Refresh admin settings
      const updatedAdminSettings = await getAdminSettings();
      setAdminSettings(updatedAdminSettings);
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      toast.error('Failed to toggle user status. Please try again.');
    }
  };

  return (
    <div className="space-y-4 mt-5">
      <div>
        <div className="flex justify-between items-center">
          <h2 className="block text-2xl font-medium text-gray-700 dark:text-gray-200">Team Members</h2>
          <Button onClick={() => setIsAddMemberModalOpen(true)} className="mb-4">
            Add New Member
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="w-full text-left font-medium text-neutral-800 dark:text-gray-200 bg-white dark:bg-gray-300/20 ">
                <th className="py-4 uppercase  text-xs px-4 ">Name</th>
                <th className="py-4 uppercase  text-xs px-4 ">Email</th>
                <th className="py-4 uppercase  text-xs px-4 ">Role</th>
                <th className="py-4 uppercase  text-xs px-4 ">Status</th>
                <th className="py-4 uppercase  text-xs px-4 ">Last Login</th>
                <th className="py-4 uppercase  text-xs px-4 ">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminSettings.teamMembers.map((member) => (
                <tr key={member._id} className="border-b border-gray-200 dark:border-zinc-600">
                  <td className="p-2">{member.name}</td>
                  <td className="p-2">{member.email}</td>
                  <td className="p-2 capitalize">{member.role}</td>
                  <td className="p-2">
                    {member.isActive ? (
                      <span className="text-green-500">Active</span>
                    ) : (
                      <span className="text-red-500">Inactive</span>
                    )}
                  </td>
                  <td className="p-2">
                    {member.lastLogin
                      ? new Date(member.lastLogin).toLocaleString()
                      : 'Never'}
                  </td>
                  <td className="p-2 space-x-2">
                    <Button variant="outline" onClick={() => handleEditUser(member)}>
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleToggleUserStatus(member.userId, !member.isActive)}
                    >
                      {member.isActive ? 'Disable' : 'Enable'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Member Modal */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 bg-neutral-900/80 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg w-2xl">
            <h2 className="text-xl font-bold mb-4">Add New Member</h2>
            <div className="space-y-4">
              <Input
                placeholder="Name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              />
              <Input
                placeholder="Email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              />
              <Select
                value={newMember.role}
                onValueChange={(value) => setNewMember({ ...newMember, role: value })}
              >
                <SelectTrigger>
                  <SelectValue>{newMember.role}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={newMember.password}
                  onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff strokeWidth={1} size={16} /> : <Eye strokeWidth={1} size={16} />}
                </button>
              </div>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={newMember.confirmPassword}
                  onChange={(e) => setNewMember({ ...newMember, confirmPassword: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff strokeWidth={1} size={16} /> : <Eye strokeWidth={1} size={16} />}
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddMemberModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTeamMember}>Add Member</Button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-neutral-900/80 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg w-2xl">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <div className="space-y-4">
              <Input
                placeholder="Name"
                value={selectedUser.name}
                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
              />
              <Input
                placeholder="Email"
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
              />
              <Select
                value={selectedUser.role}
                onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value })}
              >
                <SelectTrigger>
                  <SelectValue>{selectedUser.role}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <label>Status:</label>
                <Switch
                  checked={selectedUser.isActive}
                  onCheckedChange={(checked) =>
                    setSelectedUser({ ...selectedUser, isActive: checked })
                  }
                />
                <span>{selectedUser.isActive ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateUserDetails}>Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMembersTab;