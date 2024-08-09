import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import { loggerService } from './services/logger.service.js'
import { bugRoutes } from './api/bug/bug.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'

const app = express()

const corsOptions = {
    origin: [
        'http://127.0.0.1:5173',
        'http://localhost:5173',
        'http://127.0.0.1:5174',
        'http://localhost:5174'
    ],
    credentials: true
}

//* App Configuration

console.log("NODE_ENV:", process.env.NODE_ENV)
if (process.env.NODE_ENV !== 'production') {
    console.log("development mode")
    app.use(cors(corsOptions))
} else {
    console.log("production mode")
    app.use(express.static('public'))
}
app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


//* Routes
app.use('/api/bug', bugRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)


app.get('/', (req, res) => res.send('Hello there'))

//* For SPA (Single Page Application) - catch all routes and send to the index.html
app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const PORT = process.env.PORT || 3030

app.listen(PORT, () =>
    loggerService.info(`Server listening on port ${PORT}`)
)
