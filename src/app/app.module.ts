import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http'
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { NoticiasComponent } from './components/noticias/noticias.component';
import { NoticiaDetalleComponent } from './components/noticia-detalle/noticia-detalle.component';
import { FavoritosComponent } from './components/favoritos/favoritos.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { GestionComponent } from './components/gestion/gestion.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NoticiasComponent,
    NoticiaDetalleComponent,
    ContactoComponent,
    GestionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NavbarComponent,
    HomeComponent,
    FavoritosComponent,
    FormsModule
  ],
  providers: [
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
