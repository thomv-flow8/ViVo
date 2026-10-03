// ViVo — echte 3D-vormen met three.js (zelf gehost). Elk <div class="vorm-3d" data-vorm="..."> krijgt een eigen
// canvas met een object dat langzaam om zijn as draait. Rendert alleen als het in beeld is; bij
// prefers-reduced-motion één stilstaand beeld.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const rustig = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Licht materiaal in Clay-stijl: mat wit; de pastelzweem komt uit het grondlicht (per vorm een eigen tint)
const wit = () => new THREE.MeshPhysicalMaterial({ color: '#eef0f5', roughness: 0.55, metalness: 0, clearcoat: 0.25, clearcoatRoughness: 0.6, sheen: 0.4, sheenColor: '#ffffff' });

// Schijf met afgeronde rand (draaiprofiel)
function schijf(r = 1, h = 0.34, ronding = 0.14) {
  const p = [new THREE.Vector2(0, -h / 2)];
  for (let i = 0; i <= 8; i++) { const a = -Math.PI / 2 + (i / 8) * Math.PI; p.push(new THREE.Vector2(r - ronding + Math.cos(a) * ronding, Math.sin(a) * (h / 2))); }
  p.push(new THREE.Vector2(0, h / 2));
  return new THREE.LatheGeometry(p, 96);
}
// Zeshoekige plaat met afgeschuinde randen
function zeshoek(r = 1.1, dikte = 0.34) {
  const vorm = new THREE.Shape();
  for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; vorm[i ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r); }
  vorm.closePath();
  const g = new THREE.ExtrudeGeometry(vorm, { depth: dikte, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 8, curveSegments: 6 });
  g.center(); return g;
}
// Gesloten lus (figuur-acht in 3D) als buis
function lus() {
  const punten = [];
  for (let i = 0; i < 200; i++) { const t = (i / 200) * Math.PI * 2; punten.push(new THREE.Vector3(Math.sin(t) * 2.2, Math.sin(t * 2) * 0.9, Math.cos(t) * 0.9)); }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(punten, true), 400, 0.42, 64, true);
}

const VORMEN = {
  kubussen: { tint: '#9fb8ff', maak: m => [[-0.55, 0.35, 0, [0.4, 0.5, 0.1]], [0.6, 0.1, 0.2, [0.2, -0.3, 0.4]], [-0.05, -0.65, -0.1, [-0.3, 0.8, 0.2]]].map(([x, y, z, r]) => { const k = new THREE.Mesh(new RoundedBoxGeometry(1, 1, 1, 6, 0.2), m); k.position.set(x, y, z); k.rotation.set(...r); return k; }) },
  schijven: { tint: '#c4acff', maak: m => [0, 1, 2, 3].map(i => { const s = new THREE.Mesh(schijf(1 - i * 0.04), m); s.position.set(i * 0.12, 0.6 - i * 0.42, i * 0.05); s.rotation.set(0.5, 0, 0.35); return s; }) },
  plaat: { tint: '#9edcc4', maak: m => [new THREE.Mesh(zeshoek(), m)] },
  kegel: { tint: '#ffbc98', maak: m => { const k = new THREE.Mesh(new THREE.ConeGeometry(0.85, 2, 96, 1), m); k.rotation.z = Math.PI / 2.6; return [k]; } },
  bollen: { tint: '#bdaaff', maak: m => [[-0.35, 0.15, 0, 0.85], [0.75, -0.35, 0.2, 0.55]].map(([x, y, z, r]) => { const b = new THREE.Mesh(new THREE.SphereGeometry(r, 96, 64), m); b.position.set(x, y, z); return b; }).concat([(() => { const k = new THREE.Mesh(new RoundedBoxGeometry(0.55, 0.55, 0.55, 5, 0.12), m); k.position.set(0.15, -0.75, 0.6); k.rotation.set(0.4, 0.6, 0); return k; })()]) },
  servers: { tint: '#a6c8f2', maak: m => [0, 1, 2].map(i => { const s = new THREE.Mesh(new RoundedBoxGeometry(1.8, 0.42, 1.2, 6, 0.14), m); s.position.y = 0.55 - i * 0.55; s.rotation.y = i * 0.12; return s; }) },
  lus: { donker: true, maak: () => [new THREE.Mesh(lus(), new THREE.MeshPhysicalMaterial({ color: '#1b1e27', roughness: 0.32, metalness: 0.25, clearcoat: 0.8, clearcoatRoughness: 0.25 }))] },
};

function start(el) {
  const def = VORMEN[el.dataset.vorm]; if (!def) return;
  const canvas = el.querySelector('canvas') || el.appendChild(document.createElement('canvas'));
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50); camera.position.set(0, 0, def.donker ? 9 : 6.4);
  const groep = new THREE.Group(); scene.add(groep);
  if (def.donker) {
    // donkere lus met randlicht in de tijdlijnkleuren
    scene.add(new THREE.AmbientLight('#2a3040', 0.6));
    [['#4f6ef5', [-4, 2, -3], 60], ['#8b5cf6', [4, 3, -2], 55], ['#ff7a45', [2, -3, -3], 45], ['#c7cff5', [0, 4, 6], 6]].forEach(([k, p, s]) => { const l = new THREE.PointLight(k, s, 20, 1.6); l.position.set(...p); scene.add(l); });
  } else {
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.35;
    scene.add(new THREE.HemisphereLight('#ffffff', def.tint, 2.3)); // pastelzweem van onderen (Clay)
    const zon = new THREE.DirectionalLight('#ffffff', 1.1); zon.position.set(-3, 4, 5); scene.add(zon);
  }
  const mat = def.donker ? null : wit();
  def.maak(mat).forEach(m => groep.add(m));
  const maat = () => { const { width: w, height: h } = el.getBoundingClientRect(); if (!w || !h) return; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  new ResizeObserver(() => { maat(); if (rustig) renderer.render(scene, camera); }).observe(el); maat();
  groep.rotation.set(0.3, Math.random() * Math.PI, 0);
  if (rustig) { renderer.render(scene, camera); return; }
  let aan = false, vorige = performance.now(), t = Math.random() * 10;
  const lusje = nu => {
    if (!aan) return;
    const dt = Math.min(0.05, (nu - vorige) / 1000); vorige = nu; t += dt;
    groep.rotation.y += dt * (def.donker ? 0.18 : 0.2);            // langzaam om de eigen as (±31 s per omwenteling)
    groep.rotation.x = 0.3 + Math.sin(t * (def.donker ? 0.4 : 0.25)) * (def.donker ? 0.25 : 0.18);
    groep.position.y = Math.sin(t * 0.8) * 0.08;
    renderer.render(scene, camera); requestAnimationFrame(lusje);
  };
  new IntersectionObserver(([e]) => { const was = aan; aan = e.isIntersecting; if (aan && !was) { vorige = performance.now(); requestAnimationFrame(lusje); } }, { rootMargin: '120px' }).observe(el);
}
document.querySelectorAll('.vorm-3d').forEach(start);
