import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, 
  IonItem, IonLabel, IonIcon, IonButton 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline, personCircleOutline, mailOutline } from 'ionicons/icons';

// Importaciones de Firebase Auth
import { getAuth, signOut } from 'firebase/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonList, IonItem, IonLabel, IonIcon, IonButton
  ]
})
export class ProfilePage implements OnInit {
  usuarioCorreo: string | null = '';

  constructor(private router: Router) {
    addIcons({ logOutOutline, personCircleOutline, mailOutline });
  }

  ngOnInit() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      this.usuarioCorreo = user.email;
    }
  }

  async cerrarSesion() {
    const auth = getAuth();
    await signOut(auth);
    this.router.navigate(['/login']);
  }
}