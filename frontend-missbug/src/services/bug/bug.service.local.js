
import escapeRegExp from 'lodash.escaperegexp'
import { storageService } from '../async-storage.service.js'

const STORAGE_KEY = 'bugDB'
const PAGE_SIZE = 4

export const bugService = {
    query,
    getById,
    save,
    remove,
    getLabels,
}


function query(filterBy) {
    return new Promise((resolve, reject) => {
        storageService.query(STORAGE_KEY)
            .then(bugsToDisplay => {
                let labels = []

                if (filterBy.txt) {
                    const regExp = new RegExp(escapeRegExp(filterBy.txt, 'i'))
                    bugsToDisplay = bugsToDisplay.filter(bug => regExp.test(bug.title) || regExp.test(bug.description))
                }

                if (filterBy.minSeverity) {
                    bugsToDisplay = bugsToDisplay.filter(bug => bug.severity >= filterBy.minSeverity)
                }

                if (filterBy.labels && filterBy.labels.length) {
                    labels = filterBy.labels
                    bugsToDisplay = bugsToDisplay.filter(bug => labels.some(label => bug.labels?.includes(label)))
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

                if (filterBy.pageIdx && filterBy.pageIdx !== undefined && filterBy.pageIdx !== "undefined") {
                    const startIdx = filterBy.pageIdx * PAGE_SIZE
                    bugsToDisplay = bugsToDisplay.slice(startIdx, startIdx + PAGE_SIZE)
                }
                resolve(bugsToDisplay)
            })
            .catch(reject)
    })
}

function getById(bugId) {
    return storageService.get(STORAGE_KEY, bugId)
}
function remove(bugId) {
    return storageService.remove(STORAGE_KEY, bugId)
}
function save(bug) {
    if (bug._id) {
        return storageService.put(STORAGE_KEY, bug)
    } else {
        return storageService.post(STORAGE_KEY, bug)
    }
}


async function getLabels() {
    const labels = new Set()
    const bugs = await storageService.query(STORAGE_KEY)
    bugs.forEach(bug => {
        labels.add(bug?.labels)
    }, [])

    const labelsStr = Array.from(labels)
    return labelsStr
}
