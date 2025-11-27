package ec.edu.espe.datos.model;

public class Estudiante {
    private String id;
    private String nombres;
    private int edad;

    public Estudiante(String id, String nombres, int edad) {
        this.id = id;
        this.nombres = nombres;
        this.edad = edad;
    }

    public static Estudiante crear(String id, String nombres, int edad) {
        if (id == null || id.isEmpty() || nombres == null || nombres.isEmpty() || edad <= 0) {
            throw new IllegalArgumentException("Datos inválidos para crear un Estudiante");
        }
        return new Estudiante(id, nombres, edad);
    }

    public String getId() {
        return id;
    }

    public String getNombres() {
        return nombres;
    }

    public int getEdad() {
        return edad;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public void setEdad(int edad) {
        this.edad = edad;
    }
}
