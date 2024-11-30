import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class HomeComponent {

  public username: string = ''; // Variable para almacenar 

  constructor(private router: Router) {} // Inyecta el servicio Router para manejar la navegación.

  // Método de ingreso:
  ingresar(): void {
    alert("Ingreso exitoso 😊"); // Muestra un mensaje de éxito cuando el usuario ingresa.
    
    // Navega al componente 'chat' pasando el nombre de usuario como parámetro en la URL.
    this.router.navigate([`chat/${this.username}`]); 
    
    console.log(this.username); // Muestra el nombre de usuario en la consola.
    
    this.username = ''; 
  }

}
