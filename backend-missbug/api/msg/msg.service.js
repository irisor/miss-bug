import { ObjectId } from 'mongodb'

import { asyncLocalStorage } from '../../services/als.service.js'
import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

export const msgService = { query, remove, add }

async function query(filterBy = {}) {
	try {
		const criteria = _buildCriteria(filterBy)
		const collection = await dbService.getCollection('msg')
        
		let msgs = await collection.aggregate([
            {
                $match: criteria,
            },
            {
                $lookup: {
                    localField: 'byUserId',
                    from: 'user',
                    foreignField: '_id',
                    as: 'byUser',
                },
            },
            {
                $unwind: '$byUser',
            },
            {
                $lookup: {
                    localField: 'aboutBugId',
                    from: 'bug',
                    foreignField: '_id',
                    as: 'aboutBug',
                },
            },
            {
                $unwind: '$aboutBug',
            },
        ]).toArray()

		msgs = msgs.map(msg => {
			msg.byUser = { 
                _id: msg.byUser._id, 
                fullname: msg.byUser.fullname 
            }
			msg.aboutBug = { 
                _id: msg.aboutBug._id, 
                title: msg.aboutBug.title 
            }
			delete msg.byUserId
			delete msg.aboutUserId
			return msg
		})

		return msgs
	} catch (err) {
		loggerService.error('cannot get msgs', err)
		throw err
	}
}

async function remove(msgId) {
	try {
		const { loggedinUser } = asyncLocalStorage.getStore()
		const collection = await dbService.getCollection('msg')

		const criteria = { _id: ObjectId.createFromHexString(msgId) }

        // remove only if user is owner/admin
		// if (!loggedinUser.isAdmin) {
        //     criteria.byUserId = ObjectId.createFromHexString(loggedinUser._id)
        // }

        const { deletedCount } = await collection.deleteOne(criteria)
		return deletedCount
	} catch (err) {
		loggerService.error(`cannot remove msg ${msgId}`, err)
		throw err
	}
}

async function add(msg) {
    try {
        const msgToAdd = {
            byUserId: msg.byUserId ? ObjectId.createFromHexString(msg.byUserId) : null,
			aboutBugId: msg.aboutBugId ?ObjectId.createFromHexString(msg.aboutBugId) : null,
			txt: msg.txt,
		}
		const collection = await dbService.getCollection('msg')
		await collection.insertOne(msgToAdd)
        
		return msgToAdd
	} catch (err) {
		loggerService.error('cannot add msg', err)
		throw err
	}
}

function _buildCriteria(filterBy) {
	const criteria = {}

	if (filterBy.byUserId) {
        criteria.byUserId = ObjectId.createFromHexString(filterBy.byUserId)
    }
	return criteria
}