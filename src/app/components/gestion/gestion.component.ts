import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NoticiaService } from '../../services/noticia.service';

@Component({
  selector: 'app-gestion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css']
})
export class GestionComponent implements OnInit {
  noticiaForm!: FormGroup;
  mensajeExito: boolean = false;
  categorias: string[] = ['Tecnología', 'Educación', 'Turismo', 'Comercio', 'Actualidad'];

  constructor(
    private fb: FormBuilder,
    private noticiaService: NoticiaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  /**
   * Inicializa el formulario reactivo con validaciones
   * y un patrón para validar URLs.
   */
  private inicializarFormulario(): void {
    const urlPattern = '^(https?:\\/\\/).+';

    this.noticiaForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(10)]],
      categoria: ['', [Validators.required]],
      descripcionBreve: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(150)]],
      contenido: ['', [Validators.required, Validators.minLength(30)]],
      imagenUrl: ['', [Validators.required, Validators.pattern(urlPattern)]],
      destacada: [false]
    });
  }

  // Getters auxiliares para facilitar la lectura de errores en el HTML
  get f() {
    return this.noticiaForm.controls;
  }

  campoEsInvalido(campo: string): boolean {
    const control = this.noticiaForm.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  /**
   * Guarda la nueva noticia en el servicio
   * @returns 
   */
  guardarNoticia(): void {
    if (this.noticiaForm.invalid) {
      this.noticiaForm.markAllAsTouched();
      return;
    }

    const fechaHoy = new Date().toISOString().split('T')[0];

    const nuevaNoticia = {
      ...this.noticiaForm.value,
      fechaPublicacion: fechaHoy
    };

    this.noticiaService.crearNoticia(nuevaNoticia);

    this.mensajeExito = true;
    this.noticiaForm.reset({ destacada: false, categoria: '' });

    setTimeout(() => {
      this.mensajeExito = false;
      this.router.navigate(['/']);
    }, 2000);
  }
}