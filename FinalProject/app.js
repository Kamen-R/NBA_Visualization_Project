function finalProject(){
    var filePath="mvps_cleaned.csv";
    question1(filePath);
    question2(filePath);
    question3(filePath);
    question4(filePath);
    question5(filePath);
}

var question1=function(filePath){

    var rowConverter = function(d){
        if (d.Rank == 1){
            return {
                Player: d.Player,
                PTS: parseFloat(d.PTS),
                TRB: parseFloat(d.TRB),
                AST: parseFloat(d.AST),
                STL: parseFloat(d.STL),
                BLK: parseFloat(d.BLK),
                "FG%": parseFloat(d["FG%"]).toFixed(3),
                "3P%": parseFloat(d["3P%"]).toFixed(3),
                "FT%": parseFloat(d["FT%"]).toFixed(3),
                Year: d.Year
            }
        }
    }

    d3.csv(filePath, rowConverter).then(function(data){
        console.log(data)
        var curr_stat = "PTS"
        var years = Array.from(d3.group(data, d => d.Year).keys())
        var max = d3.max(data, function(d){ return +d[curr_stat]; })

        var height = 750;
        var width = 1400;
        var xpadding = 100;
        var ypadding = 70;
        const svg1 = d3.select("#plot1")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

        var xScale = d3.scaleBand()
        .domain(years)
        .range([xpadding, width - xpadding])
        var yScale = d3.scaleLinear()
        .domain([0, max])
        .range([height - ypadding, ypadding])
        var xAxis = d3.axisBottom(xScale)
        var yAxis = d3.axisLeft(yScale)
        svg1.append("g")
        .attr("transform", "translate(0," + (height - ypadding) + ")")
        .attr("class", "xAxis")
        .call(xAxis)
        .selectAll("text")
        svg1.append("g")
        .attr("transform", "translate(" + (xpadding) + ",0)")
        .attr("class", "yAxis")
        .call(yAxis)
        
        //Axis Labels
        svg1.append("text")
        .attr("class", "xAxisLabel")
        .attr("x", (width - xpadding)/2)
        .attr("y", height - 15)
        .text("Year")
        .style("font-size", 18);
        svg1.append("text")
        .attr("class", "yAxisLabel")
        .attr("x", 0)
        .attr("y", (height - ypadding)/2)
        .text("PTS per Game")
        .style("font-size", 16);

        var Tooltip = d3.select("#plot1").append("div").style("opacity", 0).attr("class", "tooltip");
        svg1.append("g").selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("label", curr_stat)
        .attr("fill", "blue")
        .attr("cx", function(d){
            return xScale(d.Year) + (xScale.bandwidth()/2);
        })
        .attr("cy", function(d){
            return yScale(d.PTS);
        })
        .attr("r", 6)
        .on("mouseover", function(e, d){
            Tooltip.transition().duration(50).style("opacity", 0.9);
            d3.select(".tooltip")
            .html(d.Player + ", " + String(d[this.getAttribute("label")]) + " " + this.getAttribute("label"))
            .style("font-size", "18px");
            //d3.select("#tooltip").classed("hidden", false);
        })
        .on("mousemove", function(e, d){
            d3.select(".tooltip")
            .attr("x", e.pageX+"px")
            .attr("y", e.pageY+"px")
            .style("left", e.pageX + "px")
            .style("top", e.pageY+10 + "px");
        })
        .on("mouseout", function(e, d){
            Tooltip.transition().duration(10).style("opacity", 0)
        })

        var radio = d3.select("#radio_q1")
        .attr("name", "stat").on("change", function(d){
            var curr_stat = d.target.value;
            var new_max = d3.max(data, function(d){ return +d[curr_stat]; });

            console.log(new_max);

            yScale = d3.scaleLinear()
            .domain([0, new_max])
            .range([height - ypadding, ypadding])
            yAxis = d3.axisLeft(yScale);
            d3.selectAll("g.yAxis")
            .call(yAxis)

            d3.selectAll("circle").data(data)
            .transition()
            .duration(700)
            .attr("cy", function(d){
                return yScale(d[curr_stat]);
            })
            .attr("label", curr_stat)

            d3.select(".yAxisLabel")
            .text(curr_stat + " per Game")
        })


    });

}

