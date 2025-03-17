import React, { useState } from 'react';
import { useLeads } from '@/contexts/LeadContext';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Mail, 
  Phone, 
  Plus, 
  MoreHorizontal, 
  Grip,
  Calendar,
  CalendarCheck,
  BookmarkCheck,
  User,
  Users,
  Globe,
  Link,
  Share2,
  Building,
  FileText,
  CheckCircle,
  XCircle,
  Flag,
  Target,
  MessageSquare,
  Clock
} from 'lucide-react';
import { formatDate, groupBy } from '@/lib/utils';

interface LeadsKanbanViewProps {
  onLeadClick: (lead: any) => void;
}

export function LeadsKanbanView({ onLeadClick }: LeadsKanbanViewProps) {
  const { filteredLeads, loading } = useLeads();
  const [groupByField, setGroupByField] = useState<string>('status');
  
  const groupByOptions = [
    { value: 'status', label: 'Status' },
    { value: 'stage', label: 'Stage' },
    { value: 'source', label: 'Source' },
    { value: 'associate', label: 'Associate' },
    { value: 'center', label: 'Center' }
  ];
  
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
    }
  ];

  const displayLeads = filteredLeads.length > 0 ? filteredLeads : sampleLeads;
  
  const groupedLeads = groupBy(displayLeads, groupByField as keyof typeof displayLeads[0]);
  
  const sortedGroups = Object.keys(groupedLeads).sort((a, b) => {
    if (groupByField === 'status') {
      const statusPriority: Record<string, number> = {
        'Hot': 1,
        'Warm': 2,
        'Cold': 3,
        'Converted': 4,
        'Lost': 5
      };
      return (statusPriority[a] || 99) - (statusPriority[b] || 99);
    }
    return a.localeCompare(b);
  });
  
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const getStatusColor = (status: string): string => {
    switch(status) {
      case 'Hot': return 'from-red-500 to-orange-500';
      case 'Warm': return 'from-amber-500 to-yellow-500';
      case 'Cold': return 'from-blue-500 to-cyan-500';
      case 'Converted': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-400';
    }
  };
  
  const getGroupColor = (group: string): string => {
    if (groupByField === 'status') {
      return getStatusColor(group);
    }
    
    const colors = [
      'from-indigo-500 to-purple-500',
      'from-blue-500 to-indigo-500',
      'from-cyan-500 to-blue-500',
      'from-emerald-500 to-green-500',
      'from-amber-500 to-orange-500',
      'from-rose-500 to-pink-500'
    ];
    
    const index = group.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const getSourceIcon = (source: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Website': <Globe className="h-3.5 w-3.5" />,
      'Referral': <Users className="h-3.5 w-3.5" />,
      'Social Media': <Share2 className="h-3.5 w-3.5" />,
      'Event': <Calendar className="h-3.5 w-3.5" />,
      'Cold Call': <Phone className="h-3.5 w-3.5" />,
      'Partner': <Building className="h-3.5 w-3.5" />,
      'Email Campaign': <Mail className="h-3.5 w-3.5" />
    };
    return icons[source] || <Link className="h-3.5 w-3.5" />;
  };

  const getStageIcon = (stage: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Qualification': <Target className="h-3.5 w-3.5" />,
      'Needs Analysis': <FileText className="h-3.5 w-3.5" />,
      'Proposal': <FileText className="h-3.5 w-3.5" />,
      'Negotiation': <MessageSquare className="h-3.5 w-3.5" />,
      'Closed Won': <CheckCircle className="h-3.5 w-3.5" />,
      'Closed Lost': <XCircle className="h-3.5 w-3.5" />
    };
    return icons[stage] || <Flag className="h-3.5 w-3.5" />;
  };

  const getFollowUpBadges = (lead: any) => {
    const followUps = [];
    for (let i = 1; i <= 4; i++) {
      const dateField = `followUp${i}Date`;
      if (lead[dateField]) {
        followUps.push({
          date: lead[dateField],
          index: i
        });
      }
    }
    return followUps;
  };
  
  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading kanban board...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Grip className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Kanban Board</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={groupByField} onValueChange={setGroupByField}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              {groupByOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  Group by {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="kanban-board flex gap-4 pb-4 pt-1 min-h-[500px] overflow-x-auto fancy-scrollbar">
        {sortedGroups.map(group => (
          <div key={group} className="kanban-column min-w-[280px] w-[280px] flex flex-col">
            <div className={`sticky top-0 z-10 bg-gradient-to-r ${getGroupColor(group)} p-3 rounded-t-md text-white shadow-md`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium">{group}</h3>
                  <Badge className="bg-white/30 text-white hover:bg-white/40">
                    {groupedLeads[group].length}
                  </Badge>
                </div>
                
                <Button variant="ghost" size="icon" className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/20">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 space-y-3 p-3 bg-muted/20 rounded-b-md overflow-y-auto max-h-[80vh]">
              {groupedLeads[group].map(lead => (
                <Card 
                  key={lead.id} 
                  className="kanban-card shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4"
                  style={{
                    borderLeftColor: `hsl(var(--${
                      lead.status === 'Hot' ? 'destructive' : 
                      lead.status === 'Warm' ? 'warning' : 
                      lead.status === 'Cold' ? 'info' : 
                      lead.status === 'Converted' ? 'success' : 'muted'
                    }))`
                  }}
                  onClick={() => onLeadClick(lead)}
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={`text-xs text-white bg-gradient-to-br ${
                            groupByField === 'status' ? getGroupColor(lead.status) : getGroupColor(group)
                          }`}>
                            {getInitials(lead.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium line-clamp-1">{lead.fullName}</h4>
                          {groupByField !== 'status' && lead.status && (
                            <Badge 
                              variant={
                                lead.status === 'Converted' ? 'success' : 
                                lead.status === 'Hot' ? 'destructive' : 
                                lead.status === 'Warm' ? 'secondary' : 
                                'default'
                              } 
                              className="text-xs"
                            >
                              {lead.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs space-y-1 text-muted-foreground">
                      {lead.email && (
                        <div className="flex items-center gap-1 overflow-hidden">
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{lead.email}</span>
                        </div>
                      )}
                      {lead.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 flex-shrink-0" />
                          <span>{lead.phone}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-1">
                      {lead.source && (
                        <Badge variant="outline" className="text-xs flex items-center gap-1 bg-blue-50 dark:bg-blue-950/20">
                          {getSourceIcon(lead.source)}
                          <span>{lead.source}</span>
                        </Badge>
                      )}
                      
                      {groupByField !== 'stage' && lead.stage && (
                        <Badge variant="outline" className="text-xs flex items-center gap-1 bg-purple-50 dark:bg-purple-950/20">
                          {getStageIcon(lead.stage)}
                          <span>{lead.stage}</span>
                        </Badge>
                      )}
                    </div>
                    
                    {getFollowUpBadges(lead).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {getFollowUpBadges(lead).map((followUp, idx) => (
                          <Badge 
                            key={idx}
                            variant="outline" 
                            className="text-xs flex items-center gap-1 bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/40"
                          >
                            <CalendarCheck className="h-3 w-3" />
                            <span>Follow-up {followUp.index}: {formatDate(followUp.date)}</span>
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(lead.createdAt)}
                      </span>
                      
                      <div className="flex items-center">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-[8px] bg-muted">
                            {getInitials(lead.associate || 'NA')}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button 
                variant="ghost" 
                className="w-full justify-start text-xs text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Card
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <style>{`
        .kanban-board {
          scroll-snap-type: x mandatory;
        }
        .kanban-column {
          scroll-snap-align: start;
        }
        .fancy-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .fancy-scrollbar::-webkit-scrollbar-track {
          background: hsl(var(--muted));
          border-radius: 4px;
        }
        .fancy-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground));
          border-radius: 4px;
        }
        .fancy-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary));
        }
      `}</style>
    </div>
  );
}
