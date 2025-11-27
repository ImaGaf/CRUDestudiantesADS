package ec.edu.espe.controller;

import ec.edu.espe.logica_negocio.EstudianteService;
import ec.edu.espe.logica_negocio.strategy.SortingStrategy;
import ec.edu.espe.datos.model.Estudiante;
import java.util.List;

public class EstudianteController {

    private EstudianteService service;

    public EstudianteController(EstudianteService service) {
        this.service = service;
    }

    // patrón strategy: permite cambiar el algoritmo de ordenamiento en tiempo de
    // ejecución
    public void setSortingStrategy(SortingStrategy<Estudiante> strategy) {
        service.setSortingStrategy(strategy);
    }

    public Estudiante crearEstudiante(String id, String nombres, int edad) {
        return service.crearEstudiante(id, nombres, edad);
    }

    public List<Estudiante> obtenerTodos() {
        return service.listarEstudiantes();
    }

    public boolean eliminar(String id) {
        return service.eliminarEstudiante(id);
    }

    public boolean editar(String id, String nombres, int edad) {
        return service.editarEstudiante(id, nombres, edad);
    }

    public Estudiante buscar(String id) {
        return service.buscarPorId(id);
    }
}
