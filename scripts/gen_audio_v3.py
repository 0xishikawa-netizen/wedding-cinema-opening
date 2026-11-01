"""V3 placeholder audio (original, rights-free): richer BGM, reverberant glass, shadow swish, outro boom."""
import numpy as np, wave, os
SR = 48000
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
rng = np.random.default_rng(11)
def t(d): return np.arange(int(SR*d))/SR
def save(name, x, peak=0.85):
    x = np.atleast_2d(x)
    if x.shape[0] == 1: x = np.vstack([x, x])
    m = np.abs(x).max(); x = x/m*peak if m > 0 else x
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x.T*32767).astype("<i2").tobytes())
def lp(x, k): return np.convolve(x, np.ones(k)/k, mode="same")
def ir(d=1.6, decay=3.2, seed=0):
    r = np.random.default_rng(seed); n = t(d)
    return lp(r.standard_normal(len(n)), 6)*np.exp(-n*decay)
def reverb(x, wet=0.35, d=1.6, decay=3.2):
    n = len(x); L = []
    for s in (1, 2):  # stereo decorrelated
        h = ir(d, decay, s); N = n+len(h)
        y = np.fft.irfft(np.fft.rfft(x, N)*np.fft.rfft(h, N), N)[:n]
        L.append(x*(1-wet)+y/np.abs(y).max()*np.abs(x).max()*wet*1.6)
    return np.vstack(L)
def fade(x, a=0.0, b=0.0):
    n = x.shape[-1]; e = np.ones(n)
    if a: k=int(a*SR); e[:k]=np.linspace(0,1,k)**1.5
    if b: k=int(b*SR); e[-k:]=np.linspace(1,0,k)**1.5
    return x*e

def clink(f0, gain=1.0, d=2.0):
    n = t(d); x = np.zeros(len(n))
    for r,a,dec in [(1,1,4.5),(2.32,.7,6.5),(3.9,.45,8.5),(5.6,.22,12),(0.62,.5,3.6),(1.5,.3,5.5)]:
        x += a*np.sin(2*np.pi*f0*r*n+rng.uniform(0,6.28))*np.exp(-n*dec)
    x += lp(rng.standard_normal(len(n)),3)*np.exp(-n*150)*0.5
    x = fade(x, 0.001, 0.4)
    return reverb(x, 0.3, 1.4, 3.5)*gain
save("glass-clink-v3.wav", clink(2650), 0.8)
save("glass-clink-shadow-v3.wav", clink(2330, 0.9), 0.7)

# shadow swish: airy sweep as the shadow's glass leaves the body (0.7 s)
n = t(0.7); noise = rng.standard_normal(len(n))
sweep = lp(noise, 24)*np.sin(np.pi*n/0.7)**2
sweep += lp(noise, 6)*np.sin(np.pi*n/0.7)**3*0.4
save("shadow-swish.wav", reverb(sweep, 0.2, 0.8, 5), 0.5)

# shadow wobble: lazy woozy slide with muffled glass
n = t(1.4); f = 400-120*n/1.4+16*np.sin(2*np.pi*4.5*n)
wob = np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*n/1.4)**2*0.5
save("shadow-wobble-v3.wav", reverb(wob+0.1*clink(1900,1,1.4)[0][:len(n)], 0.2, 0.9, 4), 0.5)

# BGM: slow Dm9 pad with swell, sub pulse, late shimmer (10 s)
d = 10; n = t(d); pad = np.zeros(len(n))
for fr,a in [(73.4,1),(110,.8),(146.8,.6),(174.6,.35),(220,.35),(261.6,.25),(329.6,.2)]:
    for det in (-0.5,0,0.45):
        pad += a*np.sin(2*np.pi*(fr+det)*n+rng.uniform(0,6.28))
pad *= (0.65+0.35*np.sin(2*np.pi*0.08*n-1.2))
pulse = np.sin(2*np.pi*36.7*n)*(np.exp(-((n%2.0)*9)))*0.9
shim = (np.sin(2*np.pi*880*n)+0.7*np.sin(2*np.pi*1318.5*n))*np.clip((n-6.4)/1.2,0,1)*np.clip((9.8-n)/0.8,0,1)*0.05
bgm = pad/np.abs(pad).max()*0.8+pulse*0.18+shim
save("bgm-v3.wav", reverb(fade(bgm,1.2,0.8), 0.25, 2.2, 1.8), 0.7)

# outro: low boom with sub drop and a brief airy tail
n = t(3.0)
boom = np.sin(2*np.pi*(52-18*np.minimum(n,1.2)/1.2)*n)*np.exp(-n*1.7)
sub = np.sin(2*np.pi*27*n)*np.exp(-n*1.2)*0.6
air = lp(rng.standard_normal(len(n)),30)*np.exp(-n*2.2)*0.25
hit = (boom+sub)*(1-np.exp(-n*80))+air
save("outro-hit-v3.wav", reverb(hit, 0.25, 2.0, 2.2), 0.8)
print("ok")
