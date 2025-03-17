import { debounce } from "@/lib/utils";
import Papa from 'papaparse';

// Google Sheets API configuration
const SPREADSHEET_ID = '1dQMNF69WnXVQdhlLvUZTig3kL97NA21k6eZ9HRu6xiQ';
const SHEET_NAME = '◉ Leads';
const SHEET_RANGE = `${SHEET_NAME}!A:AF`; // Extended range to include follow-ups (A to AF)

// OAuth credentials
const CLIENT_ID = '416630995185-007ermh3iidknbbtdmu5vct207mdlbaa.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REFRESH_TOKEN = '1//04MmvT_BibTsBCgYIARAAGAQSNwF-L9IrG9yxJvvQRMLPR39xzWSrqfTVMkvq3WcZqsDO2HjUkV6s7vo1pQkex4qGF3DITTiweAA';

// Token storage
let tokenData = {
  access_token: '',
  expires_in: 3599,
  expiration_time: 0
};

// Lead type definition based on the Google Sheet structure
export interface Lead {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  source: string;
  createdAt: string;
  associate: string;
  center: string;
  stage: string;
  status: string;
  remarks: string;
  followUp: string;
  lastContact: string;
  followUp1Date?: string;
  followUpComments1?: string;
  followUp2Date?: string;
  followUpComments2?: string;
  followUp3Date?: string;
  followUpComments3?: string;
  followUp4Date?: string;
  followUpComments4?: string;
  [key: string]: any; // For any additional fields
}

