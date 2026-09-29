import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { NoticiaService } from '../../services/noticia.service';
import { Noticia } from '../../models/noticia.model';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css']
})
export class FavoritosComponent implements OnInit, OnDestroy {
  noticiasFavoritas: Noticia[] = [];
  private sub?: Subscription;

  constructor(private noticiaService: NoticiaService) {}

  /**
   * Inicializa el componente y suscribe al observable de noticias favoritas.
   */
  ngOnInit(): void {
    this.sub = this.noticiaService.favoritos$.subscribe(favoritos => {
      this.noticiasFavoritas = favoritos;
    });
  }

  /**
   * Desuscribe del observable de noticias favoritas al destruir el componente.
   */
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /**
   * Elimina una noticia de los favoritos.
   * @param id - El ID de la noticia a eliminar.
   * @param event - El evento de clic.
   */
  eliminarFavorito(id: number, event: Event): void {
    event.stopPropagation();
    this.noticiaService.eliminarFavorito(id);
  }
}