import { useEffect, useState } from "react"
import { bugService } from "../services/bug"

export function BugFilter({ filterBy, onSetFilterBy, reloadLabels=false, setReloadLabels }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const [availableLabels, setAvailableLabels] = useState([])


    useEffect(() => {
        getLabels()
    }, [reloadLabels])

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    async function getLabels() {
        const labels = await bugService.getLabels()
        setAvailableLabels(labels)
        setReloadLabels(false)
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break;

            case 'checkbox':
                value = target.checked
                break

            case 'select-multiple':
                value = [...target.selectedOptions].map(option => option.value)
                if (value.includes('all')) value = []
                break

            default:
                break;
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    // function onSubmitFilter(ev) {
    //     ev.preventDefault()
    //     onSetFilterBy(filterByToEdit)
    // }


    const { txt, minSeverity, labels } = filterByToEdit
    return (
        <section className="bug-filter">
            <h2>Filter Bugs</h2>
            <form /*onSubmit={onSubmitFilter}*/>
                <label htmlFor="txt">Title: </label>
                <input value={txt} onChange={handleChange} type="text" placeholder="By Text" id="txt" name="txt" />

                <label htmlFor="minSeverity">Min. Severity: </label>
                <input value={minSeverity} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />

                <label htmlFor="labels">Labels</label>
                <select multiple type="select" name="labels" id="labels" onChange={handleChange} value={labels}>
                    <option value='all'>All labels</option>
                    {availableLabels.map(label => <option key={label} value={label}>{label}</option>)}
                </select>
            </form>
        </section>
    )
}