import React, { useState, useEffect } from 'react';
import './style.css';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [username, setUsername] = useState('fabian');

  /* ELIMINAR SOLAMENTE LAS TAREAS, NO EL USUARIO */

  useEffect(() => {
    // Verificar si el usuario existe antes de obtener las tareas
    fetch(`https://playground.4geeks.com/apis/fake/todos/user/${username}`)
      .then((response) => {
        if (!response.ok) {
          // Si la respuesta no es exitosa, el usuario no existe
          throw new Error(`The user ${username} doesn't exist`);
        }
        return response.json();
      })
      .then((data) => setTasks(data))
      .catch((error) => {
        // Manejar el error de usuario inexistente aquí
        console.error('Error fetching tasks:', error.message);
        // Puedes crear el usuario si no existe
        createUser();
      });
  }, [username]);

  const createUser = () => {
    //  método POST
    fetch(`https://playground.4geeks.com/apis/fake/todos/user/${username}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([]),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('User created:', data);
        // user creado
        fetchTasks();
      })
      .catch((error) => console.error('Error creating user:', error));
  };

  const fetchTasks = () => {
    // Obtener las tareas del usuario desde la API
    fetch(`https://playground.4geeks.com/apis/fake/todos/user/${username}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.msg){
          createUser()
        }else{
          setTasks(data)
        }
      })
      .catch((error) => console.error('Error fetching tasks:', error));
  };

  const addTask = () => {
    if (newTask.trim() !== '') {
      const updatedTasks = [...tasks, { label: newTask, done: false }];
      setTasks(updatedTasks);

      // Sincronizar las tareas con la API
      syncTasks(updatedTasks);

      setNewTask('');sfsdfsdfsdfsdfsdfsdf
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
        console.log('Tasks cleared:', data);
        //setTasks([]);
        fetchTasks()
      })
      .catch((error) => console.error('Error clearing tasks:', error));
  };

  const toggleTaskDone = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].done = !updatedTasks[index].done;
    setTasks(updatedTasks);

    // Sincronizar tareas con API
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
      .then((data) => console.log('Tasks synchronized:', data))
      .catch((error) => console.error('Error syncing tasks:', error));
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
