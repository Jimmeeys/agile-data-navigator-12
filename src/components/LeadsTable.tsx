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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLeads } from '@/contexts/LeadContext';
import { 
  MoreHorizontal, 
  ArrowUpDown, 
  Edit, 
  Trash2, 
  Eye, 
  FileText, 
  Phone, 
  Mail,
  AlertCircle,
  CheckCircle,
  Clock,
  HelpCircle,
  Zap,
  Globe,
  LinkedinIcon,
  FacebookIcon,
  Twitter,
  Instagram,
  Megaphone,
  FilePlus2,
  UserPlus,
  Locate,
  CalendarClock,
  ShoppingCart,
  Hourglass,
  XCircle,
  PhoneCall,
  MessageCircle,
  WalletCards,
  Send,
  Landmark,
  BookX,
  UserX,
  Languages,
  PhoneOff,
  DollarSign,
  Calendar,
  Map,
  HeartPulse,
  LocateFixed,
  Plane,
  ThumbsUp,
  User,
  Ban
} from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { formatDate } from '@/lib/utils';

interface LeadsTableProps {
  onLeadClick: (lead: any) => void;
  selectedLeads: string[];
  setSelectedLeads: (leadIds: string[]) => void;
  compactMode?: boolean;
}

export const LeadsTable = ({ onLeadClick, selectedLeads, setSelectedLeads, compactMode = false }: LeadsTableProps) => {
  const { 
    filteredLeads, 
    loading, 
    sortConfig, 
    setSortConfig,
    page,
    pageSize,
    deleteLead,
    setPageSize
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

  const handleSelectAllLeads = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(paginatedLeads.map(lead => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (leadId: string, checked: boolean) => {
    if (checked) {
      setSelectedLeads([...selectedLeads, leadId]);
    } else {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
    }
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Won': 
        return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300';
      case 'Lost': 
        return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300';
      case 'Open': 
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Uncategorized': 
        return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/50 dark:text-gray-300';
      case 'Trial Completed': 
        return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Trial Scheduled': 
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Unresponsive': 
        return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300';
      case 'Disqualified': 
        return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300';
      default: 
        return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/50 dark:text-gray-300';
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

  const getStageIcon = (stage: string) => {
    const stageIconMap: Record<string, JSX.Element> = {
      // Initial stages
      'New Enquiry': <Zap className="h-4 w-4 text-blue-500" />,
      'Initial Contact': <PhoneCall className="h-4 w-4 text-blue-500" />,
      'Sent Introductory message': <MessageCircle className="h-4 w-4 text-indigo-500" />,
      'Sent Introductory Message': <MessageCircle className="h-4 w-4 text-indigo-500" />,
      
      // Information sharing
      'Shared Pricing & Schedule Details': <DollarSign className="h-4 w-4 text-green-500" />,
      'Shared Pricing & Schedule details on WhatsApp': <MessageCircle className="h-4 w-4 text-green-500" />,
      'Shared Class Descriptions and Benefits': <FilePlus2 className="h-4 w-4 text-orange-500" />,
      'Shared Membership Packages And Exclusive Deals': <WalletCards className="h-4 w-4 text-amber-500" />,
      
      // Trial related
    'Trial Scheduled': <Calendar className="h-4 w-4 text-purple-500" />,
    'Trial Rescheduled': <CalendarClock className="h-4 w-4 text-purple-600" />,
    'Trial Completed': <CheckCircle className="h-4 w-4 text-green-600" />,
    'Post Trial Follow Up': <Send className="h-4 w-4 text-blue-600" />,
    'Followed up with Trial Participants': <Send className="h-4 w-4 text-blue-600" />,
    'Positive Trial Feedback - Interested in Membership': <CheckCircle className="h-4 w-4 text-green-600" />,
    
    // Membership / conversion
    'Membership Sold': <ShoppingCart className="h-4 w-4 text-green-500" />,
    
    // Call status
    'Called - Did Not Answer': <PhoneOff className="h-4 w-4 text-red-500" />,
    'Called - Did not answer': <PhoneOff className="h-4 w-4 text-red-500" />,
    'Called - Asked to Call back later': <CalendarClock className="h-4 w-4 text-amber-500" />,
    'Called - Client out of town/traveling': <Plane className="h-4 w-4 text-blue-500" />,
    'Called - Invalid Contact No': <XCircle className="h-4 w-4 text-red-500" />,
    
    // Client status
    'Client Unresponsive': <Clock className="h-4 w-4 text-red-400" />,
    'Will get back to us at a later date': <CalendarClock className="h-4 w-4 text-amber-500" />,
    'Will come back once I exhaust my current gym membership': <Hourglass className="h-4 w-4 text-amber-500" />,
    'No Response after Trial': <Clock className="h-4 w-4 text-red-400" />,
    
    // Not interested
    'Not Interested - Other': <BookX className="h-4 w-4 text-gray-500" />,
    'Not Interested - Proximity Issues': <Map className="h-4 w-4 text-gray-500" />,
    'Not Interested - Pricing Issues': <DollarSign className="h-4 w-4 text-gray-500" />,
    'Not Interested - Timings not suitable': <Clock className="h-4 w-4 text-gray-500" />,
    'Not Interested - Health Issues': <HeartPulse className="h-4 w-4 text-gray-500" />,
    'Language Barrier - Couldn\'t comprehend or speak the language': <Languages className="h-4 w-4 text-gray-500" />,
    'Lead Dropped or Lost': <UserX className="h-4 w-4 text-red-500" />,
    
    // Special cases
    'Looking for Virtual Classes': <Globe className="h-4 w-4 text-blue-500" />,
    'Looking For Virtual Classes': <Globe className="h-4 w-4 text-blue-500" />
  };
  
  return stageIconMap[stage] || <HelpCircle className="h-4 w-4 text-gray-500" />;
};

const getSourceIcon = (source: string) => {
  const sourceIconMap: Record<string, JSX.Element> = {
    'Website': <Globe className="h-4 w-4 text-blue-500" />,
    'Website Form': <FilePlus2 className="h-4 w-4 text-blue-500" />,
    'Website - Pre/Post Natal': <Landmark className="h-4 w-4 text-pink-500" />,
    
    'Social': <Twitter className="h-4 w-4 text-sky-500" />,
    'Social Media': <Twitter className="h-4 w-4 text-sky-500" />,
    'Social - Instagram': <Instagram className="h-4 w-4 text-pink-600" />,
    'Social - Facebook': <FacebookIcon className="h-4 w-4 text-blue-600" />,
    
    'Referral': <UserPlus className="h-4 w-4 text-green-500" />,
    'Client Referral': <UserPlus className="h-4 w-4 text-green-600" />,
    'Staff Referral': <UserPlus className="h-4 w-4 text-green-500" />,
    
    'Event': <Locate className="h-4 w-4 text-purple-500" />,
    'Hosted Class': <Locate className="h-4 w-4 text-purple-600" />,
    'Hosted Class ': <Locate className="h-4 w-4 text-purple-600" />,
    'Outdoor Class': <LocateFixed className="h-4 w-4 text-green-600" />,
    
    'Abandoned checkout': <ShoppingCart className="h-4 w-4 text-red-500" />,
    'Walkin': <Map className="h-4 w-4 text-blue-500" />,
    
    'Incoming call': <PhoneCall className="h-4 w-4 text-blue-600" />,
    'Enquiry on call': <PhoneCall className="h-4 w-4 text-blue-500" />,
    'Missed call': <PhoneOff className="h-4 w-4 text-red-500" />,
    
    'Yellow Messenger/Whatsapp Enquiry': <MessageCircle className="h-4 w-4 text-green-500" />,
    'Incoming sms': <MessageCircle className="h-4 w-4 text-blue-500" />,
    
    'Dashboard': <Landmark className="h-4 w-4 text-purple-500" />,
    'Endpoint (API)': <Globe className="h-4 w-4 text-gray-500" />,
    
    'Influencer Sign-up': <UserPlus className="h-4 w-4 text-pink-500" />,
    'Influencer Marketing': <Megaphone className="h-4 w-4 text-pink-600" />,
    
    'Other': <HelpCircle className="h-4 w-4 text-gray-500" />
  };
  
  return sourceIconMap[source] || <Globe className="h-4 w-4 text-gray-500" />;
};

const getStatusIcon = (status: string) => {
  switch(status) {
    case 'Won':
      return <CheckCircle className="h-4 w-4 text-green-700" />; // Success
    case 'Lost':
      return <XCircle className="h-4 w-4 text-red-600" />; // Lost
    case 'Unresponsive':
      return <UserX className="h-4 w-4 text-red-600" />; // Unresponsive
    case 'Trial Completed':
      return <ThumbsUp className="h-4 w-4 text-yellow-500" />; // Completed
    case 'Trial Scheduled':
      return <Calendar className="h-4 w-4 text-amber-500" />; // Scheduled
    case 'Open':
      return <AlertCircle className="h-4 w-4 text-blue-500" />; // Open
    case 'Disqualified':
      return <Ban className="h-4 w-4 text-red-600" />; // Disqualified
    case 'Uncategorized':
      return <HelpCircle className="h-4 w-4 text-gray-500" />; // Uncategorized
    default:
      return <HelpCircle className="h-4 w-4 text-gray-500" />; // Default icon
  }
};

const rowHeightClass = compactMode ? "h-[48px]" : "h-[60px]";

console.log('LeadsTable rendering with leads:', paginatedLeads.length);

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

return (
  <Card className="shadow-md border-border/30 overflow-hidden glass-card">
    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gradient-to-r from-indigo-500 to-purple-700 text-white sticky top-0 z-10">
            <TableRow className="hover:bg-gradient-to-r hover:from-indigo-700 hover:to-purple-900">
              <TableHead className="w-[50px] text-white">
                <Checkbox 
                  checked={selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0}
                  onCheckedChange={handleSelectAllLeads}
                  aria-label="Select all leads"
                />
              </TableHead>
              <TableHead className="min-w-[200px] text-white">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('fullName')}
                >
                  Full Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="min-w-[140px] text-white">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('source')}
                >
                  Source
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="min-w-[120px] text-white">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  Created
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="min-w-[150px] text-white">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('associate')}
                >
                  Associate
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="min-w-[200px] text-white">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('stage')}
                >
                  Stage
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="min-w-[120px] text-white">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="min-w-[200px] text-white">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('remarks')}
                >
                  Remarks
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-right w-[100px] text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLeads.length > 0 ? (
              paginatedLeads.map((lead, index) => (
                <TableRow 
                  key={lead.id} 
                  className={`${rowHeightClass} hover:bg-muted/20 transition-transform transform hover:scale-105 cursor-pointer whitespace-nowrap`}
                  onClick={() => onLeadClick(lead)}
                >
                  <TableCell className="font-medium text-muted-foreground" onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      checked={selectedLeads.includes(lead.id)}
                      onCheckedChange={(checked) => handleSelectLead(lead.id, checked === true)}
                      aria-label={`Select lead ${lead.fullName}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border">
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-medium">
                          {getInitials(lead.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground truncate max-w-[180px]">{lead.fullName}</span>
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                          {lead.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span className="truncate max-w-[100px]">{lead.email}</span>
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
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className="bg-indigo-100 text-indigo-800 flex items-center gap-1.5 py-1 hover:bg-indigo-700 hover:text-white hover:border-indigo-500 transition-colors"
                      >
                        {React.cloneElement(getSourceIcon(lead.source), { className: "h-4 w-4 text-indigo-500 hover:text-white" })}
                        <span className="truncate max-w-[100px]">{lead.source}</span>
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDate(lead.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white text-xs">
                          {getInitials(lead.associate)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate max-w-[100px]">{lead.associate}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className="bg-blue-100 text-blue-800 flex items-center gap-1.5 py-1 hover:bg-blue-700 hover:text-white hover:border-blue-500 transition-colors"
                      >
                        {React.cloneElement(getStageIcon(lead.stage), { className: "h-4 w-4 text-blue-500 hover:text-white" })}
                        <span className="truncate max-w-[150px]">{lead.stage}</span>
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(lead.status)}
                      <Badge 
                        className={`${getStatusColor(lead.status)} font-medium hover:bg-${getStatusColor(lead.status).split(' ')[0]}-700 hover:text-white hover:border-${getStatusColor(lead.status).split(' ')[0]}-500 transition-colors`}
                      >
                        {lead.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate">
                      {lead.remarks || "No remarks"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
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
                        <DropdownMenuItem onClick={() => handleViewDetails(lead.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
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
                <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                  No leads found. {filteredLeads.length > 0 ? "Try adjusting your filters or pagination." : "Add some leads to get started."}
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
