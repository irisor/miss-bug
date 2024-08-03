
import { useState } from 'react'
import { userService } from '../services/user'
import { showErrorMsg } from '../services/event-bus.service.js'
import { useParams } from 'react-router'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'


export function UserDetails() {

    const [user, setUser] = useState(null)
    const { userId } = useParams()
    const [responseMessage, setResponseMessage] = useState(null)

    useEffect(() => {
        loadUser()
    }, [])

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

    if (!user && responseMessage) {
        return (
        <>
            <h1>{responseMessage}</h1>
            <Link to="/user">Back to List</Link>
        </>
    )}
    if (!user) return <h1>loadings....</h1>
    return <div className="user-details container">
        <h1>User Details</h1>
        <h4>{user?.userame}</h4>
        <p>{user?.fullname}</p>
        <p>{user?.isAdmin && 'Admin'}</p>
        <p>Score: <span>{user.score}</span></p>
        {user?.imgUrl && <img src={user?.imgUrl} width={200} height={200} />}
        
        <p><Link to="/user">Back to List</Link></p>
    </div>

}

