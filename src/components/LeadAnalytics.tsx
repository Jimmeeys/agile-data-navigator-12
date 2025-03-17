
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useLeads } from '@/contexts/LeadContext';
import { 
  ChevronDown, 
  DownloadCloud, 
  RefreshCw,
  BarChart4,
  LineChart,
  PieChart,
  Activity,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  LineChart as RechartLine,
  Line,
  PieChart as RechartPie,
  Pie,
  Cell,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';

export function LeadAnalytics() {
  const { leads } = useLeads();
  const [chartType, setChartType] = useState('bar');
  const [xAxis, setXAxis] = useState('source');
  const [yAxis, setYAxis] = useState('count');
  const [groupBy, setGroupBy] = useState('month');
  const [isLoading, setIsLoading] = useState(false);
  
  const fieldOptions = [
    { value: 'source', label: 'Source' },
    { value: 'status', label: 'Status' },
    { value: 'stage', label: 'Stage' },
    { value: 'associate', label: 'Associate' },
    { value: 'createdAt', label: 'Created Date' }
  ];
  
  const valueOptions = [
    { value: 'count', label: 'Count' },
    { value: 'value', label: 'Value ($)' },
    { value: 'conversion', label: 'Conversion Rate (%)' }
  ];
  
  const timeOptions = [
    { value: 'day', label: 'Daily' },
    { value: 'week', label: 'Weekly' },
    { value: 'month', label: 'Monthly' },
    { value: 'quarter', label: 'Quarterly' },
    { value: 'year', label: 'Yearly' }
  ];

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  // Colors for charts
  const COLORS = ['#4f46e5', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#84cc16', '#ef4444', '#f97316', '#ec4899'];

  // Generate sample data based on user selections
  const generateChartData = () => {
    if (xAxis === 'createdAt') {
      // Time series data
      return [
        { name: 'Jan', value: 65, count: 65, conversion: 12 },
        { name: 'Feb', value: 59, count: 59, conversion: 15 },
        { name: 'Mar', value: 80, count: 80, conversion: 18 },
        { name: 'Apr', value: 81, count: 81, conversion: 22 },
        { name: 'May', value: 56, count: 56, conversion: 16 },
        { name: 'Jun', value: 55, count: 55, conversion: 14 },
        { name: 'Jul', value: 40, count: 40, conversion: 12 }
      ];
    }
    
    // Count by category
    if (xAxis === 'source') {
      return [
        { name: 'Website', value: 140, count: 140, conversion: 18 },
        { name: 'Referral', value: 110, count: 110, conversion: 22 },
        { name: 'Social Media', value: 95, count: 95, conversion: 15 },
        { name: 'Email', value: 85, count: 85, conversion: 14 },
        { name: 'Event', value: 75, count: 75, conversion: 12 }
      ];
    }
    
    if (xAxis === 'status') {
      return [
        { name: 'New', value: 120, count: 120, conversion: 0 },
        { name: 'Contacted', value: 190, count: 190, conversion: 5 },
        { name: 'Qualified', value: 150, count: 150, conversion: 15 },
        { name: 'Proposal', value: 80, count: 80, conversion: 35 },
        { name: 'Negotiation', value: 50, count: 50, conversion: 60 },
        { name: 'Closed Won', value: 95, count: 95, conversion: 100 },
        { name: 'Closed Lost', value: 75, count: 75, conversion: 0 }
      ];
    }
    
    if (xAxis === 'stage') {
      return [
        { name: 'Discovery', value: 210, count: 210, conversion: 12 },
        { name: 'Qualification', value: 150, count: 150, conversion: 18 },
        { name: 'Demo', value: 120, count: 120, conversion: 25 },
        { name: 'Proposal', value: 80, count: 80, conversion: 40 },
        { name: 'Negotiation', value: 60, count: 60, conversion: 65 }
      ];
    }
    
    // Default data
    return [
      { name: 'John', value: 35, count: 35, conversion: 22 },
      { name: 'Sarah', value: 45, count: 45, conversion: 28 },
      { name: 'Mike', value: 25, count: 25, conversion: 15 },
      { name: 'Lisa', value: 30, count: 30, conversion: 18 },
      { name: 'David', value: 40, count: 40, conversion: 25 }
    ];
  };

  const chartData = generateChartData();
  
  // For pie chart data
  const pieData = chartData.map(item => ({
    name: item.name,
    value: item[yAxis as keyof typeof item]
  }));

  const renderChart = () => {
    const dataKey = yAxis;
    
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip formatter={(value) => yAxis === 'conversion' ? `${value}%` : value} />
              <Legend />
              <Bar dataKey={dataKey} fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartLine data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip formatter={(value) => yAxis === 'conversion' ? `${value}%` : value} />
              <Legend />
              <Line type="monotone" dataKey={dataKey} stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </RechartLine>
          </ResponsiveContainer>
        );
        
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartPie margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => yAxis === 'conversion' ? `${value}%` : value} />
              <Legend />
            </RechartPie>
          </ResponsiveContainer>
        );
        
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip formatter={(value) => yAxis === 'conversion' ? `${value}%` : value} />
              <Legend />
              <Area type="monotone" dataKey={dataKey} stroke="#4f46e5" fill="url(#colorGradient)" />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        );
        
      default:
        return <div>Select a chart type</div>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/40 shadow-md overflow-hidden dark:bg-gray-900">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-xl">Lead Analytics</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">
                    <div className="flex items-center">
                      <BarChart4 className="w-4 h-4 mr-2" />
                      <span>Bar Chart</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="line">
                    <div className="flex items-center">
                      <LineChart className="w-4 h-4 mr-2" />
                      <span>Line Chart</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="pie">
                    <div className="flex items-center">
                      <PieChart className="w-4 h-4 mr-2" />
                      <span>Pie Chart</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="area">
                    <div className="flex items-center">
                      <Activity className="w-4 h-4 mr-2" />
                      <span>Area Chart</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Select value={xAxis} onValueChange={setXAxis}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="X Axis" />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={yAxis} onValueChange={setYAxis}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Y Axis" />
                  </SelectTrigger>
                  <SelectContent>
                    {valueOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {xAxis === 'createdAt' && (
                <Select value={groupBy} onValueChange={setGroupBy}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Group By" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </Button>

                <Button variant="outline" size="sm">
                  <DownloadCloud className="h-4 w-4 mr-2" />
                  <span>Export</span>
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="chart" className="flex items-center gap-2">
                <BarChart4 className="w-4 h-4" />
                <span>Chart View</span>
              </TabsTrigger>
              <TabsTrigger value="time" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Time Analysis</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart" className="pt-2">
              {renderChart()}
            </TabsContent>
            
            <TabsContent value="time" className="pt-2">
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={[
                  { date: 'Jan', newLeads: 65, qualifiedLeads: 28, closedLeads: 15 },
                  { date: 'Feb', newLeads: 59, qualifiedLeads: 32, closedLeads: 18 },
                  { date: 'Mar', newLeads: 80, qualifiedLeads: 41, closedLeads: 25 },
                  { date: 'Apr', newLeads: 81, qualifiedLeads: 45, closedLeads: 30 },
                  { date: 'May', newLeads: 56, qualifiedLeads: 36, closedLeads: 24 },
                  { date: 'Jun', newLeads: 55, qualifiedLeads: 32, closedLeads: 22 },
                  { date: 'Jul', newLeads: 40, qualifiedLeads: 28, closedLeads: 19 }
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="newLeads" name="New Leads" stroke="#4f46e5" fill="url(#colorNew)" stackId="1" />
                  <Area type="monotone" dataKey="qualifiedLeads" name="Qualified Leads" stroke="#06b6d4" fill="url(#colorQualified)" stackId="1" />
                  <Area type="monotone" dataKey="closedLeads" name="Closed Deals" stroke="#10b981" fill="url(#colorClosed)" stackId="1" />
                  <defs>
                    <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorQualified" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorClosed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/40 shadow-md overflow-hidden dark:bg-gray-900">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <PieChart className="w-5 h-5 mr-2 text-indigo-500" />
              Lead Sources Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartPie>
                <Pie
                  data={[
                    { name: 'Website', value: 140 },
                    { name: 'Referral', value: 110 },
                    { name: 'Social', value: 95 },
                    { name: 'Email', value: 85 },
                    { name: 'Event', value: 75 }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[...Array(5)].map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartPie>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="border-border/40 shadow-md overflow-hidden dark:bg-gray-900">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <BarChart4 className="w-5 h-5 mr-2 text-sky-500" />
              Conversion by Stage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Discovery', conversion: 100 },
                { name: 'Qualification', conversion: 68 },
                { name: 'Demo', conversion: 45 },
                { name: 'Proposal', conversion: 32 },
                { name: 'Negotiation', conversion: 25 },
                { name: 'Closed', conversion: 18 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="conversion" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default LeadAnalytics;
