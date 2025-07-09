import './App.css'
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Estado para la lista de alumnos
  const [alumnos, setAlumnos] = useState(() => {
    const data = localStorage.getItem('alumnos');
    return data ? JSON.parse(data) : [];
  });

  // Estado para el formulario
  const [form, setForm] = useState({ nombre: '', asignatura: '', promedio: '' });
  const [editIndex, setEditIndex] = useState(null);

  // Guardar en localStorage cada vez que cambia la lista de alumnos
  useEffect(() => {
    localStorage.setItem('alumnos', JSON.stringify(alumnos));
  }, [alumnos]);

  // Función para determinar escala de apreciación
  const calcularEscala = (promedio) => {
    const p = parseFloat(promedio);
    if (p >= 6.5) return 'Destacado';
    if (p >= 5.6) return 'Buen trabajo';
    if (p >= 4.0) return 'Con mejora';
    return 'Deficiente';
  };

  const getColorByEscala = (escala) => {
    switch (escala) {
      case 'Destacado':
        return 'green';
      case 'Buen trabajo':
        return 'blue';
      case 'Con mejora':
        return 'orange';
      case 'Deficiente':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Manejar cambios en inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Agregar o editar alumno
  const handleSubmit = (e) => {
  e.preventDefault();

  const { nombre, asignatura, promedio } = form;

  // Validar campos vacíos
  if (!nombre.trim() || !asignatura.trim() || !promedio.trim()) {
    alert('Todos los campos son obligatorios');
    return;
  }

  // Validar que promedio sea número válido entre 1 y 7
  const promedioNum = parseFloat(promedio);
  if (isNaN(promedioNum) || promedioNum < 1 || promedioNum > 7) {
    alert('El promedio debe ser un número entre 1.0 y 7.0');
    return;
  }

  // Crear nuevo alumno
  const nuevoAlumno = {
    nombre: nombre.trim(),
    asignatura: asignatura.trim(),
    promedio: promedioNum.toFixed(1),
    escala: calcularEscala(promedioNum)
  };

  if (editIndex !== null) {
    const actualizados = [...alumnos];
    actualizados[editIndex] = nuevoAlumno;
    setAlumnos(actualizados);
    setEditIndex(null);
  } else {
    setAlumnos([...alumnos, nuevoAlumno]);
  }

  setForm({ nombre: '', asignatura: '', promedio: '' });
  };



  // Editar alumno
  const handleEdit = (index) => {
    setForm(alumnos[index]);
    setEditIndex(index);
  };

  // Eliminar alumno
  const handleDelete = (index) => {
    const nuevosAlumnos = alumnos.filter((_, i) => i !== index);
    setAlumnos(nuevosAlumnos);
  };

  return (
    <div className="App">
      <h1>Aplicación de Evaluación de Alumnos</h1>
      <form onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
        <input name="asignatura" placeholder="Asignatura" value={form.asignatura} onChange={handleChange} />
        <input name="promedio" type="number" placeholder="Promedio" value={form.promedio} onChange={handleChange} step="0.1" min="1" max="7" />
        <button type="submit">{editIndex !== null ? 'Actualizar' : 'Agregar'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Asignatura</th>
            <th>Promedio</th>
            <th>Escala</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((a, i) => (
            <tr key={i}>
              <td style={{ color: '#FFFFFF' }}>{a.nombre}</td>          {/* Nombre en azul oscuro */}
              <td style={{ color: '#FFFFFF' }}>{a.asignatura}</td>      {/* Asignatura en verde oscuro */}
              <td style={{ color: '#FFFFFF' }}>{a.promedio}</td>        {/* Promedio en rojo oscuro */}
              <td style={{
                backgroundColor: getColorByEscala(a.escala),
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                {a.escala}
              </td>
              <td>
                <button onClick={() => handleEdit(i)}>Editar</button>
                <button onClick={() => handleDelete(i)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

