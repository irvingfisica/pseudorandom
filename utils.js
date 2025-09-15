function num_pseudorandom(r,a,c,M) {
    return (a*r+c)%M
}

export function pseudo(r,a,c,M,limit=10000) {
    let i=-1;
    let salida = [];
    let seto = new Set();
    let fl = false;
    while (i<limit && !fl) {
        i++;
        r = num_pseudorandom(r,a,c,M);
        salida.push({i,r});
        fl = seto.has(r);
        seto.add(r);
    }
    return {periodo:i,data:salida}
}

export function random(n,limite) {
    let i = -1;
    let salida = [];
    while (i<n) {
        i++;
        let r = Math.floor(Math.random()*limite);
        salida.push({i,r});
    }

    return {periodo:i,data:salida}
}

export function walk(n) {
    let pasos = [{x:0,y:0}];
    let x = 0;
    let y = 0;
    for (let index = 0; index < n; index++) {
        let coord = step();
        x += coord.x;
        y += coord.y;
        pasos.push({x,y});
    };
    return pasos
}

export function walker(n) {
    let pasos = [{x:0,y:0}];
    let x = 0;
    let y = 0;
    for (let index = 0; index < n; index++) {
        let coord = step();
        x += coord.x;
        y += coord.y;
    };
    return {x,y}
}

function step() {
    let xp = (Math.random() - 0.5)*2;
    let yp = (Math.random() - 0.5)*2;
    let l = Math.sqrt(xp*xp + yp*yp);
    return {x:xp/l, y:yp/l}
}

export function rango(caminata) {
    const maxx = d3.max(caminata,d => Math.abs(d.x));
    const maxy = d3.max(caminata,d => Math.abs(d.y));
    return Math.max(maxx,maxy);
}

function rgbToHex(r, g, b) {
  let hexR = r.toString(16);
  let hexG = g.toString(16);
  let hexB = b.toString(16);

  if (hexR.length === 1) hexR = "0" + hexR;
  if (hexG.length === 1) hexG = "0" + hexG;
  if (hexB.length === 1) hexB = "0" + hexB;

  return "#" + hexR + hexG + hexB;
}

function hsvToRgb(h, s, v){
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch(i % 6){
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
}

export function colors(paseos,s=0.5,v=0.95) {
    let h = Math.random();
    let colores = paseos.map(ele => {
        h += 0.618033988749895;
        h %= 1;
        let hsv = hsvToRgb(h,s,v);
        return rgbToHex(...hsv)
    });
    return colores
}