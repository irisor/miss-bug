import { useEffect, useState } from "react"
import { bugService } from "../services/bug"
import { userService } from "../services/user/user.service"

export function BugFilter({ filterBy, onSetFilterBy, reloadLabels=false, setReloadLabels }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const [availableLabels, setAvailableLabels] = useState([])
    const [availableOwners, setAvailableOwners] = useState([])


    useEffect(() => {
        getOwners()
    }, [])

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

    async function getOwners() {
        const owners = await userService.query()
        setAvailableOwners(owners)
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


    const { txt, minSeverity, labels, owner } = filterByToEdit
    return (
        <section className="bug-filter">
            <h2>Filter Bugs</h2>
            <form /*onSubmit={onSubmitFilter}*/>
                <label htmlFor="txt">Title: </label>
                <input value={txt} onChange={handleChange} type="text" placeholder="By Text" id="txt" name="txt" />

                <label htmlFor="minSeverity">Min. Severity: </label>
                <input value={minSeverity} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />

                <label htmlFor="labels">Labels</label>
                <select multiple type="select" name="labels" id="labels" onChange={handleChange} value={labels || []}>
                    <option value='all'>All labels</option>
                    {availableLabels.map(label => <option key={label} value={label}>{label}</option>)}
                </select>

                <label htmlFor="owner">Owner</label>
                <select type="select" name="owner" id="owner" onChange={handleChange} value={owner}>
                    <option value=''>Select an owner</option>
                    {availableOwners.map(owner => <option key={owner?._id} value={owner?._id}>{owner?.fullname}</option>)}
                </select>
            </form>
        </section>
    )
}