import { Controller, Put, Param, ParseIntPipe } from '@nestjs/common';
import { UsuariosService } from '../services/usuarios.service';

@Controller('admin/usuarios')
export class AdminController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // Ruta para activar un usuario: PUT /api/admin/usuarios/:id/activar
  @Put(':id/activar')
  async activarUsuario(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usuariosService.activarUsuario(id);
    return;
  }
}
