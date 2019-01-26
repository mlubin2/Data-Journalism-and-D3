// @TODO: YOUR CODE HERE!
// define SVG dimensions
var svgW = 960;
var svgH = 500;

//define chart margins
var margin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
};

// define dimensions of chart area
var chartW = svgW - margin.left - margin.right;
var chartH = svgH - margin.top - margin.bottom;
var padding = 25;
var format = d3.format('.2%');

//append svg
var svg = d3
    .select(".chart")
        .append("svg")
        .attr("height", svgH)
        .attr("width", svgW)
    .append("g")
        .attr("transform", "translate(" + margin.right + ", " + margin.top +")");
var chart = svg.append("g");

//configure band scale
d3.select(".chart")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//load CSV
d3.csv("data.csv", function(error, phData) {
    for (var i = 0; i < phData.length; i++)
        console.log(phData[i].abbr)
})
if (error) throw error;
phData.forEach(function(d) {
    d.poberty = +d.poverty;
    d.healthvare = +d.healthcare;

});

// sacle range of data
var x = d3.scaleLinear().range([0,chartW]);

//create a linear scale
var y = d3.scaleLinear().range([chartH, 0]);
var xaxis = d3.axisBottom(x);
var yaxis = d3.axisLeft(y);
var xValue = function(d) { return x(d.poverty);};
var yValue = function(d) { return y (d.healcare);};


function findminmax(i) {
    xmin = d3.min(phData, function(d) {
        return +d[i] * 0.8;
    });
    xmax = d3.max(phData, function(d) {
        return +d[i] * 1.1;
    });
    ymax = d3.max(phData, function(d) {
        return +d.healthcare * 1.1;
    });
};

var currentAxisXLabel = "poverty";
findminmax(currentAxisXLabel);
xScale=x.domain([xmin, xmax]);
yScale=y.domain([0, ymax]);

//time for the scatterplot
var toolTip = d3.tip()
    .attr("class", "tooltip")
    .html(function(d){
        var state = d.abbr;
        var poverty = +d.poverty;
        var healthcare = +d.healthcare;
        return (d.state + "<br> In Poverty: " + poverty + "%<br> Lack Healthcare: " + healthcare + "%")
    });

chart.call(toolTip);

//add circles to plot
circles = chart.selectAll('circle')
    .data(phData)
    .enter().append("circle")
    .attr("class", "circle")
    .attr("cx", function(d, index){
        return x(+d[currentAxisXLabel]);
    })
    .attr("cy", function(d, index){
        return y(d.healthcare);
    })
    .attr('r', '10')
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .style('fill', 'lightblue')
    .attr('class', 'circleText')
    //add mouseover
    .on("mouseover", function(d) {
        toolTip.show(d);
    })
    // mouseout
    .on("mouseout", function(d, index) {
        toolTip.hide(d);
    });

//text labels
    circles.append('text')
        .attr("x", function(d, index) {
            return x(+d[currentAxisXLabel]- 0.08);
        })
        .attr("y", function(d, index) {
            return y(d.healthcare - 0.2);
        })
        .attr("text-anchor", "middle")
        .text(function(d){
            return d.abbr;
        })
        .arrt('fill', 'white')
        .attr('font-size', 9);

    //axies
    xaxis = d3.axisBottom(x);
    chart.append("g")
        .attr("class", "x axis")
        .arrt("transform", "translate(0," + chartH + ")")
        .call(xaxis);

    chart.append("text")
    .attr("class", "label")
    .attr("transform", "translate(" + (chartW / 2) + " ," + (chartH - margin.top+ 60) + ")")
    .style("text-anchor", "middle")
    .text('In Poverty (%) ');

    yaxis = d3.axisLeft(y);
    chart.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yaxis);


    chart.append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - (chartMargin.left + 4))
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text('Lacks healthcare (%)');
    });

