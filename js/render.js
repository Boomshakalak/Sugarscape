var canvasId = 'sugarScape';
var c = document.getElementById(canvasId);
var ctx = c.getContext("2d");
var unit = 8;
var lineWidth = 1;
var halfUnit = unit/2;
var fullRadius = halfUnit-lineWidth;

function setCanvas()
{
    c.width = unit*cntX;
    c.height = unit*cntY;

    ctx.lineWidth= lineWidth;
}


function drawCircle(centerX, centerY, radius, color)
{
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
}


/*
draw the sugar,
using color to indicate abundance of the sugar
*/
function drawSugarColor(src, max)
{
    for (var idx=0; idx<cntX*cntY; idx++) {
        var i = Math.floor(idx / cntX), j = idx % cntX;
        var cx = j*unit+halfUnit, cy = i*unit+halfUnit;
        // ctx.clearRect(j*unit, i*unit, unit, unit);
        var color_div = 255-Math.floor(Math.min(max, src[idx])/max*255);
        var color = 'rgb('+color_div+',255,255)';
        //var color = 'rgb('+blue+',255,255)';
        drawCircle(cx, cy, fullRadius, color);
    }
}

function drawSugar()
{
    //drawSugarColor(sugarProduction, maxProduction);
    drawSugarColor(sugar, maxSugar);
}

function drawAgents()
{
    var sum=0;
    for (var i=0; i<agents.length; i++) {
        sum+=agents[i].sugar;
        var x = agents[i].x, y = agents[i].y;
        var cx = x*unit+halfUnit, cy = y*unit+halfUnit;
        var agentColor_div = 255-Math.floor(agents[i].sugar/capacityRange*255);
        var color = 'rgb('+'255,'+agentColor_div+',255';
        drawCircle(cx, cy, fullRadius, color);
    }
    document.getElementById("sum").textContent = sum;
    document.getElementById("cnt").textContent = agents.length;
}

function draw()
{
    drawSugar();
    drawAgents();
}