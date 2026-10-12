import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NoticiaService } from '../../services/noticia.service';
import { Noticia } from '../../models/noticia.model';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css']
})
export class NoticiasComponent implements OnInit, OnDestroy {
  noticias: Noticia[] = [];
  noticiasFiltradas: Noticia[] = [];
  categorias: string[] = ['Todas', 'Tecnología', 'Educación', 'Turismo', 'Comercio', 'Actualidad'];
  categoriaSeleccionada: string = 'Todas';
  terminoBusqueda: string = '';
  
  private sub: Subscription = new Subscription();

  constructor(private noticiaService: NoticiaService) {}

  ngOnInit(): void {
    this.sub = this.noticiaService.noticias$.subscribe(data => {
      this.noticias = data;
      this.aplicarFiltros();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  filtrarPorCategoria(cat: string): void {
    this.categoriaSeleccionada = cat;
    this.aplicarFiltros();
  }

  buscarNoticias(): void {
    this.aplicarFiltros();
  }

  public aplicarFiltros(): void {
    let resultado = [...this.noticias];

    // Filtro por categoría
    if (this.categoriaSeleccionada !== 'Todas') {
      resultado = resultado.filter(n => n.categoria === this.categoriaSeleccionada);
    }

    // Filtro por término de búsqueda (título o descripción)
    if (this.terminoBusqueda.trim() !== '') {
      const termino = this.terminoBusqueda.toLowerCase().trim();
      resultado = resultado.filter(n => 
        n.titulo.toLowerCase().includes(termino) || 
        n.descripcionBreve.toLowerCase().includes(termino)
      );
    }

    this.noticiasFiltradas = resultado;
  }

  toggleFavorito(id: number): void {
    this.noticiaService.toggleFavorito(id);
  }

  esFavorito(id: number): boolean {
    return this.noticiaService.esFavorito(id);
  }
}