export default function TestLotteries() {
  return (
    <div style={{ padding: "20px", backgroundColor: "#f0f0f0", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "32px", color: "#333", textAlign: "center" }}>
        🎲 PÁGINA DE LOTERÍAS FUNCIONANDO
      </h1>
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h2 style={{ color: "#666" }}>✅ La navegación está funcionando correctamente</h2>
        <p style={{ fontSize: "18px", margin: "20px 0" }}>
          Si puedes ver esta página, significa que el problema anterior ha sido resuelto.
        </p>
        <div style={{ 
          border: "2px solid #4CAF50", 
          borderRadius: "8px", 
          padding: "20px", 
          backgroundColor: "white", 
          margin: "20px auto", 
          maxWidth: "600px" 
        }}>
          <h3 style={{ color: "#4CAF50" }}>Próximos pasos:</h3>
          <p>Una vez confirmado que esta página se carga, restauraremos la página completa de loterías.</p>
        </div>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          style={{
            backgroundColor: "#2196F3",
            color: "white",
            padding: "12px 24px",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "20px"
          }}
        >
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
}