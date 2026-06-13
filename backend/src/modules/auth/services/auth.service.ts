import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from './usuarios.service';

interface AuthDto {
  nombre: string;
  email: string;
  clave: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async login(dto: {
    email: string;
    clave: string;
  }): Promise<{ accessToken: string }> {
    const usuario = await this.usuariosService.buscarUsuarioActivoPorNombre(
      dto.email,
    );

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const isMatch = await bcrypt.compare(dto.clave, usuario.clave);
    if (!isMatch) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = { email: usuario.nombre, sub: usuario.id };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async registrar(dto: AuthDto): Promise<any> {
    const salt = await bcrypt.genSalt(10);
    const claveEncriptada = await bcrypt.hash(dto.clave, salt);

    const usuarioNuevo = {
      nombre: dto.nombre,
      email: dto.email,
      clave: claveEncriptada,
      estado: 'PENDIENTE',
    };

    return await this.usuariosService.crearUsuario(usuarioNuevo as any);
  }
}
