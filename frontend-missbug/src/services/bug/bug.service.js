
import { httpService } from "../http.service"

// const BASE_URL = (process.env.NODE_ENV !== 'development') ?
//     '/api/bug' :
//     '//localhost:3030/api/bug'
// const BASE_URL = !utilService.isDevelopment() ?
//     '/api/bug' :
//     '//localhost:3030/api/bug'
// const BASE_URL = 'http://localhost:3030/api/bug' 

export const bugService = {
    query,
    getById,
    save,
    remove,
    getLabels,
    getPdf,
}


async function query(filterBy = {}) {
    try {
        let filterByToSend = { ...filterBy }
        Object.keys(filterByToSend).forEach(key => {
            if (Array.isArray(filterByToSend[key])) {
                filterByToSend[key] = filterByToSend[key].join(',')
            }
        })

        let bugs = await httpService.get('bug', { params: filterByToSend })
        // let { data: bugs } = await axios.get(BASE_URL, { params: filterByToSend })
        return bugs
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}
async function getById(bugId) {
    try {
        let bug = await httpService.get(`bug/${bugId}`)
        // let { data: bug } = await axios.get(BASE_URL + '/' + bugId)
        return bug
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}
async function remove(bugId) {
    try {
        let data = await httpService.delete(`bug/${bugId}`)
        // let { data } = await axios.delete(`${BASE_URL}/${bugId}`)
        return data
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}
async function save(bug) {
    try {
        let savedBug
        if (bug._id) {
            savedBug = await httpService.put(`bug/${bug._id}`, bug)
        } else {
            savedBug = await httpService.post(`bug`, bug)
        }
        // return savedBug.data
        return savedBug
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

async function getLabels() {
    try {
        const labels = await httpService.get('bug/labels')
        return labels
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

async function getPdf() {
    try {
        const data = await httpService.get('bug/pdf', { responseType: 'blob' })
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'bugs.pdf');
        document.body.appendChild(link);
        link.click();
        return
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}
