import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth';
import { FinanzasService } from '../core/services/finanzas.service';

interface ItemGasto {
  concepto: string;
  monto: number | null;
}

@Component({
  selector: 'app-ingresos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ingresos.html',
  styleUrls: ['./ingresos.css']
})
export class IngresosComponent implements OnInit {
  usuario: any = null;
  nombreUsuario: string = 'Usuario';
  fechaHoy: string = '';

  saldoActual: number = 0.00;
  ingresoMes: number = 0.00;
  gastosMes: number = 0.00;
  totalAhorro: number = 0.00;

  listaGastos: ItemGasto[] = [
    { concepto: '', monto: null },
    { concepto: '', monto: null },
    { concepto: '', monto: null },
    { concepto: '', monto: null },
    { concepto: '', monto: null }
  ];

  constructor(
    private authService: AuthService,
    private finanzasService: FinanzasService
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.obtenerUsuario();
    if (this.usuario && this.usuario.nombre) {
      this.nombreUsuario = this.usuario.nombre;
    }

    const opciones: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    this.fechaHoy = new Date().toLocaleDateString('es-GT', opciones);

    // Cargar ingreso desde el servicio central
    this.ingresoMes = this.finanzasService.obtenerIngresoActual();
    this.saldoActual = this.ingresoMes - this.gastosMes;
  }

  guardarIngreso(): void {
    if (this.ingresoMes !== null && this.ingresoMes >= 0) {
      this.finanzasService.actualizarIngreso(this.ingresoMes);
      this.saldoActual = this.ingresoMes - this.gastosMes;
    }
  }

  cerrarSesion(): void {
    this.authService.logout();
  }
}