
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
import { MoreHorizontal, ArrowUpDown, Edit, Trash2, Eye, FileText, Phone, Mail } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export const LeadsTable = () => {
  const { 
    filteredLeads, 
    loading, 
    sortConfig, 
    setSortConfig,
    page,
    pageSize,
    deleteLead
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

  const handleDeleteLead = (id: string) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      deleteLead(id)
        .then(() => {
          toast.success("Lead deleted successfully");
        })
        .catch((error) => {
          toast.error("Failed to delete lead");
          console.error(error);
        });
    }
  };

  const handleViewDetails = (id: string) => {
    toast.info("View details functionality coming soon");
  };

  const handleEditLead = (id: string) => {
    toast.info("Edit lead functionality coming soon");
  };

  // Sample data for demonstration if no real data is available
  const sampleLeads = [
    {
      id: 'lead-1',
      fullName: 'John Smith',
      email: 'johnsmith@example.com',
      phone: '(555) 123-4567',
      source: 'Website',
      associate: 'Sarah Johnson',
      status: 'Hot',
      createdAt: '2023-09-15',
      center: 'Downtown',
      stage: 'Qualification'
    },
    {
      id: 'lead-2',
      fullName: 'Emma Wilson',
      email: 'emma.wilson@example.com',
      phone: '(555) 987-6543',
      source: 'Referral',
      associate: 'Mike Chen',
      status: 'Cold',
      createdAt: '2023-09-10',
      center: 'Uptown',
      stage: 'Needs Analysis'
    },
    {
      id: 'lead-3',
      fullName: 'Robert Johnson',
      email: 'robert.j@example.com',
      phone: '(555) 333-2222',
      source: 'Social Media',
      associate: 'Lisa Wong',
      status: 'Warm',
      createdAt: '2023-09-05',
      center: 'Midtown',
      stage: 'Proposal'
    },
    {
      id: 'lead-4',
      fullName: 'Michael Brown',
      email: 'mbrown@example.com',
      phone: '(555) 444-5555',
      source: 'Event',
      associate: 'Sarah Johnson',
      status: 'Converted',
      createdAt: '2023-08-28',
      center: 'Downtown',
      stage: 'Closed Won'
    },
    {
      id: 'lead-5',
      fullName: 'Jennifer Lee',
      email: 'jlee@example.com',
      phone: '(555) 777-8888',
      source: 'Website',
      associate: 'Mike Chen',
      status: 'Hot',
      createdAt: '2023-09-18',
      center: 'Uptown',
      stage: 'Qualification'
    }
  ];

  // Use sample data if no real data is available
  const displayLeads = paginatedLeads.length > 0 ? paginatedLeads : sampleLeads;

  if (loading) {
    return (
      <Card className="shadow-md border-border/30">
        <CardContent className="p-4">
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            {Array(5).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-md" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Converted': return 'success';
      case 'Hot': return 'destructive';
      case 'Cold': return 'default';
      case 'Warm': return 'secondary';
      default: return 'default';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="shadow-md border-border/30 overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead className="min-w-[200px]">
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort('fullName')}
                  >
                    Lead
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="min-w-[140px]">
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort('source')}
                  >
                    Source
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="min-w-[150px]">
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort('associate')}
                  >
                    Associate
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="min-w-[120px]">
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="min-w-[120px]">
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    Created
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayLeads.length > 0 ? (
                displayLeads.map((lead, index) => (
                  <TableRow 
                    key={lead.id} 
                    className="h-[60px] hover:bg-muted/20 transition-colors"
                  >
                    <TableCell className="font-medium text-muted-foreground">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border">
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {getInitials(lead.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{lead.fullName}</span>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {lead.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <span>{lead.email}</span>
                              </div>
                            )}
                            {lead.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                <span>{lead.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10">
                        {lead.source}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                            {getInitials(lead.associate)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{lead.associate}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusColor(lead.status)}
                        className="font-medium"
                      >
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                        <span className="text-xs text-muted-foreground">{lead.stage}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open menu">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewDetails(lead.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditLead(lead.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Lead
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewDetails(lead.id)}>
                            <FileText className="mr-2 h-4 w-4" />
                            View Notes
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteLead(lead.id)}
                          >
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
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    No leads found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
