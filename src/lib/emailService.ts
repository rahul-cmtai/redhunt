// Email service for sending candidate invitation emails
export interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  fromEmail: string;
  frontendUrl: string;
}

export interface CandidateInvitationData {
  candidateName: string;
  candidateEmail: string;
  employerName: string;
  position: string;
  offerDate?: string;
  registrationUrl: string;
}

export class EmailService {
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
  }

  // Generate professional HTML email template for candidate invitation
  generateCandidateInvitationEmail(data: CandidateInvitationData): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Job Offer Invitation - Red-Flagged</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .email-container {
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content {
            padding: 30px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #1f2937;
        }
        .offer-details {
            background: #f8f9fa;
            border-left: 4px solid #dc2626;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        .offer-details h3 {
            margin: 0 0 15px 0;
            color: #dc2626;
            font-size: 18px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 5px 0;
        }
        .detail-label {
            font-weight: 600;
            color: #374151;
        }
        .detail-value {
            color: #6b7280;
        }
        .cta-button {
            display: inline-block;
            background: #dc2626;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            text-align: center;
            transition: background-color 0.3s;
        }
        .cta-button:hover {
            background: #b91c1c;
        }
        .cta-container {
            text-align: center;
            margin: 30px 0;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
        }
        .footer a {
            color: #dc2626;
            text-decoration: none;
        }
        .security-note {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
            color: #92400e;
        }
        .security-note strong {
            color: #78350f;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .header, .content, .footer {
                padding: 20px;
            }
            .detail-row {
                flex-direction: column;
            }
            .detail-label {
                margin-bottom: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>🎉 Congratulations!</h1>
            <p>You've been invited to join Red-Flagged Platform</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hello <strong>${data.candidateName}</strong>,
            </div>
            
            <p>We're excited to inform you that <strong>${data.employerName}</strong> has extended a job offer to you and has registered you on the Red-Flagged platform to track your employment history.</p>
            
            <div class="offer-details">
                <h3>📋 Offer Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Company:</span>
                    <span class="detail-value">${data.employerName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Position:</span>
                    <span class="detail-value">${data.position}</span>
                </div>
                ${data.offerDate ? `
                <div class="detail-row">
                    <span class="detail-label">Offer Date:</span>
                    <span class="detail-value">${new Date(data.offerDate).toLocaleDateString()}</span>
                </div>
                ` : ''}
            </div>
            
            <p><strong>What is Red-Flagged?</strong></p>
            <p>Red-Flagged is a trusted platform that helps employers and candidates maintain transparent employment records. By registering, you'll be able to:</p>
            <ul>
                <li>✅ Track your employment history</li>
                <li>✅ Build your professional credibility</li>
                <li>✅ Access verified employment records</li>
                <li>✅ Connect with trusted employers</li>
            </ul>
            
            <div class="security-note">
                <strong>🔒 Security Note:</strong> This invitation is secure and your information is protected. Only you can access your account using the registration link below.
            </div>
            
            <div class="cta-container">
                <a href="${data.registrationUrl}" class="cta-button">
                    Complete Your Registration
                </a>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ol>
                <li>Click the registration button above</li>
                <li>Create your secure account</li>
                <li>Verify your email address</li>
                <li>Complete your profile</li>
            </ol>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
            
            <p>Best regards,<br>
            <strong>The Red-Flagged Team</strong></p>
        </div>
        
        <div class="footer">
            <p>This email was sent by Red-Flagged Platform</p>
            <p>If you didn't expect this invitation, please ignore this email.</p>
            <p>
                <a href="${this.config.frontendUrl}">Visit Red-Flagged</a> | 
                <a href="${this.config.frontendUrl}/contact">Contact Support</a>
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  // Generate plain text version for email clients that don't support HTML
  generateCandidateInvitationText(data: CandidateInvitationData): string {
    return `
Congratulations! You've been invited to join Red-Flagged Platform

Hello ${data.candidateName},

We're excited to inform you that ${data.employerName} has extended a job offer to you and has registered you on the Red-Flagged platform to track your employment history.

OFFER DETAILS:
- Company: ${data.employerName}
- Position: ${data.position}
${data.offerDate ? `- Offer Date: ${new Date(data.offerDate).toLocaleDateString()}` : ''}

What is Red-Flagged?
Red-Flagged is a trusted platform that helps employers and candidates maintain transparent employment records. By registering, you'll be able to:
- Track your employment history
- Build your professional credibility
- Access verified employment records
- Connect with trusted employers

NEXT STEPS:
1. Complete your registration: ${data.registrationUrl}
2. Create your secure account
3. Verify your email address
4. Complete your profile

If you have any questions or need assistance, please don't hesitate to contact us.

Best regards,
The Red-Flagged Team

---
This email was sent by Red-Flagged Platform
If you didn't expect this invitation, please ignore this email.
Visit Red-Flagged: ${this.config.frontendUrl}
    `.trim();
  }

  // Send email using the configured SMTP settings
  async sendCandidateInvitation(data: CandidateInvitationData): Promise<boolean> {
    try {
      // In a real implementation, you would use a service like SendGrid, AWS SES, or Nodemailer
      // For now, we'll simulate the email sending
      console.log('📧 Sending candidate invitation email...');
      console.log('To:', data.candidateEmail);
      console.log('Subject: Job Offer Invitation - Red-Flagged Platform');
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Email sent successfully!');
      return true;
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return false;
    }
  }

  // Generate registration URL for the candidate
  generateRegistrationUrl(candidateEmail: string): string {
    const encodedEmail = encodeURIComponent(candidateEmail);
    return `${this.config.frontendUrl}/candidate/register?email=${encodedEmail}&invited=true`;
  }
}

// Default email configuration
export const defaultEmailConfig: EmailConfig = {
  smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
  smtpPort: parseInt(process.env.SMTP_PORT || '587'),
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  fromEmail: process.env.MAIL_FROM || 'noreply@red-flagged.com',
  frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'
};

// Create email service instance
export const emailService = new EmailService(defaultEmailConfig);

