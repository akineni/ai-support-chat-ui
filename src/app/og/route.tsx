import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width:          '100%',
          height:         '100%',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0f',
          fontFamily:     'sans-serif',
        }}
      >
        <div
          style={{
            width:           80,
            height:          80,
            borderRadius:    20,
            backgroundColor: '#6c63ff',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            marginBottom:    24,
          }}
        >
          <div style={{ color: 'white', fontSize: 40 }}>◆</div>
        </div>

        <div style={{
          fontSize:     64,
          fontWeight:   700,
          color:        '#f0f0f5',
          marginBottom: 16,
        }}>
          SupportAI
        </div>

        <div style={{
          fontSize:  28,
          color:     '#9090a8',
          textAlign: 'center',
          maxWidth:  700,
        }}>
          AI-Powered Customer Support Chat
        </div>

        <div style={{
          marginTop:       32,
          padding:         '12px 32px',
          borderRadius:    50,
          backgroundColor: 'rgba(108,99,255,0.2)',
          border:          '1px solid rgba(108,99,255,0.4)',
          color:           '#8b85ff',
          fontSize:        20,
        }}>
          Instant answers · Human escalation · Real-time
        </div>
      </div>
    ),
    {
      width:  1200,
      height: 630,
    }
  );
}