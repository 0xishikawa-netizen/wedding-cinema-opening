"""Original, rights-free placeholder audio. Synthesised with numpy; narration via macOS `say` (placeholder)."""
import numpy as np, wave, subprocess, os
SR = 48000
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
rng = np.random.default_rng(7)

def save(name, x, peak=0.9):
    x = np.atleast_2d(x)
    if x.shape[0] == 1: x = np.vstack([x, x])
    m = np.abs(x).max()
    x = x / m * peak if m > 0 else x
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x.T * 32767).astype("<i2").tobytes())

def t(d): return np.arange(int(SR * d)) / SR
def lp(x, k):  # simple moving-average lowpass
    return np.convolve(x, np.ones(k) / k, mode="same")

# --- theatre ambience (10s): low room tone + faint air movement
d = 10; n = t(d)
room = lp(rng.standard_normal(len(n)), 60) * 1.0
air = lp(rng.standard_normal(len(n)), 300) * 3.0
hum = 0.15 * np.sin(2*np.pi*50*n) + 0.07 * np.sin(2*np.pi*100*n)
amb = room * 0.5 + air + hum
save("ambience.wav", amb, 0.6)

# --- spotlight switch: soft thunk + warm rising hum
d = 1.4; n = t(d)
thunk = np.sin(2*np.pi*90*n) * np.exp(-n*18) + lp(rng.standard_normal(len(n)), 8) * np.exp(-n*40) * 0.6
hum = np.sin(2*np.pi*(110 + 40*(1-np.exp(-n*3)))*n) * (1-np.exp(-n*6)) * np.exp(-n*1.2) * 0.35
save("spotlight.wav", thunk + hum, 0.7)

# --- glass clink: inharmonic partials, fast decay
def clink(d=1.6, f0=2650, gain=1.0):
    n = t(d); x = np.zeros(len(n))
    for r, a, dec in [(1,1,5),(2.32,.7,7),(3.9,.45,9),(5.6,.25,12),(0.62,.5,4)]:
        x += a * np.sin(2*np.pi*f0*r*n + rng.uniform(0, 6.28)) * np.exp(-n*dec)
    x += lp(rng.standard_normal(len(n)), 3) * np.exp(-n*120) * 0.6
    return x * gain
save("glass-clink.wav", clink(), 0.8)
save("glass-clink-shadow.wav", clink(f0=2380, gain=1.0), 0.7)

# --- shadow wobble: small woozy descending slide + muffled glass
d = 1.2; n = t(d)
f = 420 - 140*n/d + 18*np.sin(2*np.pi*5*n)
ph = 2*np.pi*np.cumsum(f)/SR
wob = np.sin(ph) * np.sin(np.pi*n/d)**2 * 0.5
save("shadow-wobble.wav", wob + clink(d, 1900, 0.15)[:len(n)] * 0.4, 0.5)

# --- closing cinematic hit: low boom + shimmer swell
d = 3.0; n = t(d)
boom = np.sin(2*np.pi*(55 - 15*np.minimum(n, 1))*n) * np.exp(-n*2.2)
sh = sum(np.sin(2*np.pi*f*n) for f in (440, 659.3, 880)) * np.exp(-n*1.6) * (1-np.exp(-n*10)) * 0.12
save("outro-hit.wav", boom + sh, 0.8)

# --- BGM: slow original pad (Dm9-ish drone), 10s
d = 10; n = t(d)
pad = np.zeros(len(n))
for f, a in [(73.4,1),(110,.8),(146.8,.6),(220,.35),(261.6,.3),(329.6,.2)]:
    for det in (-0.4, 0, 0.5):
        pad += a * np.sin(2*np.pi*(f+det)*n + rng.uniform(0, 6.28))
pad *= (0.7 + 0.3*np.sin(2*np.pi*0.1*n))
save("bgm.wav", pad, 0.7)

# --- narration placeholders via macOS say (male Japanese voice)
for name, text in [("narration-1", "お飲み物は、ご自身のペースで。"), ("narration-2", "どうぞ、最後までお楽しみください。")]:
    aiff = os.path.join(OUT, "..", "..", "tmp", name + ".aiff")
    subprocess.run(["say", "-v", "Reed (日本語（日本）)", "-r", "190", "-o", aiff, text], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", aiff, "-ar", str(SR), "-ac", "2",
                    "-af", "silenceremove=start_periods=1:start_threshold=-50dB,lowpass=f=6500,aecho=0.8:0.6:60:0.18",
                    os.path.join(OUT, name + ".wav")], check=True)
print("ok")