var question2=function(filePath){

    var rowConverter = function(d){
        if (d.Rank == 1){
            return {
                Player: d.Player,
                Year: d.Year,
                Share: parseFloat(d.Share).toFixed(3)
            }
        }
    }

    d3.csv(filePath, rowConverter).then(function(data){
        console.log(data);

        var height = 750;
        var width = 1400;
        var xpadding = 100;
        var ypadding = 70;
        const svg2 = d3.select("#plot2")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

        var years = Array.from(d3.group(data, d => d.Year).keys())
        console.log(years)

        var xScale = d3.scaleBand()
        .domain(years)
        .range([xpadding, width - xpadding])
        var yScale = d3.scaleLinear()
        .domain([0.65, 1.0])
        .range([height - ypadding, ypadding])
        var xAxis = d3.axisBottom(xScale)
        var yAxis = d3.axisLeft(yScale)
        svg2.append("g")
        .attr("transform", "translate(0," + (height - ypadding) + ")")
        .attr("class", "xAxis")
        .call(xAxis)
        .selectAll("text")
        svg2.append("g")
        .attr("transform", "translate(" + (xpadding - 1) + ",0)")
        .attr("class", "yAxis")
        .call(yAxis)

        //Axis Labels
        svg2.append("text")
        .attr("class", "xAxisLabel")
        .attr("x", (width - xpadding)/2)
        .attr("y", height - 15)
        .text("Year")
        .style("font-size", 18);
        svg2.append("text")
        .attr("class", "yAxisLabel")
        .attr("x", 0)
        .attr("y", (height - ypadding)/2)
        .text("Share")
        .style("font-size", 18);

        var svg_bars = svg2.selectAll(".bar")
        .data(data).enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d){
            return xScale(d.Year);
        })
        .attr("y", function(d){
            return yScale(d.Share);
        })
        .attr("width", function(d){
            //console.log(d)
            return xScale.bandwidth() - 1;
        })
        .attr("height", function(d){
            return height - ypadding - yScale(d.Share);
        })
        .on("mouseover", function(e, d){
            d3.select(this).attr("fill", "orange")
        })
        .on("mouseout", function(e, d){
            d3.select(this).transition()
            .duration(500)
            .attr("fill", "blue")
        })
        .attr("fill", "blue")
        .append("title")
        .text(function(d){
            return d.Player + ", " + d.Share + " Share";
        })

        // sort button code not workign but it's an extra anyway
        /*d3.select("#sort_button")
        .on("click", function(){
            sortBars();
        })

        var isDescending = false;
        var sortBars = function(){
            // sort the xaxis before hand by sorting the years by the share ? should work maybe i can create other variables too
            var xScale = d3.scaleBand()
            .domain(years)
            .range([xpadding, width - xpadding])

            svg2.selectAll(".bar")
            .sort(function(a, b) {
                if (isDescending) {
                    return a.Share - b.Share;
                } else {
                    return b.Share - a.Share;
                }
            })
            .transition("sorting")
            .duration(1000)
            .attr("x", function(d){
                return xScale(d);
            });

            isDescending = !isDescending
        }*/

    })
}

