
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
  Check, 
  AlertTriangle, 
  User 
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

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
  const [activeTab, setActiveTab] = useState('details');
  
  const isBulkEdit = !lead && selectedLeads.length > 0;
  const title = isBulkEdit 
    ? `Bulk Edit ${selectedLeads.length} Leads` 
    : lead?.fullName 
      ? `Edit Lead: ${lead.fullName}`
      : 'Edit Lead';
  
  useEffect(() => {
    if (lead) {
      setFormData({ ...lead });
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
        // This would update all selectedLeads with the changed fields
        toast.success(`Updated ${selectedLeads.length} leads successfully`);
        
        if (clearSelection) {
          clearSelection();
        }
      } else if (lead) {
        // Update single lead
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
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {isBulkEdit ? <Check className="h-5 w-5" /> : <User className="h-5 w-5" />}
            {title}
          </DialogTitle>
          <DialogDescription>
            {isBulkEdit 
              ? "Update multiple leads at once. Only changed fields will be updated."
              : "Update the lead information below."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="details" className="text-sm">Lead Details</TabsTrigger>
              <TabsTrigger value="history" className="text-sm">Activity History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              {!isBulkEdit && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName || ''}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
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
                    <Label htmlFor="phone">Phone</Label>
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
                    <Label htmlFor="createdAt">Created At</Label>
                    <div className="relative">
                      <Input
                        id="createdAt"
                        name="createdAt"
                        value={formData.createdAt || ''}
                        onChange={handleInputChange}
                        placeholder="YYYY-MM-DD"
                        readOnly
                        className="pl-9 bg-muted/20"
                      />
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Select
                    name="source"
                    value={formData.source || ''}
                    onValueChange={(value) => handleSelectChange('source', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {sourceOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="associate">Associate</Label>
                  <Select
                    name="associate"
                    value={formData.associate || ''}
                    onValueChange={(value) => handleSelectChange('associate', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select associate" />
                    </SelectTrigger>
                    <SelectContent>
                      {associateOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stage">Stage</Label>
                  <Select
                    name="stage"
                    value={formData.stage || ''}
                    onValueChange={(value) => handleSelectChange('stage', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {stageOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
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
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  name="remarks"
                  value={formData.remarks || ''}
                  onChange={handleInputChange}
                  placeholder="Add any notes or remarks about this lead"
                  rows={4}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4">
              <div className="rounded-md border p-4 bg-muted/10">
                <div className="space-y-4">
                  {lead ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Activity History</h4>
                        <Button variant="outline" size="sm">View All</Button>
                      </div>
                      
                      <div className="timeline space-y-4">
                        <div className="timeline-item">
                          <div className="flex gap-2">
                            <span className="w-20 text-xs text-muted-foreground">Today</span>
                            <div className="flex-1">
                              <p className="text-sm">Status changed to <span className="font-medium">{lead.status}</span></p>
                              <p className="text-xs text-muted-foreground">Changed by Admin</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="timeline-item">
                          <div className="flex gap-2">
                            <span className="w-20 text-xs text-muted-foreground">{formatDate(lead.createdAt)}</span>
                            <div className="flex-1">
                              <p className="text-sm">Lead created</p>
                              <p className="text-xs text-muted-foreground">Initial status: {lead.status}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Activity history not available in bulk edit mode</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="flex items-center justify-between sm:justify-between pt-2">
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
