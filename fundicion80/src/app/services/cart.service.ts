import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  producto: {
    id: string;
    nombre: string;
    precio: number;
    imagenUrl: string;
  };
  color: string;
  talla: number;
  cantidad: number;
  subtotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsKey = 'fundicion80_cart';
  private cartItems: CartItem[] = [];
  
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor() {
    this.cargarCarrito();
  }

  private guardarEnLocalStorage() {
    localStorage.setItem(this.itemsKey, JSON.stringify(this.cartItems));
    this.cartSubject.next([...this.cartItems]);
  }

  private cargarCarrito() {
    const savedCart = localStorage.getItem(this.itemsKey);
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartSubject.next([...this.cartItems]);
    }
  }

  agregarProducto(nuevoItem: CartItem) {
    const index = this.cartItems.findIndex(item => 
      item.producto.id === nuevoItem.producto.id && 
      item.color === nuevoItem.color && 
      item.talla === nuevoItem.talla
    );

    if (index > -1) {
      this.cartItems[index].cantidad += nuevoItem.cantidad;
      this.cartItems[index].subtotal = this.cartItems[index].cantidad * this.cartItems[index].producto.precio;
    } else {
      this.cartItems.push(nuevoItem);
    }
    this.guardarEnLocalStorage();
  }

  eliminarProducto(index: number) {
    this.cartItems.splice(index, 1);
    this.guardarEnLocalStorage();
  }

  vaciarCarrito() {
    this.cartItems = [];
    this.guardarEnLocalStorage();
  }

  calcularTotal(): number {
    return this.cartItems.reduce((acc, item) => acc + item.subtotal, 0);
  }
}