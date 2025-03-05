#!/bin/python3
import asyncio
import websockets
import numpy as np
import matplotlib.pyplot as plt
import random
from time import time, sleep
from math import floor
from collections import deque

class Message:
    def __init__(self, data):
        self.type = data[0]
        if len(data) > 4:
            self.freq = data[1] << 24 | data[2] << 16 | data[3] << 8 | data[4]
        if len(data) > 8:
            self.freq2 = data[5] << 24 | data[6] << 16 | data[7] << 8 | data[8]
        if len(data) > 5:
            self.data = np.frombuffer(data[5:], dtype='float32')

    '''
        0: SendData
        1: StartStream
        2: ResetData
    '''
    def getType(self):
        return self.type

    def getFreq(self):
        return self.freq

    def getFreq2(self):
        return self.freq2

    def getAt(self, x):
        return self.data[x]

    def getData(self):
        return self.data

st = time()
def getTimeSlot():
    ct = time() - st
    return floor(ct * 86.1328125) # / (512 / 44100)

nextSockId = 0
messages = {}
async def sendMessage(websocket, centerFreq, tslot):
    if False:
        res = np.array(np.random.rand(514) * 10, dtype='float32')
        await websocket.send(res.tobytes())
        return

    if False:
        res = np.zeros(514, dtype='float32')
        res[40] = 200
        await websocket.send(res.tobytes())
        return

    res = np.zeros(514, dtype='float32')
    for (id, e) in messages.items():
        kms = 0
        while len(e) > 0 and e[0].tstamp < tslot:
            kms += 1
            e.popleft()
        if kms > 1:
            print("OVEROVER")

        if len(e) > 0:
            cf = e[0].getFreq()
            dif = cf - centerFreq
            dif = 0
            if abs(dif) <= (514 // 2) // 2:
                for k in range(0, 257):
                    if (k + dif < 0): # TODO: Use math
                        continue
                    if (k + dif > 257):
                        break
                    res[2 * k    ] += e[0].getAt((k + dif) * 2)
                    res[2 * k + 1] += e[0].getAt((k + dif) * 2 + 1)
    await websocket.send(res.tobytes())

async def startStream(websocket, centerFreq, cid):
    print(f'Start streaming to {cid}:{centerFreq}')
    ct = 0
    try:
        while True:
            cct = getTimeSlot()
            await asyncio.sleep((512 / 44100) * 0.4)
            if cct > ct:
                ct = cct
                await sendMessage(websocket, centerFreq, cct)
    except websockets.ConnectionClosed:
        print('Connection closed')
        return

async def sendSpec(websocket, f1, f2, tslot):
    if False:
        res = np.array(np.random.rand(514) * 10, dtype='float32')
        await websocket.send(res.tobytes())
        return

    if False:
        res = np.zeros(514, dtype='float32')
        res[40] = 200
        await websocket.send(res.tobytes())
        return

    res = np.zeros(514, dtype='float32')
    for (id, e) in messages.items():
        while len(e) > 0 and e[0].tstamp < tslot:
            e.popleft()

        if len(e) > 0:
            cf = e[0].getFreq()
            dif = cf - centerFreq
            dif = 0
            if abs(dif) <= (514 // 2) // 2:
                for k in range(0, 257):
                    if (k + dif < 0): # TODO: Use math
                        continue
                    if (k + dif > 257):
                        break
                    res[2 * k    ] += e[0].getAt((k + dif) * 2)
                    res[2 * k + 1] += e[0].getAt((k + dif) * 2 + 1)
    await websocket.send(res.tobytes())

async def startSpecStream(websocket, f1, f2, cid):
    print(f'Start streaming to {cid}:{f1}-{f2}')
    ct = 0
    try:
        while True:
            cct = getTimeSlot()
            await asyncio.sleep((512 / 44100) * 0.4)
            if cct > ct:
                ct = cct
                await sendSpec(websocket, f1, f2, cct)
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
                if cid not in messages.keys():
                    messages[cid] = deque()
                messages[cid].append(formatted)
                if len(messages[cid]) == 1:
                    print('stime')
                    messages[cid][0].tstamp = getTimeSlot()
                else:
                    messages[cid][-1].tstamp = messages[cid][-2].tstamp + 1
                # print(f'Added {formatted.getFreq()}')

            elif formatted.getType() == 1:
                print('startst')
                await startStream(websocket, formatted.getFreq(), cid)
            elif formatted.getType() == 2:
                cid = nextSockId
                print('resetCid')
                nextSockId += 1
            elif formatted.getType() == 3:
                print('startst 3')
                await startSpecStream(websocket, formatted.getFreq(), formatted.getFreq2(), cid)
        except websockets.ConnectionClosed:
            print('Connection closed')
            break

async def main():
    async with websockets.serve(handle_connection, '192.168.43.242', 8080):
        print('WebSocket server started on port 8080')
        await asyncio.Future()

asyncio.run(main())

