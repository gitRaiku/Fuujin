#!/bin/python3
import asyncio
import websockets
import numpy as np
import matplotlib.pyplot as plt
import random
from time import time, sleep

class Message:
    def __init__(self, data):
        self.data = np.frombuffer(data, dtype='uint8')
        self.tstamp = time()

    '''
        0: SendData
        1: StartStream
    '''
    def getType(self):
        return self.data[0]

    def getFreq(self):
        return np.frombuffer(self.data[1:5], dtype='uint32')[0]

    def getAt(self, x):
        return self.data[x + 5]

    def getData(self):
        return self.data[5:514 + 5]

nextSockId = 0
messages = {}
async def sendMessage(websocket, centerFreq):
    res = np.array(np.random.rand(514), dtype='float32')
    await websocket.send(res.tobytes())
    return
    res = np.zeros(514 * 50)
    ct = time()
    for (id, e) in messages.items():
        print(f'kmskmskm {id} {e}')
        if (e.tstamp - ct > 0.12):
            messages.pop(id)
            continue

        cf = e.getFreq()
        dif = cf - centerFreq
        if abs(cf - centerFreq) <= (514 // 2) / 2:
            for k in range(0, 257):
                if (k + dif < 0): # TODO: Use math
                    continue
                if (k + dif > 0):
                    break
                res[2 * k    ] += e.getAt((k + dif) * 2)
                res[2 * k + 1] += e.getAt((k + dif) * 2 + 1)
    await websocket.send(res.tobytes())

async def startStream(websocket, centerFreq, cid):
    print(f'Start streaming to {cid}:{centerFreq}')
    kms = 0
    try:
        while True:
            kms += 1
            st = time()
            await sendMessage(websocket, centerFreq)
            ct = time()
            sleep(0.012 - (ct - st))
            if (kms == 100000):
                break
    except websockets.ConnectionClosed:
        print('Connection closed')
        return

async def handle_connection(websocket, path):
    global nextSockId
    cid = nextSockId
    nextSockId += 1
    print(f'New connection established {cid}')
    while True:
        try:
            data = await websocket.recv()
            formatted = Message(data)
            if formatted.getType() == 0:
                messages[nextSockId] = formatted
            elif formatted.getType() == 1:
                print('startst')
                await startStream(websocket, formatted.getFreq(), cid)
        except websockets.ConnectionClosed:
            print('Connection closed')
            break

async def main():
    async with websockets.serve(handle_connection, 'localhost', 8080):
        print('WebSocket server started on port 8080')
        await asyncio.Future()

asyncio.run(main())

