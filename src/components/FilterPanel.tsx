
import React, { useState } from 'react';
import { 
  Check, 
  ChevronDown, 
  Calendar as CalendarIcon, 
  X,
  Tag,
  Building2,
  Clock
} from 'lucide-react';
import { useLeads } from '@/contexts/LeadContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { cn } from '@/lib/utils';

export function FilterPanel() {
  const { 
    filters, 
    setFilters, 
    clearFilters, 
    sourceOptions, 
    associateOptions, 
    centerOptions, 
    stageOptions, 
    statusOptions 
  } = useLeads();
  
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  
  // Handle filter changes
  const handleSourceChange = (value: string) => {
    const currentValues = [...filters.source];
    const index = currentValues.indexOf(value);
    
    if (index > -1) {
      currentValues.splice(index, 1);
    } else {
      currentValues.push(value);
    }
    
    setFilters({ ...filters, source: currentValues });
  };
  
  const handleAssociateChange = (value: string) => {
    const currentValues = [...filters.associate];
    const index = currentValues.indexOf(value);
    
    if (index > -1) {
      currentValues.splice(index, 1);
    } else {
      currentValues.push(value);
    }
    
    setFilters({ ...filters, associate: currentValues });
  };
  
  const handleCenterChange = (value: string) => {
    const currentValues = [...filters.center];
    const index = currentValues.indexOf(value);
    
    if (index > -1) {
      currentValues.splice(index, 1);
    } else {
      currentValues.push(value);
    }
    
    setFilters({ ...filters, center: currentValues });
  };
  
  const handleStageChange = (value: string) => {
    const currentValues = [...filters.stage];
    const index = currentValues.indexOf(value);
    
    if (index > -1) {
      currentValues.splice(index, 1);
    } else {
      currentValues.push(value);
    }
    
    setFilters({ ...filters, stage: currentValues });
  };
  
  const handleStatusChange = (value: string) => {
    const currentValues = [...filters.status];
    const index = currentValues.indexOf(value);
    
    if (index > -1) {
      currentValues.splice(index, 1);
    } else {
      currentValues.push(value);
    }
    
    setFilters({ ...filters, status: currentValues });
  };
  
  const handleStartDateChange = (date: Date | null) => {
    setFilters({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        start: date
      }
    });
  };
  
  const handleEndDateChange = (date: Date | null) => {
    setFilters({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        end: date
      }
    });
  };
  
  const handleClearDateRange = () => {
    setFilters({
      ...filters,
      dateRange: {
        start: null,
        end: null
      }
    });
    setDatePopoverOpen(false);
  };
  
  // Quick date filters
  const applyThisWeekFilter = () => {
    const today = new Date();
    const startDate = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const endDate = endOfWeek(today, { weekStartsOn: 1 }); // Sunday
    
    setFilters({
      ...filters,
      dateRange: {
        start: startDate,
        end: endDate
      }
    });
    setDatePopoverOpen(false);
  };
  
  const applyThisMonthFilter = () => {
    const today = new Date();
    const startDate = startOfMonth(today);
    const endDate = endOfMonth(today);
    
    setFilters({
      ...filters,
      dateRange: {
        start: startDate,
        end: endDate
      }
    });
    setDatePopoverOpen(false);
  };
  
  const applyLastMonthFilter = () => {
    const today = new Date();
    const lastMonth = subMonths(today, 1);
    const startDate = startOfMonth(lastMonth);
    const endDate = endOfMonth(lastMonth);
    
    setFilters({
      ...filters,
      dateRange: {
        start: startDate,
        end: endDate
      }
    });
    setDatePopoverOpen(false);
  };
  
  // Count active filters
  const activeFilterCount = 
    filters.source.length + 
    filters.associate.length + 
    filters.center.length + 
    filters.stage.length + 
    filters.status.length + 
    (filters.dateRange.start ? 1 : 0) + 
    (filters.dateRange.end ? 1 : 0);
  
  const renderFilterBadge = (label: string, count: number) => {
    if (count === 0) return null;
    
    return (
      <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20 ml-2 gap-1">
        {label}: {count} <X className="h-3 w-3 cursor-pointer" />
      </Badge>
    );
  };
  
  return (
    <Card className="p-4 shadow-md border-border/30 animate-fade-in">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <div className="flex items-center">
            <h3 className="font-medium text-base">Active Filters</h3>
            {activeFilterCount > 0 ? (
              <Badge className="ml-2 bg-primary">{activeFilterCount}</Badge>
            ) : (
              <span className="ml-2 text-sm text-muted-foreground">No active filters</span>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilters}
            disabled={activeFilterCount === 0}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear All
          </Button>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {/* Source Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Source
                {filters.source.length > 0 && (
                  <Badge className="ml-1 bg-primary">{filters.source.length}</Badge>
                )}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuLabel>Select Sources</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sourceOptions.map((source) => (
                <DropdownMenuCheckboxItem
                  key={source}
                  checked={filters.source.includes(source)}
                  onCheckedChange={() => handleSourceChange(source)}
                >
                  {source}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Associate Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                Associate
                {filters.associate.length > 0 && (
                  <Badge className="ml-1 bg-primary">{filters.associate.length}</Badge>
                )}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuLabel>Select Associates</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {associateOptions.map((associate) => (
                <DropdownMenuCheckboxItem
                  key={associate}
                  checked={filters.associate.includes(associate)}
                  onCheckedChange={() => handleAssociateChange(associate)}
                >
                  {associate}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Center Filter - New */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Center
                {filters.center.length > 0 && (
                  <Badge className="ml-1 bg-primary">{filters.center.length}</Badge>
                )}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuLabel>Select Centers</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {centerOptions.map((center) => (
                <DropdownMenuCheckboxItem
                  key={center}
                  checked={filters.center.includes(center)}
                  onCheckedChange={() => handleCenterChange(center)}
                >
                  {center}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                Status
                {filters.status.length > 0 && (
                  <Badge className="ml-1 bg-primary">{filters.status.length}</Badge>
                )}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuLabel>Select Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {statusOptions.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={filters.status.includes(status)}
                  onCheckedChange={() => handleStatusChange(status)}
                >
                  {status}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Stage Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                Stage
                {filters.stage.length > 0 && (
                  <Badge className="ml-1 bg-primary">{filters.stage.length}</Badge>
                )}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuLabel>Select Stages</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {stageOptions.map((stage) => (
                <DropdownMenuCheckboxItem
                  key={stage}
                  checked={filters.stage.includes(stage)}
                  onCheckedChange={() => handleStageChange(stage)}
                >
                  {stage}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Date Range Filter with Quick Filters */}
          <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Date Range
                {(filters.dateRange.start || filters.dateRange.end) && (
                  <Badge className="ml-1 bg-primary">
                    {filters.dateRange.start && filters.dateRange.end ? '2' : '1'}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="flex flex-col space-y-2 p-2">
                {/* Quick Filters */}
                <div className="p-2 bg-muted/20 rounded-md">
                  <h4 className="text-xs font-medium mb-2">Quick Filters</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" className="text-xs h-7" onClick={applyThisWeekFilter}>
                      <Clock className="h-3 w-3 mr-1" /> This Week
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs h-7" onClick={applyThisMonthFilter}>
                      <Clock className="h-3 w-3 mr-1" /> This Month
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs h-7" onClick={applyLastMonthFilter}>
                      <Clock className="h-3 w-3 mr-1" /> Last Month
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 pb-4">
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium">Start Date</label>
                      {filters.dateRange.start && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleStartDateChange(null)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Clear</span>
                        </Button>
                      )}
                    </div>
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.start || undefined}
                      onSelect={handleStartDateChange}
                      initialFocus
                      disabled={(date) => 
                        filters.dateRange.end 
                          ? date > filters.dateRange.end 
                          : false
                      }
                      className="pointer-events-auto"
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium">End Date</label>
                      {filters.dateRange.end && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleEndDateChange(null)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Clear</span>
                        </Button>
                      )}
                    </div>
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.end || undefined}
                      onSelect={handleEndDateChange}
                      initialFocus
                      disabled={(date) => 
                        filters.dateRange.start 
                          ? date < filters.dateRange.start 
                          : false
                      }
                      className="pointer-events-auto"
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleClearDateRange}
                  >
                    Clear Range
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => setDatePopoverOpen(false)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 text-sm">
            <span className="font-medium text-muted-foreground">Active:</span>
            {filters.source.length > 0 && renderFilterBadge('Source', filters.source.length)}
            {filters.associate.length > 0 && renderFilterBadge('Associate', filters.associate.length)}
            {filters.center.length > 0 && renderFilterBadge('Center', filters.center.length)}
            {filters.stage.length > 0 && renderFilterBadge('Stage', filters.stage.length)}
            {filters.status.length > 0 && renderFilterBadge('Status', filters.status.length)}
            {(filters.dateRange.start || filters.dateRange.end) && (
              <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20 gap-1">
                Date: {filters.dateRange.start && format(filters.dateRange.start, 'MMM d')}
                {filters.dateRange.start && filters.dateRange.end && ' to '}
                {filters.dateRange.end && format(filters.dateRange.end, 'MMM d')}
                <X className="h-3 w-3 cursor-pointer" onClick={handleClearDateRange} />
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
