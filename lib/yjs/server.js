#!/usr/bin/env node

/**
 * @type {any}
 */
import fs from 'fs'
import path from 'path';
import WebSocket from 'ws';
import http from 'http';
import https from 'https';

const wss = new WebSocket.Server({ noServer: true })
const setupWSConnection = require('./utils.js').setupWSConnection

const port = process.env.PORT || 1234


export default (host = 'thetechcompany.workhub.services') => {
  const options = {
    key: fs.readFileSync(path.resolve('') + `/../greenlock.d/live/${host}/privkey.pem`),
    cert: fs.readFileSync(path.resolve('') + `/../greenlock.d/live/${host}/cert.pem`)
  }
  
  const sslServer = https.createServer(options, (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('okay')
  })

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('okay')
})

wss.on('connection', setupWSConnection)

sslServer.on('upgrade', (request, socket, head) => {
  // You may check auth of request here..
  /**
   * @param {any} ws
   */
  const handleAuth = ws => {
    wss.emit('connection', ws, request)
  }
  wss.handleUpgrade(request, socket, head, handleAuth)
})

sslServer.listen(port)

console.log('running on port', port)

}