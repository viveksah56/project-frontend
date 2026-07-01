"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconLogout, IconBriefcase, IconTrendingUp } from "@tabler/icons-react";

export default function ProfessionalDashboard() {
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Professional Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {user?.name}!</p>
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

        {/* Profile Card */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/40 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBriefcase className="h-5 w-5" />
              Professional Profile
            </CardTitle>
            <CardDescription>Your professional account details</CardDescription>
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
                <p className="text-sm text-muted-foreground">Account Type</p>
                <p className="text-lg font-semibold text-blue-500 capitalize">{user?.role}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Professional ID</p>
                <p className="text-sm font-mono text-muted-foreground">{user?.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <IconTrendingUp className="h-5 w-5 text-green-500" />
                Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">12</p>
              <p className="text-sm text-muted-foreground">Active projects</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardHeader>
              <CardTitle className="text-base">Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">$2,450</p>
              <p className="text-sm text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardHeader>
              <CardTitle className="text-base">Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-500">4.8</p>
              <p className="text-sm text-muted-foreground">Out of 5</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardHeader>
              <CardTitle className="text-base">My Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage and track your professional projects
              </p>
              <Button size="sm" className="w-full">
                View Projects
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardHeader>
              <CardTitle className="text-base">Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Update your professional profile and preferences
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Go to Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
