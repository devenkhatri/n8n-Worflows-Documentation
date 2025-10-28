import { Workflow } from '../types';

// --- Data Transformation ---
const parseRowsToWorkflows = (rows: string[][], sheetId: string): Workflow[] => {
  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map(h => h.trim());
  const dataRows = rows.slice(1);

  const headerIndexMap: { [key: string]: number } = {};
  headers.forEach((header, index) => {
      const key = header.charAt(0).toLowerCase() + header.slice(1).replace(/\s+/g, '');
      headerIndexMap[key] = index;
  });
  
  const requiredKeys = ['title', 'description', 'tags'];
  for (const key of requiredKeys) {
      if (headerIndexMap[key] === undefined) {
          throw new Error(`Missing required column in Google Sheet: ${key.charAt(0).toUpperCase() + key.slice(1)}`);
      }
  }

  return dataRows.map((row, index) => {
    const getValue = (key: string) => row[headerIndexMap[key]] || '';
    const tagsRaw = getValue('tags');

    return {
      id: `${sheetId}-${index}`,
      title: getValue('title'),
      description: getValue('description'),
      inputDetails: getValue('inputDetails'),
      processSummary: getValue('processSummary'),
      outputDetails: getValue('outputDetails'),
      workflowUrl: getValue('workflowUrl'),
      markdownUrl: getValue('markdownUrl'),
      workflowJson: getValue('workflowJson'),
      tags: tagsRaw ? tagsRaw.split(',').map(tag => tag.trim()).filter(Boolean) : [],
    };
  }).filter(workflow => workflow.title);
};


// --- API Fetching ---
export const fetchWorkflows = async (sheetId: string, sheetName: string, apiKey: string): Promise<Workflow[]> => {
  if (!apiKey) {
    throw new Error("Configuration Error: The Google API Key is missing. Please provide it on the settings page.");
  }
  if (!sheetId) {
    throw new Error("Configuration Error: The Google Sheet ID is missing. Please provide it on the settings page.");
  }
  if (!sheetName) {
    throw new Error("Configuration Error: The Sheet Name is missing. Please provide it on the settings page.");
  }

  const sheetRange = `${sheetName}!A:J`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetRange}?key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      const message = errorData?.error?.message || 'Unknown API error.';
      console.error("Google Sheets API Error Response:", errorData);
      throw new Error(
        `Google Sheets API Error: ${message} (Status: ${response.status}).\n\nPlease check the following:\n1. Is your API Key correct and valid?\n2. Is the Google Sheets API enabled in your Google Cloud project?\n3. Is the Google Sheet ID ('${sheetId}') correct?\n4. Is your Google Sheet shared publicly ('Anyone with the link can view')?`
      );
    }

    const data = await response.json();
    const rows: string[][] = data.values;

    if (!rows || rows.length === 0) {
      console.warn('Google Sheet returned no data.');
      return [];
    }
    
    return parseRowsToWorkflows(rows, sheetId);

  } catch (error) {
    console.error("Error fetching or parsing workflow data:", error);
    if (error instanceof Error) {
        throw error; // Re-throw the detailed error from the try block or the initial config checks.
    }
    throw new Error("A network error occurred while fetching workflow data. Please check your internet connection.");
  }
};