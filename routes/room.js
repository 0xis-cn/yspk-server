const express = require('express')
const nanoid = require('nanoid')
const router = express.Router()
const createError = require('http-errors')

const rooms = new Map()
const candidates = new Map()
let numRooms = 0

// WebSocket routes
// require('express-ws')(router)

router.post('/room', function (req, res) {
    let roomid = ++numRooms
    // TODO: Use some random interesting words instead of 乱室佳人
    const room = { roomid: roomid, name: '乱室佳人', listeners: new Set() }
    rooms.set(roomid, room)
    res.status(201).redirect(`/room/${roomid}`)
})

router.get('/room', (req, res) => res.render('rooms', { title: '房间', rooms: [...rooms] }))

router.get('/room/:roomid', function (req, res, next) {
    const room = rooms.get(+req.params.roomid)
    if (!room)
        return next(createError(404))
    // Client will use this token for ws connection
    const candidate = nanoid.nanoid()
    candidates.set(candidate, { user: req.user, room: room })
    res.render('room', { token: candidate, room: room })
})


router.ws('/ws/:token', function (ws, req) {
    const candidate = req.params.token
    if (!candidates.has(candidate))
        ws.close()
    const { user, room } = candidates.get(candidate)
    candidates.delete(candidate)
    room.listeners.add(ws)

    ws.on('message', function (message) {
        const msg = JSON.parse(message)
        if (user)
            msg['user'] = user.username
        message = JSON.stringify(msg)
        console.info(message)
        // TODO: game process here
        for (const listener of room.listeners)
            if (listener != ws)
                listener.send(message)          // TODO: add userid here
    })

    ws.on('close', function (e) {
        room.listeners.delete(ws)
    })
})

// router.get('/ws/:token', Function.prototype)

module.exports = router