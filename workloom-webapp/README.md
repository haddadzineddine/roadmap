# WorkLoom - LinkedIn Mapping & Tracking Platform

A comprehensive SaaS platform for mapping, tracking, and analyzing LinkedIn profiles with advanced comparison features and CRM integration.

## 🚀 Features

### 🔐 Authentication & Security
- **NextAuth.js Integration**: Secure authentication with credentials provider
- **Protected Routes**: Middleware-based route protection
- **User Management**: Registration, login, logout with form validation

### 🗺️ Mapping System
- **Smart Criteria**: Filter by job title, country, and company
- **Status Management**: Track mapping states (Created, In Progress, Paused, Failed, Completed)
- **Automated Discovery**: Mock LinkedIn profile discovery and collection
- **Real-time Updates**: Live status updates and progress tracking

### 📊 Profile Management
- **LinkedIn Integration**: Store and manage LinkedIn profile data
- **Change Detection**: Monitor profile updates, job changes, and departures
- **Historical Tracking**: Maintain profile history and change logs
- **Bulk Operations**: Handle thousands of profiles efficiently

### 🔄 Tracking & Comparison
- **Monthly Runs**: Automated monthly re-execution of mappings
- **Change Analysis**: Detect new arrivals, departures, and job changes
- **Comparison Reports**: Side-by-side comparison of mapping results
- **Trend Analytics**: Track changes over time

### 🔗 External Account Management
- **Multi-Platform Support**: LinkedIn, Salesforce, HubSpot integration
- **Secure Credentials**: Encrypted credential storage
- **Account Linking**: Easy account connection and management
- **Status Monitoring**: Track account health and connectivity

### 📤 Export & Integration
- **Multiple Formats**: Excel (.xlsx) and CSV export
- **CRM Integration**: Direct API endpoints for CRM systems
- **Webhook Support**: Real-time updates to external systems
- **Custom Formatting**: Salesforce and HubSpot compatible formats

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Export**: XLSX library for Excel exports

## 🏗️ Project Structure

```
workloom/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── mappings/      # Mapping CRUD & operations
│   │   │   ├── accounts/      # External account management
│   │   │   └── crm/          # CRM integration endpoints
│   │   ├── auth/             # Authentication pages
│   │   ├── dashboard/        # Main dashboard
│   │   ├── mappings/         # Mapping management
│   │   ├── accounts/         # Account management
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── navbar.tsx        # Navigation component
│   │   ├── export-button.tsx # Export functionality
│   │   └── run-mapping-button.tsx # Run mapping component
│   └── lib/
│       ├── auth.ts           # NextAuth configuration
│       ├── prisma.ts         # Prisma client
│       └── utils.ts          # Utility functions
├── middleware.ts             # Route protection
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd workloom
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Configure environment variables**
   ```bash
   # .env file is already created with:
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage Guide

### 1. Authentication
- Visit the landing page and click "Get Started"
- Register a new account or sign in with existing credentials
- Access is protected - unauthenticated users are redirected to login

### 2. Creating Mappings
- Go to "Mappings" → "New Mapping"
- Set criteria: job title, company, country (all optional)
- Give your mapping a descriptive name
- Save to create the mapping

### 3. Running Mappings
- Click "Run Now" on any mapping
- The system will simulate LinkedIn profile discovery
- View results in real-time as they populate
- Check the "Run History" for previous executions

### 4. Managing Profiles
- View discovered profiles in the mapping detail page
- See profile information: name, job title, company, location
- Track when profiles were last seen
- Export data to Excel or CSV

### 5. External Accounts
- Connect LinkedIn, Salesforce, or HubSpot accounts
- Provide credentials (securely encrypted)
- Enable integrations for automated data sync
- Manage multiple accounts per platform

### 6. Exporting Data
- Use the Export button on mapping pages
- Choose Excel (.xlsx) or CSV format
- Files include all profile data with timestamps
- Perfect for importing into CRM systems

### 7. API Integration
- Access `/api/crm/contacts` for programmatic data access
- Support for Salesforce and HubSpot formats
- Pagination and filtering options
- Webhook support for real-time updates

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Mappings
- `GET /api/mappings` - List user mappings
- `POST /api/mappings` - Create new mapping
- `POST /api/mappings/[id]/run` - Execute mapping
- `GET /api/mappings/[id]/export` - Export mapping data

### External Accounts
- `GET /api/accounts` - List connected accounts
- `POST /api/accounts` - Connect new account

### CRM Integration
- `GET /api/crm/contacts` - Get contacts for CRM integration
- `POST /api/crm/contacts` - Configure webhooks

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Interface**: Clean, professional design using shadcn/ui
- **Real-time Updates**: Live status updates and progress indicators
- **Intuitive Navigation**: Clear information hierarchy and user flows
- **Accessibility**: WCAG compliant components and keyboard navigation

## 🔒 Security Features

- **Encrypted Credentials**: All external account credentials are encrypted
- **Route Protection**: Middleware-based authentication
- **Session Management**: Secure JWT-based sessions
- **Input Validation**: Zod schema validation on all inputs
- **SQL Injection Protection**: Prisma ORM with parameterized queries

## 🚦 Development

### Database Changes
```bash
# After modifying schema.prisma
npx prisma generate
npx prisma db push
```

### Adding UI Components
```bash
# Add new shadcn/ui components
npx shadcn@latest add [component-name]
```

### Running Tests
```bash
# Add your test commands here
npm test
```

## 📈 Future Enhancements

- Real LinkedIn API integration (requires LinkedIn partnership)
- Advanced analytics dashboard with charts
- Email notifications for profile changes
- Bulk import/export functionality
- Team collaboration features
- Advanced filtering and search
- Custom field mapping for CRM systems
- Automated report generation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@workloom.com or create an issue in the repository.

---

**WorkLoom** - Transform your LinkedIn networking strategy with intelligent mapping and tracking.