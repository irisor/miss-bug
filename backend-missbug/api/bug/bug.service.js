import fs from "fs";
import PDFDocument from 'pdfkit'
import { loggerService } from "../../services/logger.service.js";
import { makeId, readJsonFile } from "../../services/util.service.js";

const bugs = readJsonFile('data/bugs.json')
const PAGE_SIZE = 4

export const bugService = {
    query,
    getById,
    remove,
    save,
    getLabels,
    getpdf,
}

async function query(filterBy) {
    let bugsToDisplay = [...bugs]
    let labels = []

    try {
        if (filterBy.txt) {
            const regExp = new RegExp(filterBy.txt, 'i')
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

        if ('pageIdx' in filterBy && !isNaN(filterBy.pageIdx) && filterBy.pageIdx !== undefined) {
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            bugsToDisplay = bugsToDisplay.slice(startIdx, startIdx + PAGE_SIZE)
        }
        return bugsToDisplay

    } catch (err) {
        loggerService.error(`Couldn't get bugs`, err);
        throw err
    }
}

async function getById(bugId) {
    try {
        const bug = bugs.find(bug => bug._id === bugId)
        if (!bug) throw `Couldn't find bug with _id ${bugId}`
        return bug
    } catch (err) {
        loggerService.error(`Couldn't get bug`, err);
        throw err
    }
}

async function remove(bugId, loggedinUser) {
    try {
        const bugIdx = bugs.findIndex(bug => bug._id === bugId)
        if (bugIdx === -1) throw `Couldn't remove bug with _id ${bugId}`
        if (!loggedinUser.isAdmin && bugs[bugIdx].owner?._id !== loggedinUser._id) throw 'Cant remove bug'
        bugs.splice(bugIdx, 1)
        return _saveBugsToFile()
    } catch (err) {
        loggerService.error(`Couldn't get bug`, err);
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
        loggerService.error(`Couldn't update bug`, err);
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
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const labels = bugs.reduce((acc, bug) => {
                bug.labels?.forEach(label => {
                    if (!acc.includes(label)) acc.push(label)
                })
                return acc
            }, [])
            resolve(labels)
        }, 100)
    })
}

async function getpdf(req, res) {
    const doc = new PDFDocument();
    const filename = 'bugs.pdf';
    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
    doc.pipe(res);

    doc.text('Bugs', 20, 20);

    try {
        const bugs = await bugService.query({});
        let y = 50;
        bugs.forEach(bug => {
            doc.text(`${bug?._id} - ${bug?.title} - ${bug?.severity} - ${bug?.description}`, 20, y);
            y += 20;
        });
        doc.end();
    } catch (err) {
        console.log('err:', err);
        res.status(400).send(`Couldn't create pdf`)
    }
}