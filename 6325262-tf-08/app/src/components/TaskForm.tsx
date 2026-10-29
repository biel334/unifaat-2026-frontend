import { useState } from 'react'

type Props = {
  onAdd: (name: string) => void
}

export default function TaskForm({ onAdd }: Props) {
  const [name, setName] = useState<string>('')

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setName(event.target.value)
  }

  function handleAdd() {
    const cleanName = name.trim()
    if (cleanName === '') return
    onAdd(cleanName)
    setName('')
  }

  return (
    <div className="task-form">
      <input
        type="text"
        value={name}
        onChange={handleChange}
        placeholder="Nova task"
      />
      <button onClick={handleAdd}>Adicionar</button>
    </div>
  )
}
