import type { Task } from '../types'

type Props = {
  task: Task
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}

export default function TaskItem({ task, onToggle, onRemove }: Props) {
  function handleToggle() {
    onToggle(task.id)
  }

  function handleRemove() {
    onRemove(task.id)
  }

  return (
    <li className="task-item">
      <span
        className={task.isDone ? 'task-name is-done' : 'task-name'}
        onClick={handleToggle}
      >
        {task.name}
      </span>
      <button onClick={handleRemove}>Excluir</button>
    </li>
  )
}
