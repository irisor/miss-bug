import { storageService } from '../async-storage.service'
import { userService } from '../user'

export const msgService = {
	add,
	query,
	remove,
}

function query() {
	return storageService.query('msg')
}

async function remove(msgId) {
	await storageService.remove('msg', msgId)
}

async function add({ txt, aboutBugId }) {
	const aboutBug = await userService.getById(aboutBugId)
	const msgToAdd = {
		txt,
		byUser: userService.getLoggedinUser(),
		aboutBug: {
			_id: aboutBug._id,
			fullname: aboutBug.fullname,
			imgUrl: aboutBug.imgUrl,
		},
	}

	msgToAdd.byUser.score += 10
	await userService.update(msgToAdd.byUser)

	const addedMsg = await storageService.post('msg', msgToAdd)
	return addedMsg
}