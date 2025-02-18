from pynufft import NUFFT

NufftObj = NUFFT()

import numpy
import numpy as np
import matplotlib.pyplot as plt
ln = numpy.linspace(1, 2000, 300)
lnn = numpy.reshape(ln, (len(ln), 1))

from scipy.io import wavfile

# Load the WAV file
sample_rate, samples = wavfile.read('ivi.wav')
# samples = np.linspace(0, 10000, len(samples))

kern_size = 512
kern_step = 128

Nd = (kern_size,)
Kd = (kern_size*2,)
Jd = (6,)

NufftObj.plan(lnn, Nd, Kd, Jd)
window = np.hanning(kern_size)
res = []
ful_res = np.zeros(len(samples))
orig = np.zeros(len(samples))
slices = np.zeros(((len(samples) - kern_size) // kern_step, 300))
for i in range((len(samples) - kern_size) // kern_step):
    print(f'At {i}/{(len(samples) - kern_size) // kern_step}', end='\r')
    csamps = samples[kern_step * i : kern_step * i + kern_size] * window
    kern_fft = NufftObj.forward(csamps)
    print(numpy.array(csamps).shape)
    print(kern_fft.shape)
    # restored = NufftObj.solve(kern_fft,'L1TVOLS', maxiter=30,rho=1)
    restored = NufftObj.solve(kern_fft,'cg', maxiter=30)

    ful_res[kern_step * i : kern_step * (i + 1)] = restored[kern_size // 2 - kern_step // 2 : kern_size // 2 + kern_step // 2].real
    orig[kern_step * i : kern_step * (i + 1)] = samples[kern_step * i : kern_step * i + kern_size][kern_size // 2 - kern_step // 2 : kern_size // 2 + kern_step // 2]

    slices[i] = 10 * np.log10(2 ** kern_fft.real)

    '''
    plt.plot(np.linspace(0, kern_size, kern_size), restored.real, label='Solved')
    plt.plot(np.linspace(0, kern_size, kern_size), samples[kern_step * i : kern_step * i + kern_size], label='Original')
    restored[0:kern_size // 2 - kern_step // 2] = 0
    restored[kern_size // 2 + kern_step // 2:-1] = 0
    plt.plot(np.linspace(0, kern_size, kern_size), restored.real, label='Solved')
    plt.legend()
    plt.show()'''
    # orig.append(samples[kern_step * i : kern_step * i + kern_size][kern_step : kern_step * 2])


ful_res = np.array(ful_res).flatten()
orig = np.array(orig).flatten()

# plt.plot(np.linspace(0, 100, len(orig)), ful_res, label='Restored Real')
# plt.plot(np.linspace(0, 100, len(orig)), orig, label='Original')
# plt.plot(np.linspace(0, 100, len(orig)), ful_res, label='Original')
# plt.imshow(np.rot90(slices))
# plt.colorbar()
# plt.legend()
# plt.show()

wavfile.write('out.wav', sample_rate, ful_res.astype(np.int16))
exit()
