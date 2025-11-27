package ec.edu.espe.logica_negocio.strategy;

import java.util.List;

public interface SortingStrategy<T> {
    List<T> ordenar(List<T> items);
}
