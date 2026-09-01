import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinanzasService {
  // Clave para guardar en localStorage
  private readonly STORAGE_KEY = 'ingreso_mes_actual';

  // Obtenemos el valor guardado o usaremos 10 por defecto
  private ingresoInicial = Number(localStorage.getItem(this.STORAGE_KEY)) || 10;
  
  // Subject reactivo que notificará a cualquier componente suscrito
  private ingresoSubject = new BehaviorSubject<number>(this.ingresoInicial);

  // Observable que los componentes pueden escuchar
  ingresoMes$: Observable<number> = this.ingresoSubject.asObservable();

  constructor() {}

  // Método para actualizar el valor desde Ingresos Component
  actualizarIngreso(nuevoMonto: number): void {
    const montoValido = nuevoMonto || 0;
    localStorage.setItem(this.STORAGE_KEY, montoValido.toString());
    this.ingresoSubject.next(montoValido);
  }

  // Método para obtener el valor actual directo
  obtenerIngresoActual(): number {
    return this.ingresoSubject.value;
  }
}