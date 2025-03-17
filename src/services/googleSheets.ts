
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

// Google Sheets API configuration
const SHEET_ID = '1X2Y3Z4A5B6C7D8E9F'; // Replace with your actual Google Sheet ID
const API_KEY = 'YOUR_API_KEY'; // For public sheets, you might not need this
const SHEET_NAME = 'Leads'; // The name of your sheet tab

// Store fetched leads data
let currentLeads: Lead[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Function to fetch all leads from Google Sheets
export const fetchLeads = async (): Promise<Lead[]> => {
  console.log('Fetching leads from Google Sheets...');
  
  try {
    // Check if we have a cached version that's still fresh
    const now = Date.now();
    if (currentLeads.length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
      console.log('Using cached leads data, count:', currentLeads.length);
      return currentLeads;
    }
    
    // For development/demo purposes, simulate API delay
    await delay(800);
    
    // In a real implementation, you would fetch from Google Sheets API
    // Example fetch using public sheet (if your sheet is public):
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet data: ${response.statusText}`);
    }
    
    const data = await response.json();
    const rows = data.values || [];
    
    if (rows.length < 2) {
      console.log('Sheet is empty or has only headers');
      return [];
    }
    
    // First row contains headers
    const headers = rows[0];
    
    // Map sheet data to Lead objects
    const leads: Lead[] = rows.slice(1).map((row: any[], index: number) => {
      const lead: Partial<Lead> = { id: `lead-${index + 1}` };
      
      // Map each column value to the corresponding field based on headers
      headers.forEach((header: string, colIndex: number) => {
        const value = row[colIndex] || '';
        
        switch(header.toLowerCase()) {
          case 'name':
          case 'full name':
          case 'client name':
            lead.fullName = value;
            break;
          case 'email':
          case 'email address':
            lead.email = value;
            break;
          case 'phone':
          case 'contact number':
          case 'mobile':
            lead.phone = value;
            break;
          case 'source':
          case 'lead source':
            lead.source = value;
            break;
          case 'associate':
          case 'assigned to':
            lead.associate = value;
            break;
          case 'status':
            lead.status = value;
            break;
          case 'stage':
            lead.stage = value;
            break;
          case 'created at':
          case 'date':
          case 'created date':
            lead.createdAt = value || new Date().toISOString().split('T')[0];
            break;
          case 'center':
          case 'location':
            lead.center = value;
            break;
          case 'remarks':
          case 'notes':
          case 'comments':
            lead.remarks = value;
            break;
          case 'follow up 1 date':
            lead.followUp1Date = value;
            break;
          case 'follow up comments (1)':
            lead.followUp1Comments = value;
            break;
          case 'follow up 2 date':
            lead.followUp2Date = value;
            break;
          case 'follow up comments (2)':
            lead.followUp2Comments = value;
            break;
          case 'follow up 3 date':
            lead.followUp3Date = value;
            break;
          case 'follow up comments (3)':
            lead.followUp3Comments = value;
            break;
          case 'follow up 4 date':
            lead.followUp4Date = value;
            break;
          case 'follow up comments (4)':
            lead.followUp4Comments = value;
            break;
          default:
            // Store additional columns as custom fields
            lead[header] = value;
        }
      });
      
      // Ensure all required fields have defaults
      return {
        id: lead.id || `lead-${index + 1}`,
        fullName: lead.fullName || 'Unknown',
        email: lead.email || '',
        phone: lead.phone || '',
        source: lead.source || 'Other',
        associate: lead.associate || '',
        status: lead.status || 'New',
        stage: lead.stage || 'Initial Contact',
        createdAt: lead.createdAt || new Date().toISOString().split('T')[0],
        center: lead.center || '',
        remarks: lead.remarks || '',
        ...lead
      } as Lead;
    });
    
    console.log('Successfully fetched leads from Google Sheets, count:', leads.length);
    
    // Update cache
    currentLeads = leads;
    lastFetchTime = now;
    
    return leads;
  } catch (error) {
    console.error('Error fetching leads from Google Sheets:', error);
    
    // Fall back to sample data only if we have no cached data
    if (currentLeads.length === 0) {
      console.warn('Using fallback sample data due to fetch error');
      currentLeads = getSampleLeads();
      return currentLeads;
    }
    
    return currentLeads;
  }
};

// Function to update a lead
export const updateLead = async (lead: Lead): Promise<Lead> => {
  console.log('Updating lead in service:', lead.id);
  // Simulate API delay
  await delay(600);
  
  try {
    // In a real implementation, you would update the Google Sheet
    // For now, update the cached data
    const index = currentLeads.findIndex(l => l.id === lead.id);
    
    if (index === -1) {
      throw new Error(`Lead with ID ${lead.id} not found`);
    }
    
    currentLeads[index] = { ...lead };
    console.log('Lead updated successfully');
    
    return lead;
  } catch (error) {
    console.error('Error updating lead:', error);
    throw error;
  }
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
  
  try {
    // In a real implementation, you would add to the Google Sheet
    // For now, add to the cached data
    const newLead = {
      ...lead,
      id: lead.id || `lead-${currentLeads.length + 1}`,
      createdAt: lead.createdAt || new Date().toISOString().split('T')[0]
    };
    
    currentLeads = [...currentLeads, newLead];
    console.log('New lead added successfully');
    
    return newLead;
  } catch (error) {
    console.error('Error adding lead:', error);
    throw error;
  }
};

// Function to delete a lead
export const deleteLead = async (leadId: string): Promise<void> => {
  console.log('Deleting lead from service:', leadId);
  // Simulate API delay
  await delay(600);
  
  try {
    // In a real implementation, you would delete from the Google Sheet
    // For now, delete from the cached data
    const index = currentLeads.findIndex(l => l.id === leadId);
    
    if (index === -1) {
      throw new Error(`Lead with ID ${leadId} not found`);
    }
    
    currentLeads = [...currentLeads.slice(0, index), ...currentLeads.slice(index + 1)];
    console.log('Lead deleted successfully');
  } catch (error) {
    console.error('Error deleting lead:', error);
    throw error;
  }
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

// Helper function to get sample leads (used only as fallback if API fails)
function getSampleLeads(): Lead[] {
  return [
    {
      id: "lead-1",
      fullName: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 555-123-4567",
      source: "Website",
      associate: "Sarah Johnson",
      status: "Hot",
      stage: "Trial Scheduled",
      createdAt: "2023-09-15",
      center: "Downtown Center",
      remarks: "Interested in yoga classes, scheduled for trial on Saturday"
    },
    {
      id: "lead-2",
      fullName: "Emily Wong",
      email: "emily.wong@example.com",
      phone: "+1 555-987-6543",
      source: "Referral",
      associate: "Mike Chen",
      status: "Warm",
      stage: "Initial Contact",
      createdAt: "2023-09-10",
      center: "Westside Location",
      remarks: "Referred by existing member, looking for evening classes"
    }
  ];
}
