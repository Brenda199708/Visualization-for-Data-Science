class ElectoralVoteChart {
    /**
     * Constructor for the ElectoralVoteChart
     *
     * @param trendChart an instance of the ShiftChart class
     */
    constructor (trendChart){

        // Follow the constructor method in yearChart.js
        // assign class 'content' in style.css to electoral-vote chart

        this.trendChart = trendChart;
        this.margin = {top: 20, right: 20, bottom: 20, left: 50};

        let divElectoralVoteChart = d3.select("#electoral-vote").classed("content", true);
        this.svgBounds = divElectoralVoteChart.node().getBoundingClientRect();
        // this.svgBounds = 1000;
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 250;

        this.svg = divElectoralVoteChart.append("svg")
                                        .attr("width", this.svgWidth)
                                        .attr("height", this.svgHeight)

        // this.democratsGroup = this.svg.append("g").attr("id", "dGroup");
        // this.republicansGroup = this.svg.append("g").attr("id", "rGroup");
        // this.independentGroup = this.svg.append("g").attr("id", "iGroup");
        this.democratsGroup = this.svg.append("g");
        this.republicansGroup = this.svg.append("g");
        this.independentGroup = this.svg.append("g");
        this.democratsTextGroup = this.svg.append("g").attr("id", "dText");
        this.republicansTextGroup = this.svg.append("g").attr("id", "rText");
        this.independentTextGroup = this.svg.append("g").attr("id", "iText");
    };

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (party) {
        if (party == "R"){
            return "republican";
        }
        else if (party == "D"){
            return "democrat";
        }
        else if (party == "I"){
            return "independent";
        }
    }

    /**
     * Creates the stacked bar chart, text content and tool tips for electoral vote chart
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */

   update (electionResult, colorScale){
       
       // ******* TODO: PART II *******
       // Group the states based on the winning party for the state;
       // then sort them based on the margin of victory
       
       // Create the stacked bar chart.
       // Use the global color scale to color code the rectangles for Democrates and Republican.
       // Use #089c43 to color Independent party.
       // HINT: Use .electoralVotes class to style your bars.

       // Display total count of electoral votes won by the Democrat, Republican and Independent party(if there's candidate).
       // on top of the corresponding groups of bars.
       // HINT: Use the .electoralVoteText class to style your text elements; Use this in combination with
       // Use chooseClass method to get a color based on the party wherever necessary
       
       // Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
       // HINT: Use .middlePoint class to style this bar.
       
       // Just above this, display the text mentioning the total number of electoral votes required
       // to win the elections throughout the country
       // HINT: Use .electoralVotesNote class to style this text element
       // HINT: Use the chooseClass method to style your elements based on party wherever necessary.

       let that = this;
       // console.log(electionResult);

       let sum_ev = d3.sum(electionResult, d => d.Total_EV);
       let positionScale = d3.scaleLinear()
                             .domain([0, sum_ev])
                             .range([this.margin.left, this.svgWidth - this.margin.right]);

       try{
          let independentText = 0, republicansText = 0, democratsText = 0;
          let independentData = []; 
          let democratsData = [];
          let republicansData = [];

          let electionResultData = d3.nest()
                                     .key(d => d.State_Winner)
                                     .rollup(function(values){
                                        return values.sort(function(x, y){
                                            return d3.ascending(parseFloat(x.RD_Difference), parseFloat(y.RD_Difference));
                                        });
                                     })
                                     // .sortValues(function(x, y){
                                     //    return parseFloat(x.RD_Difference) - parseFloat(y.RD_Difference) ;
                                     // })
                                     .entries(electionResult);
          
          // console.log(electionResultData);
          // console.log(electionResultData.find(d => d.key == "D").values.map(d => d["D_EV"]), electionResultData.length);


          //********************************* fix sorting TODO ******************************************************
          // let democratTempData = electionResultData.find()

          for(let i = 0; i < electionResultData.length; i++){
              if(electionResultData[i].key == "D"){
                  let temp = electionResultData[i].value;
                  // temp.sort(function(x, y){return d3.ascending(parseFloat(x.RD_Difference), parseFloat(y.RD_Difference))});
                  let begin = 0, end = 0, counter = 0;
                  for(let j = 0; j < temp.length; j++){
                      begin = counter;
                      counter = counter + parseInt(temp[j]['D_EV']);
                      end = counter;
                      democratsData.push({"begin": begin, "end": end, "values": temp[j]});
                  }
              }

              if(electionResultData[i].key == "R"){
                  let temp = electionResultData[i].value;
                  let begin = 0, end = 0, counter = 0;
                  for(let j = 0; j < temp.length; j++){
                      begin = counter;
                      counter = counter + parseInt(temp[j]['R_EV']);
                      end = counter;
                      republicansData.push({"begin": begin, "end": end, "values": temp[j]});
                  }
              }
              
              if(electionResultData[i].key == "I"){
                  let temp = electionResultData[i].value;
                  let begin = 0, end = 0, counter = 0;
                  for(let j = 0; j < temp.length; j++){
                      begin = counter;
                      counter = counter + parseInt(temp[j]['I_EV']);
                      end = counter;
                      independentData.push({"begin": begin, "end": end, "values": temp[j]});
                  }
              }
          }

          // let democratsData = electionResultData.find
          // console.log(electionResultData, democratsData, republicansData, independentData);
          // console.log(republicansData);

          let dObjData = [], rObjData = [], iObjData = [];
          electionResultData.forEach(function(info){
              if(info.key == "D")
                  dObjData = info.value;
              else if(info.key == "R")
                      rObjData = info.value;
              else if(info.key == "I")
                  iObjData = info.value;
          })

          // console.log(electionResultData, dObjData, rObjData, iObjData);


          democratsText = democratsData[0].values["D_EV_Total"];
          republicansText = democratsData[0].values["R_EV_Total"];
          independentText = democratsData[0].values["I_EV_Total"];
          // let democratsSvg = this.svg.append("g");

          if(that.democratsGroup.empty())
            that.democratsGroup = this.svg.append("g");

          let democratsDataRect = that.democratsGroup.selectAll("rect")
                                          // .attr("id", "democratsBar")
                                          .data(democratsData);

          let democratsDataRectEnter = democratsDataRect.enter().append("rect");
          democratsDataRect.exit().remove();
          democratsDataRect = democratsDataRect.merge(democratsDataRectEnter);

          democratsDataRect.transition()
                           .duration(600)
                           .attr("x", d => (positionScale(d["begin"])))
                           // .attr("x", 0)
                           .attr("y", 50)
                           .attr("width", d => (positionScale(d["end"]) - positionScale(d["begin"])))
                           .attr("height", 25)
                           .attr("fill", d => colorScale(d.values.RD_Difference))
                           .attr("stroke", "#eee")
                           .attr("id", "dGroup")
                           .attr("stroke-width", "1px");
                           // .classed("electoralVotes", true);
          
          let republicansDataRect = that.republicansGroup.selectAll("rect")
                                          // .attr("id", "republicansBar")
                                          .data(republicansData);

          let republicansDataRectEnter = republicansDataRect.enter().append("rect");
          republicansDataRect.exit().remove();
          republicansDataRect = republicansDataRect.merge(republicansDataRectEnter);

          republicansDataRect.transition()
                           .duration(600)
                           .attr("x", d => (positionScale(d["begin"])))
                           .attr("y", 125)
                           .attr("width", d => (positionScale(d["end"]) - positionScale(d["begin"])))
                           .attr("height", 25)
                           .attr("fill", d => colorScale(d.values.RD_Difference))
                           .attr("stroke", "#eee")
                           .attr("stroke-width", "1px");
                           // .classed("electoralVotes", true);     
          
          let independentDataRect = that.independentGroup.selectAll("rect")
                                          .attr("id", "independentBar")
                                          .data(independentData);

          let independentDataRectEnter =  independentDataRect.enter().append("rect");
          independentDataRect.exit().remove();
          independentDataRect = independentDataRect.merge(independentDataRectEnter);

          independentDataRect.transition()
                           .duration(600)
                           .attr("x", d => (positionScale(d["begin"])))
                           .attr("y", 200)
                           .attr("width", d => (positionScale(d["end"]) - positionScale(d["begin"])))
                           .attr("height", 25)
                           // .attr("fill", d => colorScale(d.values.RD_Difference))
                           .attr("fill", "green")
                           .attr("stroke", "#eee")
                           .attr("stroke-width", "1px");

          // let votesNeedBar = this.svg.selectAll(".electoralVoteText").data()
          
          // let textBars = that.democratsTextGroup.selectAll(".electoralVoteText").attr("id", "textBarsSvg");
          // let textBarsEnter = textBars.enter().append("text");
          // textBars.remove();
          // textBars = textBars.merge(textBarsEnter);
          this.svg.selectAll(".electoralVoteText").remove();
            // console.log("here");
            this.svg.append("text")
                      // .transition()
                      // .duration(600)
                      .attr("x", 50)
                      .attr("y", 40)
                      .text(democratsText)
                      .attr("class", that.chooseClass("D"))
                      // .attr("stroke", "black")
                      .classed("electoralVoteText", true);

            // console.log("here");
            this.svg.append("text")
                      // .transition()
                      // .duration(600)
                      .attr("x", 50)
                      .attr("y", 115)
                      .text(republicansText)
                      .attr("class", that.chooseClass("R"))
                      // .attr("stroke", "black")
                      .classed("electoralVoteText", true);

          
          if(independentText != 0){
            // console.log("here");
            this.svg.append("text")
                      // .transition()
                      // .duration(600)
                      .attr("x", 50)
                      .attr("y", 190)
                      .text(independentText)
                      .attr("class", that.chooseClass("I"))
                      // .attr("stroke", "black")
                      .classed("electoralVoteText", true);
          }


          let textEnterBar = "270 needed to win";
          this.svg.selectAll(".electoralVotesNote").remove();

          this.svg.append("text")
                  .attr("x", d => positionScale(sum_ev/2))
                  .attr("y", 15)
                  .text(textEnterBar)
                  .style("fill", "black")
                  .classed("electoralVotesNote", true);


          this.svg.selectAll(".middlePoint").remove();
          // console.log(sum_ev);
          this.svg.append("rect")
                  .attr("x", d => positionScale(sum_ev/2))
                  .attr("y", 20)
                  .attr("height", 220)
                  .attr("width", 3)
                  .style("fill", "black")
                  .classed("middlePoint", true);


       //******* TODO: PART V *******
       
       //Implement brush on the bar chart created above.
       //Implement a call back method to handle the brush end event.
       //Call the update method of shiftChart and pass the data corresponding to brush selection.
       //HINT: Use the .brush class to style the brush.
       // this.trendChart.update("", "ev");
       // let that = this;
       var brushed = function(){
          let brushSelection = d3.event.selection;
          let statesSelectedD = [];
          let statesSelectedR = [];
          let statesSelectedI = [];
          let index = 0;
          let currentRect, xPos, tWidth;
          // let dObjData = democratsData.values;
          console.log(brushSelection, d3.event.type);
          let typeEvent = d3.event.type;
          if(brushSelection){
              // let stateRect = that.svg.selectAll("rect")
              //                         .attr("x", function(d){
              //                             let xPos = parseFloat(d3.select(this).attr("x"));
              //                             let tWidth = parseFloat(d3.select(this).attr("width"));

              //                             if(xPos < brushSelection[1] && xPos >= brushSelection[0]){
              //                                 if(xPos <= (selection[1] - tWidth)){
              //                                   data = d3.select(this).data();
              //                                   statesSelected[index] = data[0];
              //                                   index++;
              //                                 }
              //                             }
              //                             return xPos;
              //                         });
                if(typeEvent == "start"){
                    let statesSelectedValD = democratsDataRect.filter(function(d){
                        currentRect = d3.select(this);
                        xPos = parseFloat(currentRect.attr("x"));
                        tWidth = parseFloat(currentRect.attr("width"));

                        if( xPos > brushSelection[0] && (xPos + tWidth) < brushSelection[1]){
                            statesSelectedD.push(d.values);
                            return true;
                        }
                        return false;
                    });
                }
              if(typeEvent == "end"){
                    let statesSelectedValR = republicansDataRect.filter(function(d){
                        currentRect = d3.select(this);
                        xPos = parseFloat(currentRect.attr("x"));
                        tWidth = parseFloat(currentRect.attr("width"));

                        if( xPos > brushSelection[0] && (xPos + tWidth) < brushSelection[1]){
                            statesSelectedR.push(d.values);
                            return true;
                        }
                        return false;
                    });
                }
              if(typeEvent == "brush"){
                    let statesSelectedValI = independentDataRect.filter(function(d){
                        currentRect = d3.select(this);
                        xPos = parseFloat(currentRect.attr("x"));
                        tWidth = parseFloat(currentRect.attr("width"));

                        if( xPos > brushSelection[0] && (xPos + tWidth) < brushSelection[1]){
                            statesSelectedI.push(d.values);
                            return true;
                        }
                        return false;
                    });
                }                
          }
          console.log("D", statesSelectedD.map(d => d.State));
          console.log("R", statesSelectedR.map(d => d.State));
          console.log("I", statesSelectedI.map(d => d.State));
          // that.trendChart.update(statesSelectedD);
          that.trendChart.update(statesSelectedD, statesSelectedR, statesSelectedI);
       };

       let minX = positionScale(0), minY = this.svgHeight*0.5 - 85, maxX = positionScale(sum_ev), maxY = this.svgHeight * 0.5 - 40;
       var brushD = d3.brushX().extent([[0, minY],[maxX,maxY]]).on("end", brushed);
       this.svg.append("g").attr("class", "brush").call(brushD)

       minX = positionScale(0), minY = this.svgHeight*0.5 - 10, maxX = positionScale(sum_ev), maxY = this.svgHeight * 0.5 + 35;
       var brushR = d3.brushX().extent([[0, minY],[maxX,maxY]]).on("end", brushed);
       this.svg.append("g").attr("class", "brush").call(brushR)
       // this.democratsGroup.attr("class", "brush").call(brush)

       minX = positionScale(0), minY = this.svgHeight*0.5 + 65, maxX = positionScale(sum_ev), maxY = this.svgHeight * 0.5 + 110;
       var brushI = d3.brushX().extent([[0, minY],[maxX,maxY]]).on("end", brushed);
       this.svg.append("g").attr("class", "brush").call(brushI)
      }
       catch(error){
          console.log(error);
       }
    };
}