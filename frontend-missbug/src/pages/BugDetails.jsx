
import { useState } from 'react'
import { bugService } from '../services/bug'
import { showErrorMsg } from '../services/event-bus.service.js'
import { useParams } from 'react-router'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'


export function BugDetails() {

    const [bug, setBug] = useState(null)
    const { bugId } = useParams()
    const [responseMessage, setResponseMessage] = useState(null)

    useEffect(() => {
        loadBug()
    }, [])

    async function loadBug() {
        try {
            const bug = await bugService.getById(bugId)
            setBug(bug)
        } catch (err) {
            if (err.response && err.response.data) {
                setResponseMessage(err.response.data)
            }
            showErrorMsg('Cannot load bug')
        }
    }

    if (!bug && responseMessage) {
        return (
        <>
            <h1>{responseMessage}</h1>
            <Link to="/bug">Back to List</Link>
        </>
    )}
    if (!bug) return <h1>loadings....</h1>
    return <div className="bug-details container">
        <h3>Bug Details 🐛</h3>
        <h4>{bug.title}</h4>
        <p>{bug.description}</p>
        <p>Severity: <span>{bug.severity}</span></p>
        {bug.labels && <h4>Labels:</h4>}
        <ul>
            {bug.labels && bug.labels.map(label => <li key={label}>{label}</li>)}
        </ul>
        <Link to="/bug">Back to List</Link>
    </div>

}

