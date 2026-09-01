import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { FinanzasService } from '../../../../core/services/finanzas.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private finanzasService = inject(FinanzasService);
  private router = inject(Router);

  usuario: any = null;
  private subIngreso!: Subscription;

  // Valores dinámicos para las tarjetas KPI
  saldoActual: number = 0.00;
  ingresoMes: number = 0.00;
  gastosMes: number = 0.00;
  totalAhorro: number = 0.00;

  ngOnInit(): void {
    this.usuario = this.authService.obtenerUsuario();

    // Suscripción en tiempo real al valor guardado de ingresoMes
    this.subIngreso = this.finanzasService.ingresoMes$.subscribe((monto) => {
      this.ingresoMes = monto;
      // Recalcular saldo actual restando gastos
      this.saldoActual = this.ingresoMes - this.gastosMes;
    });
  }

  ngOnDestroy(): void {
    // Limpieza de suscripción al destruir el componente
    if (this.subIngreso) {
      this.subIngreso.unsubscribe();
    }
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}