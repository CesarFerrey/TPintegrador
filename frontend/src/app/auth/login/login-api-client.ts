import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class LoginApiClient{

    private readonly client: HttpClient = inject(HttpClient)

    iniciarSesion(email: string, password: string): Observable<{ accessToken: string }> {

        return this.client.post<{ accessToken: string }>("http://localhost:3000/api/v1/auth/login", { email, password });

    }



}
