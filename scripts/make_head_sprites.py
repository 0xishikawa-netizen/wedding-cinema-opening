"""Turn a reference photo into an illustrated head sprite (transparent PNG): GrabCut cut-out + smoothing + colour posterising + soft ink lines.
Run with a Python that has opencv-python-headless:  python scripts/make_head_sprites.py <photo> <out.png> x0 y0 x1 y1 [hx0 hy0 hx1 hy1]
(x0..y1 = crop box around head+neck; hx0..hy1 = tight rectangle around the head used to seed GrabCut)."""
import sys, numpy as np, cv2
from PIL import Image

def make(src, out, crop, head_rect, k=9, line=0.42, soft=False):
    im = np.array(Image.open(src).convert("RGB"))
    x0, y0, x1, y1 = crop
    img = cv2.cvtColor(im[y0:y1, x0:x1], cv2.COLOR_RGB2BGR)
    S = 3
    img = cv2.resize(img, None, fx=S, fy=S, interpolation=cv2.INTER_CUBIC)
    h, w = img.shape[:2]
    hx0, hy0, hx1, hy1 = [(v - o) * S for v, o in zip(head_rect, (x0, y0, x0, y0))]
    # --- cut-out with GrabCut seeded by an ellipse around the head (+ neck column)
    mask = np.full((h, w), cv2.GC_BGD, np.uint8)
    cv2.ellipse(mask, ((hx0 + hx1) // 2, (hy0 + hy1) // 2), ((hx1 - hx0) // 2 + 14, (hy1 - hy0) // 2 + 14), 0, 0, 360, cv2.GC_PR_BGD, -1)
    cv2.ellipse(mask, ((hx0 + hx1) // 2, (hy0 + hy1) // 2), ((hx1 - hx0) // 2 - 6, (hy1 - hy0) // 2 - 6), 0, 0, 360, cv2.GC_PR_FGD, -1)
    cv2.ellipse(mask, ((hx0 + hx1) // 2, (hy0 + hy1) // 2 + 20), (int((hx1 - hx0) * 0.30), int((hy1 - hy0) * 0.30)), 0, 0, 360, cv2.GC_FGD, -1)
    bg, fg = np.zeros((1, 65)), np.zeros((1, 65))
    cv2.grabCut(img, mask, None, bg, fg, 6, cv2.GC_INIT_WITH_MASK)
    alpha = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
    alpha = cv2.morphologyEx(alpha, cv2.MORPH_OPEN, np.ones((9, 9), np.uint8))
    alpha = cv2.morphologyEx(alpha, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))
    n, lab, stats, _ = cv2.connectedComponentsWithStats(alpha)
    if n > 1:
        alpha = np.where(lab == 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA]), 255, 0).astype(np.uint8)
    alpha = cv2.GaussianBlur(alpha, (0, 0), 3)
    # --- illustration look
    if soft:
        # gentle "painted" look: strong edge-preserving smoothing, light ink on contours, warm grade (keeps the real face recognisable)
        sm = img.copy()
        for _ in range(4):
            sm = cv2.bilateralFilter(sm, 11, 38, 11)
        # soften fine skin texture (wrinkles) while keeping the shape of eyes, nose and mouth
        sm = cv2.addWeighted(sm, 0.62, cv2.GaussianBlur(sm, (0, 0), 5.0), 0.38, 0)
        gray = cv2.medianBlur(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), 9)
        edges = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 17, 9)
        edges = cv2.GaussianBlur(edges, (0, 0), 1.6)
        ink = (255 - edges).astype(np.float32) / 255.0
        out_img = sm.astype(np.float32) * (1 - 0.14 * ink[..., None])
        hsv = cv2.cvtColor(np.clip(out_img, 0, 255).astype(np.uint8), cv2.COLOR_BGR2HSV).astype(np.float32)
        hsv[..., 1] = np.clip(hsv[..., 1] * 1.10, 0, 255); hsv[..., 2] = np.clip(hsv[..., 2] * 1.08 + 6, 0, 255)
        out_img = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)
    else:
        sm = img.copy()
        for _ in range(3):
            sm = cv2.bilateralFilter(sm, 9, 40, 9)
        lab_img = cv2.cvtColor(sm, cv2.COLOR_BGR2LAB).reshape(-1, 3).astype(np.float32)
        crit = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 12, 1.0)
        _, labels, centers = cv2.kmeans(lab_img, k, None, crit, 2, cv2.KMEANS_PP_CENTERS)
        post = centers[labels.flatten()].reshape(h, w, 3).astype(np.uint8)
        post = cv2.cvtColor(post, cv2.COLOR_LAB2BGR)
        post = cv2.addWeighted(post, 0.78, sm, 0.22, 0)
        gray = cv2.medianBlur(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), 7)
        edges = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 13, 7)
        edges = cv2.GaussianBlur(edges, (0, 0), 1.2)
        ink = (255 - edges).astype(np.float32) / 255.0
        out_img = post.astype(np.float32) * (1 - line * ink[..., None] * 0.85)
        hsv = cv2.cvtColor(np.clip(out_img, 0, 255).astype(np.uint8), cv2.COLOR_BGR2HSV).astype(np.float32)
        hsv[..., 1] = np.clip(hsv[..., 1] * 1.12, 0, 255); hsv[..., 2] = np.clip(hsv[..., 2] * 1.06 + 4, 0, 255)
        out_img = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)
    # --- fade the neck bottom into the collar
    ys = np.where(alpha > 20)[0]; top, bot = ys.min(), ys.max()
    fade = np.clip((bot - np.arange(h)) / max(1, 0.09 * (bot - top)), 0, 1)[:, None]
    alpha = (alpha * fade).astype(np.uint8)
    rgba = np.dstack([cv2.cvtColor(out_img, cv2.COLOR_BGR2RGB), alpha])
    xs = np.where(alpha.max(0) > 20)[0]
    rgba = rgba[top:bot + 1, xs.min():xs.max() + 1]
    Image.fromarray(rgba).save(out)
    print(out, "size", rgba.shape[1], "x", rgba.shape[0])

if __name__ == "__main__":
    a = [x for x in sys.argv if x != "--soft"] + (["--soft"] if "--soft" in sys.argv else [])
    make(a[1], a[2], tuple(map(int, a[3:7])), tuple(map(int, a[7:11])) if len(a) >= 11 else None, soft=("--soft" in a))
