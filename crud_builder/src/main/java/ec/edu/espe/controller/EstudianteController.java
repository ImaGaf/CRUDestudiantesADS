package ec.edu.espe.controller;

import ec.edu.espe.logica_negocio.EstudianteService;
import ec.edu.espe.datos.model.Estudiante;
import java.util.List;

public class EstudianteController {

    private EstudianteService service;

    public EstudianteController(EstudianteService service) {
        this.service = service;
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
