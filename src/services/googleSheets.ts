import { delay } from '@/lib/utils';
import Papa from 'papaparse';

// Helper function for artificial delay (for demo purposes)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Lead interface with follow-up fields
export interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  source: string;
  associate: string;
  status: string;
  stage: string;
  createdAt: string;
  center: string;
  remarks: string;
  followUp1Date?: string;
  followUp1Comments?: string;
  followUp2Date?: string;
  followUp2Comments?: string;
  followUp3Date?: string;
  followUp3Comments?: string;
  followUp4Date?: string;
  followUp4Comments?: string;
  [key: string]: any; // Allow additional properties
}

// Mock data for leads (this would be replaced with actual API calls in production)
const mockLeads: Lead[] = [
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
    stage: 'Membership Sold',
    remarks: 'Interested in premium package',
    followUp1Date: '2023-09-16',
    followUp1Comments: 'Called to discuss membership options',
    followUp2Date: '2023-09-18',
    followUp2Comments: 'Scheduled a trial class',
    followUp3Date: '',
    followUp3Comments: '',
    followUp4Date: '',
    followUp4Comments: ''
  },
  {
    id: 'lead-2',
    fullName: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    phone: '(555) 987-6543',
    source: 'Social - Instagram',
    associate: 'Mike Chen',
    status: 'Cold',
    createdAt: '2023-09-10',
    center: 'Uptown',
    stage: 'Shared Pricing & Schedule Details',
    remarks: 'Follow up in 2 weeks',
    followUp1Date: '2023-09-12',
    followUp1Comments: 'Sent email with pricing details',
    followUp2Date: '',
    followUp2Comments: '',
    followUp3Date: '',
    followUp3Comments: '',
    followUp4Date: '',
    followUp4Comments: ''
  },
  {
    id: 'lead-3',
    fullName: 'Robert Johnson',
    email: 'robert.j@example.com',
    phone: '(555) 333-2222',
    source: 'Abandoned checkout',
    associate: 'Lisa Wong',
    status: 'Warm',
    createdAt: '2023-09-05',
    center: 'Midtown',
    stage: 'Post Trial Follow Up',
    remarks: 'Sent proposal, awaiting feedback',
    followUp1Date: '2023-09-07',
    followUp1Comments: 'Called to follow up on trial',
    followUp2Date: '2023-09-09',
    followUp2Comments: 'Discussed membership options',
    followUp3Date: '2023-09-12',
    followUp3Comments: 'Sent final proposal',
    followUp4Date: '',
    followUp4Comments: ''
  },
  {
    id: 'lead-4',
    fullName: 'Michael Brown',
    email: 'mbrown@example.com',
    phone: '(555) 444-5555',
    source: 'Walkin',
    associate: 'Sarah Johnson',
    status: 'Converted',
    createdAt: '2023-08-28',
    center: 'Downtown',
    stage: 'Membership Sold',
    remarks: 'Successfully converted to customer',
    followUp1Date: '',
    followUp1Comments: '',
    followUp2Date: '',
    followUp2Comments: '',
    followUp3Date: '',
    followUp3Comments: '',
    followUp4Date: '',
    followUp4Comments: ''
  },
  {
    id: 'lead-5',
    fullName: 'Jennifer Lee',
    email: 'jlee@example.com',
    phone: '(555) 777-8888',
    source: 'Client Referral',
    associate: 'Mike Chen',
    status: 'Hot',
    createdAt: '2023-09-18',
    center: 'Uptown',
    stage: 'Trial Scheduled',
    remarks: 'Very interested in our services',
    followUp1Date: '2023-09-19',
    followUp1Comments: 'Confirmed trial appointment',
    followUp2Date: '',
    followUp2Comments: '',
    followUp3Date: '',
    followUp3Comments: '',
    followUp4Date: '',
    followUp4Comments: ''
  },
  {
    id: 'lead-6',
    fullName: 'David Wilson',
    email: 'david.w@example.com',
    phone: '(555) 222-3333',
    source: 'Incoming call',
    associate: 'Lisa Wong',
    status: 'Warm',
    createdAt: '2023-09-12',
    center: 'Downtown',
    stage: 'Needs Analysis',
    remarks: 'Requested a follow-up call',
    followUp1Date: '2023-09-14',
    followUp1Comments: 'Discussed needs and preferences',
    followUp2Date: '2023-09-16',
    followUp2Comments: 'Recommended specific classes',
    followUp3Date: '',
    followUp3Comments: '',
    followUp4Date: '',
    followUp4Comments: ''
  },
  {
    id: 'lead-7',
    fullName: 'Sarah Miller',
    email: 'sarah.m@example.com',
    phone: '(555) 111-9999',
    source: 'Yellow Messenger/Whatsapp Enquiry',
    associate: 'Mike Chen',
    status: 'Cold',
    createdAt: '2023-09-08',
    center: 'Midtown',
    stage: 'Client Unresponsive',
    remarks: 'Needs more information',
    followUp1Date: '2023-09-10',
    followUp1Comments: 'Sent WhatsApp message with details',
    followUp2Date: '',
    followUp2Comments: '',
    followUp3Date: '',
    followUp3Comments: '',
    followUp4Date: '',
    followUp4Comments: ''
  },
  {
    id: 'lead-8',
    fullName: 'Daniel Taylor',
    email: 'daniel.t@example.com',
    phone: '(555) 444-7777',
    source: 'Social',
    associate: 'Sarah Johnson',
    status: 'Hot',
    createdAt: '2023-09-17',
    center: 'Uptown',
    stage: 'Trial Completed',
    remarks: 'Very enthusiastic about our offer',
    followUp1Date: '2023-09-18',
    followUp1Comments: 'Followed up after trial',
    followUp2Date: '2023-09-20',
    followUp2Comments: 'Discussed membership options',
    followUp3Date: '',
    followUp3Comments: '',
    followUp4Date: '',
    followUp4Comments: ''
  },
  {
    id: 'lead-9',
    fullName: 'Jessica Adams',
    email: 'jessica.a@example.com',
    phone: '(555) 333-6666',
    source: 'Social - Facebook',
    associate: 'Lisa Wong',
    status: 'Warm',
    createdAt: '2023-09-14',
    center: 'Downtown',
    stage: 'Will get back to us at a later date',
    remarks: 'Interested but needs time to decide',
    followUp1Date: '2023-09-16',
    followUp1Comments: 'Sent follow-up email',
    followUp2Date: '',
    followUp2Comments: '',
    followUp3Date: '',
    followUp3Comments: '',
    followUp4Date: '',
    followUp4Comments: ''
  },
  {
    id: 'lead-10',
    fullName: 'Thomas Brown',
    email: 'thomas.b@example.com',
    phone: '(555) 222-4444',
    source: 'Dashboard',
    associate: 'Mike Chen',
    status: 'Converted',
    createdAt: '2023-09-01',
    center: 'Uptown',
    stage: 'Membership Sold',
    remarks: 'Purchased premium membership',
    followUp1Date: '2023-09-02',
    followUp1Comments: 'Welcomed to the community',
    followUp2Date: '2023-09-05',
    followUp2Comments: 'Provided orientation details',
    followUp3Date: '',
    followUp3Comments: '',
    followUp4Date: '',
    followUp4Comments: ''
  },
  {
    id: 'lead-11',
    fullName: 'Amanda Garcia',
    email: 'amanda.g@example.com',
    phone: '(555) 999-1111',
    source: 'Enquiry on call',
    associate: 'Sarah Johnson',
    status: 'Cold',
    createdAt: '2023-09-09',
    center: 'Midtown',
    stage: 'Not Interested - Pricing Issues',
    remarks: 'Found our prices too high',
    followUp1Date: '',
    followUp1Comments: '',
    followUp2Date: '',
    followUp2Comments: '',
    followUp3Date: '',
    followUp3Comments: '',
    followUp4Date: '',
    followUp4Comments: ''
  },
  {
    id: 'lead-12',
    fullName: 'Kevin Martinez',
    email: 'kevin.m@example.com',
    phone: '(555) 777-3333',
    source: 'Staff Referral',
    associate: 'Lisa Wong',
    status: 'Hot',
    createdAt: '2023-09-16',
    center: 'Downtown',
    stage: 'Trial Scheduled',
    remarks: 'Referred by our yoga instructor',
    followUp1Date: '2023-09-17',
    followUp1Comments: 'Confirmed trial details',
    followUp2Date: '',
    followUp2Comments: '',
    followUp3Date: '',
    followUp3Comments: '',
    followUp4Date: '',
    followUp4Comments: ''
  },
  {
    id: 'lead-13',
    fullName: 'Laura Wilson',
    email: 'laura.w@example.com',
    phone: '(555) 444-2222',
    source: 'Influencer Sign-up',
    associate: 'Mike Chen',
    status: 'Warm',
    createdAt: '2023-09-13',
    center: 'Uptown',
    stage: 'Post Trial Follow Up',
    remarks: 'Influencer looking to collaborate',
    followUp1Date: '2023-09-15',
    followUp1Comments: 'Discussed partnership options',
    followUp2Date: '',
    followUp2Comments: '',
    followUp3Date: '',
    followUp3Comments: '',
    followUp4Date: '',
    followUp4Comments: ''
  },
  {
    id: 'lead-14',
    fullName: 'Christopher Lee',
    email: 'chris.l@example.com',
    phone: '(555) 666-7777',
    source: 'Outdoor Class',
    associate: 'Sarah Johnson',
    status: 'Converted',
    createdAt: '2023-08-30',
    center: 'Downtown',
    stage: 'Membership Sold',
    remarks: 'Joined after outdoor yoga session',
    followUp1Date: '2023-09-01',
    followUp1Comments: 'Welcomed to the community',
    followUp2Date: '',
    followUp2Comments: '',
    followUp3Date: '',
    followUp3Comments: '',
    followUp4Date: '',
    followUp4Comments: ''
  },
  {
    id: 'lead-15',
    fullName: 'Olivia Thompson',
    email: 'olivia.t@example.com',
    phone: '(555) 888-9999',
    source: 'Incoming sms',
    associate: 'Lisa Wong',
    status: 'Cold',
    createdAt: '2023-09-07',
    center: 'Midtown',
    stage: 'Called - Did Not Answer',
    remarks: 'Texted about membership',
    followUp1Date: '2023-09-08',
    followUp1Comments: 'Attempted callback, no answer',
    followUp2Date: '2023-09-10',
    followUp2Comments: 'Left voicemail',
    followUp3Date: '',
    followUp3Comments: '',
    followUp4Date: '',
    followUp4Comments: ''
  },
  {
    id: 'lead-16',
    fullName: 'Ryan Baker',
    email: 'ryan.b@example.com',
    phone: '(555) 111-2222',
    source: 'Website - Pre/Post Natal',
    associate: 'Mike Chen',
    status: 'Hot',
    createdAt: '2023-09-19',
    center: 'Uptown',
    stage: 'Shared Pricing & Schedule Details',
    remarks: 'Interested in prenatal yoga',
    followUp1Date: '2023-09-20',
    followUp1Comments: 'Sent specialized program details',
    followUp2Date: '',
    followUp2Comments: '',
    followUp3Date: '',
    followUp3Comments: '',
    followUp4Date: '',
    followUp4Comments: ''
  },
  {
    id: 'lead-17',
    fullName: 'Nicole White',
    email: 'nicole.w@example.com',
    phone: '(555) 333-4444',
    source: 'Website Form',
    associate: 'Sarah Johnson',
    status: 'Warm',
    createdAt: '2023-09-11',
    center: 'Downtown',
    stage: 'Initial Contact',
    remarks: 'Submitted form for more info',
    followUp1Date: '2023-09-12',
    followUp1Comments: 'Sent welcome email',
    followUp2Date: '2023-09-14',
    followUp2Comments: 'Called to discuss interests',
    followUp3Date: '',
    followUp3Comments: '',
    followUp4Date: '',
    followUp4Comments: ''
  },
  {
    id: 'lead-18',
    fullName: 'Eric Davis',
    email: 'eric.d@example.com',
    phone: '(555) 777-5555',
    source: 'Endpoint (API)',
    associate: 'Lisa Wong',
    status: 'Cold',
    createdAt: '2023-09-06',
    center: 'Midtown',
    stage: 'Language Barrier - Couldn\'t comprehend or speak the language',
    remarks: 'Language barrier issues',
    followUp1Date: '',
    followUp1Comments: '',
    followUp2Date: '',
    followUp2Comments: '',
    followUp3Date: '',
    followUp3Comments: '',
    followUp4Date: '',
    followUp4Comments: ''
  },
  {
    id: 'lead-19',
    fullName: 'Samantha Cooper',
    email: 'sam.c@example.com',
    phone: '(555) 999-8888',
    source: 'Other',
    associate: 'Mike Chen',
    status: 'Hot',
    createdAt: '2023-09-15',
    center: 'Uptown',
    stage: 'Membership Sold',
    remarks: 'Enthusiastic about our programs',
    followUp1Date: '2023-09-16',
    followUp1Comments: 'Finalized membership details',
    followUp2Date: '',
    followUp2Comments: '',
    followUp3Date: '',
    followUp3Comments: '',
    followUp4Date: '',
    followUp4Comments: ''
  },
  {
    id: 'lead-20',
    fullName: 'Jason Rodriguez',
    email: 'jason.r@example.com',
    phone: '(555) 222-5555',
    source: 'Influencer Marketing',
    associate: 'Sarah Johnson',
    status: 'Warm',
    createdAt: '2023-09-10',
    center: 'Downtown',
    stage: 'Shared Class Descriptions and Benefits',
    remarks: 'Came through influencer campaign',
    followUp1Date: '2023-09-11',
    followUp1Comments: 'Sent class information',
    followUp2Date: '2023-09-13',
    followUp2Comments: 'Discussed benefits and special offers',
    followUp3Date: '',
    followUp3Comments: '',
    followUp4Date: '',
    followUp4Comments: ''
  }
];

