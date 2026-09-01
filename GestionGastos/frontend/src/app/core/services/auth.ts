import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/api/auth';
  private timerExpiracion: any;

  constructor() {
    // Al cargar el servicio, validar el token si ya existe en localStorage
    const token = this.obtenerToken();
    if (token) {
      this.iniciarTemporizadorExpiracion(token);
    }
  }

  // 1. Método Login
  login(email: string, passwordPlana: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password: passwordPlana }).pipe(
      tap((res: any) => {
        if (res && res.token) {
          this.guardarSesion(res.token, res.usuario);
        }
      })
    );
  }

  // 2. Método Registro
  registro(nombre: string, email: string, passwordPlana: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { nombre, email, password: passwordPlana }).pipe(
      tap((res: any) => {
        if (res && res.token) {
          this.guardarSesion(res.token, res.usuario);
        }
      })
    );
  }

  // 3. Guardar sesión en localStorage
  guardarSesion(token: string, usuario: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.iniciarTemporizadorExpiracion(token);
  }

  // 4. Temporizador de expiración automática para el JWT
  iniciarTemporizadorExpiracion(token: string): void {
    try {
      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) return;

      const jsonPayload = decodeURIComponent(
        atob(payloadBase64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const payload = JSON.parse(jsonPayload);
      if (!payload.exp) return;

      const tiempoRestanteMs = payload.exp * 1000 - Date.now();

      if (this.timerExpiracion) clearTimeout(this.timerExpiracion);

      if (tiempoRestanteMs > 0) {
        const maxDelay = 2147483647;
        const delay = Math.min(tiempoRestanteMs, maxDelay);

        this.timerExpiracion = setTimeout(() => {
          this.logoutPorExpiracion();
        }, delay);
      } else {
        this.logoutPorExpiracion();
      }
    } catch (error) {
      console.error('Error al procesar el token expirado:', error);
      this.logoutPorExpiracion();
    }
  }

  // 5. Obtener usuario guardado
  obtenerUsuario(): any {
    const usuarioStr = localStorage.getItem('usuario');
    return usuarioStr ? JSON.parse(usuarioStr) : null;
  }

  // 6. Obtener token
  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  // 7. Cierre de sesión manual
  logout(): void {
    this.limpiarSesion();
    this.router.navigate(['/login']);
  }

  // 8. Cierre de sesión automático por expiración
  private logoutPorExpiracion(): void {
    this.limpiarSesion();
    alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    this.router.navigate(['/login']);
  }

  // Helper privado para borrar datos
  private limpiarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    if (this.timerExpiracion) {
      clearTimeout(this.timerExpiracion);
      this.timerExpiracion = null;
    }
  }
}