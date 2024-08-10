
import { Link } from 'react-router-dom'
import { BugPreview } from './BugPreview'
import { userService } from '../services/user/user.service'

export function BugList({ bugs, onRemoveBug, onEditBug }) {
  const loggedinUser = userService.getLoggedinUser()

  function isAllowed(bug) {
    return loggedinUser && (loggedinUser.isAdmin || bug?.owner?.id === loggedinUser?._id)
  }

  if (!bugs || !bugs.length || !Array.isArray(bugs)) return <p>No bugs</p>
  return (
    <ul className="bug-list">
      {bugs?.map((bug) => (
        <li className="bug-preview" key={bug._id}>
          <BugPreview bug={bug} />
          <div>
            { isAllowed(bug) && <button onClick={() => { onRemoveBug(bug._id) }}>x</button> }
            { isAllowed(bug) && <button onClick={() => { onEditBug(bug) }}> Edit </button> }
          </div>
          <Link to={`/bug/${bug._id}`}>Details</Link>
        </li>
      ))}
    </ul>
  )
}
