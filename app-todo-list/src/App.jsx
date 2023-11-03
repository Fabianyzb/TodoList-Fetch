import React, { useState, useEffect } from "react";
import "./style.css";

const App = () => {
  const apiUrl = "https://playground.4geeks.com/apis/fake/todos/";
  const username = "fabian"; // Puse mi nombre para hacer las pruebas. Cada vez que se eliminan las notas de la lista hay que crear un username de nuevo.

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTasks = () => {
    fetch(apiUrl + "user/" + username, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Usuario no encontrado en la API");
        }
        return response.json();
      })
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((error) => {
        // Manejar el error, mostrar un mensaje al usuario, etc.
        console.error("Error:", error);
      });
  };

  const addTask = () => {
    if (newTask.trim() !== "") {
      const updatedTasks = [...tasks, { label: newTask, done: false }];
      updateTaskList(updatedTasks);
      setNewTask("");
    }
  };

  const updateTaskList = (updatedTasks) => {
    fetch(apiUrl + "user/" + username, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTasks),
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks(updatedTasks);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const deleteCompletedTasks = () => {
    const uncompletedTasks = tasks.filter((task) => !task.done);
    updateTaskList(uncompletedTasks);
  };

  const clearAllTasks = () => {
    fetch(apiUrl + "user/" + username, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al eliminar todas las tareas en la API");
        }
        return response.json();
      })
      .then(() => {
        setTasks([]); // Actualiza el estado local con una lista vacía
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="app-container">
      <h1>TODO List</h1>
      <div className="task-input">
        <input
          type="text"
          placeholder="Nueva tarea"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") addTask();
          }}
        />
        <button onClick={addTask}>Agregar</button>
        <button onClick={clearAllTasks}>Limpiar todas las tareas</button>
      </div>
      <ul className="task-list">
        {loading ? (
          <p>Cargando tareas...</p>
        ) : tasks.length === 0 ? (
          <p>No hay tareas, añadir tareas</p>
        ) : (
          tasks.map((task, index) => (
            <li key={index}>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => {
                  const updatedTasks = [...tasks];
                  updatedTasks[index].done = !task.done;
                  updateTaskList(updatedTasks);
                }}
              />
              <span className={task.done ? "completed" : ""}>{task.label}</span>
              {task.done && (
                <button onClick={() => deleteCompletedTasks()}>Eliminar</button>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default App;
