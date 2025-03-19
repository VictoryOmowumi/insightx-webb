import React, { useState, useEffect } from 'react';
import BreadCrumbs from '../../components/layout/BreadCrumb';
import { getUserSettings, getAdminSettings, updateAdminSettings, updateUserSettings } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Toaster } from 'sonner';
import SettingsTabs from '../../components/features/settings/SettingsTabs';

const Settings = () => {
  const { user } = useAuth();
  const [userSettings, setUserSettings] = useState(null);
  const [adminSettings, setAdminSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        if (user?.role === 'Admin') {
          const adminSettings = await getAdminSettings();
          setAdminSettings(adminSettings);
        } else {
          const userSettings = await getUserSettings();
          setUserSettings(userSettings);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  // Handle updating user settings
  const handleUserSettingsUpdate = async (updatedSettings) => {
    try {
      const response = await updateUserSettings(updatedSettings);
      setUserSettings(response);
    } catch (error) {
      console.error('Failed to update user settings:', error);
    }
  };

  // Handle updating admin settings
  const handleAdminSettingsUpdate = async (updatedSettings) => {
    try {
      const response = await updateAdminSettings(updatedSettings);
      setAdminSettings(response);
    } catch (error) {
      console.error('Failed to update admin settings:', error);
    }
  };

 

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-end mt-2 md:mx-5">
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl capitalize flex items-center">Settings</h1>
          <BreadCrumbs />
        </div>
      </div>
      <SettingsTabs
        user={user}
        userSettings={userSettings}
        adminSettings={adminSettings}
        handleUserSettingsUpdate={handleUserSettingsUpdate}
        handleAdminSettingsUpdate={handleAdminSettingsUpdate}
        setAdminSettings={setAdminSettings}
        loading={loading}
      />
      <Toaster />
    </div>
  );
};

export default Settings;