class Drawer {
    constructor () {
        this.ws = new WebSocket(
            'ws://localhost:3000/ws/' + document.token
        )
        this.initConn(this.ws)
    }

    initConn(ws) {
        ws.onopen = function () {
            this.send(JSON.stringify({
                type: 'wsopen',
            }))
        }

        document.forms['chat'].onsubmit = function (e) {
            ws.send(JSON.stringify({
                type: 'chat',
                msg: this.msg.value
            }))
            e.preventDefault()
        }
        // enable only with proper behaviour
        document.forms['chat']['send'].disabled = false

        ws.onmessage = function (e) {
            console.log(e.data)
        }
    }
}

let drawer = new Drawer()