import { Usuario } from '../entitites/usuario.entity';
import { Repository } from 'typeorm';
export declare class UsuariosService {
    private readonly usuariosRespository;
    constructor(usuariosRespository: Repository<Usuario>);
    buscarUsuarioActivoPorNombre(nombreORemail: string): Promise<Usuario | null>;
    crearUsuario(usuarioData: Partial<Usuario>): Promise<Usuario>;
    activarUsuario(id: number): Promise<any>;
}
