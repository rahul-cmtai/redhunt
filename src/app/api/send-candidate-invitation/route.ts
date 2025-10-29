import { NextRequest, NextResponse } from 'next/server';
import { emailService, CandidateInvitationData } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { candidateName, candidateEmail, employerName, position, offerDate } = body;
    
    if (!candidateName || !candidateEmail || !employerName || !position) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields: candidateName, candidateEmail, employerName, position' 
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(candidateEmail)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email format' 
        },
        { status: 400 }
      );
    }

    // Generate registration URL
    const registrationUrl = emailService.generateRegistrationUrl(candidateEmail);
    
    // Prepare email data
    const emailData: CandidateInvitationData = {
      candidateName,
      candidateEmail,
      employerName,
      position,
      offerDate,
      registrationUrl
    };

    // Send the email
    const emailSent = await emailService.sendCandidateInvitation(emailData);
    
    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: 'Candidate invitation email sent successfully',
        data: {
          candidateEmail,
          registrationUrl
        }
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to send email' 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending candidate invitation:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

