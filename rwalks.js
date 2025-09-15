import * as snips from "https://cdn.jsdelivr.net/gh/irvingfisica/d3snips/d3snips.js";
import * as utils from "./utils.js";

const camInput = document.getElementById('caminante');
let camEtq = d3.select("#camval");
camInput.value = 1000;

d3.select("#caminante").on("change",camch);

camch();

const ncamInput = document.getElementById('ncam');
let ncamEtq = d3.select("#ncamval");
let ncamval = 1000;
ncamInput.value = ncamval;

const kcamInput = document.getElementById('kcam');
let K = Math.floor(Math.sqrt(ncamval));
let kcamEtq = d3.select("#kcamval").html(K);
kcamInput.value = K;

kcamch();

d3.select("#ncam").on("change",ncamch);
d3.select("#kcam").on("change",kcamch);

function camch() {
    let camval = camInput.value;
    camEtq.html(camval);

    randomw(camval,1,"cam1");
}

function ncamch() {
    let ncamval = ncamInput.value;
    ncamEtq.html(ncamval);

    let K = Math.floor(Math.sqrt(ncamval));
    d3.select("#kcam").attr("max",K);
    kcamEtq.html(K);
    kcamInput.value = K;

    randomw(ncamval,K,"camv");
}

function kcamch() {
    let ncamval = ncamInput.value;
    let kcamval = kcamInput.value;
    kcamEtq.html(kcamval);

    randomw(ncamval,kcamval,"camv");
}

function randomw(N,K,div) {

    d3.select("#"+div).selectAll("*").remove();

    
    let paseos = d3.range(K);
    paseos = paseos.map(() => utils.walk(N));
    let colores = utils.colors(paseos,0.99,0.99);

    let finales = paseos.map(ele => ele[ele.length - 1]);
    let maximo = d3.max(paseos,ele => utils.rango(ele));

    let border = 10;
    let wli = new snips.Lienzo(div,1);
    wli.set_margin({left:border,bottom:border,top:border,right:border});

    let scx = d3.scaleLinear([-maximo,maximo],[0,wli.effective_width]);
    let scy = d3.scaleLinear([maximo,-maximo],[0,wli.effective_height]);

    let drawer = d3.line().x(d=>scx(d.x)).y(d=>scy(d.y));

    wli.gsvg.selectAll(".caminata")
        .data(paseos)
        .join("path")
        .attr("class","caminata")
        .attr("fill","none")
        .attr("stroke",(d,i) => colores[i])
        .attr("stroke-width",0.5)
        .attr("d", drawer);

    wli.gsvg.selectAll("circle")
        .data(finales)
        .join("circle")
        .attr("cx",d => scx(d.x))
        .attr("cy",d => scy(d.y))
        .attr("r",3)
        .attr("stroke","black")
        .attr("stroke-width",1.0)
        .attr("fill",(d,i) => colores[i]);

    wli.gsvg.append("circle")
        .datum({x:0,y:0})
        .attr("cx",d => scx(d.x))
        .attr("cy",d => scy(d.y))
        .attr("r",5)
        .attr("stroke","black")
        .attr("stroke-width",1.5)
        .attr("fill","white");
}