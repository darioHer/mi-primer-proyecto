import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  User, 
  Building, 
  CheckCircle2, 
  Droplets, 
  Trash2, 
  Lightbulb, 
  MessageSquare,
  QrCode,
  FileCheck2,
  Share2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import type { PQRSItem } from './ConsultasPage';

export interface DetalleConsultaPageProps {
  id?: string;
  onBack?: () => void;
  itemData?: PQRSItem | null;
}

export const DetalleConsultaPage: React.FC<DetalleConsultaPageProps> = ({
  id,
  onBack,
  itemData
}) => {
  const [pqrs, setPqrs] = useState<PQRSItem | null>(itemData || null);
  const [loading, setLoading] = useState<boolean>(!itemData && !!id);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Fetch item by id if not directly passed as itemData
  useEffect(() => {
    if (itemData) {
      setPqrs(itemData);
      setLoading(false);
      return;
    }

    const radicadoId = id || 'PQRS-2026-001'; // Default fallback or ID 1

    const fetchSinglePqrs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/pqrs');
        if (!response.ok) {
          throw new Error(`Servidor devolvió estado HTTP ${response.status}`);
        }
        const data: PQRSItem[] = await response.json();
        // Match by exact ID or numeric index (e.g. '1' matches first item)
        const found = data.find(
          item => item.id.toLowerCase() === radicadoId.toLowerCase() ||
                  item.id.endsWith(radicadoId.padStart(3, '0')) ||
                  (radicadoId === '1' && item.id.endsWith('-001'))
        ) || data[0];

        if (found) {
          setPqrs(found);
        } else {
          setError(`No se encontró la ficha técnica para el radicado "${radicadoId}".`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la ficha técnica.');
      } finally {
        setLoading(false);
      }
    };

    fetchSinglePqrs();
  }, [id, itemData]);

  // Copy link handler
  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Helper for category icon
  const getCategoryIcon = (categoria: string) => {
    const lower = categoria.toLowerCase();
    if (lower.includes('agua')) return <Droplets size={20} />;
    if (lower.includes('basura')) return <Trash2 size={20} />;
    if (lower.includes('alumbrado')) return <Lightbulb size={20} />;
    return <Building size={20} />;
  };

  if (loading) {
    return (
      <div className="state-container state-loading" style={{ minHeight: '350px' }}>
        <Loader2 className="spinner-icon" size={48} />
        <h3 className="state-title">Cargando Ficha Técnica del Radicado...</h3>
        <p className="state-description">Obteniendo detalles oficiales de la base de datos municipal.</p>
      </div>
    );
  }

  if (error || !pqrs) {
    return (
      <div className="state-container state-error" style={{ minHeight: '350px' }}>
        <AlertCircle className="error-icon" size={52} />
        <h3 className="state-title">Radicado No Encontrado</h3>
        <p className="state-description">{error || 'El número de radicado especificado no existe en el sistema.'}</p>
        {onBack && (
          <button className="btn-retry" onClick={onBack} style={{ backgroundColor: 'var(--azul-institucional)' }}>
            <ArrowLeft size={18} />
            <span>Volver a Consultas</span>
          </button>
        )}
      </div>
    );
  }

  const isResuelto = pqrs.estado === 'Resuelto';

  return (
    <div className="detalle-container">
      {/* Botones Superior de Navegación y Acciones */}
      <div className="detalle-nav-bar">
        {onBack && (
          <button className="btn-volver" onClick={onBack} type="button">
            <ArrowLeft size={18} />
            <span>Volver a Consultas</span>
          </button>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto' }}>
          <button className="btn-copiar-enlace" onClick={handleCopyLink} type="button">
            {copied ? <Check size={18} color="#10b981" /> : <Copy size={18} />}
            <span>{copied ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
          </button>
        </div>
      </div>

      {/* Card Ficha Técnica Principal */}
      <article className="ficha-tecnica-card">
        {/* Header Ficha Técnica */}
        <div className="ficha-header">
          <div className="ficha-header-left">
            <div className="ficha-escudo-badge">
              <ShieldCheck size={20} />
              <span>Ficha Técnica Oficial • Gobierno Municipal</span>
            </div>
            <h2 className="ficha-radicado-id">{pqrs.id}</h2>
          </div>

          <div className="ficha-header-right">
            <span className={`estado-badge ${isResuelto ? 'estado-resuelto' : 'estado-tramite'}`} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              {isResuelto ? <CheckCircle2 size={16} /> : <Clock size={16} />}
              {pqrs.estado}
            </span>
          </div>
        </div>

        {/* Rejilla de Información Técnica */}
        <div className="ficha-meta-grid">
          <div className="ficha-meta-item">
            <span className="meta-label">Solicitante:</span>
            <span className="meta-value">
              <User size={16} color="var(--azul-institucional)" />
              {pqrs.solicitante}
            </span>
          </div>

          <div className="ficha-meta-item">
            <span className="meta-label">Categoría del Servicio:</span>
            <span className="meta-value">
              {getCategoryIcon(pqrs.categoria)}
              {pqrs.categoria}
            </span>
          </div>

          <div className="ficha-meta-item">
            <span className="meta-label">Fecha de Radicación:</span>
            <span className="meta-value">
              <Calendar size={16} color="var(--azul-institucional)" />
              {pqrs.fechaRadicacion}
            </span>
          </div>

          <div className="ficha-meta-item">
            <span className="meta-label">Plazo Legal de Atención:</span>
            <span className="meta-value">
              <Clock size={16} color="var(--azul-institucional)" />
              {pqrs.plazoLegal}
            </span>
          </div>

          <div className="ficha-meta-item">
            <span className="meta-label">Entidad Responsable:</span>
            <span className="meta-value">
              <Building size={16} color="var(--azul-institucional)" />
              Dirección de Servicios Públicos Municipales
            </span>
          </div>

          <div className="ficha-meta-item">
            <span className="meta-label">Código de Verificación:</span>
            <span className="meta-value" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              <FileCheck2 size={16} color="var(--azul-institucional)" />
              VERIF-{pqrs.id.replace('PQRS-', '')}-2026-GOV
            </span>
          </div>
        </div>

        {/* Sección: Descripción Detallada */}
        <div className="ficha-seccion">
          <h3 className="ficha-seccion-title">Detalle de la Solicitud / Reporte Ciudadano</h3>
          <div className="ficha-descripcion-box">
            <p>{pqrs.descripcion}</p>
          </div>
        </div>

        {/* Sección: Respuesta Oficial Certificada */}
        <div className="ficha-seccion">
          <h3 className="ficha-seccion-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534' }}>
            <MessageSquare size={18} />
            Respuesta Oficial Municipal Certificada
          </h3>
          <div className="ficha-respuesta-box">
            <p className="respuesta-texto">{pqrs.respuestaOficial}</p>
            <div className="respuesta-footer-stamp">
              <ShieldCheck size={16} color="#166534" />
              <span>Documento firmado electrónicamente por la Secretaría de Atención Ciudadana.</span>
            </div>
          </div>
        </div>

        {/* Pie de la Ficha Técnica con Código QR Ficticio y Marca */}
        <div className="ficha-footer-info">
          <div className="qr-container">
            <QrCode size={48} color="var(--azul-institucional-dark)" />
            <div className="qr-text">
              <strong>Verificación Digital QR</strong>
              <span>Escanee para validar la autenticidad en el portal institucional</span>
            </div>
          </div>

          <div className="ficha-actions">
            <button className="btn-copiar-enlace" onClick={handleCopyLink} type="button">
              {copied ? <Check size={16} color="#10b981" /> : <Share2 size={16} />}
              <span>{copied ? '¡Copiado!' : 'Compartir / Copiar'}</span>
            </button>

            {onBack && (
              <button className="btn-volver" onClick={onBack} type="button">
                <ArrowLeft size={16} />
                <span>Volver</span>
              </button>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default DetalleConsultaPage;
