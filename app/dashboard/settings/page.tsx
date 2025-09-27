"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { User, Bell, Shield, Palette, Database, Download, Upload, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    fullName: "Umang Kavaiya",
    email: "umang@example.com",
    phone: "+91 98765 43210",
    dateOfBirth: "1995-06-15",
    currency: "INR",
    timezone: "Asia/Kolkata",
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    budgetAlerts: true,
    goalReminders: true,
    weeklyReports: true,
    transactionAlerts: true,
  })

  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    analyticsTracking: true,
    marketingEmails: false,
    twoFactorAuth: false,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and application settings</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Profile Information</h3>
                <p className="text-muted-foreground">Update your personal details and preferences</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="currency">Preferred Currency</Label>
                <Select value={profile.currency} onValueChange={(value) => setProfile({ ...profile, currency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                    <SelectItem value="USD">US Dollar ($)</SelectItem>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={profile.timezone} onValueChange={(value) => setProfile({ ...profile, timezone: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                    <SelectItem value="America/New_York">America/New_York</SelectItem>
                    <SelectItem value="Europe/London">Europe/London</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button>Save Changes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <Bell className="w-8 h-8 text-primary" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Notification Preferences</h3>
                <p className="text-muted-foreground">Choose how you want to be notified about your finances</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Push Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                </div>
                <Switch
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Budget Alerts</h4>
                  <p className="text-sm text-muted-foreground">Get notified when you exceed budget limits</p>
                </div>
                <Switch
                  checked={notifications.budgetAlerts}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, budgetAlerts: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Goal Reminders</h4>
                  <p className="text-sm text-muted-foreground">Reminders about your financial goals</p>
                </div>
                <Switch
                  checked={notifications.goalReminders}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, goalReminders: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Weekly Reports</h4>
                  <p className="text-sm text-muted-foreground">Weekly spending and savings reports</p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Transaction Alerts</h4>
                  <p className="text-sm text-muted-foreground">Alerts for large transactions</p>
                </div>
                <Switch
                  checked={notifications.transactionAlerts}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, transactionAlerts: checked })}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Privacy & Security</h3>
                <p className="text-muted-foreground">Control your privacy and security settings</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Data Sharing</h4>
                  <p className="text-sm text-muted-foreground">Share anonymized data to improve our services</p>
                </div>
                <Switch
                  checked={privacy.dataSharing}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, dataSharing: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Analytics Tracking</h4>
                  <p className="text-sm text-muted-foreground">Help us improve by tracking app usage</p>
                </div>
                <Switch
                  checked={privacy.analyticsTracking}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, analyticsTracking: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Marketing Emails</h4>
                  <p className="text-sm text-muted-foreground">Receive promotional emails and updates</p>
                </div>
                <Switch
                  checked={privacy.marketingEmails}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, marketingEmails: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={privacy.twoFactorAuth ? "default" : "secondary"}>
                    {privacy.twoFactorAuth ? "Enabled" : "Disabled"}
                  </Badge>
                  <Button size="sm" variant="outline">
                    {privacy.twoFactorAuth ? "Disable" : "Enable"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <Database className="w-8 h-8 text-primary" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Data Management</h3>
                <p className="text-muted-foreground">Import, export, and manage your financial data</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent">
                  <Download className="w-6 h-6" />
                  <span>Export Data</span>
                  <span className="text-xs text-muted-foreground">Download all your data</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent">
                  <Upload className="w-6 h-6" />
                  <span>Import Data</span>
                  <span className="text-xs text-muted-foreground">Upload transaction data</span>
                </Button>
              </div>

              <Separator />

              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Trash2 className="w-5 h-5 text-destructive" />
                  <h4 className="font-medium text-destructive">Danger Zone</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  These actions are irreversible. Please proceed with caution.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="text-destructive border-destructive bg-transparent">
                    Clear All Transactions
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive border-destructive bg-transparent">
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <Palette className="w-8 h-8 text-primary" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Appearance</h3>
                <p className="text-muted-foreground">Customize the look and feel of your dashboard</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">Theme</Label>
                <p className="text-sm text-muted-foreground mb-4">Choose your preferred theme</p>
                <div className="grid grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent">
                    <div className="w-8 h-8 bg-background border rounded"></div>
                    <span>Light</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent">
                    <div className="w-8 h-8 bg-foreground rounded"></div>
                    <span>Dark</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent">
                    <div className="w-8 h-8 bg-gradient-to-br from-background to-foreground rounded"></div>
                    <span>System</span>
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-base font-medium">Dashboard Layout</Label>
                <p className="text-sm text-muted-foreground mb-4">Choose your preferred dashboard layout</p>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent">
                    <div className="w-12 h-8 border rounded flex">
                      <div className="w-3 bg-muted"></div>
                      <div className="flex-1 bg-background"></div>
                    </div>
                    <span>Compact</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent">
                    <div className="w-12 h-8 border rounded flex">
                      <div className="w-4 bg-muted"></div>
                      <div className="flex-1 bg-background"></div>
                    </div>
                    <span>Comfortable</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
