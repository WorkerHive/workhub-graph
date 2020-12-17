#!/usr/bin/env node

/**
 * @type {any}
 */
import fs from 'fs'
import path from 'path';
import WebSocket from 'ws';
import http from 'http';
import https from 'https';
import {setupWSConnection} from './utils.js';
const wss = new WebSocket.Server({ noServer: true })

const port = process.env.PORT || 1234

function getFile(path, cb, timeout=2*1000) {
  const _timeout = setInterval(function() {

      const file = path;
      const fileExists = fs.existsSync(file);

      console.log('Checking for: ', file);
      console.log('Exists: ', fileExists);

      if (fileExists) {
          clearInterval(_timeout);
          cb()
      }
  }, timeout);
};

export default (host = process.env.WORKHUB_DOMAIN) => {
  getFile(path.resolve('') + `/greenlock.d/live/${host}/privkey.pem`, () => {
  const options = {
    key: fs.readFileSync(path.resolve('') + `/greenlock.d/live/${host}/privkey.pem`),
    cert: fs.readFileSync(path.resolve('') + `/greenlock.d/live/${host}/cert.pem`)
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
  })
}
