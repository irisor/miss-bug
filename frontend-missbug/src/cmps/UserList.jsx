import { Link } from 'react-router-dom'
import { UserPreview } from './UserPreview'
import { userService } from '../services/user'


export function UserList({ users, onRemoveUser, onEditUser }) {
  const loggedinUser = userService.getLoggedinUser()

  function isAllowed(user) {
    return loggedinUser && (loggedinUser.isAdmin || user?._id === loggedinUser?._id)
  }
  return (
    <section className="user-list">
      {users?.map((user) => (
        <article className="user-preview" key={user._id}>
          <UserPreview user={user} />
          <div className="user-actions">
            { isAllowed(user) && <button onClick={() => { onRemoveUser(user._id) }}>x</button> }
            { isAllowed(user) && <button onClick={() => { onEditUser(user) }}>Edit</button> }
          </div>
          <Link className="user-actions" to={`/user/${user._id}`}>Details</Link>
        </article>
      ))}
    </section>
  )
}
