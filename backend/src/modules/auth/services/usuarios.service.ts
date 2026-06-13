import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../entitites/usuario.entity';
import { Repository } from 'typeorm';
import { EstadosUsuariosEnum } from '../enums/estados-usuarios.enum';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRespository: Repository<Usuario>,
  ) {}

  // Este método busca por EMAIL en la base de datos
  async buscarUsuarioActivoPorNombre(
    nombreORemail: string,
  ): Promise<Usuario | null> {
    return await this.usuariosRespository.findOneBy({
      estado: EstadosUsuariosEnum.ACTIVO,
      email: nombreORemail, // Buscamos en la columna email
    });
  }

  async crearUsuario(usuarioData: Partial<Usuario>): Promise<Usuario> {
    const nuevoUsuario = this.usuariosRespository.create(usuarioData);
    return await this.usuariosRespository.save(nuevoUsuario);
  }

  async activarUsuario(id: number): Promise<any> {
    return await this.usuariosRespository.update(id, {
      estado: EstadosUsuariosEnum.ACTIVO,
    });
  }
}
