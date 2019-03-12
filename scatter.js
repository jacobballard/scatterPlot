var dataP = d3.json("gradeData.json");

var screenSetting = {
  width:500,
  height:400
};

var marginSetting = {
  top:10,
  bottom:30,
  left:30,
  right:120
};


var drawGraph = function(data, screen, margins){
  var graphWidth = screen.width - margins.left - margins.right;
  var graphHeight = screen.height - margins.top - margins.bottom;

  console.log('script runnig')
  var xScale = d3.scaleLinear()
                .domain([0, 20])
                .range([0, graphWidth]);

  var yScale = d3.scaleLinear()
                .domain([0, 100])
                .range([graphHeight, 0])

  var xAxis = d3.axisBottom()
                   .scale(xScale);

  var yAxis = d3.axisLeft()
   .scale(yScale);

//Dot radius
  var radius = 5;

  var svg = d3.select(".graph-section")
            .append("svg")
            .classed("scatter-plot", true)
            .attr("width",screen.width)
            .attr("height",screen.height);
  //console.log(screen.width);
  var colors = d3.scaleOrdinal(d3.schemeAccent)


  var plotLand = svg.append("g")
                    .classed('plot', true)
                    .attr('transform', "translate(" + margins.left + "," + margins.top +")");

  var students = plotLand.selectAll('g')
                          .data(data)
                          .enter()
                          .append('g')
                          .attr("fill", function(d, i){return colors(d.name)});


students.selectAll('g')
      .data(function(d, i){return d.grades})
      .enter()
      .append('circle')
      .attr("cx", function(d, i){return xScale(i)})
      .attr('cy', function(d, i){return yScale(d)})
      .attr('r', radius);

  var legend = svg.append('g')
                  .classed('legend', true)
                  .attr('transform', "translate(" + graphWidth +"," + margins.top+")")

  var legendLines = legend.selectAll('g')
                    .data(data, function(d, i){return [d, i]})
                    .enter()
                    .append('g')
                    .classed('legendLine', true)
                    .attr('transform', function(d, i){
                                        var x = 50;
                                        var y = (i * 25);
                                        return "translate(" + x + "," + y +")"});

  legendLines.append('rect')
             .attr('x', 0)
             .attr('y', 0)
             .attr('width', 10)
             .attr('height', 10)
             .attr('fill', function(d){return colors(d.name);});

  legendLines.append('text')
             .attr('x', 20)
             .attr('y', 10)
             .text(function(d) {return d.name;});

 svg.append("g")
         .call(xAxis)
         .attr("transform", function(){
           return "translate(" + margins.left + "," + (margins.top + graphHeight + radius) + ")";
           });

 svg.append("g")
         .call(yAxis)
         .attr("transform", function(){
           return "translate(" + (margins.left - radius) + "," + margins.top + ")";
           });

}


//Initialize
dataP.then(function(data) {
  console.log("data", data, screenSetting, marginSetting)
  drawGraph(data, screenSetting, marginSetting);
});




//Event handler for size-form
d3.select("#graph-size").on("change", function(){
  d3.select(".scatter-plot").remove()
  var size = document.getElementById('graph-size').value;
  console.log(document.getElementById('graph-size').value);


  if (size == "default"){
    console.log("Setting Default");
    screenSetting.width = 500;
    screenSetting.height = 400;
  }
  else if(size == "wide"){
    console.log("Setting Wide");
    screenSetting.width = 1000;
    screenSetting.height = 400;
  }
  else if(size == "tall"){
    console.log("Setting tall");
    screenSetting.width = 500;
    screenSetting.height = 800;
  };

  //Redraw the scatter plot
  dataP.then(function(data) {
    console.log("Plotting with data:", data, screenSetting, marginSetting)
    drawGraph(data, screenSetting, marginSetting);
  });
  console.log("-------------------");

});

//Add a new student
d3.select("#add-new").on("click", function(){
  var name = document.getElementById("student-name").value;
  var scores = document.getElementById("scores").value;
  if (name == "" || scores == ""){
    window.alert("Enter the forms before you add a new student.")
  }
  else{
    scores = scores.split(",");
    var newData = {"name": name,
                  "grades":scores};

    d3.select(".scatter-plot").remove()
    dataP.then(function(data) {
      console.log("Plotting with data:", data, screenSetting, marginSetting);
      data.push(newData);
    console.log("newData", newData);
      drawGraph(data, screenSetting, marginSetting);

    });
  }
});
