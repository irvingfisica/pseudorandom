import * as snips from "https://cdn.jsdelivr.net/gh/irvingfisica/d3snips/d3snips.js";

function random(r,a,c,M) {
    return (a*r+c)%M
}

function serie(r,a,c,M,limit=10000) {
    let salida = [];
    let seto = new Set();
    let fl = false;
    while (i<limit && !fl) {
        i++;
        r = random(r,a,c,M);
        salida.push({i,r});
        fl = seto.has(r);
        seto.add(r);
    }

    return {periodo:i,data:salida}
}

let i=-1;
let a=57;
let c=1;
let M=2048;
let r=10;
let resultado = serie(r,a,c,M)

console.log("El periodo es: " + resultado.periodo);
console.log(resultado.data);

const maximoi = d3.max(resultado.data,d => d.i);
const maximor = d3.max(resultado.data,d => d.r);

const datos = d3.range(0,(resultado.data.length - 1)/2).map(i => {
    let xi = resultado.data[2*i].r;
    let yi = resultado.data[2*i + 1].r;
    return {x:xi,y:yi}
})

let border = 40;
let corrl = new snips.Lienzo("gcorr",1);
corrl.set_margin({left:border,bottom:border,top:border,right:border});

let serl = new snips.Lienzo("gseri",1);
serl.set_margin({left:border,bottom:border,top:border,right:border});

let scx = d3.scaleLinear([0,maximoi],[0,serl.effective_width]);
let scxr = d3.scaleLinear([0,maximor],[0,corrl.effective_height]);
let scy = d3.scaleLinear([maximor,0],[0,corrl.effective_height]);

corrl.gsvg.selectAll("circle")
    .data(datos)
    .join("circle")
    .attr("cx",d => scxr(d.x))
    .attr("cy",d => scy(d.y))
    .attr("r",3)

serl.gsvg.append("path")
    .datum(resultado.data)
    .attr("fill","none")
    .attr("stroke","black")
    .attr("stroke-width",0.5)
    .attr("d", d3.line().x(d => scx(d.i)).y(d => scy(d.r)));

serl.gsvg.selectAll("circle")
    .data(resultado.data)
    .join("circle")
    .attr("cx",d => scx(d.i))
    .attr("cy",d => scy(d.r))
    .attr("r",3)
    .attr("stroke","black")
    .attr("stroke-width",0.5)
    .attr("fill","white")

serl.gsvg.append("g")
      .call(d3.axisLeft(scy));

serl.gsvg.append("g")
    .attr("transform", "translate(0," + serl.effective_height + ")")
      .call(d3.axisBottom(scx));

corrl.gsvg.append("g")
      .call(d3.axisLeft(scy));

corrl.gsvg.append("g")
    .attr("transform", "translate(0," + corrl.effective_height + ")")
      .call(d3.axisBottom(scxr));