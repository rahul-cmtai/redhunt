// Email configuration for Red-Flagged platform
export const emailConfig = {
  // Development settings
  development: {
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    fromEmail: process.env.MAIL_FROM || 'noreply@red-flagged.com',
    frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'
  },
  
  // Production settings
  production: {
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: parseInt(process.env.SMTP_PORT || '587'),
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    fromEmail: process.env.MAIL_FROM || 'noreply@red-flagged.com',
    frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://red-flagged.com'
  }
};

// Get current environment configuration
export const getEmailConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction ? emailConfig.production : emailConfig.development;
};

// Email service providers configuration
export const emailProviders = {
  gmail: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  },
  
  sendgrid: {
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY
    }
  },
  
  aws_ses: {
    host: process.env.AWS_SES_HOST || 'email-smtp.us-east-1.amazonaws.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.AWS_SES_USER,
      pass: process.env.AWS_SES_PASS
    }
  }
};

// Email templates configuration
export const emailTemplates = {
  candidateInvitation: {
    subject: 'Job Offer Invitation - Red-Flagged Platform',
    from: 'Red-Flagged Platform <noreply@red-flagged.com>',
    replyTo: 'support@red-flagged.com'
  },
  
  emailVerification: {
    subject: 'Verify Your Email - Red-Flagged Platform',
    from: 'Red-Flagged Platform <noreply@red-flagged.com>',
    replyTo: 'support@red-flagged.com'
  }
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Email rate limiting (optional)
export const emailRateLimit = {
  maxEmailsPerHour: 100,
  maxEmailsPerDay: 1000
};

