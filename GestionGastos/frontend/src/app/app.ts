import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service'; // Ajusta la ruta según la ubicación exacta de tu AuthService

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private authService = inject(AuthService);

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      // Si la página se recarga (F5), se reactiva el temporizador de expiración
      this.authService.iniciarTemporizadorExpiracion(token);
    }
  }
}