let currentLeads = [...mockLeads];

// Function to fetch all leads
export const fetchLeads = async (): Promise<Lead[]> => {
  // Simulate API delay
  await delay(800);
  
  // In production, this would be an API call to fetch leads from Google Sheets
  // For now, return the mock data
  return currentLeads;
};

// Function to update a lead
export const updateLead = async (lead: Lead): Promise<Lead> => {
  // Simulate API delay
  await delay(600);
  
  // In production, this would be an API call to update a lead in Google Sheets
  // For now, update our local mock data
  const index = currentLeads.findIndex(l => l.id === lead.id);
  
  if (index === -1) {
    throw new Error(`Lead with ID ${lead.id} not found`);
  }
  
  currentLeads[index] = { ...lead };
  
  return lead;
};

// Debounced version of updateLead for use with form inputs
export const debouncedUpdateLead = async (lead: Lead): Promise<Lead> => {
  // In production, this would use a debounce utility to avoid too many API calls
  // For now, just call the regular updateLead
  return updateLead(lead);
};

// Function to add a new lead
export const addLead = async (lead: Lead): Promise<Lead> => {
  // Simulate API delay
  await delay(800);
  
  // In production, this would be an API call to add a lead to Google Sheets
  // For now, add to our local mock data
  const newLead = {
    ...lead,
    id: lead.id || `lead-${currentLeads.length + 1}`,
    createdAt: lead.createdAt || new Date().toISOString().split('T')[0]
  };
  
  currentLeads = [...currentLeads, newLead];
  
  return newLead;
};

