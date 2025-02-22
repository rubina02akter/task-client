import { io } from "socket.io-client";
import { useState, useEffect, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FiEdit, FiTrash2, FiCheck } from "react-icons/fi";
import Swal from "sweetalert2";

const taskCategories = ["Pending", "Ongoing", "Completed"];
// const SERVER_URL = "http://localhost:5000";
const SERVER_URL = "https://server-eight-jade-75.vercel.app/";

const TasksSection = () => {
  const [taskList, setTaskList] = useState([]);
  const [newEntry, setNewEntry] = useState({
    title: "",
    description: "",
    category: "Pending",
  });
  const [editEntry, setEditEntry] = useState(null);

  useEffect(() => {
    const socket = io(SERVER_URL, { transports: ["polling"] });
    socket.on("task-refresh", fetchTasks);
    return () => socket.disconnect();
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch(`${SERVER_URL}/tasks`);
      const data = await response.json();
      Array.isArray(data) ? setTaskList(data) : setTaskList([]);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setTaskList([]);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDragComplete = async (result) => {
    const { source, destination, draggableId } = result;
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    )
      return;

    const updatedTasks = [...taskList];
    const draggedItem = updatedTasks.find((task) => task._id === draggableId);
    if (!draggedItem) return;

    updatedTasks.splice(updatedTasks.indexOf(draggedItem), 1);
    if (source.droppableId !== destination.droppableId)
      draggedItem.category = destination.droppableId;
    updatedTasks.splice(destination.index, 0, draggedItem);
    setTaskList(updatedTasks);

    try {
      await fetch(`${SERVER_URL}/tasks/reorder/${draggableId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: draggedItem.category,
          index: destination.index,
        }),
      });
    } catch (error) {
      console.error("Task reorder failed:", error);
      fetchTasks();
    }
  };

  const handleInputChange = (e) => {
    setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
  };

  const handleTaskCreation = async () => {
    if (!newEntry.title.trim()) return;
    try {
      const response = await fetch(`${SERVER_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });
      if (response.ok) {
        fetchTasks();
        Swal.fire("Success!", "New task added.", "success");
        setNewEntry({ title: "", description: "", category: "Pending" });
      }
    } catch (err) {
      console.error("Task creation failed:", err);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await fetch(`${SERVER_URL}/tasks/${taskId}`, { method: "DELETE" });
      setTaskList(taskList.filter((task) => task._id !== taskId));
      Swal.fire("Deleted!", "Task removed.", "success");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleEdit = (task) => setEditEntry(task);

  const handleSave = async (taskId, updatedTask) => {
    const { _id, ...taskDetails } = updatedTask;
    try {
      await fetch(`${SERVER_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskDetails),
      });
      setEditEntry(null);
      fetchTasks();
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          name="title"
          placeholder="Enter Task Title"
          value={newEntry.title}
          onChange={handleInputChange}
          className="p-2 border rounded-md w-1/4"
        />
        <input
          type="text"
          name="description"
          placeholder="Task Description"
          value={newEntry.description}
          onChange={handleInputChange}
          className="p-2 border rounded-md w-1/3"
        />
        <select
          name="category"
          value={newEntry.category}
          onChange={handleInputChange}
          className="p-2 border cursor-pointer rounded-md"
        >
          {taskCategories.map((cat) => (
            <option key={cat} value={cat} className="cursor-pointer">
              {cat}
            </option>
          ))}
        </select>
        <button
          onClick={handleTaskCreation}
          className="bg-green-500 cursor-pointer text-white px-4 py-2 rounded-lg"
        >
          Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragComplete}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          {taskCategories.map((category) => (
            <Droppable key={category} droppableId={category}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-400 p-5  rounded-lg shadow-lg min-h-[300px]"
                >
                  <h2 className="text-xl font-bold mb-4">{category}</h2>
                  {taskList
                    .filter((task) => task.category === category)
                    .map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-black p-4 mb-3 rounded-lg shadow-md flex justify-between items-center"
                          >
                            {editEntry?._id === task._id ? (
                              <div className="flex flex-col gap-2 w-full">
                                <input
                                  type="text"
                                  value={editEntry.title}
                                  onChange={(e) =>
                                    setEditEntry({
                                      ...editEntry,
                                      title: e.target.value,
                                    })
                                  }
                                  className="border p-1 rounded-md"
                                />
                                <input
                                  type="text"
                                  value={editEntry.description}
                                  onChange={(e) =>
                                    setEditEntry({
                                      ...editEntry,
                                      description: e.target.value,
                                    })
                                  }
                                  className="border p-1 rounded-md"
                                />
                              </div>
                            ) : (
                              <div className="">
                                <h3 className="font-semibold text-white">
                                  {task.title}
                                </h3>
                                <p className="text-sm text-white">
                                  {task.description}
                                </p>
                                <p className="text-xs text-gray-200">
                                  {formatDate(task.createdAt)}
                                </p>
                              </div>
                            )}

                            <div className="flex gap-2">
                              {editEntry?._id === task._id ? (
                                <FiCheck
                                  className="text-green-500 cursor-pointer"
                                  onClick={() =>
                                    handleSave(task._id, editEntry)
                                  }
                                />
                              ) : (
                                <FiEdit
                                  className="text-blue-500 cursor-pointer"
                                  onClick={() => handleEdit(task)}
                                />
                              )}
                              <FiTrash2
                                className="text-red-500 cursor-pointer"
                                onClick={() => handleDelete(task._id)}
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TasksSection;