var question3=function(filePath){

    var rowConverter = function(d){
        if (d.Rank <= 3){
            return {
                Player: d.Player,
                Rank: d.Rank,
                POS: d.POS
            }
        }
    }

    d3.csv(filePath, rowConverter).then(function(data){
        console.log(data);

        var counts = d3.rollup(data, v => d3.count(v, d => d.Rank), d => d.POS, d => d.Rank);
        var positions = ["PG", "SG", "SF", "PF", "C"]; // hard-coded this simply because this order is normal for basketball
        //console.log(positions);
        console.log(counts);

        var data_array = []
        var max = 0;
        for (let i in positions) {
            data_array.push({
                POS:positions[i],
                '1':counts.get(positions[i]).get('1'),
                '2':counts.get(positions[i]).get('2'),
                '3':counts.get(positions[i]).get('3'),
            })
            var num = counts.get(positions[i]).get('1') + counts.get(positions[i]).get('2') + counts.get(positions[i]).get('3');

            if (num > max) {
                max = num;
            }
        }
        console.log(data_array);
        console.log(max);

        var height = 700;
        var width = 1250;
        var xpadding = 100;
        var ypadding = 50;
        const svg3 = d3.select("#plot3")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

        var stack = d3.stack().keys(["3", "2", "1"]);
        var series = stack(data_array);
        var colors = {"1": "Gold", "2":"Gray", "3":"#CD7F32"}
        console.log(series);

        var xScale = d3.scaleBand()
		.domain(positions)
		.range([xpadding, width-xpadding])
        var yScale = d3.scaleLinear()
        .domain([0, max])
        .range([ypadding, height - ypadding]);
        var yAxisScale = d3.scaleLinear()
        .domain([0, max])
        .range([height - ypadding, ypadding]);

        //Axis Labels
        svg3.append("text")
        .attr("class", "xAxisLabel")
        .attr("x", (width - xpadding)/2)
        .attr("y", height - 15)
        .text("Position")
        .style("font-size", 18);
        svg3.append("text")
        .attr("class", "yAxisLabel")
        .attr("x", 0)
        .attr("y", (height - ypadding)/2)
        .text("Count")
        .style("font-size", 18);

        var xAxis = d3.axisBottom(xScale)
        var yAxis = d3.axisLeft(yAxisScale)
        svg3.append("g")
        .attr("transform", "translate(0," + (height - ypadding) + ")")
        .attr("class", "xAxis")
        .call(xAxis)
        .selectAll("text")
        svg3.append("g")
        .attr("transform", "translate(" + (xpadding - 1) + ",0)")
        .attr("class", "yAxis")
        .call(yAxis)

        var groups = svg3.selectAll(".gbars").data(series).enter()
        .append("g")
        .attr("class", "gbars")
        .attr("fill", function(d){
            return colors[d.key];
        })

        var rects = groups.selectAll("rect")
        .data(function(d){
            return d;
        })
        .enter().append("rect")
        .attr("x", function(d, i){
            //console.log(d.data)
            return xScale(d.data.POS);
        })
        .attr("y", function(d){
            //console.log(d)
            return height - yScale(d[1]);
        })
        .attr("width", function(d){
            return xScale.bandwidth() - 2;
        })
        .attr("height", function(d, i){
            return yScale(d[1]) - yScale(d[0]);
        })

        //Legend 
        svg3.selectAll("circle").data(series)
        .enter().append("circle")
        .attr("cx", xpadding + 100)
        .attr("cy", function(d, i) {
            return 50 + (i * 25);
        })
        .attr("r", 5)
        .attr("fill", function(d, i){
            return colors[d.key];
        })

        var offset = 4;
        svg3.selectAll(".label").data(series)
        .enter().append("text")
        .attr("class", "label")
        .attr("x", xpadding + 20)
        .attr("y", function(d, i) {
            return (50 + (i * 25)) + offset;
        })
        .text(function(d){
            if (d.key == 1) {
                return "MVP";
            } else if (d.key == 2) {
                return "2nd Place";
            }
            return "3rd Place";
        })
    })
}

