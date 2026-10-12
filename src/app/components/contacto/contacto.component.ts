import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {
  contactoForm!: FormGroup;
  mensajeEnviado: boolean = false;

  constructor(private fb: FormBuilder) {}

  /**
   * Inicializa el formulario de contacto con validaciones.
   */
  ngOnInit(): void {
    this.contactoForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      asunto: ['', [Validators.required, Validators.minLength(5)]],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  /**
   * Retorna los controles del formulario para facilitar el acceso en la plantilla.
   */
  get f() {
    return this.contactoForm.controls;
  }

  /**
   * Verifica si un campo del formulario es inválido.
   * @param campo 
   * @returns 
   */
  campoEsInvalido(campo: string): boolean {
    const control = this.contactoForm.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  /**
   * Envía el mensaje de contacto.
   * @returns 
   */
  enviarMensaje(): void {
    if (this.contactoForm.invalid) {
      this.contactoForm.markAllAsTouched();
      return;
    }

    this.mensajeEnviado = true;
    this.contactoForm.reset();
  

  /**
   * Oculta el mensaje de éxito después de 5 segundos.
   */
    setTimeout(() => {
      this.mensajeEnviado = false;
    }, 5000);
  }
}