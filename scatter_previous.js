var dataP = d3.json("gradeData.json");


var drawGraph = function(data){
  var screen = {
    width:500,
    height:400
  }

  var margins = {
    top:10,
    bottom:10,
    left:30,
    right:50
  }

  var width = screen.width - margins.left - margins.right;
  var height = screen.height - margins.top - margins.bottom;

  console.log('script runnig')
  var xScale = d3.scaleLinear()
                .domain([0, 20])
                .range([0, width]);

  var yScale = d3.scaleLinear()
                .domain([0, 100])
                .range([height, 0])

  var svg = d3.select("svg")
            .attr("width",screen.width)
            .attr("height",screen.height);
  //console.log(screen.width);
  var colors = d3.scaleOrdinal(d3.schemeAccent)


  var plotLand = svg.append("g")
                    .classed('plot', true);

  var students = plotLand.selectAll('g')
                          .data(data)
                          .enter()
                          .append('g');

  students.selectAll('g')
        .data(function(student){return student.grades})
        .enter()
        .append('circle')
        .attr("cx", function(d, i){return xScale(i)})
        .attr('cy', function(d, i){return yScale(d)})
        .attr('r', 5);

  var legend = svg.append('g')
                  .classed('legend', true)
                  .attr('transform', "translate(" + (screen.width)+"," + margins.top+")")

  var legendLines = legend.selectAll('g')
                    .data(data)
                    .enter()
                    .append('g')
                    .classed('legendLine', true)

  legendLines.append('rect')
             .attr('x', 0)
             .attr('y', 0)
             .attr('width', 10)
             .attr('height', 10)
             .attr('fill', function(d){return colors(d.name);})
             .attr('transform', '')

  legendLines.append('text')
             .attr('x', 20)
             .attr('y', 0)
             .text(function(d) {return d.name})



}


dataP.then(function(data) {
  console.log("data", data)
  drawGraph(data);
});
