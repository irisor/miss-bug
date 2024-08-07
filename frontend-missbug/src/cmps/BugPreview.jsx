

export function BugPreview({ bug }) {

    return <article >
        <h4>{bug.title}</h4>
        <h1>🐛</h1>
        <p>{bug?.description}</p>
        <p>Severity: <span>{bug.severity}</span></p>
        <p> {bug._id}</p>
    </article>
}