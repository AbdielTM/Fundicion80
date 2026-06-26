import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { 
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonButton, 
  IonIcon, IonContent, IonFooter, IonRadioGroup, IonRadio, IonItem, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cartOutline } from 'ionicons/icons';
import { CartService } from '../../services/cart.service';

// Importaciones de Firestore para leer UN solo documento
import { getFirestore, doc, getDoc } from 'firebase/firestore';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonButton, 
    IonIcon, IonContent, IonFooter, IonRadioGroup, IonRadio, IonItem, IonSpinner
  ]
})
export class ProductDetailPage implements OnInit {
  producto: any = null; // Inicializamos en null para saber cuándo está cargando
  colorSeleccionado: string = '';
  tallaSeleccionada: number = 0;

  constructor(
    private route: ActivatedRoute,
    private toastController: ToastController,
    private cartService: CartService
  ) {
    addIcons({ cartOutline });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const idProducto = params['id'];
      if (idProducto) {
        this.cargarDetalleProducto(idProducto);
      }
    });
  }

  async cargarDetalleProducto(id: string) {
    try {
      const db = getFirestore();
      // Apuntamos directamente a la sandalia por su ID único
      const docRef = doc(db, 'productos', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Si existe, guardamos los datos (incluyendo sus arreglos de colores y tallas)
        this.producto = { id: docSnap.id, ...docSnap.data() };
      } else {
        console.log('No se encontró el producto.');
      }
    } catch (error) {
      console.error('Error al cargar detalle:', error);
    }
  }

  async agregarAlCarrito() {
    const itemParaCarrito = {
      producto: {
        id: this.producto.id,
        nombre: this.producto.nombre,
        precio: this.producto.precio,
        imagenUrl: this.producto.imagenUrl
      },
      color: this.colorSeleccionado,
      talla: this.tallaSeleccionada,
      cantidad: 1,
      subtotal: this.producto.precio
    };

    this.cartService.agregarProducto(itemParaCarrito);

    const toast = await this.toastController.create({
      message: `${this.producto.nombre} agregada al carrito.`,
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    await toast.present();
  }
}