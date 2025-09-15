import * as snips from "https://cdn.jsdelivr.net/gh/irvingfisica/d3snips/d3snips.js";
import * as utils from "./utils.js";

const modInput = document.getElementById('modulus');
const mulInput = document.getElementById('multiplier');
const incInput = document.getElementById('increment');

modInput.value = 1024;

let modEtq = d3.select("#modval");
let mulEtq = d3.select("#mulval").html(mulInput.value);
let incEtq = d3.select("#incval").html(incInput.value);

d3.select("#modulus").on("change",modch);
d3.select("#multiplier").on("change",mulch);
d3.select("#increment").on("change",incch);

modch();

function modch() {
    let modval = modInput.value;
    modEtq.html(modval);

    d3.select("#multiplier").attr("max",modval);
    mulInput.value = Math.floor(Math.random()*modval);
    d3.select("#increment").attr("max",modval);
    incInput.value = Math.floor(Math.random()*modval);
    both();
}

function mulch() {
    let mulval = mulInput.value;
    mulEtq.html(mulval);
    calculadora();
}

function incch() {
    let incval = incInput.value;
    incEtq.html(incval);
    calculadora();
}

function both() {
    let mulval = mulInput.value;
    mulEtq.html(mulval);

    let incval = incInput.value;
    incEtq.html(incval);

    calculadora();
}

function calculadora() {

    let a=Math.floor(mulInput.value);
    let c=Math.floor(incInput.value);
    let M=Math.floor(modInput.value);
    let r=Math.floor(Math.random()*M);
    let resultado = utils.pseudo(r,a,c,M);
    let randoms = utils.random(resultado.periodo,d3.max(resultado.data,d=>d.r));

    generadora(resultado,"gseri","gcorr");
    generadora(randoms,"gserib","gcorrb");

}

function generadora(numeros,serieid,corrid) {

    d3.select("#" + corrid).selectAll("*").remove();
    d3.select("#" + serieid).selectAll("*").remove();

    d3.select("#" + serieid).append("p").append("strong").html("Secuencia de números pseudoaleatorios");
    d3.select("#" + corrid).append("p").append("strong").html("Dependencia entre un número de la secuencia y el siguiente");

    const maximoi = d3.max(numeros.data,d => d.i);
    const maximor = d3.max(numeros.data,d => d.r);

    const datos = d3.range(0,(numeros.data.length - 1)/2).map(i => {
        let xi = numeros.data[2*i].r;
        let yi = numeros.data[2*i + 1].r;
        return {x:xi,y:yi}
    });

    let border = 40;
    let corrl = new snips.Lienzo(corrid,1);
    corrl.set_margin({left:border,bottom:border,top:10,right:border});

    let serl = new snips.Lienzo(serieid,0.5);
    serl.set_margin({left:border,bottom:border,top:10,right:border});

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
        .datum(numeros.data)
        .attr("fill","none")
        .attr("stroke","black")
        .attr("stroke-width",0.5)
        .attr("d", d3.line().x(d => scx(d.i)).y(d => scy(d.r)));

    serl.gsvg.selectAll("circle")
        .data(numeros.data)
        .join("circle")
        .attr("cx",d => scx(d.i))
        .attr("cy",d => scy(d.r))
        .attr("r",3)
        .attr("stroke","black")
        .attr("stroke-width",1.2)
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

}
