import React, { useState, useEffect } from 'react';
import { 
  Search, 
  RotateCcw, 
  AlertCircle, 
  Loader2, 
  FileQuestion, 
  CheckCircle2, 
  Clock, 
  User, 
  Calendar, 
  Droplets, 
  Trash2, 
  Lightbulb, 
  Filter,
  MessageSquare,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { DetalleConsultaPage } from './DetalleConsultaPage';

export interface PQRSItem {
  id: string;
  solicitante: string;
  categoria: string;
  descripcion: string;
  estado: 'En trámite' | 'Resuelto' | string;
  fechaRadicacion: string;
  plazoLegal: string;
  respuestaOficial: string;
}

export interface ConsultasPageProps {
  initialRadicadoId?: string | null;
  onSelectRadicado?: (id: string) => void;
}

export const ConsultasPage: React.FC<ConsultasPageProps> = ({
  initialRadicadoId = null,
  onSelectRadicado
}) => {
  const [pqrsList, setPqrsList] = useState<PQRSItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedItem, setSelectedItem] = useState<PQRSItem | null>(null);

  const fetchPqrsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/pqrs');
      if (!response.ok) {
        throw new Error(`Servidor devolvió estado HTTP ${response.status}`);
      }
      const data: PQRSItem[] = await response.json();
      setPqrsList(data);

      // If initialRadicadoId is provided, select it automatically
      if (initialRadicadoId) {
        const found = data.find(item => item.id.toLowerCase() === initialRadicadoId.toLowerCase());
        if (found) setSelectedItem(found);
      }
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : 'No se pudo conectar con el servicio backend de PQRS.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPqrsData();
  }, [initialRadicadoId]);

  // If an item is selected, render the DetalleConsultaPage view
  if (selectedItem) {
    return (
      <DetalleConsultaPage 
        itemData={selectedItem} 
        onBack={() => setSelectedItem(null)} 
      />
    );
  }

  // Filtered dataset for real-time search and category filtering
  const filteredPqrs = pqrsList.filter((item) => {
    const matchesSearch = 
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.solicitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoria.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = 
      selectedCategory === 'Todas' || item.categoria === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Icon helper based on category
  const getCategoryIcon = (categoria: string) => {
    const lower = categoria.toLowerCase();
    if (lower.includes('agua')) return <Droplets size={18} />;
    if (lower.includes('basura')) return <Trash2 size={18} />;
    if (lower.includes('alumbrado')) return <Lightbulb size={18} />;
    return <Filter size={18} />;
  };

  const handleCardClick = (item: PQRSItem) => {
    setSelectedItem(item);
    if (onSelectRadicado) {
      onSelectRadicado(item.id);
    }
  };

  return (
    <div className="consultas-container">
      {/* Header de la Página de Consultas */}
      <header className="consultas-header">
        <h1 className="consultas-title">Consulta de Radicados y PQRS</h1>
        <p className="consultas-subtitle">
          Consulte en tiempo real el estado de sus trámites de Agua, Recolección de Basura y Alumbrado Público. Haga clic en cualquier radicado para ver su ficha técnica completa.
        </p>
      </header>

      {/* Bar de Búsqueda y Filtros */}
      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por radicado (ej: PQRS-2026-001), solicitante o palabra clave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="clear-search-btn" 
              onClick={() => setSearchTerm('')}
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-select-wrapper">
          <Filter size={18} className="filter-icon" />
          <select 
            className="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="Todas">Todas las Categorías</option>
            <option value="Agua y Alcantarillado">Agua y Alcantarillado</option>
            <option value="Recolección de Basura">Recolección de Basura</option>
            <option value="Alumbrado Público">Alumbrado Público</option>
          </select>
        </div>
      </div>

      {/* ESTADO 1: CARGANDO */}
      {loading && (
        <div className="state-container state-loading" role="status">
          <Loader2 className="spinner-icon" size={48} />
          <h3 className="state-title">Cargando información de trámites...</h3>
          <p className="state-description">
            Conectando con la API institucional `/api/pqrs` para consultar los radicados.
          </p>
        </div>
      )}

      {/* ESTADO 2: ERROR */}
      {!loading && error && (
        <div className="state-container state-error" role="alert">
          <AlertCircle className="error-icon" size={52} />
          <h3 className="state-title">Error de Conexión</h3>
          <p className="state-description">
            Ocurrió un problema al obtener los datos de la API: <strong>{error}</strong>
          </p>
          <button className="btn-retry" onClick={fetchPqrsData}>
            <RotateCcw size={18} />
            <span>Reintentar</span>
          </button>
        </div>
      )}

      {/* ESTADO 3: VACÍO (NO HAY RESULTADOS) */}
      {!loading && !error && filteredPqrs.length === 0 && (
        <div className="state-container state-empty">
          <FileQuestion className="empty-icon" size={56} />
          <h3 className="state-title">No se encontraron trámites</h3>
          <p className="state-description">
            No existen radicados que coincidan con la búsqueda &quot;<strong>{searchTerm}</strong>&quot;
            {selectedCategory !== 'Todas' && ` en la categoría "${selectedCategory}"`}.
          </p>
          <button 
            className="btn-reset-filters"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('Todas');
            }}
          >
            Restablecer Filtros
          </button>
        </div>
      )}

      {/* ESTADO 4: LISTA CON DATOS */}
      {!loading && !error && filteredPqrs.length > 0 && (
        <div className="pqrs-results-meta">
          <span>Mostrando <strong>{filteredPqrs.length}</strong> de <strong>{pqrsList.length}</strong> radicados (Haz clic en una tarjeta para ver la Ficha Técnica)</span>
        </div>
      )}

      {!loading && !error && filteredPqrs.length > 0 && (
        <div className="pqrs-grid">
          {filteredPqrs.map((item) => {
            const isResuelto = item.estado === 'Resuelto';

            return (
              <article 
                key={item.id} 
                className="pqrs-card"
                onClick={() => handleCardClick(item)}
                style={{ cursor: 'pointer' }}
              >
                {/* Header de la Tarjeta de Radicado */}
                <div className="pqrs-card-header">
                  <div className="pqrs-id-tag" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>{item.id}</span>
                    <ExternalLink size={12} color="var(--azul-institucional)" />
                  </div>

                  {/* Estado con Color Distintivo */}
                  <span className={`estado-badge ${isResuelto ? 'estado-resuelto' : 'estado-tramite'}`}>
                    {isResuelto ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                    {item.estado}
                  </span>
                </div>

                {/* Categoría y Solicitante */}
                <div className="pqrs-card-meta">
                  <span className="pqrs-categoria-badge">
                    {getCategoryIcon(item.categoria)}
                    {item.categoria}
                  </span>

                  <span className="pqrs-solicitante">
                    <User size={14} />
                    {item.solicitante}
                  </span>
                </div>

                {/* Descripción del Trámite */}
                <div className="pqrs-card-body">
                  <h4 className="pqrs-descripcion-title">Descripción del reporte:</h4>
                  <p className="pqrs-descripcion-text">{item.descripcion}</p>
                </div>

                {/* Detalles de Fechas y Plazo */}
                <div className="pqrs-card-dates">
                  <span className="date-item">
                    <Calendar size={14} />
                    Radicado: <strong>{item.fechaRadicacion}</strong>
                  </span>
                  <span className="date-item">
                    <Clock size={14} />
                    Plazo legal: <strong>{item.plazoLegal}</strong>
                  </span>
                </div>

                {/* Respuesta Oficial */}
                <div className="pqrs-respuesta-box">
                  <div className="respuesta-header">
                    <MessageSquare size={16} />
                    <span>Respuesta Oficial Municipal:</span>
                  </div>
                  <p className="respuesta-content">{item.respuestaOficial}</p>
                </div>

                {/* Botón Ver Ficha Técnica */}
                <div style={{ paddingTop: '0.5rem' }}>
                  <button 
                    type="button" 
                    className="btn-tramite"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(item);
                    }}
                  >
                    <span>Ver Ficha Técnica Completa</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConsultasPage;
