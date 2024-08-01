
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
                    const regExp = new RegExp(filterBy.txt, 'i')
                    bugsToDisplay = bugsToDisplay.filter(bug => regExp.test(bug.title) || regExp.test(bug.description))
                }

                if (filterBy.minSeverity) {
                    bugsToDisplay = bugsToDisplay.filter(bug => bug.severity >= filterBy.minSeverity)
                }

                if (filterBy.labels) {
                    labels = filterBy.labels
                    bugsToDisplay = bugsToDisplay.filter(bug => labels.some(label => bug.labels?.includes(label)))
                }

                if (filterBy.sortBy) {
                    switch (filterBy.sortBy) {
                        case 'title':
                            bugsToDisplay.sort((bug1, bug2) => bug1.title.localeCompare(bug2.title))
                            break;
                        case 'severity':
                            bugsToDisplay.sort((bug1, bug2) => bug1.severity - bug2.severity)
                            break;
                        case 'createdAt':
                            bugsToDisplay.sort((bug1, bug2) => bug1.createdAt - bug2.createdAt)
                            break;
                        default:
                            break;
                    }

                    if (filterBy.sortDir === -1) bugsToDisplay.reverse()
                }

                if ('pageIdx' in filterBy) {
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


function getLabels() {
    return new Promise((resolve, reject) => {
        storageService.query(STORAGE_KEY)
            .then(bugs => {
                const labels = bugs.reduce((acc, bug) => {
                    bug.labels?.forEach(label => {
                        if (!acc.includes(label)) acc.push(label);
                    })
                    return acc
                }, [])
                resolve(labels)
            })
            .catch(reject)
    })
}
