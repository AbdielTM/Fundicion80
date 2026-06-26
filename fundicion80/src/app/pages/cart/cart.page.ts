import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { 
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, 
  IonContent, IonList, IonItemSliding, IonItem, IonThumbnail, 
  IonLabel, IonButton, IonIcon, IonFooter 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline, cartOutline } from 'ionicons/icons';
import { CartService, CartItem } from '../../services/cart.service';

// Importaciones para guardar la venta en Firebase
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, 
    IonContent, IonList, IonItemSliding, IonItem, IonThumbnail, 
    IonLabel, IonButton, IonIcon, IonFooter
  ]
})
export class CartPage implements OnInit {
  items: CartItem[] = [];
  total: number = 0;

  constructor(
    private cartService: CartService,
    private alertController: AlertController,
    private router: Router
  ) {
    addIcons({ trashOutline, cartOutline });
  }

  ngOnInit() {
    this.cartService.cart$.subscribe(cartItems => {
      this.items = cartItems;
      this.total = this.cartService.calcularTotal();
    });
  }

  removerItem(index: number) {
    this.cartService.eliminarProducto(index);
  }

async procesarCompra() {
    console.log('1. Botón presionado');
    
    const auth = getAuth();
    const usuarioActual = auth.currentUser;

    if (!usuarioActual) {
      console.log('2. Error: No hay usuario autenticado');
      this.mostrarAlerta('Error', 'Debes iniciar sesión.');
      return;
    }

    const nuevaVenta = {
      clienteId: usuarioActual.uid,
      clienteCorreo: usuarioActual.email,
      fecha: new Date().toISOString(),
      total: this.total,
      estado: 'Procesando',
      productos: this.items
    };

    console.log('3. Datos listos para enviar:', nuevaVenta);

    try {
      const db = getFirestore();
      await addDoc(collection(db, 'ventas'), nuevaVenta);
      console.log('¡Venta guardada con éxito!');

      // Alerta con redirección automática al Catálogo
      const alert = await this.alertController.create({
        header: '¡Pedido Confirmado!',
        message: 'Tu orden ha sido registrada exitosamente.',
        buttons: [
          {
            text: 'Ir al Catálogo',
            handler: () => {
              // 1. Vaciamos el carrito
              this.cartService.vaciarCarrito();
              // 2. Redirigimos al catálogo
              this.router.navigate(['/tabs/catalog']);
            }
          }
        ]
      });
      await alert.present();

    } catch (error) {
      console.error('ERROR AL GUARDAR:', error);
      this.mostrarAlerta('Error', 'No pudimos registrar tu compra. Revisa tu conexión.');
    }
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}