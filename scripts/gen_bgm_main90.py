"""Main90 BGM: one continuous 90 s original soundtrack @120 BPM, arranged per section (no samples, no external audio).
Sections: 01 curtain-up fanfare / 02 gentle / 03 swing party (stop-time at 24s) / 04 key lift / 05 celebration /
06 anticipation (cut at 66.6, breath) / 07 trailer (D major, ostinato + builds + stingers) / 08 big title chord / 09 rise + clean stop at 89.7.
Peak-normalised, no sub-bass (nothing below ~80 Hz)."""
import numpy as np, wave, os
SR = 48000; BEAT = 0.5; BAR = 2.0
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
rng = np.random.default_rng(11)
def t(d): return np.arange(int(SR*d))/SR
def mtof(m): return 440.0*2**((m-69)/12)
def lp(x, k): return np.convolve(x, np.ones(k)/k, mode="same")
def hp(x, k): return x-lp(x, k)
def place(buf, snd, at, gain=1.0):
    i = int(at*SR)
    if i >= len(buf) or i < 0: return
    j = min(len(buf), i+len(snd)); buf[i:j] += snd[:j-i]*gain
def ks(freq, dur, amp=1.0, damp=0.9965):
    N = int(SR/freq); buf = rng.uniform(-1, 1, N); buf -= buf.mean(); out = np.empty(int(SR*dur))
    for i in range(len(out)):
        out[i] = buf[i % N]; buf[i % N] = damp*0.5*(buf[i % N]+buf[(i+1) % N])
    return lp(out, 2)*amp
_ks = {}
def bass(m, dur=0.42, g=1.0):
    k = (m, dur)
    if k not in _ks: _ks[k] = ks(mtof(m), dur, 0.9)
    return _ks[k]*g
def pluck(freq, dur, amp=1.0, dec=9.0, bright=0.5):
    n = t(dur); x = np.zeros(len(n))
    for k, a in enumerate([1, .55*bright*2, .3*bright*2, .15*bright*2, .08], start=1):
        x += a*np.sin(2*np.pi*freq*k*n)*np.exp(-n*dec*(0.7+0.3*k))
    return x*amp*(1-np.exp(-n*600))
def pad(freq, dur, amp=0.1, att=0.6, rel=0.8):
    n = t(dur); x = np.zeros(len(n))
    for d in (-0.004, 0.0, 0.004):
        for h, a in ((1, 1), (2, .5), (3, .25), (4, .12)):
            x += a*np.sin(2*np.pi*freq*(1+d)*h*n)
    e = np.minimum(1, n/att)*np.minimum(1, np.maximum(0, (dur-n)/rel))
    return x*e*amp
def stab(freq, dur=0.32, amp=0.16):
    n = t(dur); x = np.zeros(len(n))
    for h in range(1, 9): x += np.sin(2*np.pi*freq*h*n)/h
    return lp(x, 3)*amp*np.exp(-n*9)*(1-np.exp(-n*300))
def glock(freq, dur=1.4, amp=0.16):
    n = t(dur); x = np.zeros(len(n))
    for r, a, d in ((1, 1, 3.5), (2.76, .5, 5), (5.4, .3, 8)): x += a*np.sin(2*np.pi*freq*r*n)*np.exp(-n*d)
    return x*amp*(1-np.exp(-n*800))
def tom(f0=170, dur=0.3, amp=0.5):
    n = t(dur); return np.sin(2*np.pi*np.cumsum(f0*(1-0.35*n/dur))/SR)*np.exp(-n*12)*amp
def cymbal(dur=1.6, amp=0.2):
    n = t(dur); return hp(rng.standard_normal(len(n)), 4)*np.exp(-n*3.2)*amp
def clap(amp=0.16):
    n = t(0.1); return hp(rng.standard_normal(len(n)), 6)*(np.exp(-n*70)+0.6*np.exp(-np.maximum(0, n-0.02)*90)*(n > 0.02))*amp
def brush(amp=0.1):
    n = t(0.22); return hp(lp(rng.standard_normal(len(n)), 3)*np.sin(np.pi*np.minimum(1, n/0.22))**1.5, 8)*amp
def ride(amp=0.16):
    n = t(0.18); return hp(rng.standard_normal(len(n)), 6)*np.exp(-n*28)*amp
