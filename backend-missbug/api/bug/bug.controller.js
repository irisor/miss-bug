import { bugService } from "./bug.service.js"

export async function getBugs(req, res) {
	const { txt, minSeverity, labels, sortBy, sortDir, pageIdx } = req.query
    const filterBy = { txt, minSeverity: +minSeverity, labels, sortBy, sortDir }
    if (pageIdx) filterBy.pageIdx = +pageIdx
    try {
        const bugs = await bugService.query(filterBy)
        res.send(bugs)
    } catch (err) {
        console.log('err:', err)
        res.status(400).send(`Couldn't get bugs`)
    }
}

export async function getBug(req, res) {
    const { bugId } = req.params

    try {
        const bug = await bugService.getById(bugId)
        res.send(bug)
    } catch (err) {
        console.log('err:', err)
        res.status(400).send(`Couldn't get bug`)
    }
}

export async function removeBug(req, res) {
    const { loggedinUser } = req
    const { bugId } = req.params
    try {
        await bugService.remove(bugId, loggedinUser)
        res.send('Bug Deleted')
    } catch (err) {
        console.log('err:', err)
        res.status(400).send(`Couldn't get bug`)
    }
}

export async function addBug(req, res) {
    const { loggedinUser } = req
    const { title, severity, description, labels } = req.body
    const bugToSave = { title, severity: +severity, description, labels }
    try {
        const savedBug = await bugService.save(bugToSave, loggedinUser)
        res.send(savedBug)
    } catch (err) {
        console.log('err:', err)
        res.status(400).send(`Couldn't add bug`)
    }
}

export async function updateBug(req, res) {
    const { loggedinUser } = req
    const { _id, title, severity, description, labels } = req.body
    const bugToSave = { _id, title, severity: +severity, description, labels }
    try {
        const savedBug = await bugService.save(bugToSave, loggedinUser)
        res.send(savedBug)
    } catch (err) {
        console.log('err:', err)
        res.status(400).send(`Couldn't save bug`)
    }
}

export async function getLabels(req, res) {
    try {
        const labels = await bugService.getLabels()
        res.send(labels)
    } catch (err) {
        console.log('err:', err)
        res.status(400).send(`Couldn't get labels`)
    }
}

export async function getpdf(req, res) {
    try {
        await bugService.getpdf(req, res)
    } catch (err) {
        console.log('err:', err);
        res.status(400).send(`Couldn't create pdf`)
    }
}
    