import { bugService as remoteService } from './bug.service.js'
import { bugService as localService } from './bug.service.local.js'
const { DEV, VITE_LOCAL } = import.meta.env


let isRemote = VITE_LOCAL !== 'true'
isRemote = true

const service = isRemote ? remoteService : localService

export const bugService = {
    ...service,
	getFilterFromSearchParams,
	getDefaultFilter,
}

function getFilterFromSearchParams(searchParams) {
    const defaultFilter = getDefaultFilter()
    const filterBy = {}
    for (const field in defaultFilter) {
        filterBy[field] = searchParams.get(field) || defaultFilter[field]
        if (field === 'labels') filterBy[field] = filterBy[field].trim() ? filterBy[field].split(',') : []
    }
    return filterBy
}

function getDefaultFilter() {
    return {
        txt: '',
        minSeverity: 0,
        labels: '',
        owner: '',
        sortBy: '',
        sortDir: 1,
        pageIdx: undefined,
    }
}

if (DEV) window.bugService = bugService