def roll(buf, a, b, amp0, amp1):
    s = a; step = 0.2
    while s < b:
        step = max(0.04, step*0.9); k = (s-a)/(b-a)
        place(buf, hp(lp(rng.standard_normal(int(SR*0.06)), 3), 6)*np.exp(-t(0.06)*40)*(amp0+(amp1-amp0)*k), s); s += step

IV = {"6": [4, 7, 9, 12], "m7": [3, 7, 10, 14], "7": [4, 7, 10, 12], "maj7": [4, 7, 11, 14], "sus": [5, 7, 10, 14], "maj": [4, 7, 12, 16], "m": [3, 7, 12, 15], "m9": [3, 7, 10, 14]}
def voice(r, q): return [r+12+i for i in IV[q]]
# swing cycle (F): F6 | D7 | Gm7 | C7   (bass root midi, quality)
CYC = [(41, "6"), (38, "7"), (43, "m7"), (36, "7")]
MEL = [(0, 72), (0.667, 74), (1, 77), (2, 74), (2.667, 72), (3, 69), (4, 69), (4.667, 72), (5, 74), (5.667, 72), (6, 69), (7, 66),
       (8, 70), (8.667, 74), (9, 77), (10, 74), (10.667, 70), (11, 67), (12, 72), (12.667, 76), (13, 79), (14, 76), (14.667, 72), (15, 70)]

def swing(buf, a, b, shift=0, bass_g=1.0, comp=1.0, mel=1.0, perc=1.0, stabs=0.0, claps=0.0, vibes=0.0, octave=False, stop=None):
    """a,b seconds (beat-aligned). stop=(s0,s1): only bass plays (stop-time)."""
    nb = int(round((b-a)/BAR)) if (b-a) > 0 else 0
    for bar in range(int(np.ceil((b-a)/BAR))):
        r, q = CYC[bar % 4]; r2, _ = CYC[(bar+1) % 4]
        tb = a+bar*BAR
        if tb >= b: break
        third = 3 if q == "m7" else 4
        walk = [r, r+third, r+7, r2+(1 if r2 < r else -1)]
        for k, m in enumerate(walk):
            tt = tb+k*BEAT
            if tt < b: place(buf, bass(m+shift), tt, bass_g)
        halt = stop is not None and stop[0] <= tb < stop[1]
        if halt: continue
        for beat in range(4):
            tt = tb+beat*BEAT
            if tt >= b: break
            place(buf, ride(0.16*perc), tt)
            if beat % 2 == 1:
                place(buf, ride(0.11*perc), tt+BEAT*2/3)
                place(buf, brush(0.1*perc), tt)
                if claps: place(buf, clap(claps), tt)
            else:
                place(buf, np.sin(2*np.pi*72*t(0.18))*np.exp(-t(0.18)*30)*0.2*perc, tt)
            if beat in (1, 3) and comp:
                for m in voice(r, q)[:4]: place(buf, pluck(mtof(m+shift-12+12), 0.25, 0.09*comp, 18), tt)
            if stabs and beat in (0, 2) and bar % 2 == 1:
                for m in voice(r, q)[:3]: place(buf, stab(mtof(m+shift), 0.3, stabs), tt+BEAT*2/3)
    if mel:
        pos0 = a
        c = 0
        while pos0 < b-0.5:
            for p, m in MEL:
                tt = pos0+p*BEAT
                if tt >= b-0.2 or tt < a: continue
                if stop is not None and stop[0] <= tt < stop[1]: continue
                place(buf, pluck(mtof(m+shift+(12 if octave else 0)), 0.45, 0.19*mel, 7, 0.8), tt)
                place(buf, pluck(mtof(m+12+shift+(12 if octave else 0)), 0.3, 0.05*mel, 14, 0.6), tt)
                if vibes: place(buf, glock(mtof(m+12+shift), 0.9, 0.07*vibes), tt)
            pos0 += 16*BEAT

