import { useEffect } from 'react'

export function AppFooter () {

    useEffect(() => {
        // component did mount when dependancy array is empty
    }, [])

    return (
        <footer className='footer container'>
            <p>
                coffeerights to all
            </p>
            {import.meta.env.VITE_LOCAL ? 
                <span className="local-services">Local Services</span> : 
                <span className="remote-services">Remote Services</span>}
        </footer>
    )

}