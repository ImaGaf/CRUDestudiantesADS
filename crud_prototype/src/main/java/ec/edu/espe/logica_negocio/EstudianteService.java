package ec.edu.espe.logica_negocio;

import ec.edu.espe.datos.model.Estudiante;
import ec.edu.espe.datos.repository.EstudianteRepository;
import java.util.List;

public class EstudianteService {

    private EstudianteRepository repo;

    public EstudianteService() {
        this.repo = new EstudianteRepository();
    }

    public Estudiante crearEstudiante(String id, String nombres, int edad) {
        Estudiante nuevo = Estudiante.crear(id, nombres, edad);
        repo.agregar(nuevo);
        return nuevo;
    }

    public List<Estudiante> listarEstudiantes() {
        return repo.obtenerTodos();
    }

    public boolean eliminarEstudiante(String id) {
        return repo.eliminar(id);
    }

    public Estudiante buscarPorId(String id) {
        return repo.buscar(id);
    }

    public boolean editarEstudiante(String id, String nombres, int edad) {

        Estudiante original = repo.buscar(id);
        if (original == null) {
            throw new RuntimeException("Estudiante no encontrado");
        }

        // === PROTOTYPE ===
        Estudiante copia = original.clone();

        System.out.println("=== Copia antes de editar ===");
        System.out.println(copia);

        original.setNombres(nombres);
        original.setEdad(edad);
        repo.actualizar(original);

        System.out.println("=== Copia después de editar (se mantiene igual) ===");
        System.out.println(copia);

        System.out.println("=== Original actualizado ===");
        System.out.println(original);

        return true;
    }
}
