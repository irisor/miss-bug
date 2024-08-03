import { UserPreview } from './UserPreview'

export function UserList({ users, onRemoveUser, onEditUser }) {
  return (
    <section className="user-list">
      {users?.map((user) => (
        <article className="user-preview" key={user._id}>
          <UserPreview user={user} />
          <div className="user-actions">
            <button
              onClick={() => {
                onRemoveUser(user._id)
              }}
            >
              x
            </button>
            <button
              onClick={() => {
                onEditUser(user)
              }}
            >
              Edit
            </button>
          </div>
        </article>
      ))}
    </section>
  )
}