var question4=function(filePath){

    var rowConverter = function(d){
        if (d.Rank == "1") {
            return {
                Player: d.Player,
                Rank: d.Rank,
                Team: d.Tm
            }
        }
    }

    d3.csv(filePath, rowConverter).then(function(data){
        var teams = Array.from(d3.group(data, d => d.Team).keys());
        console.log(teams)
        console.log(data)

        var width = 1000;
        var height = 800;
        var svg4 = d3.select("#plot4")
        .append("svg").attr("width", width)
        .attr("height", height);

        const projection  = d3.geoAlbersUsa().scale(1300).translate([width / 2, height / 2]) //chain translate and scale
        const pathgeo = d3.geoPath().projection(projection);
        const statesmap = d3.json("us-states.json");

        statesmap.then(function(map){
            svg4.selectAll("path")
            .data(map.features)
            .enter()
            .append("path")
            .attr("d", pathgeo)
            .attr("stroke", "gray")
            .attr("fill", "lightblue")

            //var max = d3.max(d3.rollup(data, v => d3.count(v, d => d.Rank), d => d.Team).values());
            var mvp_counts = d3.rollup(data, v => d3.count(v, d => d.Rank), d => d.Team);
            var ordinalDomain = new Set(mvp_counts.values())
            ordinalDomain.add(0)
            ordinalDomain = Array.from(ordinalDomain);
            ordinalDomain.sort(function(a, b){return a - b});

            var radiusScale = d3.scaleOrdinal()
            .domain(ordinalDomain)
            .range([4, 6, 8, 10, 12])
            var colorScale = d3.scaleOrdinal()
            .domain(ordinalDomain)
            .range(["#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#99000d"]);  //used colorbrwer2 for color scheme
            //.range(["#fed976", "#feb24c", "#fd8d3c", "#f03b20", "#bd0026"]);

            d3.csv("city_data_cleaned.csv").then(function(cities) {
                console.log(cities)
                
                //var Tooltip = d3.select("#plot4").append("div").style("opacity", 0).attr("class", "tooltip");
                svg4.selectAll(".points")
                .data(cities)
                .enter()
                .append("circle")
                .attr("r", function(d){
                    //console.log(d)
                    if (teams.includes(d.Abbreviation)) {
                        return radiusScale(mvp_counts.get(d.Abbreviation));
                    }
                    else {
                        return radiusScale(0);
                    }
                })
                .attr("cx", function(d){
                    return projection([d.lng, d.lat])[0];
                })
                .attr("cy", function(d){
                    return projection([d.lng, d.lat])[1];
                })
                .attr("fill", function(d){
                    if (teams.includes(d.Abbreviation)) {
                        return colorScale(mvp_counts.get(d.Abbreviation));
                    } else {
                        return colorScale(0);
                    }
                })

                svg4.selectAll(".cityname").data(cities)
                .enter()
                .append("text")
                .attr("x", function(d){
                    // some special cases to stop overlap
                    if (d.city == "San Antonio"){
                        return projection([d.lng, d.lat])[0] - 25;
                    }
                    if (d.city == "Philadelphia" | d.city == "Washington") {
                        return projection([d.lng, d.lat])[0] + 5;
                    }
                    if (d.city == "New York") {
                        return projection([d.lng, d.lat])[0] - 25;
                    }
                    return projection([d.lng, d.lat])[0] + 1;
                })
                .attr("y", function(d){
                    // some special cases to stop overlap
                    if (d.city == "San Francisco"){
                        return projection([d.lng, d.lat])[1] + 15;
                    }
                    if (d.city == "Philadelphia" | d.city == "Washington") {
                        return projection([d.lng, d.lat])[1] + 10;
                    }
                    return projection([d.lng, d.lat])[1] - 10;
                })
                .text(function(d){
                    if (d.city == "New York") {
                        return d.city + "/Brookyln";
                    }
                    return d.city;
                })
                .attr("fill", "black")
                .attr("opacity", function(d) {
                    if (d.city == "Brooklyn") {
                        return 0;
                    }
                })

                //Legend 
                //var legend = [{"color": "firebrick", "label": "1+ MVPs"}, {"color": "black", "label": "0 MVPs"}]
                svg4.selectAll(".legend").data(ordinalDomain)
                .enter().append("circle")
                .attr("class", "legend")
                .attr("cx", 900)
                .attr("cy", function(d, i) {
                    return 25 + (i * 25);
                })
                .attr("r", function(d){
                    return radiusScale(d);
                })
                .attr("fill", function(d){
                    return colorScale(d);
                })

                var offset = 4;
                svg4.selectAll(".label").data(ordinalDomain)
                .enter().append("text")
                .attr("class", "label")
                .attr("x", 920)
                .attr("y", function(d, i) {
                    return (25 + (i * 25)) + offset;
                })
                .text(function(d){
                    return String(d) + " MVPs";
                })
            })
        })
    })
}

