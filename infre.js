

var paths = [ [[100,100],[400,200]]
            , [[200,400],[500,300]]
            ];

var epsilon = 200;

var  width = window.innerWidth/2,
    height = window.innerHeight,
      size = Math.min(width, height)*0.8;
   marginX = ( width-size)/2;
   marginY = (height-size)/2;
var x = d3.scale.linear().range([marginX, marginX + size]),
    y = d3.scale.linear().range([marginY, marginY + size]);

var linesCanvas = d3.select("body").insert("svg")
  .attr("width", width)
  .attr("height", height);

var freespaceCanvas = d3.select("body").insert("svg")
  .attr("width", width)
  .attr("height", height);


linesCanvas.append("g")
  .selectAll("path")
  .data(paths)
  .enter()
    .append("path")
      .attr("d", d3.svg.line());

var leash = linesCanvas.append("path").attr('class','leash');

var xAxis = d3.svg.axis()
            .scale(x)
            .orient("top");

freespaceCanvas.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0,"+(marginY-3)+")")
            .call(xAxis)

var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

freespaceCanvas.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate("+(marginX-3)+",0)")
            .call(yAxis)


function norm(x) {
  return Math.sqrt(x[0]*x[0] + x[1]*x[1]);
}

function subtract(d) {
  return [ [d[0][0] - d[1][0]]
         , [d[0][1] - d[1][1]]
         ];
}

var distance = ch(norm, subtract);

freespaceCanvas.on("mousemove", function(d){
  var pos = fork([x,y].map(acc("invert")))(d3.mouse(this));
  var range = paths.map(function(d){return d3.scale.linear().range(d).clamp(true);})
  var leashPoints = fork(range)(pos);
  var dist = distance(leashPoints);
  leash.datum(leashPoints).attr("d", d3.svg.line());
  leash.classed({"overextended": dist > epsilon});
});