// Function to refresh access token
async function refreshAccessToken(): Promise<string> {
  const now = Date.now();
  
  // If token is still valid, return it
  if (tokenData.access_token && tokenData.expiration_time > now) {
    return tokenData.access_token;
  }
  
  try {
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: REFRESH_TOKEN,
        grant_type: 'refresh_token',
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Update token data
    tokenData = {
      access_token: data.access_token,
      expires_in: data.expires_in,
      expiration_time: now + (data.expires_in * 1000), // Convert to milliseconds
    };
    
    return tokenData.access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
}

// Map array data to lead objects
function mapRowsToLeads(rows: string[][]): Lead[] {
  if (!rows || rows.length < 2) {
    return [];
  }
  
  const headers = rows[0];
  
  return rows.slice(1).map((row, index) => {
    const lead: Record<string, any> = { id: `lead-${index}` };
    
    headers.forEach((header, i) => {
      const key = mapHeaderToKey(header);
      lead[key] = row[i] || '';
    });
    
    return lead as Lead;
  });
}

// Map header to camelCase keys
function mapHeaderToKey(header: string): string {
  // Custom mapping for known headers
  const headerMap: Record<string, string> = {
    'Full Name': 'fullName',
    'Created At': 'createdAt',
    'Last Contact': 'lastContact',
    'Follow Up': 'followUp',
    'Follow Up 1 Date': 'followUp1Date',
    'Follow Up Comments (1)': 'followUpComments1',
    'Follow Up 2 Date': 'followUp2Date',
    'Follow Up Comments (2)': 'followUpComments2',
    'Follow Up 3 Date': 'followUp3Date',
    'Follow Up Comments (3)': 'followUpComments3',
    'Follow Up 4 Date': 'followUp4Date',
    'Follow Up Comments (4)': 'followUpComments4',
  };
  
  if (headerMap[header]) {
    return headerMap[header];
  }
  
  // Convert to camelCase for other headers
  return header
    .toLowerCase()
    .replace(/\s+(.)/g, (_, char) => char.toUpperCase());
}

// Map lead object back to row array for updating
function mapLeadToRow(lead: Lead, headers: string[]): string[] {
  return headers.map(header => {
    const key = mapHeaderToKey(header);
    return lead[key] !== undefined ? String(lead[key]) : '';
  });
}

// Fetch all leads from Google Sheets
export async function fetchLeads(): Promise<Lead[]> {
  try {
    const accessToken = await refreshAccessToken();
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_RANGE}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const leads = mapRowsToLeads(data.values);
    
    // Store headers for later use when updating
    sessionStorage.setItem('sheet_headers', JSON.stringify(data.values[0]));
    
    return leads;
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
}

// Find the row index for a specific lead
async function findLeadRowIndex(leadId: string): Promise<number> {
  const leads = await fetchLeads();
  const index = leads.findIndex(lead => lead.id === leadId);
  
  if (index === -1) {
    throw new Error(`Lead with ID ${leadId} not found`);
  }
  
  // Add 2 because: 1 for zero-indexing to 1-indexing, and 1 for header row
  return index + 2;
}

// Update a lead in Google Sheets
export async function updateLead(lead: Lead): Promise<void> {
  try {
    const accessToken = await refreshAccessToken();
    const rowIndex = await findLeadRowIndex(lead.id);
    
    // Get headers
    const headersJson = sessionStorage.getItem('sheet_headers');
    if (!headersJson) {
      throw new Error('Sheet headers not found in session storage');
    }
    
    const headers = JSON.parse(headersJson) as string[];
    const rowData = mapLeadToRow(lead, headers);
    
    // Update the specific row
    const updateRange = `${SHEET_NAME}!A${rowIndex}:${String.fromCharCode(65 + headers.length - 1)}${rowIndex}`;
    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${updateRange}?valueInputOption=RAW`;
    
    const response = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowData],
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error updating lead:', error);
    throw error;
  }
}

// Add a new lead to the Google Sheet
export async function addLead(lead: Lead): Promise<void> {
  try {
    const accessToken = await refreshAccessToken();
    
    // Get headers
    const headersJson = sessionStorage.getItem('sheet_headers');
    if (!headersJson) {
      throw new Error('Sheet headers not found in session storage');
    }
    
    const headers = JSON.parse(headersJson) as string[];
    const rowData = mapLeadToRow(lead, headers);
    
    // Append to the end of the sheet
    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:A:append?valueInputOption=RAW`;
    
    const response = await fetch(appendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowData],
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error adding lead:', error);
    throw error;
  }
}

// Delete a lead from the Google Sheet
export async function deleteLead(leadId: string): Promise<void> {
  try {
    const accessToken = await refreshAccessToken();
    const rowIndex = await findLeadRowIndex(leadId);
    
    // Delete the specific row
    const batchUpdateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`;
    
    const response = await fetch(batchUpdateUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // Assuming the sheet ID is 0
                dimension: 'ROWS',
                startIndex: rowIndex - 1, // 0-indexed in the API
                endIndex: rowIndex, // Exclusive end
              },
            },
          },
        ],
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting lead:', error);
    throw error;
  }
}

// Batch update leads (for efficiency when updating multiple rows)
export async function batchUpdateLeads(leads: Lead[]): Promise<void> {
  try {
    const accessToken = await refreshAccessToken();
    
    // Get headers
    const headersJson = sessionStorage.getItem('sheet_headers');
    if (!headersJson) {
      throw new Error('Sheet headers not found in session storage');
    }
    
    const headers = JSON.parse(headersJson) as string[];
    
    // Prepare data
    const requests = await Promise.all(
      leads.map(async lead => {
        const rowIndex = await findLeadRowIndex(lead.id);
        const rowData = mapLeadToRow(lead, headers);
        
        return {
          updateCells: {
            start: {
              sheetId: 0, // Assuming the sheet ID is 0
              rowIndex: rowIndex - 1, // Convert to 0-indexed
              columnIndex: 0,
            },
            rows: [
              {
                values: rowData.map(value => ({
                  userEnteredValue: { stringValue: value },
                })),
              },
            ],
            fields: 'userEnteredValue',
          },
        };
      })
    );
    
    // Send batch update
    const batchUpdateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`;
    
    const response = await fetch(batchUpdateUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error batch updating leads:', error);
    throw error;
  }
}

// Import leads from CSV
export async function importLeadsFromCSV(
  csvData: string,
  columnMapping: Record<string, string>
): Promise<void> {
  try {
    // Parse the CSV data using PapaParse
    const parsedData = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });
    
    if (parsedData.errors && parsedData.errors.length > 0) {
      console.error('CSV parsing errors:', parsedData.errors);
      throw new Error('Error parsing CSV: ' + parsedData.errors[0].message);
    }
    
    const rows = parsedData.data as Record<string, string>[];
    
    // Transform CSV data according to column mapping
    const transformedLeads = rows.map(row => {
      const lead: Record<string, any> = {};
      
      Object.entries(columnMapping).forEach(([csvCol, sheetCol]) => {
        if (row[csvCol] !== undefined) {
          lead[mapHeaderToKey(sheetCol)] = row[csvCol];
        }
      });
      
      return lead as Lead;
    });
    
    // Add each lead
    for (const lead of transformedLeads) {
      await addLead(lead);
    }
  } catch (error) {
    console.error('Error importing leads from CSV:', error);
    throw error;
  }
}

// Send follow-up email reminder
export async function sendReminderEmail(
  email: string,
  subject: string,
  message: string
): Promise<void> {
  try {
    const accessToken = await refreshAccessToken();
    
    // Gmail API endpoint for sending messages
    const apiUrl = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';
    
    // Create email in RFC 2822 format
    const emailLines = [
      `To: ${email}`,
      'Content-Type: text/html; charset=utf-8',
      `Subject: ${subject}`,
      '',
      message,
    ];
    
    const emailContent = emailLines.join('\r\n');
    
    // Encode the email in base64url format as required by Gmail API
    const base64EncodedEmail = btoa(emailContent)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: base64EncodedEmail,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error sending reminder email:', error);
    throw error;
  }
}

// Create a debounced version of updateLead to prevent too many API calls
export const debouncedUpdateLead = debounce(updateLead, 1000);
