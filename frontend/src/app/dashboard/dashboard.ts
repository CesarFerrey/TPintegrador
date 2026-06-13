
import { Component, inject, OnInit, signal } from '@angular/core';
import { ProyectosListadoApiClient } from '../proyectos/listado/proyectos-listado-api-client';
import { ListProyectoDTO } from '../proyectos/listado/list-proyecto-dto';
import { Chart, registerables } from 'chart.js';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class DashboardComponent implements OnInit {

  private graficoEstados: Chart | null = null;
  private graficoClientes: Chart | null = null;
  private readonly api = inject(ProyectosListadoApiClient);
  proyectos: ListProyectoDTO[] = [];


  totalProyectos = signal(0);
  proyectosActivos = signal(0);
  proyectosFinalizados = signal(0);
  proyectosBaja = signal(0);
  clientesTotales = signal(0);
  fechaActualizacion = new Date().toLocaleString('es-AR');

  ngOnInit(): void {

    Chart.register(...registerables);
  
    this.cargarDatos();
  
  }

  cargarDatos(): void {

    this.api.buscarProyectos().subscribe({

      next: (proyectos: ListProyectoDTO[]) => {

        this.proyectos = proyectos;
      
        this.totalProyectos.set(proyectos.length);
      
        this.proyectosActivos.set(
          proyectos.filter(
            p => p.estado?.toUpperCase() === 'ACTIVO'
          ).length
        );
      
        this.proyectosFinalizados.set(
          proyectos.filter(
            p => p.estado?.toUpperCase() === 'FINALIZADO'
          ).length
        );
      
        this.proyectosBaja.set(
          proyectos.filter(
            p => p.estado?.toUpperCase() === 'BAJA'
          ).length
        );
      
        // CLIENTES TOTALES
      
        const clientesUnicos = new Set(
          proyectos.map(p => p.cliente.nombre)
        );
      
        this.clientesTotales.set(
          clientesUnicos.size
        );
      
        // GRÁFICOS
      
        const activos = proyectos.filter(
          p => p.estado === 'ACTIVO'
        ).length;
      
        const finalizados = proyectos.filter(
          p => p.estado === 'FINALIZADO'
        ).length;
      
        const baja = proyectos.filter(
          p => p.estado === 'BAJA'
        ).length;
      
        this.crearGraficoEstados(
          activos,
          finalizados,
          baja
        );
        
        this.crearGraficoClientes();
        
        } 
        
        }); 
      } 

  exportarCSV(): void {

    const encabezados = [
      'ID',
      'Proyecto',
      'Estado',
      'Cliente'
    ];
  
    const filas = this.proyectos.map(p => [
      p.id,
      p.nombre,
      p.estado,
      p.cliente.nombre
    ]);
  
    const csv = [
      encabezados.join(','),
      ...filas.map(f => f.join(','))
    ].join('\n');
  
    const blob = new Blob(
      [csv],
      { type: 'text/csv;charset=utf-8;' }
    );
  
    const url = window.URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.download = 'proyectos.csv';
    link.click();
  
    window.URL.revokeObjectURL(url);
  }

  private crearGraficoClientes(): void {

    const proyectosPorCliente: Record<string, number> = {};
  
    this.proyectos.forEach(proyecto => {
  
      const cliente = proyecto.cliente.nombre;
  
      proyectosPorCliente[cliente] =
        (proyectosPorCliente[cliente] || 0) + 1;
    });
  
    const labels = Object.keys(proyectosPorCliente);
    const data = Object.values(proyectosPorCliente);
  
    if (this.graficoClientes) {
      this.graficoClientes.destroy();
    }
  
    this.graficoClientes = new Chart('graficoClientes', {
  
      type: 'bar',
  
      data: {
        labels: labels,
        datasets: [{
          label: 'Cantidad de proyectos',
          data: data
        }]
      },
  
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Proyectos por Cliente'
          }
        }
      }
  
    });
  
  }


  private crearGraficoEstados(
    activos: number,
    finalizados: number,
    baja: number
  ): void {
  
    if (this.graficoEstados) {
      this.graficoEstados.destroy();
    }
  
    this.graficoEstados = new Chart('graficoEstados', {
      type: 'doughnut',
  
      data: {
        labels: ['Activos', 'Finalizados', 'Baja'],
        datasets: [{
          data: [activos, finalizados, baja]
        }]
      },
  
      options: {
        responsive: true,
        maintainAspectRatio: false,
      
        cutout: '65%'
      }

    });
  
  }

}
