# n8n Workflow Explorer

A modern, responsive web application for exploring and documenting n8n workflows. This application provides an intuitive interface to browse, search, and view detailed information about your n8n workflows, with data sourced from a Google Sheet.

## Features

### 📱 Responsive Design
- Modern, clean interface that works on desktop and mobile devices
- Dark/Light mode support with system preference detection
- Grid and List view options for workflow browsing

### 🔍 Powerful Search & Filter
- Real-time search across workflow titles and descriptions
- Tag-based filtering with quick filters for popular tags
- Clear visual indication of active filters

### 📋 Workflow Management
- Detailed view for each workflow with:
  - Title and description
  - Input/Output details
  - Process summary
  - Tags
  - Direct links to workflow and documentation
- Interactive n8n workflow visualization
- Shareable URLs for direct access to workflow details

### ⚡ Performance & UX
- Pagination support (10/25/50/100/All items per page)
- Fast client-side filtering and sorting
- Loading states and smooth transitions
- Persistent view preferences

### 🔒 Configuration
- Google Sheets integration for data storage
- Environment variable support for easy deployment
- Local storage fallback for settings

## Setup & Configuration

### Prerequisites
- Node.js (version 16 or higher)
- Google Cloud Platform account with Sheets API enabled
- A Google Sheet containing workflow data

### Installation

1. Clone the repository:
```bash
git clone https://github.com/devenkhatri/n8n-Worflows-Documentation.git
cd n8n-Worflows-Documentation
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Google API credentials:
```env
VITE_GOOGLE_API_KEY=your_google_api_key
VITE_GOOGLE_SHEET_ID=your_sheet_id
VITE_GOOGLE_SHEET_NAME=Sheet1
```

### Google Sheet Structure

Your Google Sheet should have the following columns:
- `title`: Workflow title
- `description`: Brief description of the workflow
- `inputDetails`: Input parameters and requirements
- `processSummary`: Step-by-step process description
- `outputDetails`: Output format and details
- `workflowUrl`: URL to the n8n workflow
- `markdownUrl`: URL to additional documentation
- `workflowJson`: n8n workflow JSON for visualization
- `tags`: Comma-separated list of tags

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

Build the application:
```bash
npm run build
```

The built files will be in the `dist` directory.

### Deployment

#### Environment Variables

For production deployment, set these environment variables:

- `VITE_GOOGLE_API_KEY`: Your Google API key
- `VITE_GOOGLE_SHEET_ID`: ID of your Google Sheet
- `VITE_GOOGLE_SHEET_NAME`: Name of the sheet (default: 'Sheet1')

#### Netlify Deployment

1. Connect your repository to Netlify
2. Set the build command to: `npm run build`
3. Set the publish directory to: `dist`
4. Add your environment variables in the Netlify dashboard
5. Deploy!

The application includes a `netlify.toml` configuration for proper routing.

#### Other Platforms

Ensure your hosting platform:
1. Supports SPA routing (redirects to index.html)
2. Allows setting environment variables
3. Supports Node.js for the build process

## Configuration Options

### Local Storage (Manual Configuration)
If environment variables are not set, the application will prompt for:
- Google API Key
- Sheet ID
- Sheet Name

These settings are stored in the browser's local storage.

### Environment Variables (Automatic Configuration)
When environment variables are present, the application will:
- Automatically initialize
- Skip the settings page
- Start loading workflow data immediately

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
