import { UsuariosService } from '../services/usuarios.service';
export declare class AdminController {
    private readonly usuariosService;
    constructor(usuariosService: UsuariosService);
    activarUsuario(id: number): Promise<void>;
}
