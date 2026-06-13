import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register'; // 🔥 NUEVO: Importamos tu componente de registro
import { TareasListado } from './proyectos/tareas/listado/tareas-listado';
import { ProyectosListado } from './proyectos/listado/proyectos-listado';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
    {
        path: "login",
        component: Login
    },
    {
        // 🔥 NUEVO: Declaramos la ruta pública para el formulario de registro
        path: "registrar",
        component: Register
    },
    {
        path: 'proyectos/:id/tareas',
        component: TareasListado,
        /*canActivate: [authGuard]*/
    },
    {
        path: 'proyectos',
        component: ProyectosListado,
        canActivate: [authGuard]
    },
    {
        path: "**",
        redirectTo: "proyectos"
    }
];