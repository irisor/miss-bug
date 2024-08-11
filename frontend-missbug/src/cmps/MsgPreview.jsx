import { Link } from 'react-router-dom'

export function MsgPreview({ msg }) {
    const { byUser, aboutBug } = msg

    return <article className="preview msg-preview">
        <p>About: <Link to={`/bug/${aboutBug._id}`}>{aboutBug.title}</Link></p>
        <p>Severity: {aboutBug.severity}</p>
        <p className="msg-by">By: <Link to={`/user/${byUser._id}`}>{byUser.fullname}</Link></p>
        <p className="msg-txt">{msg.txt}</p>
    </article>
}