var question5=function(filePath){
    var rowConverter = function(d){
        if (d.Rank == "1") {
            return {
                Player: d.Player,
                Rank: d.Rank,
            }
        }
    }
    d3.csv(filePath, rowConverter).then(function(data){
        var players = Array.from(d3.group(data, d => d.Player).keys());
        var rowConverter2 = function(d){
            if (players.includes(d.Player)) {
                return {
                    Player: d.Player,
                    Year: d.Year
                }
            }
        }
        d3.csv("player_mvp_stats_cleaned.csv", rowConverter2).then(function(data2){
            // get players from data2
            console.log(data2)
            var mvps = d3.group(data2, d => d.Player);

            // first create list of dictionaries for nodes
            var nodes = [];
            for (let i in players) {
                var years_played = [];
                for (let j in mvps.get(players[i])) {
                    years_played.push(mvps.get(players[i])[j].Year)
                }
                nodes.push({
                    id: i,
                    player: players[i],
                    years: years_played
                })
            }
            console.log(nodes)
            //next create list of dicts for edges 

            var edges = [];
            var max_overlap = 0;
            for (let i in nodes) {

                for (let j in nodes) {
                    var overlap_years = 0;
                    //console.log(nodes[j]);
                    if (parseInt(nodes[j].id) <= parseInt(nodes[i].id)) {
                        continue;
                    } else {
                        for (let x in nodes[j].years) {
                            if (nodes[i].years.includes(nodes[j].years[x])){
                                overlap_years += 1;
                            }
                        }
                    }
                    if (overlap_years != 0) {
                        edges.push({
                            "source": nodes[i],
                            "target": nodes[j],
                            "overlap": overlap_years
                        })
                    }
                    if (overlap_years > max_overlap) {
                        max_overlap = overlap_years;
                    }
                }
            }
            console.log(edges)

            // next create list of dicts for links
            var links = []
            for(var i=0;i<edges.length;i++){
                var obj={}
                obj["source"]=edges[i]["source"].id;
                obj["target"]=edges[i]["target"].id;
                obj["overlap"]=edges[i]["overlap"]
                links.push(obj);
            }
            console.log(links);

            var width = 1500;
            var height = 1000;
            var svg5 = d3.select("#plot5")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            // add border to svg canvas
            svg5.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "none")
            .attr("stroke", "black")

            console.log(max_overlap)
            num_of_bins = 4;
            var bin_amount = Math.floor(max_overlap / num_of_bins);
            var bins = [];
            for (let i=1;i<=num_of_bins;i++){
                bins.push(bin_amount*i)
            }
            var get_bin = function(d){
                for (let i in bins){
                    if (d <= bins[i]){
                        return bins[i]
                    }
                }
            }
            console.log(bins)
            console.log(get_bin(18))

            var strokeScale = d3.scaleOrdinal()
            .domain(bins)
            .range([1, 3, 5, 7])
            console.log(strokeScale(3));
            //create edges first
            var link = svg5.selectAll("line").data(edges).enter()
            .append("line")
            .style("stroke", "gray")
            .style("stroke-width", function(d){
                return strokeScale(get_bin(d.overlap))
            })
            // create nodes
            var node = svg5.selectAll("circle").data(nodes).enter()
            .append("circle")
            .attr("r", 15)
            .classed("node", true)
            .classed("fixed", d => d.fx !== undefined);

            // basic tooltips
            node.append("title").text(function(d){
                return d.player;
            })
            //Legend 

            svg5.selectAll(".legend").data(bins)
            .enter().append("line")
            .attr("class", "legend")
            .attr("x1", 80)
            .attr("x2",  105)
            .attr("y1", function(d, i){
                return 25 + (i * 25);
            })
            .attr("y2", function(d, i){
                return 25 + (i * 25);
            })
            .attr("stroke-width", function(d){
                return strokeScale(d);
            })
            .attr("stroke", "gray")

            var offset = 4;
            svg5.selectAll(".label").data(bins)
            .enter().append("text")
            .attr("class", "label")
            .attr("x", 1)
            .attr("y", function(d, i) {
                return (25 + (i * 25)) + offset;
            })
            .text(function(d){
                return String(d-4) + "-" + String(d) + " Years";
            })

            // create force graphs
            var force = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(edges).distance(600))
            .force("center", d3.forceCenter().x(width/2).y(height/2))
            .force("collide", d3.forceCollide().strength(.1).radius(30).iterations(1))
            console.log(nodes)

            force.on("tick", function(){
                link.attr("x1", function(d){ return d.source.x; })
                .attr("y1", function(d){ return d.source.y; })
                .attr("x2", function(d){ return d.target.x; })
                .attr("y2", function(d){ return d.target.y; })

                node.attr("cx", function(d){ return d.x; })
                .attr("cy", function(d){ return d.y; })
            })

            const drag = d3.drag().on("start", dragstart).on("drag", dragged)

            node.call(drag).on("click", click)

            function click(event, d) {
                delete d.fx;
                delete d.fy;
                d3.select(this).classed("fixed", false);
                force.alpha(1).restart();
              }
            
              function dragstart() {
                d3.select(this).classed("fixed", true);
              }
            
              function dragged(event, d) {
                d.fx = clamp(event.x, 0, width);
                d.fy = clamp(event.y, 0, height);
                force.alpha(1).restart();
              }
              function clamp(x, lo, hi) {
                return x < lo ? lo : x > hi ? hi : x;
              }
        })

    })



}

