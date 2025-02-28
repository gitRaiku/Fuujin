#!/bin/python3
import asyncio
import websockets
import numpy as np
import matplotlib.pyplot as plt

async def handle_connection(websocket, path):
    print('New connection established')
    nextT = 0
    ms1 = []
    iid = 0
    while True:
        try:
            message = await websocket.recv()
            print(f'Lm {len(message)}')
            if (len(message)) < 100:
                if message[0] == '0':
                    iid = 0
                    plt.legend()
                    plt.show()
                else:
                    nextT = message[0]
                print(f'Update {nextT}')
            else:
                if nextT == '2':
                    # ar = np.frombuffer(message, dtype='float32').reshape(-1, 2)[:,0]
                    ar = np.frombuffer(message, dtype='float32').reshape(-1, 2)
                    plt.plot(ar, linewidth=1, label=f'2 - {iid}')
                elif nextT == '1':
                    ar = np.frombuffer(message, dtype='float32')
                    plt.plot(ar, linewidth=2, label=f'1 - {iid}')
                elif nextT == '3':
                    ar = np.frombuffer(message, dtype='float32')
                    plt.plot(ar / 512, linewidth=1, label=f'1 - {iid}')
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

