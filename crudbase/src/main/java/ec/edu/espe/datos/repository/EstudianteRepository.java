package ec.edu.espe.datos.repository;

import ec.edu.espe.datos.model.Estudiante;
import java.util.ArrayList;
import java.util.List;

public class EstudianteRepository {

    private List<Estudiante> estudiantes;

    public EstudianteRepository() {
        estudiantes = new ArrayList<>();
    }

    public void agregar(Estudiante estudiante) {
        estudiantes.add(estudiante);
    }

    public boolean editar(String id, String nombres, int edad) {
        Estudiante est = buscarPorId(id);
        if (est == null) return false;

        est.setNombres(nombres);
        est.setEdad(edad);
        return true;
    }

    public boolean eliminar(String id) {
        return estudiantes.removeIf(e -> e.getId().equals(id));
    }

    public List<Estudiante> listar() {
        return estudiantes;
    }

    public Estudiante buscarPorId(String id) {
        return estudiantes.stream()
                .filter(e -> e.getId().equals(id))
                .findFirst()
                .orElse(null);
    }
}
