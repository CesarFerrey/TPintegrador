import { Component, inject } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { LoginApiClient } from "./login-api-client";
import { MessageService } from "primeng/api";
import { AuthStore } from "../auth-store";
import { Router } from "@angular/router";


@Component({
    selector: "app-login",
    templateUrl: "./login.html",
    styleUrl: "./login.css",
    imports: [ButtonModule, InputTextModule, PasswordModule, ReactiveFormsModule]

})
export class Login {

    private readonly loginApiClient: LoginApiClient = inject(LoginApiClient);

    private readonly messageService: MessageService = inject(MessageService)

    private readonly authStore: AuthStore = inject(AuthStore);

    private readonly router: Router = inject(Router);

    readonly form: FormGroup = new FormGroup({
        email: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", [Validators.required])
    });


    iniciarSesion() {
        if (!this.form.valid){
            this.messageService.add({severity: "error", summary: "Los campos del formulario son requeridos"});
            return;

    }

        const email: string = this.form.value.email

        const password: string = this.form.value.password

        this.loginApiClient.iniciarSesion(email, password).subscribe({
            next: (data)=>{
                this.authStore.guardarToken(data.accessToken);
                this.router.navigateByUrl("/proyectos");
            },

            error: (err)=>{
                this.messageService.add({severity: "error", summary: "Ha ocurrido un error al iniciar sesión"})
            }

        });

    }}
