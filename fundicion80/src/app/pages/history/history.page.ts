import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, 
  IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, 
  IonCardContent, IonList, IonItem, IonThumbnail, IonLabel, 
  IonBadge, IonIcon, IonSpinner 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bagCheckOutline } from 'ionicons/icons';

// Importaciones de Firebase
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, 
    IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, 
    IonCardContent, IonList, IonItem, IonThumbnail, IonLabel, 
    IonBadge, IonIcon, IonSpinner
  ]
})
export class HistoryPage implements OnInit {
  compras: any[] = [];
  cargando: boolean = true;

  constructor() {
    addIcons({ bagCheckOutline });
  }

  ngOnInit() {
    const auth = getAuth();
    // Este método espera a que Firebase confirme la sesión antes de buscar
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.cargarHistorial(user.uid);
      } else {
        this.cargando = false;
        console.log('No hay usuario autenticado en este momento.');
      }
    });
  }

  async cargarHistorial(uid: string) {
    try {
      const db = getFirestore();
      // Buscamos las ventas que le pertenecen a este ID de usuario
      const q = query(collection(db, 'ventas'), where('clienteId', '==', uid));
      const querySnapshot = await getDocs(q);
      
      this.compras = [];
      querySnapshot.forEach((doc) => {
        this.compras.push({ id: doc.id, ...doc.data() });
      });

      // Ordenamos para que la compra más reciente salga arriba
      this.compras.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    } catch (error) {
      console.error('Error al cargar el historial:', error);
    } finally {
      this.cargando = false;
    }
  }
}