import { useEffect, useState } from "react"
// import { useSelector } from "react-redux"

// import { addMsg } from "../store/actions/msg.actions"

import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"
import { bugService } from "../services/bug"
import { msgService } from "../services/msg"

export function MsgEdit({ onRefreshMsgs }) {
	// const users = useSelector(storeState => storeState.userModule.users)
	const [bugs, setBugs] = useState([])
	const [msgToEdit, setMsgToEdit] = useState({ txt: '', aboutBugId: '' })

	useEffect(() => {
		loadBugs()
	}, [])

	async function loadBugs() {
		const bugs = await bugService.query()
		setBugs(bugs)
	}

	function handleChange(ev) {
		const { name, value } = ev.target
		setMsgToEdit({ ...msgToEdit, [name]: value })
	}

	async function onAddMsg(ev) {
		ev.preventDefault()
		if (!msgToEdit.txt || !msgToEdit.aboutBugId) return alert('All fields are required')

		try {
			await msgService.add(msgToEdit)
			// await addMsg(msgToEdit)
			showSuccessMsg('Msg added')
			setMsgToEdit({ txt: '', aboutBugId: '' })
			onRefreshMsgs()
		} catch (err) {
			showErrorMsg('Cannot add msg')
		}
	}

	return <form className="msg-edit" onSubmit={onAddMsg}>
		<h3>Add Msg</h3>
		<select onChange={handleChange} value={msgToEdit.aboutBugId} name="aboutBugId">
			<option value="">Msg about...</option>
			{bugs.map(bug =>
				<option key={bug._id} value={bug._id}>
					{bug.title}
				</option>
			)}
		</select>
		<textarea name="txt" onChange={handleChange} value={msgToEdit.txt}></textarea>
		<button>Add</button>
	</form>

}