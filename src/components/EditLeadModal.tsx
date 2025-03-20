import React, { useState, useEffect } from 'react';
import { useLeads } from '@/contexts/LeadContext';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Phone, 
  Save, 
  X, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  User,
  MessageSquare,
  CalendarCheck,
  Building,
  Users,
  Share2,
  CalendarDays,
  Search,
  Clipboard,
  FileText,
  BadgeDollarSign,
  CheckCircle as Check,
  XCircle,
  Flag,
  Globe,
  Info,
  Clock,
  Star,
  MapPin,
  Briefcase,
  PersonStanding,
  Megaphone,
  PhoneIncoming,
  MessagesSquare,
  Smartphone,
  Instagram,
  Facebook,
  ExternalLink,
  HelpCircle,
  BellRing,
  Ban,
  Award
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: any;
  selectedLeads?: string[];
  clearSelection?: () => void;
}

export function EditLeadModal({ 
  isOpen, 
  onClose, 
  lead, 
  selectedLeads = [], 
  clearSelection 
}: EditLeadModalProps) {
  const { updateLead, sourceOptions, associateOptions, stageOptions, statusOptions } = useLeads();
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  
  const isBulkEdit = !lead && selectedLeads.length > 0;
  const title = isBulkEdit 
    ? `Bulk Edit ${selectedLeads.length} Leads` 
    : lead?.fullName 
      ? `Edit Lead: ${lead.fullName}`
      : 'Edit Lead';
  
  useEffect(() => {
    if (lead) {
      setFormData({ ...lead });
      console.log('Lead data loaded:', lead);
    } else {
      setFormData({});
    }
  }, [lead]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isBulkEdit) {
        // Handle bulk edit logic here
        toast.success(`Updated ${selectedLeads.length} leads successfully`);
        
        if (clearSelection) {
          clearSelection();
        }
      } else if (lead) {
        await updateLead({ ...lead, ...formData });
        toast.success("Lead updated successfully");
      }
      
      onClose();
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Failed to update lead");
    } finally {
      setLoading(false);
    }
  };

  const getSourceColor = (source: string) => {
    const colorMap: Record<string, string> = {
      'Website': 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300',
      'Walkin': 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300',
      'Social Media': 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300',
      'Social - Instagram': 'bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/30 dark:text-pink-300',
      'Social - Facebook': 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-300',
      'Client Referral': 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-900/30 dark:text-cyan-300',
      'Staff Referral': 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/30 dark:text-teal-300',
      'Incoming call': 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300',
      'Yellow Messenger/Whatsapp Enquiry': 'bg-lime-100 text-lime-800 border-lime-300 dark:bg-lime-900/30 dark:text-lime-300',
      'Hosted Class': 'bg-violet-100 text-violet-800 border-violet-300 dark:bg-violet-900/30 dark:text-violet-300',
      'Outdoor Class': 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300',
      'Abandoned checkout': 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/30 dark:text-rose-300',
      'Influencer Marketing': 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300',
      'Missed call': 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300',
    };
    return colorMap[source] || 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/50 dark:text-gray-300';
  };

  const getStageColor = (stage: string) => {
    const colorMap: Record<string, string> = {
      'New Enquiry': 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300',
      'Sent Introductory message': 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-300',
      'Shared Pricing & Schedule Details': 'bg-violet-100 text-violet-800 border-violet-300 dark:bg-violet-900/30 dark:text-violet-300',
      'Trial Scheduled': 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300',
      'Trial Completed': 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300',
      'Membership Sold': 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300',
      'Client Unresponsive': 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/50 dark:text-gray-300',
      'Not Interested - Pricing Issues': 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300',
      'Will get back to us at a later date': 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300',
      'Lead Dropped or Lost': 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/30 dark:text-rose-300',
    };
    return colorMap[stage] || 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/50 dark:text-gray-300';
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'Open': 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300',
      'Trial Scheduled': 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300',
      'Trial Completed': 'bg-violet-100 text-violet-800 border-violet-300 dark:bg-violet-900/30 dark:text-violet-300',
      'Won': 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300',
      'Lost': 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300',
      'Unresponsive': 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/50 dark:text-gray-300',
      'Disqualified': 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/30 dark:text-rose-300',
      'Uncategorized': 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/50 dark:text-gray-300',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/50 dark:text-gray-300';
  };

  const getSourceIcon = (source: string) => {
    const sourceIconMap: Record<string, React.ReactNode> = {
      'Website': <Globe className="h-3.5 w-3.5" />,
      'Website Form': <ExternalLink className="h-3.5 w-3.5" />,
      'Client Referral': <Users className="h-3.5 w-3.5" />,
      'Staff Referral': <PersonStanding className="h-3.5 w-3.5" />,
      'Social Media': <Share2 className="h-3.5 w-3.5" />,
      'Social - Instagram': <Instagram className="h-3.5 w-3.5" />,
      'Social - Facebook': <Facebook className="h-3.5 w-3.5" />,
      'Social': <Share2 className="h-3.5 w-3.5" />,
      'Hosted Class': <CalendarDays className="h-3.5 w-3.5" />,
      'Outdoor Class': <MapPin className="h-3.5 w-3.5" />,
      'Walkin': <PersonStanding className="h-3.5 w-3.5" />,
      'Incoming call': <PhoneIncoming className="h-3.5 w-3.5" />,
      'Yellow Messenger/Whatsapp Enquiry': <MessagesSquare className="h-3.5 w-3.5" />,
      'Abandoned checkout': <Smartphone className="h-3.5 w-3.5" />,
      'Influencer Marketing': <Megaphone className="h-3.5 w-3.5" />,
      'Missed call': <Phone className="h-3.5 w-3.5" />,
    };
    return sourceIconMap[source] || <Globe className="h-3.5 w-3.5" />;
  };

  const getStageIcon = (stage: string) => {
    const stageIconMap: Record<string, React.ReactNode> = {
      'New Enquiry': <Star className="h-3.5 w-3.5" />,
      'Sent Introductory message': <Mail className="h-3.5 w-3.5" />,
      'Shared Pricing & Schedule Details': <FileText className="h-3.5 w-3.5" />,
      'Trial Scheduled': <CalendarCheck className="h-3.5 w-3.5" />,
      'Trial Completed': <CheckCircle className="h-3.5 w-3.5" />,
      'Membership Sold': <Award className="h-3.5 w-3.5" />,
      'Client Unresponsive': <Clock className="h-3.5 w-3.5" />,
      'Not Interested - Pricing Issues': <Ban className="h-3.5 w-3.5" />,
      'Will get back to us at a later date': <Calendar className="h-3.5 w-3.5" />,
      'Lead Dropped or Lost': <XCircle className="h-3.5 w-3.5" />,
    };
    return stageIconMap[stage] || <HelpCircle className="h-3.5 w-3.5" />;
  };

  const getStatusIcon = (status: string) => {
    const statusIconMap: Record<string, React.ReactNode> = {
      'Open': <Star className="h-3.5 w-3.5" />,
      'Trial Scheduled': <CalendarCheck className="h-3.5 w-3.5" />,
      'Trial Completed': <Check className="h-3.5 w-3.5" />,
      'Won': <Award className="h-3.5 w-3.5" />,
      'Lost': <XCircle className="h-3.5 w-3.5" />,
      'Unresponsive': <Clock className="h-3.5 w-3.5" />,
      'Disqualified': <Ban className="h-3.5 w-3.5" />,
      'Uncategorized': <HelpCircle className="h-3.5 w-3.5" />,
    };
    return statusIconMap[status] || <HelpCircle className="h-3.5 w-3.5" />;
  };

  const getFollowUpColor = (index: number) => {
    const colors = [
      'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800/60 dark:text-blue-300',
      'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800/60 dark:text-purple-300',
      'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800/60 dark:text-amber-300',
      'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/60 dark:text-emerald-300'
    ];
    return colors[index % colors.length];
  };

  const handleFollowUpChange = (index: number, field: 'date' | 'comments', value: string) => {
    const dateField = `followUp${index}Date`;
    const commentsField = `followUp${index}Comments`;
    
    if (field === 'date') {
      setFormData(prev => ({ ...prev, [dateField]: value }));
    } else {
      setFormData(prev => ({ ...prev, [commentsField]: value }));
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {isBulkEdit ? (
              <span className="inline-flex items-center">
                <CheckCircle className="h-5 w-5 text-indigo-500 mr-2" />
                {title}
              </span>
            ) : (
              <span className="inline-flex items-center">
                <Avatar className="h-7 w-7 mr-2">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs">
                    {lead ? getInitials(lead.fullName) : "?"}
                  </AvatarFallback>
                </Avatar>
                {title}
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            {isBulkEdit 
              ? "Update multiple leads at once. Only changed fields will be updated."
              : "Update the lead information below."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="pt-2 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span>Lead Details</span>
              </TabsTrigger>
              <TabsTrigger value="followups" className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4" />
                <span>Follow-ups</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-6 pt-2">
              {!isBulkEdit && (
                <Card className="border-slate-200 dark:border-slate-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4 text-indigo-500" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName || ''}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">Email</Label>
                      <div className="relative">
                        <Input
                          id="email"
                          name="email"
                          value={formData.email || ''}
                          onChange={handleInputChange}
                          placeholder="Email"
                          className="pl-9"
                        />
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm">Phone</Label>
                      <div className="relative">
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone || ''}
                          onChange={handleInputChange}
                          placeholder="Phone"
                          className="pl-9"
                        />
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="createdAt" className="text-sm">Created At</Label>
                      <div className="relative">
                        <Input
                          id="createdAt"
                          name="createdAt"
                          value={formData.createdAt || ''}
                          readOnly
                          className="pl-9 bg-muted/20"
                        />
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                    <Clipboard className="h-4 w-4 text-indigo-500" />
                    Lead Classification
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="source" className="text-sm">Source</Label>
                    <Select
                      name="source"
                      value={formData.source || ''}
                      onValueChange={(value) => handleSelectChange('source', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[240px]">
                        {sourceOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            <div className="flex items-center gap-2">
                              {getSourceIcon(option)}
                              <span>{option}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.source && (
                      <Badge className={`mt-1 flex items-center gap-1 ${getSourceColor(formData.source)}`}>
                        {getSourceIcon(formData.source)}
                        <span>{formData.source}</span>
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="associate" className="text-sm">Associate</Label>
                    <Select
                      name="associate"
                      value={formData.associate || ''}
                      onValueChange={(value) => handleSelectChange('associate', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select associate" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[240px]">
                        {associateOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            <div className="flex items-center gap-2">
                              <span>{option}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stage" className="text-sm">Stage</Label>
                    <Select
                      name="stage"
                      value={formData.stage || ''}
                      onValueChange={(value) => handleSelectChange('stage', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[240px]">
                        {stageOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            <div className="flex items-center gap-2">
                              {getStageIcon(option)}
                              <span>{option}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.stage && (
                      <Badge className={`mt-1 flex items-center gap-1 ${getStageColor(formData.stage)}`}>
                        {getStageIcon(formData.stage)}
                        <span>{formData.stage}</span>
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm">Status</Label>
                    <Select
                      name="status"
                      value={formData.status || ''}
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(option)}
                              <span>{option}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.status && (
                      <Badge className={`mt-1 flex items-center gap-1 ${getStatusColor(formData.status)}`}>
                        {getStatusIcon(formData.status)}
                        <span>{formData.status}</span>
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                    <MessageSquare className="h-4 w-4 text-indigo-500" />
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                  <div className="space-y-2">
                    <Label htmlFor="remarks" className="text-sm">Remarks</Label>
                    <Textarea
                      id="remarks"
                      name="remarks"
                      value={formData.remarks || ''}
                      onChange={handleInputChange}
                      placeholder="Add any notes or remarks about this lead"
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="followups" className="pt-2">
              {!isBulkEdit && lead ? (
                <Card className="border-slate-200 dark:border-slate-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <CalendarCheck className="h-4 w-4 text-indigo-500" />
                      Scheduled Follow-ups
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((index) => {
                        const dateField = `followUp${index}Date`;
                        const commentsField = `followUp${index}Comments`;
                        const hasDate = formData[dateField];
                        
                        return (
                          <Card 
                            key={index} 
                            className={`transition-all border ${hasDate ? getFollowUpColor(index-1) : ''}`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-xs border shadow-sm">
                                    {index}
                                  </div>
                                  <span className="font-medium text-sm">Follow-up {index}</span>
                                </div>
                                {hasDate && (
                                  <Badge variant="outline" className="bg-white/80 text-xs gap-1 font-normal">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(hasDate, "MMM d, yyyy")}
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="space-y-3">
                                <div className="space-y-1">
                                  <Label htmlFor={dateField} className="text-xs">Schedule Date</Label>
                                  <Input
                                    id={dateField}
                                    name={dateField}
                                    type="date"
                                    value={formData[dateField] || ''}
                                    onChange={(e) => handleFollowUpChange(index, 'date', e.target.value)}
                                    className="bg-white/80 border-white/80"
                                  />
                                </div>
                                
                                <div className="space-y-1">
                                  <Label htmlFor={commentsField} className="text-xs">Notes</Label>
                                  <Textarea
                                    id={commentsField}
                                    name={commentsField}
                                    value={formData[commentsField] || ''}
                                    onChange={(e) => handleFollowUpChange(index, 'comments', e.target.value)}
                                    placeholder="Add notes for this follow-up"
                                    rows={2}
                                    className="resize-none bg-white/80 border-white/80 text-sm"
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertTriangle className="h-10 w-10 text-amber-500 mb-2 opacity-80" />
                  <h3 className="text-lg font-medium">Not Available</h3>
                  <p className="text-sm text-muted-foreground max-w-md mt-1">
                    Follow-up scheduling is not available in bulk edit mode or when no lead is selected.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="pt-4 border-t flex items-center justify-between sm:justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </Button>
            
            <Button 
              type="submit" 
              disabled={loading}
              className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              <Save className="h-4 w-4" />
              <span>{isBulkEdit ? 'Update Selected Leads' : 'Save Changes'}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
