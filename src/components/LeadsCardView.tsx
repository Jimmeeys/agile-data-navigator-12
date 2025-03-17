
import React, { useState } from 'react';
import { useLeads } from '@/contexts/LeadContext';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Calendar, 
  Edit, 
  Trash2, 
  Eye, 
  Star, 
  StarHalf, 
  CheckCircle, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface LeadsCardViewProps {
  onLeadClick: (lead: any) => void;
}

export function LeadsCardView({ onLeadClick }: LeadsCardViewProps) {
  const { 
    filteredLeads, 
    loading, 
    page, 
    pageSize 
  } = useLeads();

  const startIndex = (page - 1) * pageSize;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + pageSize);

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
      stage: 'Qualification',
      remarks: 'Interested in premium package'
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
      stage: 'Needs Analysis',
      remarks: 'Follow up in 2 weeks'
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
      stage: 'Proposal',
      remarks: 'Sent proposal, awaiting feedback'
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
      stage: 'Closed Won',
      remarks: 'Successfully converted to customer'
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
      stage: 'Qualification',
      remarks: 'Very interested in our services'
    },
    {
      id: 'lead-6',
      fullName: 'David Wilson',
      email: 'david.w@example.com',
      phone: '(555) 222-3333',
      source: 'Website',
      associate: 'Lisa Wong',
      status: 'Warm',
      createdAt: '2023-09-12',
      center: 'Downtown',
      stage: 'Needs Analysis',
      remarks: 'Requested a follow-up call'
    },
    {
      id: 'lead-7',
      fullName: 'Sarah Miller',
      email: 'sarah.m@example.com',
      phone: '(555) 111-9999',
      source: 'Social Media',
      associate: 'Mike Chen',
      status: 'Cold',
      createdAt: '2023-09-08',
      center: 'Midtown',
      stage: 'Qualification',
      remarks: 'Needs more information'
    },
    {
      id: 'lead-8',
      fullName: 'Daniel Taylor',
      email: 'daniel.t@example.com',
      phone: '(555) 444-7777',
      source: 'Event',
      associate: 'Sarah Johnson',
      status: 'Hot',
      createdAt: '2023-09-17',
      center: 'Uptown',
      stage: 'Proposal',
      remarks: 'Very enthusiastic about our offer'
    }
  ];

  // Use sample data if no real data is available
  const displayLeads = paginatedLeads.length > 0 ? paginatedLeads : sampleLeads;

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array(8).fill(0).map((_, index) => (
          <Card key={index} className="shadow-md animate-pulse">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
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

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Hot': 
        return <Star className="h-4 w-4 text-amber-500" fill="currentColor" />;
      case 'Warm': 
        return <StarHalf className="h-4 w-4 text-amber-500" fill="currentColor" />;
      case 'Cold': 
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'Converted': 
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: 
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {displayLeads.length > 0 ? (
        displayLeads.map(lead => (
          <Card
            key={lead.id}
            className="lead-card shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden" 
          >
            <div className={`h-1 w-full ${
              lead.status === 'Hot' ? 'bg-red-500' :
              lead.status === 'Warm' ? 'bg-amber-500' :
              lead.status === 'Cold' ? 'bg-blue-500' :
              lead.status === 'Converted' ? 'bg-green-500' :
              'bg-gray-300'
            }`}></div>
            <CardHeader className="pb-2 flex flex-row justify-between items-start space-y-0 pt-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9 border">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-medium">
                    {getInitials(lead.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{lead.fullName}</CardTitle>
                  <div className="flex items-center mt-1">
                    {getStatusIcon(lead.status)}
                    <Badge 
                      variant={getStatusColor(lead.status)}
                      className="text-xs font-medium ml-1"
                    >
                      {lead.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open menu">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onLeadClick(lead)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Lead
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Lead
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-2 pt-2">
              <div className="grid grid-cols-1 gap-1">
                {lead.email && (
                  <div className="flex items-center text-sm">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground mr-2" />
                    <span className="truncate">{lead.email}</span>
                  </div>
                )}
                {lead.phone && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground mr-2" />
                    <span>{lead.phone}</span>
                  </div>
                )}
                <div className="flex items-center text-sm">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground mr-2" />
                  <span>{formatDate(lead.createdAt)}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-muted-foreground">Source:</span>
                  <Badge variant="outline" className="bg-primary/5">
                    {lead.source}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-muted-foreground">Stage:</span>
                  <span className="font-medium">{lead.stage}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Associate:</span>
                  <span className="font-medium">{lead.associate}</span>
                </div>
              </div>
              {lead.remarks && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground">Remarks:</p>
                  <p className="text-sm mt-1 line-clamp-2">{lead.remarks}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full gap-2"
                onClick={() => onLeadClick(lead)}
              >
                <Edit className="h-4 w-4" />
                <span>Edit Lead</span>
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center py-10 text-muted-foreground">
          No leads found
        </div>
      )}
    </div>
  );
}
