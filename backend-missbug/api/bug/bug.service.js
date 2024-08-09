import escapeRegExp from 'lodash.escaperegexp' // Requiring lodash.escaperegexp here
import fs from "fs"
import PDFDocument from 'pdfkit'
import { loggerService } from "../../services/logger.service.js"
import { makeId, readJsonFile } from "../../services/util.service.js"

const bugs = readJsonFile('data/bugs.json')
const PAGE_SIZE = 4

export const bugService = {
    query,
    getById,
    remove,
    save,
    getLabels,
    getPdf,
}

async function query(filterBy) {
    let bugsToDisplay = [...bugs]
    let labels = []

    try {
        if (filterBy.txt) {
            const regExp = new RegExp(escapeRegExp(filterBy.txt, 'i'))
            bugsToDisplay = bugsToDisplay.filter(bug => regExp.test(bug.title) || regExp.test(bug.description))
        }

        if (filterBy.minSeverity) {
            bugsToDisplay = bugsToDisplay.filter(bug => bug.severity >= filterBy.minSeverity)
        }

        if (filterBy.labels) {
            labels = filterBy.labels.split(',')
            bugsToDisplay = bugsToDisplay.filter(bug => labels.some(label => bug.labels?.includes(label)))
        }

        if (filterBy.owner) {
            bugsToDisplay = bugsToDisplay.filter(bug => bug.owner?._id === filterBy.owner)
        }

        if (filterBy.sortBy) {
            switch (filterBy.sortBy) {
                case 'title':
                    bugsToDisplay.sort((bug1, bug2) => bug1.title.localeCompare(bug2.title) * filterBy.sortDir)
                    break
                case 'severity':
                    bugsToDisplay.sort((bug1, bug2) => bug1.severity - bug2.severity * filterBy.sortDir)
                    break
                case 'createdAt':
                    bugsToDisplay.sort((bug1, bug2) => bug1.createdAt - bug2.createdAt * filterBy.sortDir)
                    break
                default:
                    break
            }
        }

        if (filterBy.pageIdx && filterBy.pageIdx !== undefined) {
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            bugsToDisplay = bugsToDisplay.slice(startIdx, startIdx + PAGE_SIZE)
        }
        return bugsToDisplay

    } catch (err) {
        loggerService.error(`Couldn't get bugs`, err)
        throw err
    }
}

async function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) throw `Couldn't find bug with _id ${bugId}`
    return bug
}

async function remove(bugId, loggedinUser) {
    try {
        const bugIdx = bugs.findIndex(bug => bug._id === bugId)
        if (bugIdx === -1) throw `Couldn't remove bug with _id ${bugId}`
        if (!loggedinUser.isAdmin && bugs[bugIdx].owner?._id !== loggedinUser._id) throw 'Unauthorized'
        bugs.splice(bugIdx, 1)
        return _saveBugsToFile()
    } catch (err) {
        loggerService.error(`Couldn't get bug`, err)
        throw err
    }
}

async function save(bugToSave, loggedinUser) {
    try {
        if (bugToSave._id) {
            if (!loggedinUser.isAdmin && bugToSave?.owner?._id !== loggedinUser._id) throw 'Cant update bug'
            const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
            if (idx === -1) throw `Couldn't update bug with _id ${bugToSave._id}`
            bugs[idx] = { ...bugs[idx], ...bugToSave } // update the bug with the new bugToSave
            bugToSave = bugs[idx]
        } else {
            bugToSave._id = makeId()
            bugToSave.CreatedAt = Date.now()
            bugToSave.owner = loggedinUser
            bugs.push(bugToSave)
        }
        await _saveBugsToFile()
        return bugToSave
    } catch (err) {
        loggerService.error(`Couldn't update bug`, err)
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
    const labels = new Set()
    bugs.forEach(bug => {
        labels.add(bug?.labels)
    }, [])
    return Array.from(labels)
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