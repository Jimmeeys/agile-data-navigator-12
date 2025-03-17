
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
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Building2
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface LeadsCardViewProps {
  onLeadClick: (lead: any) => void;
}

export function LeadsCardView({ onLeadClick }: LeadsCardViewProps) {
  const { 
    filteredLeads, 
    loading, 
    page, 
    pageSize,
    deleteLead
  } = useLeads();

  const startIndex = (page - 1) * pageSize;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + pageSize);
  
  const [expandedCards, setExpandedCards] = useState<string[]>([]);

  const handleDeleteLead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
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
  
  const toggleCardExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCards(prev => 
      prev.includes(id) 
        ? prev.filter(cardId => cardId !== id)
        : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {Array(6).fill(0).map((_, index) => (
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
      case 'Converted': 
      case 'Won': return 'success';
      case 'Hot': return 'destructive';
      case 'Cold': return 'default';
      case 'Warm': return 'secondary';
      case 'Lost': return 'destructive';
      case 'Trial Completed': return 'success';
      case 'Trial Scheduled': return 'warning';
      case 'Open': return 'info';
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
      case 'Won':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Lost':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'Trial Completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Trial Scheduled':
        return <Calendar className="h-4 w-4 text-amber-500" />;
      case 'Open':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
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
  
  const hasFollowUpData = (lead: any) => {
    return lead.followUp1Date || lead.followUp2Date || lead.followUp3Date || lead.followUp4Date;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {paginatedLeads.length > 0 ? (
        paginatedLeads.map(lead => (
          <Card
            key={lead.id}
            className="lead-card shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border-border/40 backdrop-blur-sm hover:bg-card/80"
            onClick={() => onLeadClick(lead)}
          >
            <div className={`h-1.5 w-full ${
              lead.status === 'Hot' || lead.status === 'Won' ? 'bg-gradient-to-r from-red-500 to-orange-500' :
              lead.status === 'Warm' || lead.status === 'Trial Scheduled' ? 'bg-gradient-to-r from-amber-500 to-yellow-500' :
              lead.status === 'Cold' || lead.status === 'Open' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
              lead.status === 'Converted' || lead.status === 'Trial Completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
              lead.status === 'Lost' ? 'bg-gradient-to-r from-red-700 to-rose-600' :
              'bg-gradient-to-r from-gray-300 to-gray-400'
            }`}></div>
            <CardHeader className="pb-2 flex flex-row justify-between items-start space-y-0 pt-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10 border shadow-sm">
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
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted" aria-label="Open menu">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onLeadClick(lead);
                  }}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Lead
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    toast.info("View details coming soon");
                  }}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive"
                    onClick={(e) => handleDeleteLead(lead.id, e)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Lead
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
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
                {lead.center && (
                  <div className="flex items-center text-sm">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground mr-2" />
                    <span>{lead.center}</span>
                  </div>
                )}
              </div>
              <div className="pt-3 border-t border-border/30 text-sm">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-muted-foreground text-xs">Source:</span>
                  <Badge variant="outline" className="bg-primary/5 text-xs">
                    {lead.source}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-muted-foreground text-xs">Stage:</span>
                  <span className="font-medium text-sm">{lead.stage}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-xs">Associate:</span>
                  <span className="font-medium text-sm">{lead.associate}</span>
                </div>
              </div>
              {lead.remarks && (
                <div className="pt-3 border-t border-border/30">
                  <p className="text-xs text-muted-foreground">Remarks:</p>
                  <p className="text-sm mt-1 line-clamp-2">{lead.remarks}</p>
                </div>
              )}
              
              {/* Follow-up Section - Collapsible */}
              {hasFollowUpData(lead) && (
                <div className="pt-3 border-t border-border/30">
                  <Collapsible className="text-sm w-full" open={expandedCards.includes(lead.id)}>
                    <CollapsibleTrigger 
                      className="flex items-center justify-between w-full cursor-pointer text-xs text-muted-foreground font-medium"
                      onClick={(e) => toggleCardExpand(lead.id, e)}
                    >
                      <span>Follow-up History</span>
                      {expandedCards.includes(lead.id) ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      }
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 space-y-2">
                      {lead.followUp1Date && (
                        <div className="bg-muted/40 p-2 rounded-md text-xs">
                          <div className="font-medium flex items-center justify-between">
                            <Badge variant="outline" className="bg-primary/5 py-1 px-2 text-xs">
                              <Calendar className="mr-1 h-3 w-3" /> 
                              {formatDate(lead.followUp1Date)}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">Follow-up 1</Badge>
                          </div>
                          <p className="mt-1.5">{lead.followUp1Comments || "No comments"}</p>
                        </div>
                      )}
                      {lead.followUp2Date && (
                        <div className="bg-muted/40 p-2 rounded-md text-xs">
                          <div className="font-medium flex items-center justify-between">
                            <Badge variant="outline" className="bg-primary/5 py-1 px-2 text-xs">
                              <Calendar className="mr-1 h-3 w-3" /> 
                              {formatDate(lead.followUp2Date)}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">Follow-up 2</Badge>
                          </div>
                          <p className="mt-1.5">{lead.followUp2Comments || "No comments"}</p>
                        </div>
                      )}
                      {lead.followUp3Date && (
                        <div className="bg-muted/40 p-2 rounded-md text-xs">
                          <div className="font-medium flex items-center justify-between">
                            <Badge variant="outline" className="bg-primary/5 py-1 px-2 text-xs">
                              <Calendar className="mr-1 h-3 w-3" /> 
                              {formatDate(lead.followUp3Date)}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">Follow-up 3</Badge>
                          </div>
                          <p className="mt-1.5">{lead.followUp3Comments || "No comments"}</p>
                        </div>
                      )}
                      {lead.followUp4Date && (
                        <div className="bg-muted/40 p-2 rounded-md text-xs">
                          <div className="font-medium flex items-center justify-between">
                            <Badge variant="outline" className="bg-primary/5 py-1 px-2 text-xs">
                              <Calendar className="mr-1 h-3 w-3" /> 
                              {formatDate(lead.followUp4Date)}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">Follow-up 4</Badge>
                          </div>
                          <p className="mt-1.5">{lead.followUp4Comments || "No comments"}</p>
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full gap-2 hover:bg-primary hover:text-primary-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  onLeadClick(lead);
                }}
              >
                <Edit className="h-4 w-4" />
                <span>Edit Lead</span>
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center py-10 text-muted-foreground">
          No leads found. Try adjusting your filters or adding new leads.
        </div>
      )}
    </div>
  );
}
