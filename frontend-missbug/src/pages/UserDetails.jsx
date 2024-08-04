
import { useState } from 'react'
import { userService } from '../services/user'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { useParams } from 'react-router'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BugList } from '../cmps/BugList.jsx'
import { bugService } from '../services/bug/bug.service.js'


export function UserDetails() {
    const [user, setUser] = useState(null)
    const [bugs, setBugs] = useState([])
    const { userId } = useParams()
    const [responseMessage, setResponseMessage] = useState(null)

    useEffect(() => {
        loadUser()
    }, [])

    useEffect(() => {
        if (user) loadBugs()
    }, [user])

    async function loadUser() {
        try {
            const user = await userService.getById(userId)
            setUser(user)
        } catch (err) {
            if (err.response && err.response.data) {
                setResponseMessage(err.response.data)
            }
            showErrorMsg('Cannot load user')
        }
    }

    async function loadBugs() {
        try {
            const bugs = await bugService.query({ owner: user._id })
            setBugs(bugs)
        } catch (err) {
            console.log('Error loading bugs', err)
            showErrorMsg('Cannot load bugs')
        }
    }

    async function onRemoveBug(bugId) {
        try {
          await bugService.remove(bugId)
          console.log('Deleted Succesfully!')
          setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
          showSuccessMsg('Bug removed')
        } catch (err) {
          console.log('Error from onRemoveBug ->', err)
          showErrorMsg('Cannot remove bug')
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
          showSuccessMsg('Bug updated')
        } catch (err) {
          console.log('Error from onEditBug ->', err)
          showErrorMsg('Cannot update bug')
        }
      }

    if (!user && responseMessage) {
        return (
            <>
                <h1>{responseMessage}</h1>
                <Link to="/user">Back to List</Link>
            </>
        )
    }

    if (!user) return <h1>loadings....</h1>
    return <div className="user-details container">
        <h1>User Details</h1>
        <h4>{user?.userame}</h4>
        <p>{user?.fullname}</p>
        <p>{user?.isAdmin && 'Admin'}</p>
        <p>Score: <span>{user.score}</span></p>
        {user?.imgUrl && <img src={user?.imgUrl} width={200} height={200} />}
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />

        <p><Link to="/user">Back to List</Link></p>
    </div>

}

