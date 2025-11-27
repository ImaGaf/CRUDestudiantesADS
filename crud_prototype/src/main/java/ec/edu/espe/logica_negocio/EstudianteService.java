package ec.edu.espe.logica_negocio;

import ec.edu.espe.datos.model.Estudiante;
import ec.edu.espe.datos.repository.EstudianteRepository;

public class EstudianteService {

    private EstudianteRepository repository;

    public EstudianteService() {
        this.repository = EstudianteRepository.getInstance();
    }

    public Estudiante crearEstudiante(String id, String nombres, int edad) {
        if (repository.buscarPorId(id) != null) {
            throw new IllegalArgumentException("El ID ya existe");
        }

        Estudiante est = Estudiante.crear(id, nombres, edad);
        repository.agregar(est);
        return est;
    }

    public boolean editarEstudiante(String id, String nombres, int edad) {
        if (repository.buscarPorId(id) == null) {
            throw new IllegalArgumentException("Estudiante no encontrado");
        }
        return repository.editar(id, nombres, edad);
    }

    public boolean eliminarEstudiante(String id) {
        if (repository.buscarPorId(id) == null) {
            throw new IllegalArgumentException("Estudiante no encontrado");
        }
        return repository.eliminar(id);
    }

    public java.util.List<Estudiante> listarEstudiantes() {
        return repository.listar();
    }

    public Estudiante buscarPorId(String id) {
        return repository.buscarPorId(id);
    }
    
}
