//-------------------------global definition--------------------
var cntX            =   50;
var cntY            =   50;
var sugar           =   new Array(cntX*cntY);
var sugarProduction =   new Array(cntX*cntY);
var sugarCapacity   =   new Array(cntX*cntY);
var hasAgent        =   new Array(cntX*cntY);
var agentCnt        =   250;
var maxSugar        =   30;
var maxProduction   =   1;
var agents          =   new Array(agentCnt);
var fps             =   2;

//--------------------------agent constant------------------------
var visionRange     =   6;
var harvestRange    =   10;
var consumeRange    =   8;
var capacityRange   =   15;
var initSugarRange  =   10;

//--------------------------sugar mine----------------------------
var sugarMineA = {
    x:          cntX/4,
    y:          cntY/4,
    initSugar:  maxSugar,
    production: maxProduction, 
    fallOff:    15};

var sugarMineB = {
    x:          cntX/2,
    y:          cntY*3/4,
    initSugar:  maxSugar,
    production: maxProduction,
    fallOff:    10};


var sugarMineC = {
    x:          cntX*3/4,
    y:          cntY/4,
    initSugar:  maxSugar,
    production: maxProduction,
    fallOff:    8};

var sugarMines = [sugarMineA, sugarMineB, sugarMineC];
//--------------------------------------------------------------
//--------------------------test--------------------------------

function test_init_sugar_sugarMine()
{
    for (var i=0; i<cntX*cntY; i++) {
        var x = i%cntX, y = Math.floor(i/cntX);
        var nearest = get_nearest_sugarMine(x, y);
        var dist = get_dist(nearest.x, nearest.y, x, y);
        if (dist > nearest.fallOff) {
            sugarCapacity[i] = sugar[i] = 0;
            sugarProduction[i] = 0;

        } 
        else {
            var fallOff = (nearest.fallOff-dist)/nearest.fallOff;
            sugarCapacity[i] = sugar[i] = nearest.initSugar*fallOff;
            sugarProduction[i] = nearest.production*fallOff;
        }
    }
}
function test_init_sugar()
{
    test_init_sugar_sugarMine();         
}

function test_init_agent()
{
    pos_arr = init_position();
    for (var i=0; i<agents.length; i++) {
        var pos = pos_arr[i];
        var x = pos%cntX, y = Math.floor(pos/cntX);
        
        var vision      = Math.floor(Math.random()*(visionRange-1))+1; //at least 1
        var harvest     = Math.floor(Math.random()*harvestRange);
        var consume     = Math.floor(Math.random()*(consumeRange-1))+1; //at least 1
        var capacity    = Math.floor(Math.random()*capacityRange);
        var initSugar   = Math.floor(Math.random()*initSugarRange);

        agents[i] = 
            new Agent(x, y, 
                vision,
                harvest,
                consume,
                capacity,
                initSugar);
        hasAgent[pos] = true;
    }
}

function process_one_frame()
{
    process_one_frame_agent();
    draw();
    product_sugar();
    setTimeout(process_one_frame, 1000/fps);
}

function process_one_frame_agent()
{
    for (var i=0; i<agents.length; i++) {
        if (!agents[i].Consume()) {
            agents[i] = agents[agents.length-1];
            i--;
            agents.pop();
            agentCnt--;
        }
        else {
            agents[i].Harvest();
            agents[i].Migrate();
        }
    }
}


function test_draw_grid()
{
    test_init_sugar();
    test_init_agent();
    drawSugar(sugar, maxSugar);
    drawAgents();  
    process_one_frame();
}

//--------------------------------------------------------------
function get_dist(x0, y0, x1, y1)
{
    var dx = x0-x1, dy = y0 - y1;
    return Math.sqrt(dx*dx + dy*dy);
}
function get_nearest_sugarMine(x, y)
{
    var nearest_idx = 0;
    for (var i=0; i<sugarMines.length; i++) {
        if (get_dist(x, y, sugarMines[i].x, sugarMines[i].y)
            < get_dist(x, y, sugarMines[nearest_idx].x, sugarMines[nearest_idx].y))
            nearest_idx = i;
    }
    return sugarMines[nearest_idx];
    
}

function init_position()
{
    var pos_candidate_arr = new Array(cntX*cntY);
    for (var i=0; i<cntX*cntY; i++)
        pos_candidate_arr[i] = i;
    var pos_arr = [];
    for (var i=0; i<agentCnt; i++) {
        var idx = Math.floor(Math.random()*(cntX*cntY-i));
        pos_arr[i] = pos_candidate_arr[idx];
        pos_candidate_arr[idx] = pos_candidate_arr[cntX*cntY-i-1];    
    }
    return pos_arr;
}

function product_sugar()
{
    for (var i=0; i<sugar.length; i++) 
        sugar[i] = Math.min(sugarCapacity[i], sugar[i]+sugarProduction[i]);
}
//--------------------------------------------------------------

setCanvas();
test_draw_grid();