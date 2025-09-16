# Buyer Lead Intake System

A Next.js-based web application designed for real estate lead management, specifically for tracking potential property buyers. The application features user authentication, lead management, and reporting capabilities with specific optimizations for mobile devices including Redmi.

## ✨ Features

### User Authentication
- Email/password and OAuth authentication
- Biometric authentication (fingerprint/face unlock) for mobile devices
- Role-based access control
- Session management with device-specific sessions
- Offline authentication support

### Lead Management
- Mobile-optimized interface with touch support
- Offline-first data collection with sync capabilities
- Camera integration for document scanning (Aadhar, PAN, etc.)
- GPS location tagging for property visits
- Voice notes for quick lead updates
- Track lead status through sales funnel (New → Qualified → Contacted → Converted/Dropped)
- Add notes and tags to leads

### Property Management
- Barcode/QR code scanning for property listings
- Augmented Reality (AR) property viewing
- 360° virtual tours
- Offline property catalog with media caching

### Data Visualization & Reporting
- Interactive dashboards with Recharts
- Exportable reports in multiple formats
- Custom report generation
- Performance analytics

### Mobile-Specific Features
- Push notifications for lead updates
- SMS integration for OTP and alerts
- Call logging integration
- Battery-optimized background sync
- Data saver mode for limited connectivity
- Redmi device optimizations

## 📁 Project Structure

```
/buyer-lead-intake
├── /prisma
│   └── schema.prisma         # Database schema and models
├── /public                   # Static files
├── /src
│   ├── /app                  # App Router pages and routes
│   │   ├── /api              # API routes
│   │   ├── /auth             # Authentication pages
│   │   ├── /buyers           # Buyer management pages
│   │   ├── /dashboard        # Dashboard page
│   │   ├── /profile          # User profile page
│   │   └── /settings         # Application settings
│   ├── /components           # Reusable UI components
│   │   ├── /buyers           # Buyer-related components
│   │   ├── /layout           # Layout components
│   │   └── /ui               # Base UI components
│   ├── /lib                  # Utility functions and configs
│   └── /styles               # Global styles and themes
├── .env.example             # Example environment variables
├── package.json             # Project dependencies
└── README.md                # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database
- Google OAuth credentials (for authentication)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/buyer-lead-intake.git
   cd buyer-lead-intake
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. Set up environment variables:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/buyer_leads"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Frontend**: Next.js 13+ (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom theming and mobile-first responsive design
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **State Management**: React Query (TanStack Query) with offline capabilities
- **Form Handling**: React Hook Form with Zod validation
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with multiple providers
- **Visualization**: Recharts with touch interaction support
- **Mobile Features**: PWA support, device APIs, offline functionality
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📝 Data Model

### Core Entities
- **Users**: System users/agents with device information
- **Buyers**: Potential property buyers with contact details and preferences
- **Properties**: Detailed property listings with media
- **Visits**: Property visit tracking with GPS and timestamps
- **History**: Audit trail of changes with device info
- **Media**: Optimized image/video storage for mobile

### Enumerated Types
- **Cities**: Chandigarh, Mohali, Zirakpur, Panchkula, Other
- **Property Types**: Apartment, Villa, Plot, Office, Retail
- **BHK**: Studio, 1-4 BHK
- **Purpose**: Buy/Rent
- **Timeline**: 0-3 months, 3-6 months, 6+ months, Exploring
- **Source**: Website, Referral, Walk-in, Call, SMS, WhatsApp, Other
- **Status**: New, Qualified, Contacted, Visited, Negotiation, Converted, Dropped

## 🚀 Deployment

### GitHub Setup

1. Create a new repository on GitHub
2. Initialize git in your project (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Add the remote repository:
   ```bash
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

### Vercel Deployment

1. Sign in to [Vercel](https://vercel.com) with your GitHub account
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build` or `yarn build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install` or `yarn`
5. Add Environment Variables (from `.env.example`)
6. Click "Deploy"

### Required Environment Variables

Make sure to set these in your Vercel project settings:

- `DATABASE_URL` - Your PostgreSQL connection string
- `NEXTAUTH_SECRET` - A secure random string (can generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL` - Your production URL (e.g., `https://your-app.vercel.app`)
- `GOOGLE_CLIENT_ID` - For Google OAuth
- `GOOGLE_CLIENT_SECRET` - For Google OAuth
- `EMAIL_*` - If using email authentication

### Database Setup

1. Set up a PostgreSQL database (e.g., Supabase, Railway, or Vercel Postgres)
2. Run migrations in production:
   ```bash
   npx prisma migrate deploy
   ```
3. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

## 🚀 Performance Optimizations

- Image optimization for mobile displays
- Adaptive loading based on device capabilities
- Memory management for low-end devices
- Network-aware data fetching
- Service workers for offline functionality
- Code splitting and lazy loading

## 🔒 Security Features

- Biometric data handling
- Secure local storage
- Encrypted offline data
- Remote wipe capability
- Regular security audits
- Rate limiting and DDoS protection

## 🧪 Testing

Run the test suite:

```bash
npm test
# or
yarn test
# or
pnpm test
```

## 🚀 Deployment

1. Set up a production database
2. Configure environment variables in your hosting platform
3. Build the application:
   ```bash
   npm run build
   ```
4. Start the production server:
   ```bash
   npm start
   ```

### Vercel Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fbuyer-lead-intake&env=DATABASE_URL,NEXTAUTH_SECRET,NEXTAUTH_URL,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET&envDescription=Required%20environment%20variables%20for%20the%20application&envLink=https%3A%2F%2Fgithub.com%2Fyourusername%2Fbuyer-lead-intake%2Fblob%2Fmain%2F.env.example&project-name=buyer-lead-intake&repository-name=buyer-lead-intake)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) to get started.

## 📧 Contact

For any questions or feedback, please open an issue on GitHub.
