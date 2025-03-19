import React, { useState } from 'react';
import ProfileTab from './ProfileTab';
import NotificationsTab from './NotificationsTab';
import TeamMembersTab from './TeamMembersTab';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const SettingsTabs = ({
  user,
  userSettings,
  adminSettings,
  handleUserSettingsUpdate,
  setAdminSettings,
  handleAdminSettingsUpdate,
  loading, // Add loading prop
}) => {
  const [activeTab, setActiveTab] = useState('notifications');

  return (
    <div className="grid grid-cols-3">
      {/* Profile Tab (Always visible) */}
      <div className="col-span-1">
        <ProfileTab loading={loading} />
      </div>

      {/* Settings Tabs (Profile, Notifications, Team Members) */}
      <div className="col-span-2 bg-[#f5f5f5] dark:bg-muted p-6 rounded-lg">
        <div className="flex gap-4 mb-4">
          {/* Notifications Tab Button */}
          <Button
            variant={activeTab === 'notifications' ? 'default' : 'outline'}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </Button>

          {/* Team Members Tab Button (Only for Admins) */}
          {user?.role === 'Admin' && (
            <Button
              variant={activeTab === 'team' ? 'default' : 'outline'}
              onClick={() => setActiveTab('team')}
            >
              Team Members
            </Button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <>
            {/* Notifications Tab (Different for Users and Admins) */}
            {activeTab === 'notifications' && (
              <>
                {user?.role === 'Admin' ? (
                  <NotificationsTab
                    notifications={adminSettings.notifications}
                    handleSettingsUpdate={handleAdminSettingsUpdate}
                  />
                ) : (
                  <NotificationsTab
                    notifications={userSettings.notifications}
                    handleSettingsUpdate={handleUserSettingsUpdate}
                  />
                )}
              </>
            )}

            {/* Team Members Tab (Only for Admins) */}
            {activeTab === 'team' && user?.role === 'Admin' && (
              <TeamMembersTab
                adminSettings={adminSettings}
                setAdminSettings={setAdminSettings}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SettingsTabs;