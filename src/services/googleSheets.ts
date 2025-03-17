
import { delay } from '@/lib/utils';
import Papa from 'papaparse';

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

// Store leads data
let currentLeads: Lead[] = [];

// Function to fetch all leads
export const fetchLeads = async (): Promise<Lead[]> => {
  // Simulate API delay - in a real application, this would be an API call
  await delay(800);
  
  console.log('Fetching leads from service...', currentLeads.length);
  return currentLeads;
};

// Function to update a lead
export const updateLead = async (lead: Lead): Promise<Lead> => {
  console.log('Updating lead in service:', lead.id);
  // Simulate API delay
  await delay(600);
  
  const index = currentLeads.findIndex(l => l.id === lead.id);
  
  if (index === -1) {
    throw new Error(`Lead with ID ${lead.id} not found`);
  }
  
  currentLeads[index] = { ...lead };
  console.log('Lead updated successfully');
  
  return lead;
};

// Debounced version of updateLead for use with form inputs
export const debouncedUpdateLead = async (lead: Lead): Promise<Lead> => {
  // In production, this would use a debounce utility to avoid too many API calls
  return updateLead(lead);
};

// Function to add a new lead
export const addLead = async (lead: Lead): Promise<Lead> => {
  console.log('Adding new lead to service');
  // Simulate API delay
  await delay(800);
  
  const newLead = {
    ...lead,
    id: lead.id || `lead-${currentLeads.length + 1}`,
    createdAt: lead.createdAt || new Date().toISOString().split('T')[0]
  };
  
  currentLeads = [...currentLeads, newLead];
  console.log('New lead added successfully');
  
  return newLead;
};

// Function to delete a lead
export const deleteLead = async (leadId: string): Promise<void> => {
  console.log('Deleting lead from service:', leadId);
  // Simulate API delay
  await delay(600);
  
  const index = currentLeads.findIndex(l => l.id === leadId);
  
  if (index === -1) {
    throw new Error(`Lead with ID ${leadId} not found`);
  }
  
  currentLeads = [...currentLeads.slice(0, index), ...currentLeads.slice(index + 1)];
  console.log('Lead deleted successfully');
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
    console.log('Importing leads from CSV');
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
    
    console.log(`${mappedLeads.length} leads imported successfully`);
    return;
  } catch (error) {
    console.error('Error importing CSV:', error);
    throw error;
  }
};
