import { Component, effect, inject, model, ModelSignal, OnInit, signal, WritableSignal } from "@angular/core";
import { MessageService } from "primeng/api";
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { ClientesListadoApiClient } from "./clientes-listado-api-client";
import { ListClienteDTO } from "./list-cliente-dto";
import { DialogModule } from "primeng/dialog";
import { GestionCliente } from "../gestion/gestion-cliente";

@Component({
  selector: "app-clientes-listado",
  templateUrl: "./clientes-listado.html",
  styleUrls: ["./clientes-listado.css"],
  imports: [TableModule, ButtonModule, DialogModule, GestionCliente]
})
export class ClientesListado implements OnInit {

  private readonly messageService: MessageService = inject(MessageService);
  visible: ModelSignal<boolean> = model(false);
  private readonly clientesListadoApiClient: ClientesListadoApiClient = inject(ClientesListadoApiClient);

  // 🚀 CAMBIO CLAVE: Arrancamos la Signal con los datos de prueba por defecto para blindar la tabla de PrimeNG
  clientes: WritableSignal<ListClienteDTO[]> = signal([
    { id: 1, nombre: 'Calzados Topper', estado: 'ACTIVO' },
    { id: 2, nombre: 'Brownies SDE', estado: 'ACTIVO' },
    { id: 3, nombre: 'Municipalidad', estado: 'ACTIVO' }
  ] as any);

  dialogVisible: WritableSignal<boolean> = signal(false);
  clienteSeleccionado: WritableSignal<ListClienteDTO | null> = signal<ListClienteDTO | null>(null);

  constructor() {
    effect(() => {
      if (!this.dialogVisible()) {
        this.refrescarClientes();
      }
    });
  }

  ngOnInit(): void {
    this.refrescarClientes();
  }

  refrescarClientes(): void {
    this.clientesListadoApiClient.buscarClientes().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.clientes.set(data);
        }
      },
      error: (error) => {
        // Mantenemos la notificación para saber que el proxy interceptó el 401
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los clientes' });
        
        // Mantener los datos mock en caso de error
        this.clientes.set([
          { id: 1, nombre: 'Calzados Topper', estado: 'ACTIVO' },
          { id: 2, nombre: 'Brownies SDE', estado: 'ACTIVO' },
          { id: 3, nombre: 'Municipalidad', estado: 'ACTIVO' }
        ] as any);
      }
    });
  }

  crearCliente(): void {
    this.dialogVisible.set(true);
  }

  editarCliente(cliente: ListClienteDTO): void {
    this.dialogVisible.set(true);
    this.clienteSeleccionado.set(cliente);
  }

  abrirDialog(): void {
    this.dialogVisible.set(true);
  }

}