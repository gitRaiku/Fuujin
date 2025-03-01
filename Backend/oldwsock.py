#!/bin/python3
import asyncio
import websockets
import numpy as np
import matplotlib.pyplot as plt
import random

async def handle_connection(websocket, path):
    print('New connection established')
    nextT = 0
    ms1 = []
    iid = 0
    linWidth = 2
    while True:
        try:
            message = await websocket.recv()
            if (len(message)) < 100:
                if message[0] == 'a':
                    data = np.zeros(200, dtype=np.float32)
                    for i in range(200):
                        data[i] = random.random()
                    await websocket.send(data.tobytes())
                elif message[0] == '0':
                    iid = 0
                    plt.legend()
                    plt.show()
                elif message[0] == '5':
                    plt.plot(np.array(ms1).flatten(), linewidth=2, label=f'1 - {iid}')
                elif message[0] == '1':
                    nextT = '1'
                    if len(message) > 1:
                        linWidth = ord(message[1]) - ord('0')
                elif message[0] == '2':
                    nextT = '2'
                    if len(message) > 1:
                        linWidth = ord(message[1]) - ord('0')
                else:
                    nextT = message[0]
            else:
                if nextT == '2':
                    # ar = np.frombuffer(message, dtype='float32').reshape(-1, 2)[:,0]
                    ar = np.frombuffer(message, dtype='float32').reshape(-1, 2)
                    plt.plot(ar, linewidth=linWidth, label=f'2 - {iid}')
                elif nextT == '1':
                    ar = np.frombuffer(message, dtype='float32')
                    plt.plot(ar, linewidth=linWidth, label=f'1 - {iid}')
                elif nextT == '3':
                    ar = np.frombuffer(message, dtype='float32')
                    plt.plot(ar / 512, linewidth=1, label=f'1 - {iid}')
                elif nextT == '4':
                    ar = np.frombuffer(message, dtype='float32')
                    ms1.append(ar.flatten())
                # await websocket.send(f'Hello from server! You said: {message[0]}')
                iid += 1
        except websockets.ConnectionClosed:
            print('Connection closed')
            break

async def main():
    async with websockets.serve(handle_connection, 'localhost', 8080):
        print('WebSocket server started on port 8080')
        await asyncio.Future()

asyncio.run(main())

