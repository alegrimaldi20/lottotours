import { useEffect } from "react";

export default function LotteryRedirect() {
  useEffect(() => {
    // Force immediate redirect
    window.location.replace('/lotteries');
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: '24px', 
          marginBottom: '16px',
          color: '#333'
        }}>
          Redirecting to Lotteries...
        </div>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #e3e3e3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}></div>
      </div>
    </div>
  );
}