D = 90.0; buf = np.zeros(int(SR*D))
# ---- 01 (0-8): curtain up. Warm pad swell, harp arpeggios, tom roll, fanfare + cymbal at 6.0, rest to 8
for i, (rt, q) in enumerate([(41, "maj7"), (38, "m9"), (43, "m7"), (36, "7")]):
    tb = i*BAR
    for m in voice(rt, q): place(buf, pad(mtof(m), BAR+0.4, 0.07, 0.5, 0.5), tb)
    for k, m in enumerate(voice(rt, q)+[v+12 for v in voice(rt, q)][:2]):
        place(buf, pluck(mtof(m), 0.9, 0.12, 4.5, 0.8), tb+k*BEAT/2+ (0.5 if i == 3 else 0), 1.0)
roll(buf, 4.0, 6.0, 0.06, 0.32)
for m in (65, 69, 72, 77, 81): place(buf, stab(mtof(m), 0.9, 0.18), 6.0)
place(buf, cymbal(2.0, 0.22), 6.0)
for k, m in enumerate((77, 81, 84, 89)): place(buf, glock(mtof(m), 1.6, 0.14), 6.0+k*0.08)
# ---- 02 (8-15): gentle announcement bed, then fill into party
swing(buf, 8.0, 14.0, bass_g=0.55, comp=0.5, mel=0.0, perc=0.35)
for k, m in enumerate((72, 76, 79, 84)): place(buf, glock(mtof(m), 1.6, 0.1), 9.0+k*0.5)
for m in voice(41, "maj7")[:3]: place(buf, pad(mtof(m), 6.0, 0.045, 1.0, 1.0), 8.0)
roll(buf, 14.0, 15.0, 0.1, 0.4); place(buf, cymbal(1.6, 0.26), 15.0)
# ---- 03 (15-38): swing party; stop-time 24-25; band returns at 25 with octave melody + vibes
swing(buf, 15.0, 24.0, bass_g=1.0, comp=1.0, mel=1.0, perc=1.0)
swing(buf, 24.0, 25.0, bass_g=1.0, comp=0, mel=0.0, perc=0, stop=(24.0, 25.0))
place(buf, cymbal(1.2, 0.25), 25.0); roll(buf, 24.4, 25.0, 0.1, 0.35)
swing(buf, 25.0, 38.0, bass_g=1.0, comp=1.1, mel=1.15, perc=1.1, claps=0.0, vibes=0.6, octave=True)
# ---- 04 (38-50): key lift +2, brass stabs
place(buf, cymbal(1.4, 0.22), 38.0)
swing(buf, 38.0, 50.0, shift=2, bass_g=1.0, comp=1.1, mel=1.1, perc=1.15, stabs=0.12, claps=0.0, vibes=0.5, octave=True)
# ---- 05 (50-61): celebration +4, claps, big stabs
place(buf, cymbal(1.8, 0.28), 50.0)
for m in voice(41, "maj")[:4]: place(buf, stab(mtof(m+4), 0.7, 0.18), 50.0)
swing(buf, 50.0, 61.0, shift=4, bass_g=1.05, comp=1.2, mel=1.2, perc=1.25, stabs=0.16, claps=0.2, vibes=0.7, octave=True)
# ---- 06 (61-68): anticipation. pulse of woodblock ticks that gets denser, rising pad; cut at 66.6; breath
for k, m in enumerate((60, 64, 67, 72)): place(buf, pad(mtof(m), 5.6, 0.07, 1.8, 0.5), 61.0)
for k, m in enumerate((67, 71, 74, 79)): place(buf, pad(mtof(m), 3.6, 0.06, 1.5, 0.3), 63.0)
tt = 61.0; step = 0.5
while tt < 66.0:
    place(buf, np.sin(2*np.pi*1650*t(0.04))*np.exp(-t(0.04)*90)*0.14+hp(rng.standard_normal(int(SR*0.04)), 4)*np.exp(-t(0.04)*80)*0.06, tt)
    tt += step; step = max(0.125, step*0.93)
