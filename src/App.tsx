import { Building2, ShieldCheck, HelpCircle } from 'lucide-react';
import { TarjetaTramite } from './components/TarjetaTramite';

export function App() {
  return (
    <div className="app-container">
      {/* Barra superior gubernamental */}
      <div className="top-bar-institucional">
        <div className="top-bar-branding">
          <Building2 size={16} />
          <span>Gobierno Municipal • Atención Ciudadana</span>
        </div>
        <span className="top-bar-badge">Portal Oficial</span>
      </div>

      {/* Encabezado Institucional Principal */}
      <header className="header-institucional">
        <div className="header-content">
          <div className="institucion-badge">
            <ShieldCheck size={16} />
            <span>Ventanilla Única de Atención</span>
          </div>

          <h1 className="header-title">
            Portal Institucional de Servicios y Trámites
          </h1>

          <p className="header-subtitle">
            Sistema de consulta, reportes y atención directa para los servicios comunitarios y municipales.
          </p>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="main-content">
        {/* Encabezado de Sección: Respuestas */}
        <section className="seccion-respuestas">
          <div className="seccion-titulo-container">
            <div className="seccion-titulo-bar"></div>
            <h2 className="seccion-titulo">Respuestas</h2>
          </div>
          <p className="seccion-descripcion">
            Seleccione una de las categorías principales para obtener respuesta inmediata a reportes, consultar horarios o solicitar atención técnica municipal.
          </p>
        </section>

        {/* Grilla de 3 Tarjetas de Trámite */}
        <section className="grid-tarjetas" aria-label="Tarjetas de trámites y respuestas">
          {/* Tarjeta 1: Agua y Alcantarillado */}
          <TarjetaTramite
            titulo="Agua y Alcantarillado"
            descripcion="Reporte e información sobre fugas de agua en la red pública, aviso de cortes del suministro y mantenimiento del sistema de alcantarillado municipal."
            categoria="Servicios Básicos"
          />

          {/* Tarjeta 2: Recolección de Basura */}
          <TarjetaTramite
            titulo="Recolección de Basura"
            descripcion="Consulta de rutas y horarios oficiales de recolección, reporte de acumulación inusual de residuos y atención prioritaria a puntos críticos."
            categoria="Limpia y Medio Ambiente"
          />

          {/* Tarjeta 3: Alumbrado Público */}
          <TarjetaTramite
            titulo="Alumbrado Público"
            descripcion="Atención a reportes de lámparas apagadas o deficientes, mantenimiento preventivo de luminarias y reparación de postes caídos o dañados."
            categoria="Infraestructura Urbana"
          />
        </section>

        {/* Bloque informativo secundario */}
        <div 
          style={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid #e2e8f0', 
            borderRadius: '12px', 
            padding: '1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <HelpCircle size={32} color="#003399" style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ color: '#003399', fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>
              ¿Necesitas apoyo adicional con tu trámite?
            </h4>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Puedes comunicarte a la línea gratuita de atención ciudadana municipal 01-800-RESPUESTA las 24 horas.
            </p>
          </div>
        </div>
      </main>

      {/* Pie de página institucional */}
      <footer className="footer-institucional">
        <div className="footer-content">
          <p className="footer-branding">Gobierno Municipal • Portal de Respuestas Ciudadanas</p>
          <p>© 2026 Todos los derechos reservados. Plataforma de Atención Pública.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
