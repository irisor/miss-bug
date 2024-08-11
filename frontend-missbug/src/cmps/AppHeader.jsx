
import { useState } from 'react'
import { useNavigate, NavLink, Link } from 'react-router-dom'
import { userService } from '../services/user/user.service'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { LoginSignup } from './LoginSignup'

export function AppHeader() {
    // Will be in the store in the future~~
    const [loggedinUser, setLoggedinUser] = useState(userService.getLoggedinUser())
    const navigate = useNavigate()

    async function onLogin(credentials) {
        try {
            const user = await userService.login(credentials)
            setLoggedinUser(user)
            navigate('/')
        } catch (err) {
            console.log('Cannot login :', err)
            showErrorMsg(`Cannot login`)
        }
    }

    async function onSignup(credentials) {
        try {
            const user = await userService.signup(credentials)
            setLoggedinUser(user)
            showSuccessMsg(`Welcome ${user.fullname}`)
            navigate('/')
        } catch (err) {
            console.log('Cannot signup :', err)
            showErrorMsg(`Cannot signup`)
        }
        // add signup
    }

    async function onLogout() {
        try {
            await userService.logout()
            setLoggedinUser(null)
            navigate('/')
        } catch (err) {
            console.log('can not logout')
        }
        // add logout
    }


    return (
        <header className='app-header container'>
            <div className='header-container'>
                <section className="login-signup-container">
                    {!loggedinUser && <LoginSignup onLogin={onLogin} onSignup={onSignup} />}

                    {loggedinUser && <div className="user-preview">
                        <h3>Hello {loggedinUser.fullname}</h3>
                        <button onClick={onLogout}>Logout</button>
                        <button><Link to={`/user/${loggedinUser._id}`}>Profile</Link></button>
                    </div>}
                </section>
                <nav className='app-nav'>
                    <NavLink to="/">Home</NavLink> | <NavLink to="/bug">Bugs</NavLink> |
                    <NavLink to="/user">Users</NavLink> | <NavLink to="/msg">Messages</NavLink> |
                    <NavLink to="/about">About</NavLink>
                </nav>
                <h3>Bugs are Forever</h3>
            </div>
        </header>
    )
}
