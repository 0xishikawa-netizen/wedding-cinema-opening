"""Brighter placeholder narration for the character edition (macOS `say`, Kyoko). Replace with a real voice later."""
import subprocess, os
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio"); TMP = os.path.join(os.path.dirname(__file__), "..", "tmp")
os.makedirs(TMP, exist_ok=True)
LINES = [("narration-c1", "お飲み物は、ご自身のペースで。"), ("narration-c2", "飲み過ぎ注意！　お帰りも、二足歩行でお願いします。")]
for name, text in LINES:
    aiff = os.path.join(TMP, name + ".aiff")
    subprocess.run(["say", "-v", "Kyoko", "-r", "215", "-o", aiff, f"[[pbas +6]]{text}"], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", aiff, "-ar", "48000", "-ac", "2",
                    "-af", "silenceremove=start_periods=1:start_threshold=-50dB,highpass=f=120,equalizer=f=3500:t=q:w=1:g=2.5,aecho=0.8:0.5:45:0.12",
                    os.path.join(OUT, name + ".wav")], check=True)
print("ok")
