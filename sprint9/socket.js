import { EventEmitter } from 'events'
import { WebSocketServer } from 'ws'

const PORT = 8080
const WS_EVENT = {
    CONNECTING: 'connecting',
    MESSAGE: 'message',
    CLOSE: 'close',
    ERROR: 'error',
}

const eventEmitter = new EventEmitter();
const wss = new WebSocketServer({ port: PORT })

wss.on(WS_EVENT.CONNECTING, (ws) => {
    console.log('✅ client connected')

    // 클라이언트에게 환영 메시지 보내기 (프론트 onmessage에서 보임)
    ws.send('Hello Client!')

    // 클라이언트가 보낸 메시지 받기
    ws.on(WS_EVENT.MESSAGE, (data) => {
        const text = data.toString()
        console.log('📩 from client:', text)

        // 내부 이벤트 발생시키기
        eventEmitter.emit(WS_EVENT.MESSAGE, text)
    })

    // EventEmitter에서 발생한 이벤트를 다시 클라이언트로 전송
    eventEmitter.on(WS_EVENT.MESSAGE, (data) => {
        ws.send(`🎁 message from server event: ${data}`);
    });

    ws.on(WS_EVENT.CLOSE, () => {
        console.log('👋 client disconnected')
    })

    ws.on(WS_EVENT.ERROR, (err) => {
        console.error('⚠️ ws error:', err.message)
    })
})

console.log(`🚀 WebSocket Started at ws://localhost:${PORT}`);