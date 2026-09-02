import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FilaGasto {
  concepto: string;
  monto: number | null;
}

@Component({
  selector: 'app-gastos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gastos.html',
  styleUrls: ['./gastos.css']
})
export class GastosComponent {

  // Filas iniciales
  gastos: FilaGasto[] = [
    { concepto: '', monto: null },
    { concepto: '', monto: null },
    { concepto: '', monto: null },
    { concepto: '', monto: null }
  ];

  // Agrega una fila nueva totalmente editable
  agregarFila(): void {
    this.gastos.push({ concepto: '', monto: null });
  }

  // Calcula automáticamente la suma total en tiempo real
  calcularTotal(): number {
    return this.gastos.reduce((acc, curr) => {
      const montoValido = typeof curr.monto === 'number' && !isNaN(curr.monto) ? curr.monto : 0;
      return acc + montoValido;
    }, 0);
  }
}