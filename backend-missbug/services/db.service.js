import { MongoClient } from 'mongodb'

import { config } from '../config/index.js'
import { loggerService } from './logger.service.js'

export const dbService = { getCollection, aggregate }

var dbConn = null

async function getCollection(collectionName) {
	try {
		const db = await _connect()
		const collection = await db.collection(collectionName)
		return collection
	} catch (err) {
		loggerService.error('Failed to get Mongo collection', err)
		throw err
	}
}

async function aggregate(collectionName, pipeline) {
	try {
		const collection = await getCollection(collectionName)

		return await collection.aggregate(pipeline).toArray()
	} catch (err) {
		loggerService.error('Failed to aggregate', err)
		throw err
	}
}

async function _connect() {
	if (dbConn) return dbConn
    
	try {
		const client = await MongoClient.connect(config.dbURL)
		return dbConn = client.db(config.dbName)
	} catch (err) {
		loggerService.error('Cannot Connect to DB', err)
		throw err
	}
}