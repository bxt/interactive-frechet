

var paths = [ [[100,100],[400,200]]
            , [[200,400],[500,300]]
            ];

var epsilon = 200;

var  width = (window.innerWidth/2)-15,
    height = window.innerHeight,
      size = Math.min(width, height)*0.8;
   marginX = ( width-size)/2;
   marginY = (height-size)/2;
var x = d3.scale.linear().range([marginX, marginX + size]),
    y = d3.scale.linear().range([marginY, marginY + size]);

var linesCanvas = d3.select("body").insert("svg")
  .attr("width", width)
  .attr("height", height);

var pathsLines = linesCanvas.append("g").attr("class","paths")
  .selectAll("path").data(paths).enter().append("path");

function updatePathLines() {
  pathsLines.attr("d", d3.svg.line());
}
updatePathLines();

var drag = d3.behavior.drag()
  .origin(Object)
  .on("drag", function(d,i,j){
    d.x = d3.event.x;
    d.y = d3.event.y;
    console.log(d,i,j)
    d3.select(this)
      .attr("cx", d.x)
      .attr("cy", d.y);
    paths[j][i][0] = d.x;
    paths[j][i][1] = d.y;
    updatePathLines();
    updateCircle();
    leash.attr('d','');
  });

var handle = linesCanvas
  .selectAll("g.handles")
  .data(paths)
  .enter()
    .append("g")
    .selectAll("circle")
    .data(function(d){return d.map(function(d){return {x: d[0], y: d[1]};});})
    .enter()
      .append("circle")
      .attr("cx", acc("x"))
      .attr("cy", acc("y"))
      .attr("r", 6)
      .attr("class", "handle")
      .call(drag);


var leash = linesCanvas.append("path").attr('class','leash');

var freespaceCanvas = d3.select("body").insert("svg")
  .attr("width", width)
  .attr("height", height);

freespaceCanvas.append("clipPath").attr('id','uniclip')
  .append("rect").attr("width", 1).attr("height", 1)

var theCircle = freespaceCanvas.append("g")
  .attr("transform",d3.svg.transform().translate(marginX, marginY).scale(size))
  .attr("clip-path","url(#uniclip)")
  .append("circle")

function updateCircle() {
  theCircle
    .attr("vector-effect","non-scaling-stroke")
    .attr("r", epsilon)
    .attr("transform",d3.svg.transform().matrix(function(){
      var m = [ paths[0][1][0] - paths[0][0][0], paths[1][0][0] - paths[1][1][0]
              , paths[0][1][1] - paths[0][0][1], paths[1][0][1] - paths[1][1][1]
              ];
      var t = [ paths[1][0][0] - paths[0][0][0], paths[1][0][1] - paths[0][0][1] ];
      var mi = inverse(m);
      var tt = mmult(mi,t);
      return [mi[0],mi[2],mi[1],mi[3],tt[0],tt[1]];
    }));
}
updateCircle();

var xAxis = d3.svg.axis()
            .scale(x)
            .orient("top");

freespaceCanvas.append("g")
            .attr("class", "x axis")
            .attr("transform", d3.svg.transform().translate(0, marginY-3))
            .call(xAxis)

var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

freespaceCanvas.append("g")
            .attr("class", "y axis")
            .attr("transform", d3.svg.transform().translate(marginX-3, 0))
            .call(yAxis)

var distance = ch(norm, subtract);

freespaceCanvas.on("mousemove", function(d){
  var pos = fork([x,y].map(acc("invert")))(d3.mouse(this));
  var range = paths.map(function(d){return d3.scale.linear().range(d).clamp(true);})
  var leashPoints = fork(range)(pos);
  var dist = distance(leashPoints);
  leash.datum(leashPoints).attr("d", d3.svg.line());
  leash.classed({"overextended": dist > epsilon});
});

