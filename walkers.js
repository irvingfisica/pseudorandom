import * as snips from "https://cdn.jsdelivr.net/gh/irvingfisica/d3snips/d3snips.js";
import * as utils from "./utils.js";

let enes = [10,25,50,75,100,250,500,750,1000,2500,5000,7500,10000,25000,50000,75000,100000];
enes.reverse();
let finales = enes.map(N => d3.range(Math.floor(Math.sqrt(N)*3)).map(() => utils.walker(N)));
console.log(finales);
let promedios = finales.map(ele => Math.sqrt(d3.mean(ele,d => d.x*d.x + d.y*d.y)));
console.log(promedios);
let maximo = d3.max(finales,ele => utils.rango(ele));

let colores = utils.colors(finales,0.99,0.99);
console.log(colores);

let pldata = enes.map((d,i) => {return {x:Math.sqrt(d),y:promedios[i]}});
console.log(pldata);

let border = 10;
let wls = new snips.Lienzo("gseri3",1);
wls.set_margin({left:border,bottom:border,top:border,right:border});
let wli = new snips.Lienzo("gcorr3",1);
wli.set_margin({left:border,bottom:border,top:border,right:border});

let scx = d3.scaleLinear([-maximo,maximo],[0,wli.effective_width]);
let scy = d3.scaleLinear([maximo,-maximo],[0,wli.effective_height]);
let scr = d3.scaleLinear([0,maximo],[0,Math.max(wli.effective_width,wli.effective_height)]);

wls.gsvg.selectAll("g")
    .data(finales)
    .join("g")
    .each(function(dup,iup) {
        d3.select(this).selectAll("circle")
            .data(dup)
            .join("circle")
            .attr("cx",d => scx(d.x))
            .attr("cy",d => scy(d.y))
            .attr("r",3)
            .attr("stroke","black")
            .attr("stroke-width",0.3)
            .attr("fill",colores[iup]);
    });

wli.gsvg.selectAll("g")
    .data(finales)
    .join("g")
    .each(function(dup,iup) {
        d3.select(this).selectAll("circle")
            .data(dup)
            .join("circle")
            .attr("cx",d => scx(d.x))
            .attr("cy",d => scy(d.y))
            .attr("r",3)
            .attr("stroke","black")
            .attr("stroke-width",0.3)
            .attr("opacity",0.1)
            .attr("fill",colores[iup]);
    });

wli.gsvg.selectAll(".promedios")
    .data(promedios)
    .join("circle")
    .attr("class","promedios")
    .attr("cx",scx(0))
    .attr("cy",scy(0))
    .attr("r",d => scr(d))
    .attr("stroke",(d,i) => colores[i])
    .attr("stroke-width",2)
    .attr("fill","None");

 wli.gsvg.selectAll(".tickers")
    .data(promedios)
    .join("line")
    .attr("class","ticker")
    .attr("x1",d => scx(0) + scr(d))
    .attr("x2",d => scx(0) + scr(d))
    .attr("y1",scy(0))
    .attr("y2",d => scy(0) + scr(d3.max(pldata,ele=>ele.y)))
    .attr("fill","none")
    .attr("stroke-dasharray","0 2 0")
    .attr("stroke",(d,i) => colores[i])
    .attr("stroke-width",1); 

/* wli.gsvg.append("path")
    .datum(pldata)
    .attr("fill","none")
    .attr("stroke","black")
    .attr("stroke-width",1.5)
    .attr("stroke-dasharray","0 4 0")
    .attr("d",d3.line().x(d => scx(0) + scr(d.y)).y(d => scy(0))); */

wli.gsvg.append("path")
    .datum(pldata)
    .attr("fill","none")
    .attr("stroke","black")
    .attr("stroke-width",1.0)
    .attr("d",d3.line().x(d => scx(0) + scr(Math.max(d.x,d.y))).y(d => scy(0) + scr(d3.max(pldata,ele=>ele.y)))); 

wli.gsvg.selectAll(".ticka")
    .data(pldata)
    .join("circle")
    .attr("class","ticka")
    .attr("cx",d => scx(0) + scr(d.y))
    .attr("cy",scy(0))
    .attr("r",7)
    .attr("fill",(d,i)=>colores[i])
    .attr("stroke-width",2)
    .attr("stroke","white")

wli.gsvg.selectAll(".tickab")
    .data(pldata)
    .join("circle")
    .attr("class","tickab")
    .attr("cx",d => scx(0) + scr(d.x))
    .attr("cy",scy(0) + scr(d3.max(pldata,ele=>ele.y)))
    .attr("r",4)
    .attr("fill","black")
    .attr("stroke-width",2)
    .attr("stroke","white")