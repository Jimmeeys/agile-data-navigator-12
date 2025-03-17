
import React, { useState } from 'react';
import { 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  Layers, 
  DollarSign,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useLeads } from '@/contexts/LeadContext';
import { cn, formatNumber, calculatePercentageChange } from '@/lib/utils';
import { Card, CardContent } from "@/components/ui/card";

export function MetricsPanel() {
  const { statusCounts, filteredLeads, leads } = useLeads();
  const [collapsed, setCollapsed] = useState(false);
  
  // Calculate total leads count
  const totalLeads = filteredLeads.length;
  const totalAllLeads = leads.length;
  
  // For demo purposes, calculate week-over-week change
  // In a real app, we would use historical data
  const weekOnWeekChange = calculatePercentageChange(
    totalLeads,
    totalLeads > 10 ? totalLeads - Math.floor(Math.random() * 10) : totalLeads
  );
  
  // Calculate conversion rate (assuming 'Converted' is a status)
  const convertedCount = statusCounts['Converted'] || 0;
  const conversionRate = totalLeads > 0 ? (convertedCount / totalLeads) * 100 : 0;
  
  // Calculate estimated value (assuming an average value per conversion)
  const avgLeadValue = 1500; // Example value
  const estimatedValue = convertedCount * avgLeadValue;
  
  // Calculate active leads (not closed)
  const closedStatuses = ['Converted', 'Lost', 'Rejected'];
  const activeLeads = filteredLeads.filter(lead => 
    !closedStatuses.includes(lead.status)
  ).length;
  
  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-medium">Key Metrics</h2>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-secondary rounded-md focus:outline-none"
        >
          {collapsed ? (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
      </div>
      
      {!collapsed && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Leads"
            value={totalLeads}
            change={weekOnWeekChange}
            icon={<Users className="h-5 w-5" />}
            description={`${formatNumber(totalLeads)} of ${formatNumber(totalAllLeads)} total leads`}
          />
          
          <MetricCard
            title="Active Leads"
            value={activeLeads}
            change={calculatePercentageChange(
              activeLeads,
              activeLeads > 5 ? activeLeads - Math.floor(Math.random() * 5) : activeLeads
            )}
            icon={<Layers className="h-5 w-5" />}
            description="Leads in active stages"
          />
          
          <MetricCard
            title="Conversion Rate"
            value={conversionRate.toFixed(1) + '%'}
            change={calculatePercentageChange(
              conversionRate,
              conversionRate > 2 ? conversionRate - Math.random() * 2 : conversionRate
            )}
            icon={<ArrowUpRight className="h-5 w-5" />}
            description={`${convertedCount} converted leads`}
          />
          
          <MetricCard
            title="Estimated Value"
            value={`$${formatNumber(estimatedValue)}`}
            change={calculatePercentageChange(
              estimatedValue,
              estimatedValue > 2000 ? estimatedValue - Math.random() * 2000 : estimatedValue
            )}
            icon={<DollarSign className="h-5 w-5" />}
            description="Based on converted leads"
          />
        </div>
      )}
    </section>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  description: string;
}

function MetricCard({ title, value, change, icon, description }: MetricCardProps) {
  const positive = change >= 0;
  
  return (
    <Card className="overflow-hidden glass-card">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-semibold mt-1">{value}</h3>
          </div>
          <div className="h-9 w-9 rounded-full flex items-center justify-center bg-primary/10">
            {icon}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-3">
          <div className={cn(
            "flex items-center text-xs font-medium",
            positive ? "text-green-600" : "text-red-600"
          )}>
            {positive ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            )}
            {Math.abs(change).toFixed(1)}%
          </div>
          
          <span className="text-xs text-muted-foreground">
            {description}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
