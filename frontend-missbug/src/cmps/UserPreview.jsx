

export function UserPreview({ user }) {

    return <article >
        <h1>{user.fullname}</h1>
        <p>{user?.username}</p>
        <p>{user?.password}</p>
        <p>Score: <span>{user.score}</span></p>
        <p> {user._id}</p>
    </article>
}