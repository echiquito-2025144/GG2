import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/api/auth'; // Cambia el puerto si tu backend usa otro
  private timerExpiracion: any;

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

  // 3. Guardar sesión y activar temporizador de expiración
  guardarSesion(token: string, usuario: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.iniciarTemporizadorExpiracion(token);
  }

  // 4. Temporizador automático al vencer el JWT
  iniciarTemporizadorExpiracion(token: string): void {
    try {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));
      const tiempoRestanteMs = (payload.exp * 1000) - Date.now();

      if (this.timerExpiracion) clearTimeout(this.timerExpiracion);

      if (tiempoRestanteMs > 0) {
        console.log(`⏰ Sesión programada para expirar en ${Math.round(tiempoRestanteMs / 1000)}s.`);
        this.timerExpiracion = setTimeout(() => {
          this.logoutPorExpiracion();
        }, tiempoRestanteMs);
      } else {
        this.logoutPorExpiracion();
      }
    } catch (error) {
      console.error('Error al procesar tiempo del token:', error);
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
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    if (this.timerExpiracion) clearTimeout(this.timerExpiracion);
    this.router.navigate(['/login']);
  }

  
  private logoutPorExpiracion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    if (this.timerExpiracion) clearTimeout(this.timerExpiracion);
    alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    this.router.navigate(['/login']);
  }
}