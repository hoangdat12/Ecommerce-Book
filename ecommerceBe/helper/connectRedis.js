const redis = require('redis')
// redis version 3.1.2

const client = redis.createClient({
    port: 6379,
    host: '127.0.0.1'
})

client.ping( (err, pong) => {
    console.log(pong)
})

client.on('error', (err) => console.log('Redis Client Error', err))

client.on('connect', (err) => console.log('Connected'))

client.on('ready', (err) => console.log('Redis to ready'))

module.exports = client