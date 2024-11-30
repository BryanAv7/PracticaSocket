
import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { modelMessage} from '../models/modelMessage';
import { BehaviorSubject } from 'rxjs';
import { encrypt } from 'src/app/util/util-encrypt';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient: any;  // Variable que mantiene la conexión del cliente STOMP.
  private messageSubject: BehaviorSubject<modelMessage[]> = new BehaviorSubject<modelMessage[]>([]);  // Comportamiento de flujo de mensajes, inicializado con un array vacío.

  constructor() {
    this.initConnectionSocket();  // Llama al método para inicializar la conexión al socket.
  }

  // Método para iniciar la conexión con el servidor WebSocket.
  initConnectionSocket(): void {
    const url = '/chat-socket';  // Define la URL del servidor WebSocket.
    
    // Crea la instancia de la conexión usando SockJS.
    const socket = new SockJS(url);
    
    // Usa STOMP sobre la conexión SockJS para establecer comunicación WebSocket.
    this.stompClient = Stomp.over(socket);
  }

  // Método para unirse a una sala de chat especificada por 'salaId'.
  ingresarSala(salaId: string) {
    this.stompClient.connect({}, () => {
      // Se suscribe al canal de mensajes para la sala indicada.
      this.stompClient.subscribe(`/topic/${salaId}`, (messages: any) => {
        
        const messageContent = JSON.parse(messages.body);  // Convierte el mensaje recibido en formato JSON.
        console.log(messageContent);  // Imprime el mensaje recibido para depuración.

        const currentMessage = this.messageSubject.getValue();  // Obtiene el valor actual de los mensajes.

        currentMessage.push(messageContent);  // Añade el nuevo mensaje a la lista actual.

        this.messageSubject.next(currentMessage);  // Actualiza el flujo de mensajes con el nuevo mensaje.
      });
    });
  }

  // Método para enviar un mensaje a una sala de chat.
  enviarSmsEncrypt(salaId: string, chatMessage: modelMessage): void {

    console.log(encrypt(chatMessage.message));  // Imprime el mensaje encriptado (para depuración).

    // Si la encriptación está habilitada en el entorno, encripta el mensaje.
    if (environment.encrypt) {
      chatMessage.message = encrypt(chatMessage.message);  // Encripta el mensaje antes de enviarlo.
    }

    // Envía el mensaje al servidor WebSocket a través del canal de la sala.
    this.stompClient.send(`/app/chat/${salaId}`, {}, JSON.stringify(chatMessage));
  }

  // Método para obtener el flujo de mensajes como un Observable.
  getMessageSubject() {
    return this.messageSubject.asObservable(); 
  }

  // Método para desconectar la sesión del WebSocket.
  disconnect() {
    this.stompClient.disconnect();  // Llama al método para desconectar la sesión WebSocket.
  }
}