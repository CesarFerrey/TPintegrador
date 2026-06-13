import { Component, effect, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { MessageService } from "primeng/api";
import { ListProyectoDTO } from "./list-proyecto-dto";
import { ProyectosListadoApiClient } from "./proyectos-listado-api-client";
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { Template } from "../../template/template";
import { TooltipModule } from 'primeng/tooltip';
import { GestionProyecto } from "../gestion/gestion-proyecto";

@Component({
  selector: "app-proyectos-listado",
  templateUrl: "./proyectos-listado.html",
  styleUrls: ["./proyectos-listado.css"],
  imports: [TableModule, ButtonModule, Template, TooltipModule, GestionProyecto]
})
export class ProyectosListado implements OnInit {

  private readonly messageService: MessageService = inject(MessageService);
  private readonly proyectosListadoApiClient: ProyectosListadoApiClient = inject(ProyectosListadoApiClient);

  proyectos: WritableSignal<ListProyectoDTO[]> = signal([]);
  dialogVisible: WritableSignal<boolean> = signal(false);
  proyectoSeleccionado: WritableSignal<ListProyectoDTO | null> = signal<ListProyectoDTO | null>(null);

  constructor() {
    effect(() => {
      if (!this.dialogVisible()) {
        this.refrescarProyectos();
      }
    });
  }

  ngOnInit(): void {
    this.refrescarProyectos();
  }

  refrescarProyectos(): void {
    this.proyectosListadoApiClient.buscarProyectos().subscribe({
      next: (data) => {
        this.proyectos.set(data);
      },
      error: (error) => {
        // Muestra el mensaje de error flotante en la pantalla
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Error al obtener los proyectos desde el servidor.' 
        });
        
        // 🚀 BYPASS: Cargamos proyectos de prueba para que la tabla no quede vacía
        this.proyectos.set([
          { id: 1, nombre: 'Sistema de Catálogo Digital', cliente: { nombre: 'Calzados Topper' }, estado: 'ACTIVO' },
          { id: 2, nombre: 'Control de Stock - Pastelería', cliente: { nombre: 'Brownies SDE' }, estado: 'EN_PROCESO' },
          { id: 3, nombre: 'Aplicación Web de Reservas', cliente: { nombre: 'Municipalidad' }, estado: 'FINALIZADO' }
        ] as any);
      }
    });
  }

  crearProyecto(): void {
    this.dialogVisible.set(true);
  }

  editarProyecto(proyecto: ListProyectoDTO): void {
    this.dialogVisible.set(true);
    this.proyectoSeleccionado.set(proyecto);
  }

  gestionarTareas(proyecto: ListProyectoDTO): void {
    window.open(`/proyectos/${proyecto.id}/tareas`, '_blank');
  }

}