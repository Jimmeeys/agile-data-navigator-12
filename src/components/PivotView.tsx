
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLeads } from '@/contexts/LeadContext';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, ChevronsUpDown, RefreshCw } from 'lucide-react';

export function PivotView() {
  const { leads } = useLeads();
  const [rowFields, setRowFields] = useState<string[]>(['status']);
  const [colFields, setColFields] = useState<string[]>(['source']);
  const [valueField, setValueField] = useState<string>('count');
  const [valueType, setValueType] = useState<string>('count');
  const [isLoading, setIsLoading] = useState(false);

  const fieldOptions = [
    { value: 'fullName', label: 'Full Name' },
    { value: 'email', label: 'Email' },
    { value: 'source', label: 'Source' },
    { value: 'status', label: 'Status' },
    { value: 'stage', label: 'Stage' },
    { value: 'associate', label: 'Associate' },
    { value: 'createdAt', label: 'Created (Month-Year)', formatter: (date: string) => {
      return new Date(date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }},
    { value: 'createdAtYear', label: 'Created (Year)', formatter: (date: string) => {
      return new Date(date).getFullYear().toString();
    }},
    { value: 'createdAtMonth', label: 'Created (Month)', formatter: (date: string) => {
      return new Date(date).toLocaleDateString('en-US', { month: 'long' });
    }}
  ];

  const valueOptions = [
    { value: 'count', label: 'Count' },
    { value: 'countUnique', label: 'Count Unique' },
    { value: 'sum', label: 'Sum' },
    { value: 'avg', label: 'Average' }
  ];

  const handleAddRowField = (value: string) => {
    if (!rowFields.includes(value)) {
      setRowFields([...rowFields, value]);
    }
  };

  const handleAddColField = (value: string) => {
    if (!colFields.includes(value)) {
      setColFields([...colFields, value]);
    }
  };

  const handleRemoveRowField = (index: number) => {
    setRowFields(rowFields.filter((_, i) => i !== index));
  };

  const handleRemoveColField = (index: number) => {
    setColFields(colFields.filter((_, i) => i !== index));
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate loading for demonstration
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  // Mock pivot data generation
  const generatePivotData = () => {
    // This is a simplified mock implementation
    // In a real scenario, you would use a pivot library or implement complex logic
    
    const rowValues = new Set<string>();
    const colValues = new Set<string>();
    
    // Collect unique row and column values
    leads.forEach(lead => {
      const rowValue = getFieldValue(lead, rowFields[0]);
      const colValue = getFieldValue(lead, colFields[0]);
      
      rowValues.add(rowValue);
      colValues.add(colValue);
    });
    
    // Generate data structure
    const pivotData: Record<string, Record<string, number>> = {};
    Array.from(rowValues).forEach(row => {
      pivotData[row] = {};
      Array.from(colValues).forEach(col => {
        pivotData[row][col] = 0;
      });
    });
    
    // Fill data
    leads.forEach(lead => {
      const rowValue = getFieldValue(lead, rowFields[0]);
      const colValue = getFieldValue(lead, colFields[0]);
      
      if (pivotData[rowValue] && pivotData[rowValue][colValue] !== undefined) {
        pivotData[rowValue][colValue] += 1;
      }
    });
    
    return {
      rowValues: Array.from(rowValues),
      colValues: Array.from(colValues),
      data: pivotData
    };
  };
  
  const getFieldValue = (lead: any, field: string) => {
    if (field === 'createdAt') {
      return new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    } else if (field === 'createdAtYear') {
      return new Date(lead.createdAt).getFullYear().toString();
    } else if (field === 'createdAtMonth') {
      return new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'long' });
    }
    return lead[field] || 'N/A';
  };
  
  const pivotResult = generatePivotData();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium mb-2">Row Fields</h3>
            <div className="space-y-2">
              {rowFields.map((field, index) => (
                <div key={`row-${index}`} className="flex items-center justify-between py-1 px-2 bg-secondary/40 rounded-md">
                  <span className="text-sm">{fieldOptions.find(f => f.value === field)?.label || field}</span>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveRowField(index)} className="h-6 w-6 p-0">×</Button>
                </div>
              ))}
              <Select onValueChange={handleAddRowField}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Add row field" />
                </SelectTrigger>
                <SelectContent>
                  {fieldOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium mb-2">Column Fields</h3>
            <div className="space-y-2">
              {colFields.map((field, index) => (
                <div key={`col-${index}`} className="flex items-center justify-between py-1 px-2 bg-secondary/40 rounded-md">
                  <span className="text-sm">{fieldOptions.find(f => f.value === field)?.label || field}</span>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveColField(index)} className="h-6 w-6 p-0">×</Button>
                </div>
              ))}
              <Select onValueChange={handleAddColField}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Add column field" />
                </SelectTrigger>
                <SelectContent>
                  {fieldOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium mb-2">Values</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground">Value Field</label>
                <Select value={valueField} onValueChange={setValueField}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select value field" />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground">Aggregation</label>
                <Select value={valueType} onValueChange={setValueType}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select aggregation" />
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
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleRefresh} className="gap-2" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Generate Pivot Table
        </Button>
      </div>
      
      <Card className="border-border/40 bg-white dark:bg-gray-900 overflow-auto">
        <div className="p-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-muted/50 font-medium">Rows \ Columns</TableHead>
                {pivotResult.colValues.map((col) => (
                  <TableHead key={col} className="bg-muted/50 font-medium">
                    {col}
                  </TableHead>
                ))}
                <TableHead className="bg-muted/50 font-medium">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pivotResult.rowValues.map((row) => (
                <TableRow key={row}>
                  <TableCell className="font-medium bg-muted/30">{row}</TableCell>
                  {pivotResult.colValues.map((col) => (
                    <TableCell key={`${row}-${col}`}>
                      {pivotResult.data[row][col]}
                    </TableCell>
                  ))}
                  <TableCell className="font-medium bg-muted/30">
                    {pivotResult.colValues.reduce((sum, col) => sum + pivotResult.data[row][col], 0)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="border-t-2">
                <TableCell className="font-medium bg-muted/50">Total</TableCell>
                {pivotResult.colValues.map((col) => (
                  <TableCell key={`total-${col}`} className="font-medium bg-muted/30">
                    {pivotResult.rowValues.reduce((sum, row) => sum + pivotResult.data[row][col], 0)}
                  </TableCell>
                ))}
                <TableCell className="font-medium bg-muted/50">
                  {pivotResult.rowValues.reduce(
                    (rowSum, row) => rowSum + pivotResult.colValues.reduce(
                      (colSum, col) => colSum + pivotResult.data[row][col], 0
                    ), 0
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

export default PivotView;
