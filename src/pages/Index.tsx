
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadProvider } from "@/contexts/LeadContext";
import { Button } from "@/components/ui/button";
import { MoveRight, BarChart3, Table, Kanban, Clock, GitBranch, Settings, Users, FileSpreadsheet, BrainCircuit } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SearchBar } from "@/components/SearchBar";
import { MetricsPanel } from "@/components/MetricsPanel";

const Index = () => {
  return (
    <LeadProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="sticky top-0 z-10 bg-white border-b">
          <div className="container py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Lead Management Portal</h1>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Clock className="w-4 h-4 mr-2" />
                  Last updated 2 min ago
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container py-4">
          <SearchBar />
        </div>

        <div className="container py-4">
          <MetricsPanel />
        </div>

        <div className="container flex-1 py-4">
          <Tabs defaultValue="leads-main" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList className="grid grid-cols-6 w-auto">
                <TabsTrigger value="leads-main" className="flex items-center">
                  <Table className="w-4 h-4 mr-2" />
                  Leads
                </TabsTrigger>
                <TabsTrigger value="leads-by-associate" className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  By Associate
                </TabsTrigger>
                <TabsTrigger value="leads-by-source" className="flex items-center">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  By Source
                </TabsTrigger>
                <TabsTrigger value="ai-insights" className="flex items-center">
                  <BrainCircuit className="w-4 h-4 mr-2" />
                  AI Insights
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <GitBranch className="w-4 h-4 mr-2" />
                  View Options
                </Button>
                <Button size="sm">
                  Refresh
                  <MoveRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            <Card className="p-6">
              <TabsContent value="leads-main" className="mt-0">
                <Suspense fallback={<div>Loading leads...</div>}>
                  <h2 className="text-xl font-semibold mb-4">Lead Management</h2>
                  <p className="text-gray-500 mb-4">
                    This tab displays all leads with advanced filtering, sorting, and viewing options.
                  </p>
                  <div className="h-[400px] flex items-center justify-center border rounded-md bg-gray-50">
                    <p className="text-gray-500">Lead data will be displayed here once connected to Google Sheets</p>
                  </div>
                </Suspense>
              </TabsContent>

              <TabsContent value="leads-by-associate" className="mt-0">
                <h2 className="text-xl font-semibold mb-4">Leads by Associate</h2>
                <p className="text-gray-500">View and analyze leads grouped by associate.</p>
              </TabsContent>

              <TabsContent value="leads-by-source" className="mt-0">
                <h2 className="text-xl font-semibold mb-4">Leads by Source</h2>
                <p className="text-gray-500">View and analyze leads grouped by source.</p>
              </TabsContent>

              <TabsContent value="ai-insights" className="mt-0">
                <h2 className="text-xl font-semibold mb-4">AI Insights</h2>
                <p className="text-gray-500">AI-powered analysis and recommendations based on your lead data.</p>
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <h2 className="text-xl font-semibold mb-4">Analytics</h2>
                <p className="text-gray-500">Detailed charts and reports on lead performance metrics.</p>
              </TabsContent>

              <TabsContent value="admin" className="mt-0">
                <h2 className="text-xl font-semibold mb-4">Admin</h2>
                <p className="text-gray-500">Administrative tools and settings for managing the application.</p>
              </TabsContent>
            </Card>
          </Tabs>
        </div>

        <footer className="border-t bg-white">
          <div className="container py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">© 2025 Lead Management Portal</p>
              <p className="text-sm text-gray-500">Auto-refreshes every 15 minutes</p>
            </div>
          </div>
        </footer>
      </div>
    </LeadProvider>
  );
};

export default Index;
