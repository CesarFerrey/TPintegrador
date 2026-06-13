import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ListClienteDTO } from "./list-cliente-dto";
import { EstadosClientesEnum } from "../estados-clientes-enum";

@Injectable({
    providedIn: 'root'
})
export class ClientesListadoApiClient {

    private readonly httpClient = inject(HttpClient);
    
    // 🔥 NUEVO: Definimos la dirección real de tu servidor NestJS
    private readonly baseUrl = 'http://localhost:3000';

    buscarClientes(estado?: EstadosClientesEnum): Observable<ListClienteDTO[]> {

        // 🔥 MODIFICADO: Ahora concatenamos la URL base para que le pegue al puerto correcto
        let path: string = `${this.baseUrl}/api/v1/clientes`;

        if (estado) {
            path += "?estado=" + estado;
        }

        return this.httpClient.get<ListClienteDTO[]>(path);
    }
}