for i, m in enumerate((72, 76, 79, 84, 88)): place(buf, glock(mtof(m), 1.8, 0.1), 66.6+i*0.07)
place(buf, cymbal(1.2, 0.18), 66.6)
for m in voice(38, "maj")[:3]: place(buf, pad(mtof(m), 1.4, 0.03, 0.5, 0.8), 66.8)
# ---- 07 (68-82): trailer in D. plucked 8th ostinato, strings swell, toms, stingers on chapters (68, 72, 76, 80)
PROG = [(38, "maj"), (35, "m"), (43, "maj"), (33, "7")]
for bar in range(7):
    tb = 68.0+bar*BAR; r, q = PROG[bar % 4]; lvl = [0.5, 0.5, 0.75, 0.75, 1.0, 1.0, 1.3][bar]
    for m in voice(r, q)[:4]: place(buf, pad(mtof(m), BAR+0.6, 0.05*lvl, 0.7, 0.8), tb)
    arp = voice(r, q)
    for k in range(8):
        m = arp[[0, 1, 2, 1, 0, 1, 2, 3][k]]+12
        place(buf, pluck(mtof(m), 0.28, 0.14*lvl, 12, 0.7), tb+k*BEAT/2)
    place(buf, ks(mtof(r), 0.9, 0.85)*(lvl*0.8), tb); place(buf, ks(mtof(r), 0.9, 0.85)*(lvl*0.6), tb+BEAT*2)
    for k in (0, 2): place(buf, tom(150, 0.3, 0.3*lvl), tb+k*BEAT)
    if bar >= 2: place(buf, clap(0.1*lvl), tb+BEAT); place(buf, clap(0.1*lvl), tb+BEAT*3)
    if bar >= 4: place(buf, ride(0.12), tb)
for st, big in ((68.0, 0.8), (72.0, 0.7), (76.0, 0.8), (80.0, 1.0)):
    for m in voice(38 if st != 76 else 43, "maj")[:4]: place(buf, stab(mtof(m), 0.8, 0.14*big), st)
    place(buf, cymbal(1.4, 0.18*big), st)
roll(buf, 78.6, 80.0, 0.05, 0.3); roll(buf, 74.8, 76.0, 0.04, 0.22)
for k, m in enumerate((74, 78, 81, 86)): place(buf, glock(mtof(m), 1.4, 0.1), 80.0+k*0.06)
# ---- 08 (82-87): big title chord, shimmer, resolved
for m in voice(38, "maj")+[38+12+7, 38+24]: place(buf, pad(mtof(m), 5.2, 0.06, 0.15, 2.0), 82.0)
for m in (62, 66, 69, 74, 78): place(buf, stab(mtof(m), 1.2, 0.16), 82.0)
place(buf, cymbal(3.0, 0.3), 82.0); place(buf, tom(110, 0.5, 0.5), 82.0)
for k, m in enumerate((86, 90, 93, 98, 93, 90, 86, 81)): place(buf, glock(mtof(m), 1.6, 0.1), 83.0+k*0.45)
# ---- 09 (87-90): rising arpeggio to bright chord at 89.0, clean stop by 89.7
for k, m in enumerate((62, 66, 69, 74, 78, 81, 86, 90)): place(buf, pluck(mtof(m), 0.7, 0.14, 6, 0.8), 87.0+k*0.22)
for m in (62, 66, 69, 74, 78, 81): place(buf, stab(mtof(m), 0.7, 0.16), 89.0)
place(buf, cymbal(0.9, 0.2), 89.0)
for k, m in enumerate((86, 90, 93, 98)): place(buf, glock(mtof(m), 0.7, 0.1), 89.0+k*0.05)

# ---- master: gentle reverb, section-aware loudness, hard clean tail
def reverb(x, wet=0.17, d=0.9, decay=5.0):
    n = t(d); out = []
    for s in (1, 2):
        h = lp(np.random.default_rng(s).standard_normal(len(n)), 5)*np.exp(-n*decay); N = len(x)+len(h)
        y = np.fft.irfft(np.fft.rfft(x, N)*np.fft.rfft(h, N), N)[:len(x)]
        out.append(x*(1-wet)+y/(np.abs(y).max()+1e-9)*np.abs(x).max()*wet*1.4)
    return np.vstack(out)
st = reverb(buf)
env = np.ones(st.shape[1]); k = int(0.4*SR); env[:k] = np.linspace(0, 1, k)
e0 = int(89.45*SR); env[e0:int(89.75*SR)] = np.linspace(1, 0, int(89.75*SR)-e0); env[int(89.75*SR):] = 0
st = st*env
st = np.tanh(st*1.15)/np.tanh(1.15)
st = st/np.abs(st).max()*0.8
with wave.open(os.path.join(OUT, "bgm-main90.wav"), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st.T*32767).astype("<i2").tobytes())
print("ok", st.shape[1]/SR)
