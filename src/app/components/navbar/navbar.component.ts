import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NoticiaService } from '../../services/noticia.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule, RouterModule] // <--- Importante incluir estos dos módulos
})
export class NavbarComponent implements OnInit {
  cantidadFavoritos: number = 0;

  constructor(private noticiaService: NoticiaService) {}

  /**
   * Inicializa el componente y suscribe al observable de noticias favoritas.
   */
  ngOnInit(): void {
    this.noticiaService.favoritos$.subscribe(favs => {
      this.cantidadFavoritos = favs.length;
    });
  }
}