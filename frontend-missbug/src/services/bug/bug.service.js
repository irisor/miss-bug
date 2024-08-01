
import Axios from "axios"
const axios = Axios.create({
    withCredentials: true
})

const BASE_URL = 'http://localhost:3030/api/bug' 

export const bugService = {
    query,
    getById,
    save,
    remove,
    getLabels,
    getpdf,
}


async function query(filterBy = {}) {
    try {
        let filterByToSend = {...filterBy}
        Object.keys(filterByToSend).forEach(key => {
            if (Array.isArray(filterByToSend[key])) {
                filterByToSend[key] = filterByToSend[key].join(',')
            }
        })
        let { data: bugs } = await axios.get(BASE_URL, { params: filterByToSend })
        return bugs
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}
async function getById(bugId) {
    try {
        let { data: bug } = await axios.get(BASE_URL + '/' + bugId)
        return bug
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}
async function remove(bugId) {
    const url = BASE_URL + '/' + bugId
    try {
        let { data } = await axios.delete(url)
        return data
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}
async function save(bugToSave) {
    try {
        const method = bugToSave._id ? 'put' : 'post'
        const { data: savedBug } = await axios[method](BASE_URL, bugToSave)
        return savedBug
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

async function getLabels() {
    try {
        const { data: labels } = await axios.get(BASE_URL + '/getlabels')
        return labels
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

async function getpdf() {
    try {
        const { data } = await axios.get(BASE_URL + '/getpdf', { responseType: 'blob' })
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
