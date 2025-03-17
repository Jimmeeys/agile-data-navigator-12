
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadProvider } from "@/contexts/LeadContext";
import { Button } from "@/components/ui/button";
import { 
  MoveRight, 
  BarChart3, 
  Table, 
  Kanban, 
  Clock, 
  GitBranch, 
  Settings, 
  Users, 
  FileSpreadsheet, 
  BrainCircuit,
  Plus,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { SearchBar } from "@/components/SearchBar";
import { MetricsPanel } from "@/components/MetricsPanel";
import { LeadsTable } from "@/components/LeadsTable";

const Index = () => {
  return (
    <LeadProvider>
      <div className="flex flex-col min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
          <div className="container py-3">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Lead Management Portal</h1>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">Last updated 2 min ago</span>
                </Button>
                <Button variant="outline" size="sm" className="w-9 h-9 p-0">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container py-4">
          <div className="flex flex-col-reverse sm:flex-row gap-4 items-start sm:items-center justify-between">
            <SearchBar />
            <Button className="w-full sm:w-auto gap-2">
              <Plus className="h-4 w-4" />
              <span>Add New Lead</span>
            </Button>
          </div>
        </div>

        <div className="container py-4">
          <MetricsPanel />
        </div>

        <div className="container flex-1 py-4 pb-8">
          <Tabs defaultValue="leads-main" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full sm:w-auto">
                <TabsTrigger value="leads-main" className="flex items-center gap-2">
                  <Table className="w-4 h-4" />
                  <span className="hidden md:inline">Leads</span>
                </TabsTrigger>
                <TabsTrigger value="leads-by-associate" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="hidden md:inline">By Associate</span>
                </TabsTrigger>
                <TabsTrigger value="leads-by-source" className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span className="hidden md:inline">By Source</span>
                </TabsTrigger>
                <TabsTrigger value="ai-insights" className="flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4" />
                  <span className="hidden md:inline">AI Insights</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden md:inline">Analytics</span>
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span className="hidden md:inline">Admin</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="gap-2">
                  <GitBranch className="w-4 h-4" />
                  <span>View</span>
                </Button>
                <Button size="sm" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </Button>
              </div>
            </div>

            <TabsContent value="leads-main" className="mt-0">
              <Card className="shadow-sm border-border/30 mb-4">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Lead Management</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Today</span>
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Kanban className="h-4 w-4" />
                        <span>Kanban</span>
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    View and manage all leads with advanced filtering, sorting, and editing options.
                  </p>
                </CardHeader>
              </Card>

              <Suspense fallback={<div className="py-8 text-center">Loading leads data...</div>}>
                <LeadsTable />
              </Suspense>
            </TabsContent>

            <TabsContent value="leads-by-associate" className="mt-0">
              <Card className="p-6 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Leads by Associate</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    View and analyze leads grouped by associate.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center border rounded-md bg-muted/30">
                    <p className="text-muted-foreground">Associate data will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leads-by-source" className="mt-0">
              <Card className="p-6 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Leads by Source</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    View and analyze leads grouped by source.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center border rounded-md bg-muted/30">
                    <p className="text-muted-foreground">Source data will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai-insights" className="mt-0">
              <Card className="p-6 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">AI Insights</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    AI-powered analysis and recommendations based on your lead data.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center border rounded-md bg-muted/30">
                    <p className="text-muted-foreground">AI insights will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-0">
              <Card className="p-6 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Analytics</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Detailed charts and reports on lead performance metrics.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center border rounded-md bg-muted/30">
                    <p className="text-muted-foreground">Analytics data will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admin" className="mt-0">
              <Card className="p-6 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Admin</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Administrative tools and settings for managing the application.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center border rounded-md bg-muted/30">
                    <p className="text-muted-foreground">Admin tools will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <footer className="border-t bg-white dark:bg-gray-900">
          <div className="container py-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">© 2023 Lead Management Portal</p>
              <p className="text-sm text-muted-foreground">Auto-refreshes every 15 minutes</p>
            </div>
          </div>
        </footer>
      </div>
    </LeadProvider>
  );
};

export default Index;
