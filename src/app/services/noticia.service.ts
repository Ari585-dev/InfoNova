import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Noticia } from '../models/noticia.model';

@Injectable({
  providedIn: 'root'
})
export class NoticiaService {
  private readonly STORAGE_KEY = 'infonova_noticias';
  private readonly FAVORITES_KEY = 'infonova_favoritos';

  // BehaviorSubject para notificar cambios en la lista de noticias a los componentes
  private noticiasSubject = new BehaviorSubject<Noticia[]>([]);
  public noticias$ = this.noticiasSubject.asObservable();

  // BehaviorSubject para notificar cambios en la lista de favoritos
  private favoritosSubject = new BehaviorSubject<Noticia[]>([]);
  public favoritos$ = this.favoritosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cargarNoticiasIniciales();
  }

  /**
   * Carga inicial: Si no existen noticias en localStorage, realiza el fetch del JSON local
   */
  private cargarNoticiasIniciales(): void {
    const noticiasGuardadas = localStorage.getItem(this.STORAGE_KEY);

    if (noticiasGuardadas) {
      const noticias: Noticia[] = JSON.parse(noticiasGuardadas);
      this.noticiasSubject.next(noticias);
      this.actualizarFavoritosSubject(noticias);
    } else {
      // Cargar desde noticias.json si es la primera ejecución
      this.http.get<Noticia[]>('assets/data/noticias.json').pipe(
        tap((noticias) => {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(noticias));
          this.noticiasSubject.next(noticias);
          this.actualizarFavoritosSubject(noticias);
        }),
        catchError((error) => {
          console.error('Error al cargar noticias.json:', error);
          return of([]);
        })
      ).subscribe();
    }
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
    
    // Si estaba en favoritos, también se remueve
    this.eliminarFavorito(id);
  }

  // ==========================================
  // LÓGICA DE FAVORITOS
  // ==========================================

  /**
   * OBTENER los IDs de las noticias favoritas
   */
  private getIdsFavoritos(): number[] {
    const favs = localStorage.getItem(this.FAVORITES_KEY);
    return favs ? JSON.parse(favs) : [];
  }

  /**
   * Actualizar la lista de favoritos
   */
  private actualizarFavoritosSubject(noticias: Noticia[] = this.getNoticias()): void {
    const idsFavs = this.getIdsFavoritos();
    const favoritos = noticias.filter(n => idsFavs.includes(n.id));
    this.favoritosSubject.next(favoritos);
  }

  /**
   * Verificar si una noticia es favorita
   */
  esFavorito(id: number): boolean {
    return this.getIdsFavoritos().includes(id);
  }

   /**
   * Guardar una noticia como favorita
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
   * Eliminar una noticia de los favoritos
   */
  eliminarFavorito(id: number): void {
    let idsFavs = this.getIdsFavoritos();
    idsFavs = idsFavs.filter(favId => favId !== id);
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(idsFavs));
    this.actualizarFavoritosSubject();
  }

   /**
   * Alternar el estado de favorito de una noticia
   */
  toggleFavorito(id: number): void {
    if (this.esFavorito(id)) {
      this.eliminarFavorito(id);
    } else {
      this.guardarFavorito(id);
    }
  }

   /**
   * Guardar la lista de noticias en localStorage y notificar a los suscriptores
   */
  private guardarEnStorage(noticias: Noticia[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(noticias));
    this.noticiasSubject.next(noticias);
    this.actualizarFavoritosSubject(noticias);
  }
}