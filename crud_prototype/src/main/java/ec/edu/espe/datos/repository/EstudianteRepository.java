package ec.edu.espe.datos.repository;

import ec.edu.espe.datos.model.Estudiante;
import java.util.ArrayList;
import java.util.List;

public class EstudianteRepository {

    private List<Estudiante> bd = new ArrayList<>();

    public void agregar(Estudiante e) {
        bd.add(e);
    }

    public List<Estudiante> obtenerTodos() {
        return bd;
    }

    public boolean eliminar(String id) {
        return bd.removeIf(e -> e.getId().equals(id));
    }

    public Estudiante buscar(String id) {
        return bd.stream().filter(e -> e.getId().equals(id)).findFirst().orElse(null);
    }

    public void actualizar(Estudiante actualizado) {
        for (int i = 0; i < bd.size(); i++) {
            if (bd.get(i).getId().equals(actualizado.getId())) {
                bd.set(i, actualizado);
                break;
            }
        }
    }
}
