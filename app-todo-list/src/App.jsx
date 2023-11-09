import React, { useState } from 'react';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, newTask]);
      setNewTask('');
    }
  };

  const removeTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
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
      </div>
      {tasks.length === 0 ? (
        <p>No hay tareas, añadir tareas</p>
      ) : (
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              {task}{' '}
              <span onClick={() => removeTask(index)} style={{ cursor: 'pointer' }}>
                ❌
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
