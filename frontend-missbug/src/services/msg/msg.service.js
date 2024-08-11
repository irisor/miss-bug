import { httpService } from '../http.service'

export const msgService = {
	add,
	query,
	remove,
}

function query(filterBy) {
	var queryStr = !filterBy ? '' : `?name=${filterBy.name}&sort=anaAref`
	return httpService.get(`msg${queryStr}`)
}

async function remove(msgId) {
	await httpService.delete(`msg/${msgId}`)
}

async function add({ txt, aboutBugId }) {
	return await httpService.post(`msg`, { txt, aboutBugId })
}