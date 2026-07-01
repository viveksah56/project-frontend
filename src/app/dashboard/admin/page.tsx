"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconLogout, IconShield, IconUsers, IconActivity, IconAlertCircle } from "@tabler/icons-react";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <IconShield className="h-8 w-8 text-red-500" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">System administration & oversight</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2"
          >
            <IconLogout className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Admin Info Card */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/40 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconShield className="h-5 w-5 text-red-500" />
              Administrator Account
            </CardTitle>
            <CardDescription>Full system access and control</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-lg font-semibold text-foreground">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-lg font-semibold text-foreground">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="text-lg font-semibold text-red-500 capitalize">{user?.role}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Admin ID</p>
                <p className="text-sm font-mono text-muted-foreground">{user?.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <IconUsers className="h-5 w-5 text-blue-500" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">1,234</p>
              <p className="text-sm text-muted-foreground">+12% this month</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <IconActivity className="h-5 w-5 text-green-500" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">856</p>
              <p className="text-sm text-muted-foreground">69% of total</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <IconShield className="h-5 w-5 text-purple-500" />
                Professionals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">234</p>
              <p className="text-sm text-muted-foreground">19% of total</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <IconAlertCircle className="h-5 w-5 text-orange-500" />
                Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">5</p>
              <p className="text-sm text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardHeader>
              <CardTitle className="text-base">User Management</CardTitle>
              <CardDescription>Manage users and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button size="sm" className="w-full">
                View All Users
              </Button>
              <Button size="sm" variant="outline" className="w-full">
                View Reports
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardHeader>
              <CardTitle className="text-base">System Settings</CardTitle>
              <CardDescription>Configure system preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button size="sm" className="w-full">
                Settings
              </Button>
              <Button size="sm" variant="outline" className="w-full">
                System Logs
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardHeader>
              <CardTitle className="text-base">Security</CardTitle>
              <CardDescription>Monitor and manage security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button size="sm" className="w-full">
                Security Center
              </Button>
              <Button size="sm" variant="outline" className="w-full">
                Audit Trail
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardHeader>
              <CardTitle className="text-base">Analytics</CardTitle>
              <CardDescription>View system analytics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button size="sm" className="w-full">
                Analytics Dashboard
              </Button>
              <Button size="sm" variant="outline" className="w-full">
                Export Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
