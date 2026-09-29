import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NoticiaService } from '../../services/noticia.service';
import { Noticia } from '../../models/noticia.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, RouterModule] // <--- Importante incluir estos dos módulos
})
export class HomeComponent implements OnInit {
  noticiaPrincipal?: Noticia;
  noticiasDestacadas: Noticia[] = [];
  categoriaSeleccionada: string = 'Todas';
  categorias: string[] = ['Todas', 'Tecnología', 'Educación', 'Turismo', 'Comercio', 'Actualidad'];

  constructor(private noticiaService: NoticiaService) {}

  /**
   * Inicializa el componente y suscribe al observable de noticias.
   * Si hay noticias, selecciona la noticia destacada o la primera como principal.
   * Luego filtra las noticias para mostrar las destacadas según la categoría seleccionada. 
   */
  ngOnInit(): void {
    this.noticiaService.noticias$.subscribe(noticias => {
      if (noticias.length > 0) {
        this.noticiaPrincipal = noticias.find(n => n.destacada) || noticias[0];
        this.filtrarNoticias();
      }
    });
  }

  /**
   * Filtra las noticias por categoría.
   * @param categoria - La categoría por la cual filtrar.
   */
  filtrarPorCategoria(categoria: string): void {
    this.categoriaSeleccionada = categoria;
    this.filtrarNoticias();
  }

  /**
   * Filtra las noticias destacadas según la categoría seleccionada y excluye la noticia principal.
   */
  private filtrarNoticias(): void {
    const todas = this.noticiaService.getNoticias();
    if (this.categoriaSeleccionada === 'Todas') {
      this.noticiasDestacadas = todas.filter(n => n.id !== this.noticiaPrincipal?.id);
    } else {
      this.noticiasDestacadas = todas.filter(
        n => n.categoria === this.categoriaSeleccionada && n.id !== this.noticiaPrincipal?.id
      );
    }
  }

  /**
   * Alterna el estado de favorito para una noticia.
   * @param id - El ID de la noticia.
   * @param event - El evento de clic.
   */
  toggleFavorito(id: number, event: Event): void {
    event.stopPropagation();
    this.noticiaService.toggleFavorito(id);
  }

  /**
   * Verifica si una noticia está en los favoritos.
   * @param id 
   * @returns 
   */
  esFavorito(id: number): boolean {
    return this.noticiaService.esFavorito(id);
  }
}