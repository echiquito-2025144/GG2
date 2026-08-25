import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html', // o ./register.component.html según como se haya creado
  styleUrl: './register.css'       // o ./register.component.css
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  nombre = '';
  email = '';
  password = '';
  errorMensaje = '';

  onSubmit(): void {
    if (!this.nombre || !this.email || !this.password) {
      this.errorMensaje = 'Por favor completa todos los campos.';
      return;
    }

    this.authService.registro(this.nombre, this.email, this.password).subscribe({
      next: () => {
        alert('¡Usuario registrado con éxito! Ya puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMensaje = err.error?.message || 'Error al registrar el usuario.';
      }
    });
  }
}