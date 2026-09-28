export interface Noticia {
  id: number;
  titulo: string;
  categoria: 'Actualidad' | 'Tecnología' | 'Educación' | 'Turismo' | 'Comercio';
  descripcionBreve: string;
  contenido: string;
  imagenUrl: string;
  fechaPublicacion: string;
  destacada?: boolean;
}