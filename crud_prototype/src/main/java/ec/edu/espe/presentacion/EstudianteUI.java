package ec.edu.espe.presentacion;

import ec.edu.espe.controller.EstudianteController;
import ec.edu.espe.logica_negocio.EstudianteService;
import ec.edu.espe.datos.model.Estudiante;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableCellRenderer;
import javax.swing.table.TableCellEditor;
import java.awt.*;

public class EstudianteUI extends JFrame {

    private EstudianteController controller;
    private JTextField txtId, txtNombres, txtEdad;
    private JTable table;
    private DefaultTableModel model;

    private String modo = "crear";
    private String idEditando = null;

    public EstudianteUI() {
        controller = new EstudianteController(new EstudianteService());

        setTitle("Gestión de Estudiantes");
        setSize(700, 450);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        JPanel form = new JPanel(new GridLayout(4, 2));

        form.add(new JLabel("ID:"));
        txtId = new JTextField();
        form.add(txtId);

        form.add(new JLabel("Nombres:"));
        txtNombres = new JTextField();
        form.add(txtNombres);

        form.add(new JLabel("Edad:"));
        txtEdad = new JTextField();
        form.add(txtEdad);

        JButton btnGuardar = new JButton("Guardar");
        btnGuardar.addActionListener(e -> guardar());
        form.add(btnGuardar);

        add(form, BorderLayout.NORTH);

        model = new DefaultTableModel(new String[] { "ID", "Nombres", "Edad", "Acciones" }, 0);
        table = new JTable(model);

        table.setRowHeight(35);
        table.getColumn("Acciones").setPreferredWidth(160);
        table.getColumn("Acciones").setMinWidth(160);
        table.getColumn("Acciones").setMaxWidth(160);

        table.getColumn("Acciones").setCellRenderer(new ButtonRenderer());
        table.getColumn("Acciones").setCellEditor(new ButtonEditor());

        add(new JScrollPane(table), BorderLayout.CENTER);

        mostrarTabla();
        setVisible(true);
    }

    private void guardar() {
        try {
            String id = txtId.getText().trim();
            String nombres = txtNombres.getText().trim();
            String edadStr = txtEdad.getText().trim();

            if (id.isEmpty()) {
                throw new IllegalArgumentException("El ID no puede estar vacío");
            }

            if (nombres.isEmpty()) {
                throw new IllegalArgumentException("El nombre no puede estar vacío");
            }
            if (nombres.matches(".*\\d.*")) { // contiene algún número
                throw new IllegalArgumentException("El nombre no puede contener números");
            }

            if (edadStr.isEmpty()) {
                throw new IllegalArgumentException("La edad no puede estar vacía");
            }
            int edad;
            try {
                edad = Integer.parseInt(edadStr);
            } catch (NumberFormatException ex) {
                throw new IllegalArgumentException("La edad debe ser un número entero");
            }
            if (edad <= 0) {
                throw new IllegalArgumentException("La edad debe ser mayor a cero");
            }

            if (modo.equals("crear")) {
                if (controller.buscar(id) != null) {
                    throw new IllegalArgumentException("Ya existe un estudiante con este ID");
                }
                controller.crearEstudiante(id, nombres, edad);
                JOptionPane.showMessageDialog(this, "Estudiante agregado");
            } else {
                controller.editar(idEditando, nombres, edad);
                JOptionPane.showMessageDialog(this, "Estudiante actualizado");
                modo = "crear";
                txtId.setEnabled(true);
            }

            limpiar();
            mostrarTabla();

        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void mostrarTabla() {
        model.setRowCount(0);

        for (Estudiante est : controller.obtenerTodos()) {
            model.addRow(new Object[] {
                    est.getId(),
                    est.getNombres(),
                    est.getEdad(),
                    "Acciones"
            });
        }
    }

    private void limpiar() {
        txtId.setText("");
        txtNombres.setText("");
        txtEdad.setText("");
    }

    class ButtonRenderer extends JPanel implements TableCellRenderer {

        private JButton btnEditar = new JButton("Editar");
        private JButton btnEliminar = new JButton("Eliminar");

        public ButtonRenderer() {
            setLayout(new FlowLayout(FlowLayout.CENTER, 5, 5));
            setPreferredSize(new Dimension(160, 35));

            add(btnEditar);
            add(btnEliminar);

            btnEditar.setFocusable(false);
            btnEliminar.setFocusable(false);
        }

        @Override
        public Component getTableCellRendererComponent(JTable table, Object value,
                boolean isSelected, boolean hasFocus,
                int row, int column) {
            return this;
        }
    }

    class ButtonEditor extends AbstractCellEditor implements TableCellEditor {

        private JPanel panel = new JPanel();
        private JButton btnEditar = new JButton("Editar");
        private JButton btnEliminar = new JButton("Eliminar");

        private int filaActual;

        public ButtonEditor() {
            panel.setLayout(new FlowLayout(FlowLayout.CENTER));
            panel.add(btnEditar);
            panel.add(btnEliminar);

            btnEditar.addActionListener(e -> editarFila());
            btnEliminar.addActionListener(e -> eliminarFila());
        }

        private void editarFila() {
            fireEditingStopped();

            String id = (String) table.getValueAt(filaActual, 0);
            Estudiante est = controller.buscar(id);

            idEditando = est.getId();
            modo = "editar";

            txtId.setText(est.getId());
            txtId.setEnabled(false);
            txtNombres.setText(est.getNombres());
            txtEdad.setText(String.valueOf(est.getEdad()));
        }

        private void eliminarFila() {
            fireEditingStopped();

            String id = (String) table.getValueAt(filaActual, 0);
            controller.eliminar(id);
            mostrarTabla();
        }

        @Override
        public Component getTableCellEditorComponent(JTable table, Object value,
                boolean isSelected, int row, int col) {
            filaActual = row;
            return panel;
        }

        @Override
        public Object getCellEditorValue() {
            return null;
        }
    }
}