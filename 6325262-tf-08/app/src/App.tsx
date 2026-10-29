import { useState } from 'react'
import FilterBar from './components/FilterBar'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import type { Filter, Task } from './types'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<Filter>('all')

  function handleAdd(name: string) {
    const newTask: Task = { id: crypto.randomUUID(), name, isDone: false }
    setTasks((current) => [...current, newTask])
  }

  function handleToggle(id: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, isDone: !task.isDone } : task,
      ),
    )
  }

  function handleRemove(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id))
  }

  const visibleTasks = tasks.filter(
    (task) =>
      filter === 'all' ||
      (filter === 'pending' && !task.isDone) ||
      (filter === 'done' && task.isDone),
  )
  const pendingCount = tasks.filter((task) => !task.isDone).length

  return (
    <main className="app">
      <h1>To-do</h1>
      <TaskForm onAdd={handleAdd} />
      <FilterBar filter={filter} onChange={setFilter} />
      <p>{pendingCount} pendente(s)</p>
      <TaskList
        tasks={visibleTasks}
        onToggle={handleToggle}
        onRemove={handleRemove}
      />
    </main>
  )
}
