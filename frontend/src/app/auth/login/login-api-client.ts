import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class LoginApiClient {

    private readonly client: HttpClient = inject(HttpClient);

    // 🔥 NUEVO: Definimos la dirección real de tu servidor NestJS
    private readonly baseUrl = 'http://localhost:3000';

    iniciarSesion(nombre: string, clave: string): Observable<{ accessToken: string }> {
        
        // 🔥 MODIFICADO: Apuntamos al puerto 3000 usando la URL base
        return this.client.post<{ accessToken: string }>(`${this.baseUrl}/api/v1/auth`, { nombre, clave });

    }
}