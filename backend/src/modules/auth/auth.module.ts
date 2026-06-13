import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AdminController } from './controllers/admin.controller'; // 1. IMPORTAR EL NUEVO CONTROLADOR
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entitites/usuario.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from './services/usuarios.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';

@Module({
  // 2. AGREGAR EL ADMINCONTROLLER A LA LISTA
  controllers: [AuthController, AdminController],
  providers: [UsuariosService, AuthService, AuthGuard],
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,

      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '8h' },
        };
      },
    }),
  ],
  // 3. AGREGAR USUARIOSSERVICE A LOS EXPORTS
  // (Para que otros módulos puedan usar la lógica de activación si lo necesitan)
  exports: [AuthGuard, UsuariosService],
})
export class AuthModule {}
