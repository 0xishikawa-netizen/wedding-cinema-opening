"""V4 audio (all original, synthesised, rights-free): light swing-jazz BGM @120 BPM, bright SFX."""
import numpy as np, wave, os
SR = 48000
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
rng = np.random.default_rng(5)
BEAT = 0.5  # 120 BPM
def t(d): return np.arange(int(SR*d))/SR
def mtof(m): return 440.0*2**((m-69)/12)
def lp(x, k): return np.convolve(x, np.ones(k)/k, mode="same")
def hp(x, k): return x-lp(x, k)
def save(name, x, peak=0.85):
    x = np.atleast_2d(x)
    if x.shape[0] == 1: x = np.vstack([x, x])
    m = np.abs(x).max(); x = x/m*peak if m > 0 else x
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x.T*32767).astype("<i2").tobytes())
def ir(d, decay, seed):
    r = np.random.default_rng(seed); n = t(d); return lp(r.standard_normal(len(n)), 5)*np.exp(-n*decay)
def reverb(x, wet=0.25, d=1.0, decay=5.0):
    L = []
    for s in (1, 2):
        h = ir(d, decay, s); N = len(x)+len(h)
        y = np.fft.irfft(np.fft.rfft(x, N)*np.fft.rfft(h, N), N)[:len(x)]
        L.append(x*(1-wet)+y/(np.abs(y).max()+1e-9)*np.abs(x).max()*wet*1.5)
    return np.vstack(L)

def ks(freq, dur, amp=1.0, damp=0.9965):
    """Karplus-Strong plucked string (pizzicato bass)."""
    N = int(SR/freq); buf = rng.uniform(-1, 1, N); buf -= buf.mean(); out = np.empty(int(SR*dur))
    for i in range(len(out)):
        out[i] = buf[i % N]
        buf[i % N] = damp*0.5*(buf[i % N]+buf[(i+1) % N])
    return lp(out, 2)*amp
def pluck(freq, dur, amp=1.0, dec=9.0, bright=0.5):
    n = t(dur); x = np.zeros(len(n))
    for k, a in enumerate([1, .55*bright*2, .3*bright*2, .15*bright*2, .08], start=1):
        x += a*np.sin(2*np.pi*freq*k*n)*np.exp(-n*dec*(0.7+0.3*k))
    return x*amp*(1-np.exp(-n*600))
def place(buf, snd, at, gain=1.0):
    i = int(at*SR); j = min(len(buf), i+len(snd))
    if i < len(buf): buf[i:j] += snd[:j-i]*gain

D = 10.0; buf = np.zeros(int(SR*D))
chords = [(41,[65,69,72,74]), (38,[66,69,72,74]), (43,[67,70,74,77]), (36,[64,67,70,72]), (41,[65,69,72,74])]
bass = [[41,45,48,50],[38,42,45,44],[43,46,50,49],[48,52,55,54],[53,57,60,57]]
# walking pizzicato bass (quarters)
for bar, notes in enumerate(bass):
    for k, m in enumerate(notes):
        place(buf, ks(mtof(m), 0.42, 0.9), (bar*4+k)*BEAT, 1.0)
# swung ride + feathered kick + brush snare + hi-hat chick
for beat in range(20):
    tm = beat*BEAT
    ride = hp(rng.standard_normal(int(SR*0.18)), 6)*np.exp(-t(0.18)*28)*0.18
    place(buf, ride, tm)
    if beat % 2 == 1:
        place(buf, ride*0.7, tm+BEAT*2/3)  # swung skip note
        sn = lp(rng.standard_normal(int(SR*0.22)), 3)*np.sin(np.pi*np.minimum(1, t(0.22)/0.22))**1.5*0.12
        place(buf, hp(sn, 8), tm)
        place(buf, hp(rng.standard_normal(int(SR*0.05)), 4)*np.exp(-t(0.05)*70)*0.2, tm)
    if beat % 2 == 0:
        place(buf, np.sin(2*np.pi*58*t(0.2))*np.exp(-t(0.2)*30)*0.28, tm)
# pizzicato string comping on 2 and 4 (swung "and" as well on bar ends)
for bar, (_, voic) in enumerate(chords):
    for beat in (1, 3):
        for m in voic:
            place(buf, pluck(mtof(m-12), 0.25, 0.1, 18), (bar*4+beat)*BEAT+0.0)
    if bar % 2 == 1:
        for m in voic: place(buf, pluck(mtof(m-12), 0.2, 0.08, 20), (bar*4+2)*BEAT+BEAT*2/3)
