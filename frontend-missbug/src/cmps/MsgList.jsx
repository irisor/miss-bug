import { userService } from '../services/user/index.js'

import { MsgPreview } from './MsgPreview.jsx'

export function MsgList({ msgs, onRemoveMsg }) {
    
    function shouldShowActionBtns(msg) {
        const user = userService.getLoggedinUser()
        
        if (!user) return false
        if (user.isAdmin) return true
        return msg.byUser?._id === user._id
    }

    return <section>
        <ul className="list msg-list">
            {msgs.map(msg =>
                <li key={msg._id}>
                    <MsgPreview msg={msg}/>
                    {shouldShowActionBtns(msg) && <div className="actions">
                        <button onClick={() => onRemoveMsg(msg._id)}>x</button>
                    </div>}
                </li>)
            }
        </ul>
    </section>
}