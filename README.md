# RedHunt - Verify Before You Hire

RedHunt is a B2B verification platform that lets employers track candidates who accept offers but fail to join — helping companies hire smarter and avoid repeated no-shows.

## 🚀 Features

### Landing Page
- **Hero Section**: Clear value proposition with interactive dashboard mockup
- **How It Works**: 3-step process explanation
- **Benefits Section**: Key advantages for employers
- **Trust Indicators**: Security and verification messaging

### Employer Panel
- **Dashboard**: Overview with key metrics and quick actions
- **Add Candidate**: Comprehensive form for logging candidate records
- **Verify Candidate**: Search functionality to check candidate history
- **Reports & Analytics**: Hiring insights and trend analysis
- **Company Profile**: Account management and settings

### Admin Panel
- **System Overview**: Key metrics and system health monitoring
- **Employer Management**: Account approval, suspension, and monitoring
- **Candidate Database**: Master records with filtering and search
- **Analytics**: Comprehensive reporting and system insights
- **Notifications**: System alerts and important updates

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **UI Components**: Headless UI
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx              # Root layout with metadata
│   ├── demo/
│   │   └── page.tsx           # Interactive demo page
│   ├── employer/
│   │   ├── login/
│   │   │   └── page.tsx       # Employer login
│   │   └── dashboard/
│   │       └── page.tsx       # Employer dashboard
│   └── admin/
│       ├── login/
│       │   └── page.tsx       # Admin login
│       └── dashboard/
│           └── page.tsx       # Admin console
├── components/                # Reusable components (future)
└── lib/                      # Utilities (future)
```

## 🎨 Design System

### Colors
- **Primary**: Red (#DC2626) - Trust and urgency
- **Secondary**: Gray scale for text and backgrounds
- **Accent**: Green for success, Yellow for warnings

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, clear hierarchy
- **Body**: Readable, professional

### Components
- **Cards**: Clean, shadowed containers
- **Buttons**: Consistent styling with hover states
- **Forms**: Accessible inputs with validation styling
- **Tables**: Responsive data display

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd redhunt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📱 Pages Overview

### Landing Page (`/`)
- Hero section with value proposition
- How it works (3 steps)
- Benefits and features
- Trust indicators and footer

### Demo Page (`/demo`)
- Interactive candidate search
- Live demonstration of features
- Sample data and results
- Call-to-action sections

### Employer Login (`/employer/login`)
- Secure login form
- Company email authentication
- Password visibility toggle
- Registration link

### Employer Dashboard (`/employer/dashboard`)
- **Dashboard Tab**: Overview with metrics and quick actions
- **Add Candidate Tab**: Comprehensive form for logging offers
- **Verify Candidate Tab**: Search and verification interface
- **Reports Tab**: Analytics and insights
- **Profile Tab**: Company settings and API management

### Admin Login (`/admin/login`)
- Secure admin authentication
- Enhanced security messaging
- Support contact options

### Admin Dashboard (`/admin/dashboard`)
- **Dashboard Tab**: System overview and health monitoring
- **Employers Tab**: Account management and approval
- **Candidates Tab**: Master database with filtering
- **Reports Tab**: System analytics and insights
- **Notifications Tab**: System alerts and updates

## 🔒 Security Features

- **Data Encryption**: All candidate data is encrypted
- **Access Control**: Role-based authentication
- **Audit Logging**: All activities are tracked
- **Secure APIs**: Protected endpoints for data access

## 📊 Key Metrics Tracked

### Employer Metrics
- Total candidates added
- Non-joining cases
- Verified records
- Company trust score

### System Metrics
- Total employers
- Total candidates
- Verified records
- Pending verifications

### Analytics
- Offer acceptance rates
- Non-joining percentages
- Industry-specific trends
- Monthly joining patterns

## 🎯 Target Audience

- **HR Teams**: Looking to improve hiring efficiency
- **Recruitment Agencies**: Managing multiple clients
- **Startups**: Building reliable hiring processes
- **Enterprise**: Large-scale recruitment operations

## 📈 Business Value

- **Reduce No-Shows**: Prevent repeated offer dropouts
- **Save Costs**: Avoid wasted recruitment efforts
- **Build Trust**: Verified employer data network
- **Data-Driven**: Analytics for better decisions

## 🔮 Future Enhancements

- **API Integration**: RESTful APIs for third-party integration
- **Mobile App**: Native mobile applications
- **Advanced Analytics**: Machine learning insights
- **Integration Hub**: Connect with ATS systems
- **Real-time Notifications**: Instant alerts and updates

## 📞 Support

For technical support or business inquiries:
- **Email**: support@redhunt.com
- **Phone**: +91-XXXX-XXXXXX
- **Website**: [redhunt.com](https://redhunt.com)

## 📄 License

© 2025 RedHunt Technologies Pvt. Ltd. All rights reserved.

---

**RedHunt** - *Transparency. Trust. Talent.*