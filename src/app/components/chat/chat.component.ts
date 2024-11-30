import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import { modelMessage } from 'src/app/models/modelMessage';
import { ChatService } from 'src/app/services/chat.service';
import { decrypt } from 'src/app/util/util-encrypt';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  almacenarSms: string = "";
  idUsuario: string = "";
  recibidoEnviadoSms: any[] = [];

  constructor(
    private chatService: ChatService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

   // Inicializa la conexión con el socket y obtiene el ID del usuario de la URL.
   ngOnInit(): void {
    this.idUsuario = this.route.snapshot.params["userid"]; // Obtener el ID del usuario desde los parámetros de la URL.
    this.chatService.ingresarSala("777"); // El usuario ingresa a la sala de chat: 777
    this.listenerMessage(); // Comienza a escuchar los mensajes entrantes.
  }

  // Envía un mensaje cifrado al servidor.
  enviarSms(): void {
    const chatMessage = {
      message: this.almacenarSms, // Mensaje ingresado
      user: this.idUsuario           // ID del usuario
    } as modelMessage;

    // Llama al servicio para enviar el mensaje cifrado.
    this.chatService.enviarSmsEncrypt("777", chatMessage); 
    this.almacenarSms = ''; // Limpia el campo de entrada.
  }

  // Método para escuchar los mensajes entrantes y mostrarlos en la interfaz.
  listenerMessage() {
    this.chatService.getMessageSubject().subscribe((messages: any) => {
      // Asocia los mensajes recibidos a la lista y determina si el mensaje es del usuario o del receptor.
      this.recibidoEnviadoSms = messages.map((item: any) => ({
        ...item,
        message_side: item.user === this.idUsuario ? 'sender' : 'receiver' // (enviado o recibido).
      }));
    });
  }

  // Método para descifrar el mensaje 
  decifrarSms(message: string): null | string {
    if(environment.encrypt) {
      return decrypt(message); // Desencripta el mensaje si la encriptación está habilitada.
    }

    return null; // Si no está habilitada la encriptación, retorna null.
  }

  // Desconecta al usuario y muestra un mensaje de alerta.
  desconectar() {
    alert("Usted fue Desconectado, no podra enviar SMS 😢");
    this.chatService.disconnect(); // Llama al servicio para desconectar la conexión del socket.
  }

  // Reconecta al usuario y muestra un mensaje de alerta.
  reconectar() {
    alert("Usted fue reconectado 😊");
    this.chatService.initConnectionSocket(); // Inicializa la conexión del socket.
    this.chatService.ingresarSala("777"); // Reingresa a la sala de chat.
  }

}