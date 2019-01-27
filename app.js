// Define SVG dimensions
var svgWidth = 960;
var svgHeight = 500;

var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};
// dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
var padding = 25;  // Padding around canvas, i.e. replaces the 0 of scale
var formatPercent = d3.format('.2%');
// append SVG
var svg = d3
  .select(".chart")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)
  // Append a group to the SVG area and adjust location
  .append("g")
    .attr("transform", "translate(" + chartMargin.right + ", " + chartMargin.top + ")");
// Append and SVG group
var chart = svg.append("g");
// bandscale

d3.select(".chart")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Load data from hours-of-tv-watched.csv
d3.csv("newdata.csv", function(error, phData) {
  for (var i = 0; i < phData.length; i++){
        
        console.log(phData[i].abbr)
  } 
  if (error) throw error;
  phData.forEach(function(d) {

      d.poverty = +d.poverty;
      d.healthcare = +d.healthcare;
  });
  
  var x = d3.scaleLinear().range([0, chartWidth]);
  var y= d3.scaleLinear().range([chartHeight, 0]);
  //var x = d3.scaleLinear().range([0]);
  //var y= d3.scaleLinear().range([0]);
  var xAxis = d3.axisBottom(x);
  var yAxis = d3.axisLeft(y);

  var xValue = function(d) { return x(d.poverty);};
  var yValue = function(d) { return y(d.healthcare);};

  function findMinAndMax(i) {
        xMin = d3.min(phData, function(d) {
            return +d[i] * 0.8;
        });

        xMax =  d3.max(phData, function(d) {
            return +d[i] * 1.1;
        });

        yMax = d3.max(phData, function(d) {
            return +d.healthcare * 1.1;
        });
  };
    
  var currentAxisXLabel = "poverty";

    // findMinAndMax()
  findMinAndMax(currentAxisXLabel);

  xScale=x.domain([xMin, xMax]);
  yScale=y.domain([0, yMax]);
      
  // ####### scatterplot #######
  var toolTip = d3.tip()
        .attr("class", "tooltip")
        .html(function(d) {
            var state = d.abbr;
            var poverty = +d.poverty;
            var healthcare = +d.healthcare;
            return (state + "<br> In Poverty: " + poverty + "%<br> Lack Healthcare: " + healthcare + "%");
      });

  chart.call(toolTip);
                


  // adding circles
  circles = chart.selectAll('circle')
        .data(phData)
        .enter().append('circle')
        .attr("class", "circle")
        .attr("cx", function(d, index) {
            return x(+d[currentAxisXLabel]);
        })
        .attr("cy", function(d, index) {
            return y(d.healthcare);
        })   
        .attr('r','10')
        .attr('stroke','black')
        .attr('stroke-width',1)
        .style('fill', "lightblue")
        .attr("class", "circleText")
        // adding listeners
        .on("mouseover", function(d) {
          toolTip.show(d);
        })
        // onmouseout event
        .on("mouseout", function(d, index) {
          toolTip.hide(d);
        });              
     
  
    // Labels
  circles.append('text')
         .attr("x", function(d, index) {
            return x(+d[currentAxisXLabel]- 0.08);
        })
         .attr("y", function(d, index) {
            return y(d.healthcare - 0.2);
        })
    
        .attr("text-anchor", "middle")
        .text(function(d){
            return d.abbr;})
        .attr('fill', 'white')
        .attr('font-size', 9);
  
  
    // xAxis
  xAxis = d3.axisBottom(x);


  chart.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + chartHeight + ")")
       .call(xAxis);
    

  chart.append("text")
       .attr("class", "label")
       .attr("transform", "translate(" + (chartWidth / 2) + " ," + (chartHeight - chartMargin.top+ 60) + ")")
       .style("text-anchor", "middle")
       .text('In Poverty (%) ');

  // yAxis
  yAxis = d3.axisLeft(y);
            
  chart.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);       
                
 
  chart.append("text")
       .attr("class", "label")
       .attr("transform", "rotate(-90)")
       .attr("y", 0 - (chartMargin.left + 4))
       .attr("x", 0 - (chartHeight/ 2))
       .attr("dy", "1em")
       .style("text-anchor", "middle")
       .text('Lacks healthcare (%)');
});
