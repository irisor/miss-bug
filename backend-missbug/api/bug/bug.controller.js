import { loggerService } from "../../services/logger.service.js"
import { bugService } from "./bug.service.js"

export async function getBugs(req, res) {
	const { txt, minSeverity, labels, owner, sortBy, sortDir, pageIdx } = req.query
    const filterBy = { txt, minSeverity: +minSeverity, labels, owner, sortBy, sortDir }
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
    try {
		const bugId = req.params.id
		const removedId = await bugService.remove(bugId)

		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove bug', err)
		res.status(400).send({ err: 'Failed to remove bug' })
	}
}

export async function addBug(req, res) {
    const { loggedinUser, body: bug } = req

	try {
		bug.owner = loggedinUser
		const addedBug = await bugService.add(bug)
		res.json(addedBug)
	} catch (err) {
		logger.error('Failed to add bug', err)
		res.status(400).send({ err: 'Failed to add bug' })
	}
}

export async function updateBug(req, res) {
    const { loggedinUser, body: bug } = req
    const { _id: userId, isAdmin } = loggedinUser

    if(!isAdmin && bug.owner._id !== userId) {
        res.status(403).send('Not your bug...')
        return
    }

	try {
		const updatedBug = await bugService.update(bug)
		res.json(updatedBug)
	} catch (err) {
		logger.error('Failed to update bug', err)
		res.status(400).send({ err: 'Failed to update bug' })
	}
}

export async function getLabels(req, res) {
    try {
        const labels = await bugService.getLabels()
        res.send(labels)
    } catch (err) {
        loggerService.error('Cannot get labels, err:', err)
        res.status(400).send(`Couldn't get labels`)
    }
}

export async function getPdf(req, res) {
    try {
        const { filename, pdf } = await bugService.getPdf()
        res.setHeader('Content-disposition', `attachment; filename=${filename}`)
        res.set("Content-Type", "application/pdf");
        res.send(pdf)
    } catch (err) {
        loggerService.error('Cannot get pdf, err:', err)
        res.status(400).send(`Couldn't create pdf`)
    }
}
    