import React, { useState, useEffect } from 'react';
import './style.css';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [username, setUsername] = useState('fabian'); //setUsername va a cambiar en la medida que cambie el nombre de usuario 

  /* EN ESTE MOMENTO HAY 4 USUARIOS EN LA API: ["fabian","Merlina","Camilo","pierre"]  */
  
  useEffect(() => {
    // Obtener las tareas del usuario desde la API al montar el componente
    fetch(`https://playground.4geeks.com/apis/fake/todos/user/${username}`)
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('Error fetching tasks:', error));
  }, [username]);

  const addTask = () => {
    if (newTask.trim() !== '') {
      const updatedTasks = [...tasks, { label: newTask, done: false }];
      setTasks(updatedTasks);

      // Sincronizar las tareas con la API
      syncTasks(updatedTasks);

      setNewTask('');
    }
  };

  const removeTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);

    // Sincronizar las tareas con la API
    syncTasks(updatedTasks);
  };

  const clearAllTasks = () => {
    // Limpiar todas las tareas en el servidor
    fetch(`https://playground.4geeks.com/apis/fake/todos/user/${username}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Tarea realizada:', data);
        setTasks([]); // Actualizar el estado local para reflejar la lista vacía
      })
      .catch((error) => console.error('Error clearing tasks:', error));
  };

  const toggleTaskDone = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].done = !updatedTasks[index].done;
    setTasks(updatedTasks);

    // Sincronizar las tareas con la API
    syncTasks(updatedTasks);
  };

  const syncTasks = (updatedTasks) => {
    fetch(`https://playground.4geeks.com/apis/fake/todos/user/${username}`, {
      method: 'PUT',
      body: JSON.stringify(updatedTasks),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => console.log('Tareas sincronizadas:', data))
      .catch((error) => console.error('Error :', error));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <div className="todo-list">
      <h1>TO-DO List</h1>
      <div>
        <input
          type="text"
          placeholder="Escribe una nueva tarea"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={addTask}>Agregar</button>
        <button onClick={clearAllTasks}>Limpiar Todas</button>
      </div>
      {tasks.length === 0 ? (
        <p>No hay tareas, añadir tareas</p>
      ) : (
        <ul>
          {tasks.map((task, index) => (
            <li key={index} className={task.done ? 'complete' : ''}>
              {task.label}{' '}
              {task.done && (
                <span onClick={() => removeTask(index)} style={{ cursor: 'pointer' }}>
                  ❌
                </span>
              )}
              <span onClick={() => toggleTaskDone(index)} style={{ cursor: 'pointer' }}>
                ✔️
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
