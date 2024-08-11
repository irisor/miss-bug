import { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'

// import { loadMsgs, removeMsg, getActionAddMsg, getActionRemoveMsg } from '../store/actions/msg.actions'
// import { loadUsers } from '../store/actions/user.actions'

import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
// import { socketService, SOCKET_EVENT_MSG_ADDED, SOCKET_EVENT_MSG_REMOVED } from '../services/socket.service'
import { MsgList } from '../cmps/MsgList'
import { MsgEdit } from '../cmps/MsgEdit'
import { userService } from '../services/user'
import { msgService } from '../services/msg'

export function MsgIndex() {
	const [msgs, setMsgs] = useState([])
	const loggedInUser = userService.getLoggedinUser()

	// const loggedInUser = useSelector(storeState => storeState.userModule.user)
	// const msgs = useSelector(storeState => storeState.msgModule.msgs)

	// const dispatch = useDispatch()

	useEffect(() => {
		loadMsgs()

		// socketService.on(SOCKET_EVENT_MSG_ADDED, msg => {
		// 	console.log('GOT from socket', msg)
		// 	dispatch(getActionAddMsg(msg))
		// })

		// socketService.on(SOCKET_EVENT_MSG_REMOVED, msgId => {
		// 	console.log('GOT from socket', msgId)
		// 	dispatch(getActionRemoveMsg(msgId))
		// })

		// return () => {
		//     socketService.off(SOCKET_EVENT_MSG_ADDED)
		//     socketService.off(SOCKET_EVENT_MSG_REMOVED)
		// }
	}, [])

	async function loadMsgs() {
		const msgs = await msgService.query()
		console.log("*** MsgIndex msgs=", msgs)
		setMsgs(msgs)
	}

	async function onRemoveMsg(msgId) {
		try {
			await msgService.remove(msgId)
			// await removeMsg(msgId)
			showSuccessMsg('Msg removed')
		} catch (err) {
			showErrorMsg('Cannot remove')
		}
	}

	return <div className="msg-index">
		<h2>Msgs and Gossip</h2>
		{loggedInUser && <MsgEdit onRefreshMsgs={loadMsgs}/>}
		<MsgList
			msgs={msgs}
			onRemoveMsg={onRemoveMsg} />
	</div>
}