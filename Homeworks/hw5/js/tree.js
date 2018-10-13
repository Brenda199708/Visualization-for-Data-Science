/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {
        
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(treeData) {

        // ******* TODO: PART VI *******


        //Create a tree and give it a size() of 800 by 300. 


        //Create a root for the tree using d3.stratify(); 

        
        //Add nodes and links to the tree. 
        try{

        function diagonal(s, d) {

            let path = `M ${s.y} ${s.x}
                    C ${(s.y + d.y) / 2} ${s.x},
                      ${(s.y + d.y) / 2} ${d.x},
                      ${d.y} ${d.x}`;

            return path;
        }
        this.treeData = treeData;
        let treeDisplay = d3.tree().size([800, 300]);

        let treeRoot = d3.stratify()
                          // .id(d => d.id)
                          .id((d, i) => i)
                          .parentId(d => d.ParentGame)
                          (treeData);

        let treeDisplayData = treeDisplay(treeRoot);

        let treeNodes = treeDisplayData.descendants();
        let treeLinks = treeDisplayData.descendants().slice(1);                      

        treeNodes.forEach(function(d){
            d.y = d.depth * 75 + 90;
        });

        let nodeSelection = d3.select("#tree")
                              .selectAll("g")
                              .data(treeNodes, d => d.id);

        let padding = 50;
        let nodeSelectionEnter = nodeSelection.enter()
                                              .append("g")
                                              .attr("class", d => (d.data.Wins == 1) ? "winner" : "loser")
                                              .classed("node", true)
                                              .attr("transform", d => ("translate(" + d.y + "," + d.x + ")"));

        nodeSelectionEnter.append("circle")
                          .attr("r", 6);

        nodeSelectionEnter.append("text")
                          .text(d => d.data.Team)
                          .attr("dy", "0.35em")
                          .attr("x", d => (!d.children ? 13 : -13))
                          .attr("text-anchor", d => (d.children) ? "end" : "start")
                          .attr("id", function(d){return "node"+d.data.id.slice().replace(/[a-z]/gi, '');});

        let nodeLink = d3.select("#tree")
                     .selectAll("path.link")
                     .data(treeLinks, d => d.id);
                     // .data(treeLinks, function(d){ return d.id;})



        // for id, we have to use replace function, I found a related link which I am using:
        // https://stackoverflow.com/questions/1487422/regular-expression-in-javascript-to-remove-anything-that-is-not-a-z-0-9-and-hyp

        let nodeLinkEnter = nodeLink.enter()
                                    .insert("path", "g")
                                    .classed("link", true)
                                    .attr("d", d => diagonal(d, d.parent))
                                    .attr("id", function(d){return d.data.id.slice().replace(/[^a-z]/gi, '');});
        }
        catch(error){
            console.log(error);
        }
    }

    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(row) {
        // ******* TODO: PART VII *******
        // console.log(row);
        try{
            this.clearTree;
            let that = this;
            let highlightedCountry = row.key;
            let highlightType = row.value.type;
            let svgTree = d3.select("#tree");
            let tempOppo = row.value.Opponent;
            let tempid;

            if(highlightType == "game"){
                // console.log(row);
                for(let node of this.treeData){
                    
                    if(node.Opponent == highlightedCountry && node.Team == tempOppo){
                            svgTree.select("#" + node.Team + "" + node.Opponent).classed("selected", true);
                            svgTree.select("#node" + node.id.replace(/[a-z]/gi, '')).classed("selectedLabel", true);
                    }
    
                    if(node.Team == highlightedCountry && node.Opponent == tempOppo){
                            svgTree.select("#" + node.Team + "" + node.Opponent).classed("selected", true);
                            svgTree.select("#node" + node.id.replace(/[a-z]/gi, '')).classed("selectedLabel", true);
                    }
                }
            }
            else{
                // console.log(row);
                // console.log(this.treeData);
                for(let node of this.treeData){
                    if(node.Team == highlightedCountry && node.Wins == 1){
                                svgTree.select("#"+ node.Team +""+ node.Opponent).classed("selected", true);
                                svgTree.select("#node"+node.ParentGame).classed("selectedLabel", true);
                                svgTree.select("#node"+node.id.replace(/[a-z]/gi, '')).classed("selectedLabel", true);
                    }
                }
            }
        }
        catch(error){
            console.log(error);
        }
    }
    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******

        // You only need two lines of code for this! No loops! 
        // d3.selectAll(".selected").classed("link", true).classed("selected", false);
        // d3.selectAll(".selectedLabel").classed("selectedLabel", false);

        d3.select("#tree").selectAll(".selected, .selectedLabel").classed("selected", false).classed("selectedLabel", false);
    }
}
