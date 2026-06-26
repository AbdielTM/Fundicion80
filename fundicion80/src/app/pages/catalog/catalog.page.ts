import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonButton, 
  IonIcon, 
  IonContent, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonCard, 
  IonCardHeader, 
  IonCardSubtitle, 
  IonCardTitle,
  IonSpinner // <-- Aquí está el que nos faltaba
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cartOutline } from 'ionicons/icons';

// Importaciones de Firestore para leer la base de datos
import { getFirestore, collection, getDocs } from 'firebase/firestore';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.page.html',
  styleUrls: ['./catalog.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonButtons, 
    IonButton, 
    IonIcon, 
    IonContent, 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonCard, 
    IonCardHeader, 
    IonCardSubtitle, 
    IonCardTitle,
    IonSpinner // <-- Y aquí también se lo declaramos a Angular
  ]
})
export class CatalogPage implements OnInit {

  productos: any[] = [];

  constructor(private router: Router) {
    addIcons({ cartOutline });
  }

  ngOnInit() {
    this.cargarProductosDesdeFirebase();
  }

  async cargarProductosDesdeFirebase() {
    try {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, 'productos'));
      
      this.productos = []; 
      
      querySnapshot.forEach((doc) => {
        this.productos.push({ id: doc.id, ...doc.data() });
      });

      console.log('Productos de Firebase:', this.productos);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }

  verProducto(id: string) {
    this.router.navigate(['/product-detail'], { queryParams: { id } });
  }

  irAlCarrito() {
    this.router.navigate(['/cart']);
  }
}