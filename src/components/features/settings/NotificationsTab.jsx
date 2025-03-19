import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const NotificationsTab = ({ userSettings, handleUserSettingsUpdate }) => {

  return (
    <div className="space-y-4 mt-5">
      <div>
        <Label htmlFor="theme">Theme</Label>
        <Select
          value={userSettings?.theme}
          onValueChange={(value) => handleUserSettingsUpdate({ theme: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue>{userSettings?.theme}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem  >Select theme</SelectItem>
            <SelectItem value="Light">Light</SelectItem>
            <SelectItem value="Dark">Dark</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        {/* <h2 className="block text-2xl font-medium text-gray-700 dark:text-gray-200">Notifications</h2> */}
        <div className="mt-5 space-y-2">
          <div className="flex flex-col mt-4 items-start gap-2">
            <label className="!text-sm"> Email Notifications</label>
            <Switch
              checked={userSettings?.notifications?.email}
              onCheckedChange={(checked) =>
                handleUserSettingsUpdate({
                  notifications: { ...userSettings.notifications, email: checked },
                })
              }
            />
          </div>
          <div className="flex flex-col mt-4 items-start gap-2">
            <label className="!text-sm"> In-App Notifications</label>
            <Switch
              checked={userSettings?.notifications.inApp}
              onCheckedChange={(checked) =>
                handleUserSettingsUpdate({
                  notifications: { ...userSettings.notifications, inApp: checked },
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsTab;