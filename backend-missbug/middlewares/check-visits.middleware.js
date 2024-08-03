const MAX_VISITED_BUGS = 3
const VISITED_BUGS_TIMEOUT =  70 * 1000 // 7 seconds

export function checkVisits(req, res, next) {
    let visitedBugs = req.cookies?.visitedBugs ? req.cookies.visitedBugs : []
    const { bugId } = req.params

    if (!visitedBugs.includes(bugId)) {
        visitedBugs.push(bugId)
    }
    if (visitedBugs.length > MAX_VISITED_BUGS) {
        return res.status(401).send('Wait for a bit')
    }

    res.cookie('visitedBugs', visitedBugs, { maxAge: VISITED_BUGS_TIMEOUT })
    next()
}