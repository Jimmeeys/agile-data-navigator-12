
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLeads } from '@/contexts/LeadContext';
import { MoreHorizontal, ArrowUpDown, Edit, Trash2, Eye } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

export const LeadsTable = () => {
  const { 
    filteredLeads, 
    loading, 
    sortConfig, 
    setSortConfig,
    page,
    pageSize
  } = useLeads();

  const startIndex = (page - 1) * pageSize;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + pageSize);

  const handleSort = (key: string) => {
    if (sortConfig?.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      setSortConfig({ key, direction: 'asc' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        {Array(5).fill(0).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">#</TableHead>
            <TableHead>
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => handleSort('fullName')}
              >
                Full Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => handleSort('source')}
              >
                Source
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => handleSort('associate')}
              >
                Associate
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => handleSort('status')}
              >
                Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => handleSort('createdAt')}
              >
                Created At
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedLeads.length > 0 ? (
            paginatedLeads.map((lead, index) => (
              <TableRow 
                key={lead.id} 
                className="h-[30px]"
              >
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell className="font-medium">{lead.fullName}</TableCell>
                <TableCell>{lead.source}</TableCell>
                <TableCell>{lead.associate}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      lead.status === 'Converted' ? 'success' :
                      lead.status === 'Cold' ? 'default' : 
                      lead.status === 'Hot' ? 'destructive' : 
                      'secondary'
                    }
                  >
                    {lead.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(lead.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Lead
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Lead
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                No leads found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
