import * as CryptoJS from "crypto-js";
import { environment } from "../environments/environment";

// Encriptar los datos:

export const encrypt = (data: string): string => {
  // Encripta el mensaje 'data' usando el algoritmo AES
  // Luego convierte el resultado a una cadena de texto.
  return CryptoJS.AES.encrypt(data, environment.keyEcrypt).toString();
}

// Función para desencriptar los datos encriptados usando AES
export const decrypt = (valueEncrypt: string): string | null => {
  // Desencripta el mensaje 'valueEncrypt' usando el algoritmo AES y la clave definida en environment.keyEcrypt.
  const valueDecrypt = CryptoJS.AES.decrypt(valueEncrypt, environment.keyEcrypt).toString(CryptoJS.enc.Utf8);

  // Si el valor desencriptado es vacío o no válido, retorna null.
  if(!valueDecrypt) {
    return null;
  }

  // Si la desencriptación es exitosa, retorna el mensaje desencriptado.
  return valueDecrypt;
}

