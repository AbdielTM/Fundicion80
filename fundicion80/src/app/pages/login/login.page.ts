import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { 
  IonContent, 
  IonItem, 
  IonInput, 
  IonButton, 
  IonIcon 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { footstepsOutline } from 'ionicons/icons';

// Importaciones de Firebase Auth
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonContent, 
    IonItem, 
    IonInput, 
    IonButton, 
    IonIcon
  ]
})
export class LoginPage implements OnInit {
  correo = '';
  contrasena = '';

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({ footstepsOutline });
  }

  ngOnInit() {}

  async ingresar() {
    if (!this.correo || !this.contrasena) {
      this.mostrarAlerta('Error', 'Por favor, completa todos los campos.');
      return;
    }

    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, this.correo, this.contrasena);
      // Redirigir al catálogo tras iniciar sesión exitosamente
      this.router.navigate(['/catalog']);
    } catch (error: any) {
      console.error('Error al ingresar:', error);
      this.mostrarAlerta('Error de Acceso', 'Correo o contraseña incorrectos.');
    }
  }

  async registrar() {
    if (!this.correo || !this.contrasena) {
      this.mostrarAlerta('Error', 'Ingresa un correo y contraseña para registrarte.');
      return;
    }

    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, this.correo, this.contrasena);
      this.mostrarAlerta('¡Éxito!', 'Cuenta creada correctamente. Ya puedes Iniciar Sesión con esos datos.');
    } catch (error: any) {
      console.error('Error en registro:', error);
      this.mostrarAlerta('Error de Registro', 'No se pudo crear la cuenta. Recuerda que la contraseña debe tener al menos 6 caracteres.');
    }
  }

  // Función para mostrar mensajes en pantalla
  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}