package ec.edu.espe.logica_negocio;

import ec.edu.espe.datos.model.Estudiante;
import ec.edu.espe.datos.repository.EstudianteRepository;
import ec.edu.espe.logica_negocio.strategy.SortingStrategy;
import ec.edu.espe.logica_negocio.strategy.SortByIdStrategy;

public class EstudianteService {

    private EstudianteRepository repository;
    private SortingStrategy<Estudiante> sortingStrategy;

    public EstudianteService() {
        this.repository = new EstudianteRepository();
        // estrategia por defecto
        this.sortingStrategy = new SortByIdStrategy();
    }

    public void setSortingStrategy(SortingStrategy<Estudiante> sortingStrategy) {
        this.sortingStrategy = sortingStrategy;
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
        // aplicando el patrón strategy
        // el servicio delega el algoritmo de ordenamiento al objeto estrategia
        return sortingStrategy.ordenar(repository.listar());
    }

    public Estudiante buscarPorId(String id) {
        return repository.buscarPorId(id);
    }
}