// Function to delete a lead
export const deleteLead = async (leadId: string): Promise<void> => {
  // Simulate API delay
  await delay(600);
  
  // In production, this would be an API call to delete a lead from Google Sheets
  // For now, remove from our local mock data
  const index = currentLeads.findIndex(l => l.id === leadId);
  
  if (index === -1) {
    throw new Error(`Lead with ID ${leadId} not found`);
  }
  
  currentLeads = [...currentLeads.slice(0, index), ...currentLeads.slice(index + 1)];
};

// Function to parse CSV data using PapaParse
export const parseCSV = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Process the data to match our Lead interface
        const processedData = results.data.map((row: any, index: number) => {
          return {
            id: `imported-${index + 1}`,
            fullName: row['Full Name'] || row['Name'] || row['Client Name'] || '',
            email: row['Email'] || row['Email Address'] || '',
            phone: row['Phone'] || row['Contact Number'] || row['Mobile'] || '',
            source: row['Source'] || row['Lead Source'] || 'Other',
            associate: row['Associate'] || row['Assigned To'] || '',
            status: row['Status'] || 'New',
            stage: row['Stage'] || 'Initial Contact',
            createdAt: row['Created At'] || row['Date'] || new Date().toISOString().split('T')[0],
            center: row['Center'] || row['Location'] || '',
            remarks: row['Remarks'] || row['Notes'] || row['Comments'] || '',
            followUp1Date: row['Follow Up 1 Date'] || '',
            followUp1Comments: row['Follow Up Comments (1)'] || '',
            followUp2Date: row['Follow Up 2 Date'] || '',
            followUp2Comments: row['Follow Up Comments (2)'] || '',
            followUp3Date: row['Follow Up 3 Date'] || '',
            followUp3Comments: row['Follow Up Comments (3)'] || '',
            followUp4Date: row['Follow Up 4 Date'] || '',
            followUp4Comments: row['Follow Up Comments (4)'] || ''
          };
        });
        
        resolve(processedData);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

// Function to import leads from CSV
export const importLeadsFromCSV = async (csvString: string, columnMapping: Record<string, string>): Promise<void> => {
  try {
    // Parse CSV string
    const results = Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
    });
    
    if (results.errors.length > 0) {
      throw new Error(results.errors[0].message);
    }
    
    // Map CSV data to lead format based on columnMapping
    const mappedLeads = results.data.map((row: any, index: number) => {
      const lead: Partial<Lead> = {
        id: `imported-${Date.now()}-${index}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      
      // Map each CSV column to the corresponding lead field based on columnMapping
      Object.entries(columnMapping).forEach(([csvHeader, leadField]) => {
        if (row[csvHeader] !== undefined && leadField) {
          (lead as any)[leadField] = row[csvHeader];
        }
      });
      
      return lead as Lead;
    });
    
    // Simulate API delay
    await delay(1000);
    
    // Add all mapped leads to the current leads
    for (const lead of mappedLeads) {
      currentLeads.push(lead as Lead);
    }
    
    return;
  } catch (error) {
    console.error('Error importing CSV:', error);
    throw error;
  }
};
