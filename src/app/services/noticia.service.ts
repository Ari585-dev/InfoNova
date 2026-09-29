import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Noticia } from '../models/noticia.model';

@Injectable({
  providedIn: 'root'
})
export class NoticiaService {
  private readonly STORAGE_KEY = 'infonova_noticias';
  private readonly FAVORITES_KEY = 'infonova_favoritos';

  private noticiasSubject = new BehaviorSubject<Noticia[]>([]);
  public noticias$ = this.noticiasSubject.asObservable();

  private favoritosSubject = new BehaviorSubject<Noticia[]>([]);
  public favoritos$ = this.favoritosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cargarNoticiasIniciales();
  }

  /**
   * Carga inicial: Si no existen noticias en localStorage, realiza la petición HTTP del JSON local
   */
private cargarNoticiasIniciales(): void {
      this.http.get<Noticia[]>('data/noticias.json').subscribe({
        next: (noticiasJson) => {
          this.procesarNoticias(noticiasJson);
        },
        error: (err) => {
          console.error('No se pudo cargar noticias.json desde ninguna ruta:', err);
          // Si falla la red, cargamos lo que haya en localStorage como último recurso
          const guardadas = localStorage.getItem(this.STORAGE_KEY);
          if (guardadas) {
            const noticias = JSON.parse(guardadas);
            this.noticiasSubject.next(noticias);
            this.actualizarFavoritosSubject(noticias);
          }
        }
      });
}


  /**
   * Procesa las noticias obtenidas del JSON y las combina con las noticias creadas por el usuario
   * @param noticiasJson 
   */
private procesarNoticias(noticiasJson: Noticia[]): void {
  const noticiasGuardadas = localStorage.getItem(this.STORAGE_KEY);
  
  if (noticiasGuardadas) {
    try {
      const noticiasLocal: Noticia[] = JSON.parse(noticiasGuardadas);
      
      // Mantenemos las noticias creadas manualmente desde la app (IDs que no están en el JSON)
      const idsJson = new Set(noticiasJson.map(n => n.id));
      const creadasPorUsuario = noticiasLocal.filter(n => !idsJson.has(n.id));
      
      // Mezclamos lo nuevo del JSON con las creadas por el usuario
      const noticiasActualizadas = [...noticiasJson, ...creadasPorUsuario];
      this.guardarEnStorage(noticiasActualizadas);
      return;
    } catch (e) {
      console.error('Error leyendo LocalStorage:', e);
    }
  }

  // Si no había nada en LocalStorage, guardamos y notificamos las noticias del JSON
  this.guardarEnStorage(noticiasJson);
}

  /**
   * Obtiene la lista actual de noticias
   */
  getNoticias(): Noticia[] {
    return this.noticiasSubject.getValue();
  }

  /**
   * Obtiene una noticia específica por su ID
   */
  getNoticiaById(id: number): Noticia | undefined {
    return this.getNoticias().find(n => n.id === id);
  }

  /**
   * Crear una nueva noticia y persistir en localStorage
   */
  crearNoticia(nuevaNoticia: Omit<Noticia, 'id'>): void {
    const noticiasActuales = this.getNoticias();
    const nuevoId = noticiasActuales.length > 0 
      ? Math.max(...noticiasActuales.map(n => n.id)) + 1 
      : 1;

    const noticiaCompleta: Noticia = {
      ...nuevaNoticia,
      id: nuevoId
    };

    const noticiasActualizadas = [noticiaCompleta, ...noticiasActuales];
    this.guardarEnStorage(noticiasActualizadas);
  }

  /**
   * Eliminar una noticia por su ID
   */
  eliminarNoticia(id: number): void {
    const noticiasFiltradas = this.getNoticias().filter(n => n.id !== id);
    this.guardarEnStorage(noticiasFiltradas);
    this.eliminarFavorito(id);
  }

  // ==========================================
  // LÓGICA DE FAVORITOS
  // ==========================================

  /**
   * Obtiene la lista de IDs de noticias favoritas.
   * @returns 
   */
  private getIdsFavoritos(): number[] {
    const favs = localStorage.getItem(this.FAVORITES_KEY);
    return favs ? JSON.parse(favs) : [];
  }

  /**
   * Actualiza el subject de noticias favoritas.
   * @param noticias 
   */
  private actualizarFavoritosSubject(noticias: Noticia[] = this.getNoticias()): void {
    const idsFavs = this.getIdsFavoritos();
    const favoritos = noticias.filter(n => idsFavs.includes(n.id));
    this.favoritosSubject.next(favoritos);
  }

  /**
   * Verifica si una noticia está en los favoritos.
   * @param id 
   * @returns 
   */
  esFavorito(id: number): boolean {
    return this.getIdsFavoritos().includes(id);
  }

  /**
   * Guarda una noticia como favorita.
   * @param id 
   */
  guardarFavorito(id: number): void {
    const idsFavs = this.getIdsFavoritos();
    if (!idsFavs.includes(id)) {
      idsFavs.push(id);
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(idsFavs));
      this.actualizarFavoritosSubject();
    }
  }

  /**
   * Elimina una noticia de los favoritos.
   * @param id 
   */
  eliminarFavorito(id: number): void {
    let idsFavs = this.getIdsFavoritos();
    idsFavs = idsFavs.filter(favId => favId !== id);
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(idsFavs));
    this.actualizarFavoritosSubject();
  }


  /**
   * Alterna el estado de favorito para una noticia.
   * @param id 
   */
  toggleFavorito(id: number): void {
    if (this.esFavorito(id)) {
      this.eliminarFavorito(id);
    } else {
      this.guardarFavorito(id);
    }
  }

  /**
   * guarda la lista de noticias en localStorage y actualiza los subjects.
   * @param noticias 
   */
  private guardarEnStorage(noticias: Noticia[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(noticias));
    this.noticiasSubject.next(noticias);
    this.actualizarFavoritosSubject(noticias);
  }
}