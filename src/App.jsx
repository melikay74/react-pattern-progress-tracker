import { useActionState, useState } from 'react'
import './App.css'

const savedPatternInfo = JSON.parse(localStorage.getItem('patternInfo')) || {}

function App() {

  // Initialize count from localStorage or default to 0
  const [count, setCount] = useState(() => Number(localStorage.getItem('repeatCount')) || 0)

  function addPatternInfo(prevState, formData) {
    if (formData.get('intent') === 'clear') {
      localStorage.removeItem('patternInfo')
      localStorage.removeItem('repeatCount')
      setCount(0)
      return {}
    }
    const newPatternInfo = { ...Object.fromEntries(formData)}
    localStorage.setItem('patternInfo', JSON.stringify(newPatternInfo))
    setCount(0) // Reset count when a new pattern is submitted
    localStorage.removeItem('repeatCount') // Reset repeat count in localStorage
    
    return newPatternInfo
  }

  const [patternInfo, formAction] = useActionState(addPatternInfo, savedPatternInfo)

  const isComplete = count >= Number(patternInfo.repeats)

  return (
    <main className="app">
    <header className="app-header">
      <h1>My Pattern Repeats Tracker</h1>
    </header>

    <div className="layout">
    <form action={formAction} className="pattern-form card">
        <div className="field">
          <label htmlFor="pattern">Pattern name</label>
          <input type="text" id="pattern" name="patternName" />
        </div>

        <div className="field">
          <label htmlFor="garmentSection">Garment section</label>
          <input type="text" id="garmentSection" name="garmentSection" />
        </div>

        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description"></textarea>
        </div>

        <div className="field">
          <label htmlFor="repeats">Number of repeats</label>
          <input type="number" id="repeats" name="repeats" min="1" />
        </div>

        <div className="form-actions">
          <button className="btn btn-primary">Submit</button>
          <button name="intent" value="clear" className="btn btn-quiet">Clear</button>
        </div>
    </form>

    {patternInfo.patternName && (
      <section className={`tracker card ${isComplete ? 'is-complete' : ''}`}>
        <h2>{patternInfo.patternName}</h2>
        <h3>{patternInfo.garmentSection}</h3>
        <p className="description">{patternInfo.description}</p>

        <div className="progress-row">
          <p className="count">
            <span className="count-current">{count}</span> / {patternInfo.repeats}
          </p>
          <progress className="progress" value={count} max={patternInfo.repeats} aria-label="Repeats completed" />
          <button className="btn btn-add" aria-label="Add repeat" onClick={() => {
            const newCount = count + 1
            setCount(newCount)
            localStorage.setItem('repeatCount', newCount)
          }} disabled={isComplete}>
            +
          </button>
        </div>

        {isComplete && <p className="complete" role="status">Pattern completed! What's next?</p>}
      </section>
    )}
    </div>
    </main>
  )
}

export default App
