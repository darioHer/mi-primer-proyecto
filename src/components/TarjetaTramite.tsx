import React from 'react';
import { Droplets, Trash2, Lightbulb, ChevronRight, FileText } from 'lucide-react';

export interface TarjetaTramiteProps {
  titulo: string;
  descripcion: string;
  categoria: string;
}

export const TarjetaTramite: React.FC<TarjetaTramiteProps> = ({
  titulo,
  descripcion,
  categoria
}) => {
  // Helper to render appropriate icon based on category or title
  const renderIcon = () => {
    const lowerTitle = titulo.toLowerCase();
    if (lowerTitle.includes('agua') || lowerTitle.includes('alcantarillado')) {
      return <Droplets className="card-icon" />;
    } else if (lowerTitle.includes('basura') || lowerTitle.includes('recoleccion') || lowerTitle.includes('recolección')) {
      return <Trash2 className="card-icon" />;
    } else if (lowerTitle.includes('alumbrado') || lowerTitle.includes('lámparas') || lowerTitle.includes('lamparas')) {
      return <Lightbulb className="card-icon" />;
    }
    return <FileText className="card-icon" />;
  };

  return (
    <article className="tarjeta-tramite">
      <div className="tarjeta-header">
        <div className="tarjeta-icon-container">
          {renderIcon()}
        </div>
        <span className="tarjeta-categoria">{categoria}</span>
      </div>

      <div className="tarjeta-body">
        <h3 className="tarjeta-titulo">{titulo}</h3>
        <p className="tarjeta-descripcion">{descripcion}</p>
      </div>

      <div className="tarjeta-footer">
        <button className="btn-tramite" type="button" aria-label={`Consultar trámite: ${titulo}`}>
          <span>Ver información del trámite</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </article>
  );
};

export default TarjetaTramite;
