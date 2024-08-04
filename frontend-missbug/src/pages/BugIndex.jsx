import _ from 'lodash.debounce'
import { bugService } from '../services/bug'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { useCallback, useState } from 'react'
import { useEffect } from 'react'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugSort } from '../cmps/BugSort.jsx'
import { useSearchParams } from 'react-router-dom'


export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [reloadLabels, setReloadLabels] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterBy, setFilterBy] = useState(bugService.getFilterFromSearchParams(searchParams))

  useEffect(() => {
    let filterByToSend = { ...filterBy }
    Object.keys(filterByToSend).forEach(key => {
      if (Array.isArray(filterByToSend[key])) {
        filterByToSend[key] = filterByToSend[key].join(',')
      }
    })

    setSearchParams(filterByToSend)
    loadBugs()
  }, [filterBy])

  const onSetFilterBy = useCallback(_(_onSetFilterBy, 350), [])

  function _onSetFilterBy(filterBy) {
    setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
  }

  async function loadBugs() {
    const bugs = await bugService.query(filterBy)
    setBugs(bugs)
  }

  async function onRemoveBug(bugId) {
    try {
      await bugService.remove(bugId)
      console.log('Deleted Succesfully!')
      setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
      setReloadLabels(true)
      showSuccessMsg('Bug removed')
    } catch (err) {
      console.log('Error from onRemoveBug ->', err)
      showErrorMsg('Cannot remove bug')
    }
  }

  async function onAddBug() {
    const bug = {
      title: prompt('Bug title?'),
      severity: +prompt('Bug severity?'),
      description: prompt('Bug description?'),
      labels: prompt('Bug labels? list of labels separated by comma')?.split(',') || []
    }
    try {
      const savedBug = await bugService.save(bug)
      console.log('Added Bug', savedBug)
      setBugs(prevBugs => [...prevBugs, savedBug])
      setReloadLabels(true)
      showSuccessMsg('Bug added')
    } catch (err) {
      console.log('Error from onAddBug ->', err)
      showErrorMsg('Cannot add bug')
    }
  }

  async function onEditBug(bug) {
    let severity = prompt('New severity?', bug?.severity);
    if (severity === null) {
      return;
    }
    severity = +severity;

    const description = prompt('New description?', bug?.description);
    if (description === null) { return; }

    const labels = prompt('New labels? list of labels separated by comma', bug.labels?.join(','))?.split(',') || []
    if (labels === null) { return; }

    const bugToSave = { ...bug, severity, description, labels }
    try {

      const savedBug = await bugService.save(bugToSave)
      setBugs(prevBugs => prevBugs.map((currBug) =>
        currBug._id === savedBug._id ? savedBug : currBug
      ))
      setReloadLabels(true)
      showSuccessMsg('Bug updated')
    } catch (err) {
      console.log('Error from onEditBug ->', err)
      showErrorMsg('Cannot update bug')
    }
  }

  function onChangePageIdx(pageIdx) {
    if (pageIdx < 0) return
    setFilterBy(prevFilter => ({ ...prevFilter, pageIdx }))
  }

  function onTogglePaging() {
    const isPaging = filterBy.pageIdx !== undefined
    setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: isPaging ? undefined : 0 }))
  }

  function onGetpdf() {
    bugService.getpdf()
  }

  const { pageIdx, ...restOfFilter } = filterBy
  const isPaging = pageIdx !== undefined && pageIdx !== 'undefined'

  return (
    <main className="bug-index">
      <h1>Bugs App</h1>
      <div className="bug-pagination">
        <label> Use paging
          <input type="checkbox" checked={isPaging} onChange={onTogglePaging} />
        </label>
        {isPaging && <>
          <button onClick={() => onChangePageIdx(pageIdx - 1)}>-</button>
          <span>{pageIdx + 1}</span>
          <button onClick={() => onChangePageIdx(pageIdx + 1)}>+</button>
        </>}
      </div>
      <main>
        <BugFilter filterBy={restOfFilter} onSetFilterBy={onSetFilterBy} reloadLabels={reloadLabels} setReloadLabels={setReloadLabels} />
        <BugSort filterBy={restOfFilter} onSetFilterBy={onSetFilterBy} />
        <button className='add-btn' onClick={onAddBug}>Add Bug ⛐</button>
        <button className='pdf-btn' onClick={onGetpdf}>Get PDF of the bugs</button>
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
      </main>
    </main>
  )
}
