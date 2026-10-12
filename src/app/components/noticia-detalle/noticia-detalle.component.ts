import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NoticiaService } from '../../services/noticia.service';
import { Noticia } from '../../models/noticia.model';

@Component({
  selector: 'app-noticia-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './noticia-detalle.component.html',
  styleUrls: ['./noticia-detalle.component.css']
})
export class NoticiaDetalleComponent implements OnInit {
  noticia: Noticia | undefined;
  esFavorito: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private noticiaService: NoticiaService
  ) {}

  ngOnInit(): void {
    // Escuchamos los cambios en el parámetro :id de la URL
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        const id = +idParam;
        this.cargarNoticia(id);
      }
    });
  }

  private cargarNoticia(id: number): void {
    const todasLasNoticias = this.noticiaService.getNoticias();
    this.noticia = todasLasNoticias.find(n => n.id === id);

    if (this.noticia) {
      this.esFavorito = this.noticiaService.esFavorito(this.noticia.id);
    } else {
      // Si no existe la noticia, redirigimos al home
      this.router.navigate(['/']);
    }
  }

  toggleFavorito(): void {
    if (this.noticia) {
      this.noticiaService.toggleFavorito(this.noticia.id);
      this.esFavorito = this.noticiaService.esFavorito(this.noticia.id);
    }
  }
}