import type { Filter } from '../types'

type Props = {
  filter: Filter
  onChange: (filter: Filter) => void
}

export default function FilterBar({ filter, onChange }: Props) {
  function handleShowAll() {
    onChange('all')
  }

  function handleShowPending() {
    onChange('pending')
  }

  function handleShowDone() {
    onChange('done')
  }

  return (
    <div className="filter-bar">
      <button
        className={filter === 'all' ? 'is-active' : ''}
        onClick={handleShowAll}
      >
        Todas
      </button>
      <button
        className={filter === 'pending' ? 'is-active' : ''}
        onClick={handleShowPending}
      >
        Pendentes
      </button>
      <button
        className={filter === 'done' ? 'is-active' : ''}
        onClick={handleShowDone}
      >
        Feitas
      </button>
    </div>
  )
}
