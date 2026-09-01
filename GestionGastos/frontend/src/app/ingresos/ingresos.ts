import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth';

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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.usuario = this.authService.obtenerUsuario();
    if (this.usuario && this.usuario.nombre) {
      this.nombreUsuario = this.usuario.nombre;
    }

    const opciones: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    this.fechaHoy = new Date().toLocaleDateString('es-GT', opciones);

    // Cargar ingreso previamente guardado en el navegador si existe
    const ingresoGuardado = localStorage.getItem('ingresoMes');
    if (ingresoGuardado !== null) {
      this.ingresoMes = parseFloat(ingresoGuardado) || 0;
    }
  }

  // Método que se ejecuta cada vez que el usuario escribe un nuevo valor
  guardarIngreso(): void {
    if (this.ingresoMes !== null && this.ingresoMes >= 0) {
      localStorage.setItem('ingresoMes', this.ingresoMes.toString());
      this.saldoActual = this.ingresoMes - this.gastosMes;
    }
  }

  cerrarSesion(): void {
    this.authService.logout();
  }
}