# playful pizzicato melody (swung eighths)
mel = [(0,72),(0.667,74),(1,77),(2,74),(2.667,72),(3,69),
       (4,69),(4.667,72),(5,74),(5.667,72),(6,69),(7,66),
       (8,70),(8.667,74),(9,77),(10,74),(10.667,70),(11,67),
       (12,72),(12.667,76),(13,79),(14,76),(14.667,72),(15,70),
       (16,77),(16.667,74),(17,72)]
for pos, m in mel:
    place(buf, pluck(mtof(m), 0.45, 0.2, 7, 0.8), pos*BEAT)
    place(buf, pluck(mtof(m+12), 0.3, 0.05, 14, 0.6), pos*BEAT)  # sparkle octave
# final "ta-da" stab on beat 18.5 (F6) — bright chord
for m in [65,69,72,74,77,81]:
    place(buf, pluck(mtof(m), 0.7, 0.16, 6, 0.9), 18.5*BEAT)
place(buf, ks(mtof(41), 0.8, 0.9), 18.5*BEAT)
env = np.ones(len(buf)); k = int(0.9*SR); env[:k] = np.linspace(0, 1, k)**1.4; k2 = int(0.6*SR); env[-k2:] = np.linspace(1, 0, k2)
save("bgm-v4.wav", reverb(buf*env, 0.18, 0.7, 6.0), 0.8)

# ---- SFX
def clink(f0, dur=1.3, gain=1.0):
    n = t(dur); x = np.zeros(len(n))
    for r, a, dec in [(1, 1, 6), (2.32, .7, 8), (3.9, .5, 10), (5.6, .28, 14), (1.5, .3, 7)]:
        x += a*np.sin(2*np.pi*f0*r*n+rng.uniform(0, 6.28))*np.exp(-n*dec)
    x += lp(rng.standard_normal(len(n)), 2)*np.exp(-n*200)*0.5
    return reverb(x*(1-np.exp(-n*3000)), 0.25, 0.9, 5)*gain
save("glass-clink-v4.wav", clink(3300), 0.8)
save("glass-clink-shadow-v4.wav", clink(3000, 1.3, 0.95), 0.75)
# spotlight on: warm harp-like glissando + soft air
n = t(1.2); sp = np.zeros(len(n))
for i, m in enumerate([72, 76, 79, 84, 88]):
    sp += pluck(mtof(m), 1.2, 0.3, 4.5, 0.7)*np.roll(np.ones(len(n)), 0)*(np.arange(len(n)) > int(i*0.07*SR))
sp += lp(rng.standard_normal(len(n)), 40)*np.sin(np.pi*n/1.2)**2*0.12
save("spotlight-v4.wav", reverb(sp, 0.25, 1.0, 4), 0.7)
# slide whistle: playful wobble (up, then woozy down)
n = t(0.95); f = np.where(n < 0.4, 520+1000*(n/0.4)**1.2, 1520-1050*((n-0.4)/0.55)**0.9)+25*np.sin(2*np.pi*7*n)
sw = np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*np.minimum(1, n/0.95))**0.6*(1-np.exp(-n*80))
save("slide-whistle.wav", reverb(sw*0.8+0.2*np.sin(4*np.pi*np.cumsum(f)/SR)*0.3, 0.12, 0.6, 6), 0.55)
# "pon" pop when the shadow snaps upright
n = t(0.25); pop = np.sin(2*np.pi*np.cumsum(900-2200*n)/SR)*np.exp(-n*24)+lp(rng.standard_normal(len(n)), 3)*np.exp(-n*140)*0.4
save("pop.wav", pop, 0.7)
# airy swish (glass leaves the body)
n = t(0.5); sw2 = lp(rng.standard_normal(len(n)), 18)*np.sin(np.pi*n/0.5)**2
save("swish-v4.wav", reverb(sw2, 0.15, 0.6, 7), 0.45)
# outro: bright chime sparkle + soft low thump (no horror boom)
n = t(1.5); ch = np.zeros(len(n))
for i, m in enumerate([84, 88, 91, 96]):
    ch += pluck(mtof(m), 1.5, 0.2, 3.5, 1.0)*(np.arange(len(n)) > int(i*0.06*SR))
th = np.sin(2*np.pi*70*n)*np.exp(-n*9)*0.8
save("outro-v4.wav", reverb(ch+th, 0.2, 1.0, 4), 0.7)
print("ok")
