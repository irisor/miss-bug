import escapeRegExp from 'lodash.escaperegexp' // Requiring lodash.escaperegexp here
import { ObjectId } from 'mongodb'
import fs from "fs"
import PDFDocument from 'pdfkit'
import { loggerService } from "../../services/logger.service.js"
import {  readJsonFile } from "../../services/util.service.js"
import { dbService } from '../../services/db.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'

const bugs = readJsonFile('data/bugs.json')
const PAGE_SIZE = 4

export const bugService = {
    query,
    getById,
    remove,
    add,
    update,
    getLabels,
    getPdf,
}

async function query(filterBy) {

    try {
        const criteria = _buildCriteria(filterBy)
        const sort = _buildSort(filterBy)

        const collection = await dbService.getCollection('bug')
        let bugCursor = await collection.find(criteria, { sort })

        if (filterBy?.pageIdx !== undefined && !isNaN(filterBy.pageIdx)) {
            bugCursor.skip(filterBy.pageIdx * PAGE_SIZE).limit(PAGE_SIZE)
        }

        const bugs = bugCursor.toArray()
        return bugs

    } catch (err) {
        loggerService.error(`Couldn't get bugs`, err)
        throw err
    }
}

async function getById(bugId) {
    const criteria = { _id: ObjectId.createFromHexString(bugId) }
    console.log("*** bug.service getById criteria:", bugId, criteria)

    const collection = await dbService.getCollection('bug')
    const bug = await collection.findOne(criteria)

    if (!bug) throw `Couldn't find bug with _id ${bugId}`
    bug.createdAt = bug._id.getTimestamp()
    return bug
}

async function remove(bugId) {
    const { loggedinUser } = asyncLocalStorage.getStore()
    const { _id: ownerId, isAdmin } = loggedinUser

    try {
        const criteria = {
            _id: ObjectId.createFromHexString(bugId),
        }
        if (!isAdmin) criteria['owner._id'] = ownerId

        const collection = await dbService.getCollection('bug')
        const res = await collection.deleteOne(criteria)

        if (res.deletedCount === 0) throw ('Not your bug')
        return bugId
    } catch (err) {
        loggerService.error(`Couldn't get bug`, err)
        throw err
    }
}

async function add(bug) {
    try {
        const collection = await dbService.getCollection('bug')
        await collection.insertOne(bug)

        return bug
    } catch (err) {
        logger.error('cannot insert bug', err)
        throw err
    }
}

async function update(bug) {

    try {
        const criteria = { _id: ObjectId.createFromHexString(bug._id) }

        const collection = await dbService.getCollection('bug')
        await collection.updateOne(criteria, { $set: bugToSave })

        return bug
    } catch (err) {
        logger.error(`cannot update bug ${bug._id}`, err)
        throw err
    }
}


function _saveBugsToFile(path = './data/bugs.json') {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

async function getLabels() {
    try {
        const [{labels}] = await dbService.aggregate(('bug'), [
            { $unwind: "$labels" },
            { $match: { labels: { $ne: "" } } },
            { $group: { _id: null, labels: { $addToSet: "$labels" } } },
            { $project: { _id: 0, labels: 1 } },
        ])

        return labels || []
    } catch (err) {
        loggerService.error('Cannot get labels', err)
        throw err
    }
}

async function getPdf() {
    const doc = new PDFDocument()
    const filename = 'bugs.pdf'

    try {
        const bugs = await bugService.query({})
        let y = 50
        bugs.forEach(bug => {
            doc.text(`${bug?._id} - ${bug?.title} - ${bug?.severity} - ${bug?.description}`, 20, y)
            y += 20
        })
        doc.end()
        const pdf = await new Promise((resolve, reject) => {
            const buffers = []
            doc.on('data', chunk => buffers.push(chunk))
            doc.on('error', reject)
            doc.on('end', () => resolve(Buffer.concat(buffers)))
        }).catch(err => {
            loggerService.error('Couldn\'t create pdf', err)
            throw err
        })
        return {
            filename,
            pdf: pdf
        }
    } catch (err) {
        loggerService.error('Cannot get bug, err:', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const labels = filterBy.labels.split(',')
    let criteria = {}

    criteria.$and = []

    if (filterBy.txt && filterBy.txt.trim() !== '') {
        const txt = escapeRegExp(filterBy.txt)
        criteria.$and.push({
            $or: [
                { title: { $regex: txt, $options: 'i' } },
                { description: { $regex: txt, $options: 'i' } }
            ]
        })
    }

    if (filterBy.labels && filterBy.labels.length > 0) {
        criteria.$and.push({ labels: { $in: labels } })
    }

    if (filterBy.minSeverity) {
        criteria.$and.push({ severity: { $gte: filterBy.minSeverity } })
    }

    if (filterBy.owner) {
        criteria.$and.push({ "owner.id": filterBy.owner })
    }

    if (criteria.$and.length === 0) criteria = {}

    // example:
    // {
    //     $and: [
    //         { 
    //             $or: [
    //                 { title: { $regex: "my", $options: "i" } },
    //                 { description: { $regex: "my", $options: "i" } }
    //             ]
    //         },
    //         { labels: { $in: ["critical", "to-verify", "label1"] } },
    //         { severity: { $gte: 2 } },
    //         { "owner.id": "u101" }
    //     ]
    // }

    return criteria
}

function _buildSort(filterBy) {
    if (!filterBy.sortBy) return {}
    return { [filterBy.sortBy]: filterBy.sortDir }
}
