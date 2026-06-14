import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../entitites/usuario.entity';
import { Repository } from 'typeorm'; // <--- ESTA ES LA ÚNICA QUE NECESITAS
import { EstadosUsuariosEnum } from '../enums/estados-usuarios.enum';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRespository: Repository<Usuario>,
  ) {}

  async buscarUsuarioActivoPorNombre(
    nombreORemail: string,
  ): Promise<Usuario | null> {
    return await this.usuariosRespository.findOneBy({
      estado: EstadosUsuariosEnum.ACTIVO,
      email: nombreORemail,
    });
  }

  async crearUsuario(usuarioData: Partial<Usuario>): Promise<Usuario> {
    try {
      const nuevoUsuario = this.usuariosRespository.create({
        ...usuarioData,
        estado: EstadosUsuariosEnum.ACTIVO,
      });
      return await this.usuariosRespository.save(nuevoUsuario);
    } catch (error) {
      console.error('Error al guardar usuario en la BD:', error);
      throw new InternalServerErrorException('No se pudo registrar el usuario');
    }
  }

  async activarUsuario(id: number): Promise<any> {
    return await this.usuariosRespository.update(id, {
      estado: EstadosUsuariosEnum.ACTIVO,
    });
  }
}
