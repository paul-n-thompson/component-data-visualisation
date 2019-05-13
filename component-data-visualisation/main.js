    //Program Start
    function main(container)
    {
        var jsonFile = '{  "nodes": [   {"id": "N1", "component": "Admin Portal", "behaviour": "Displayed", "type": "State"},   {"id": "N2", "component": "Administrator", "behaviour": "Manage Configuration Data", "type": "Event"},     {"id": "N3", "component": "Configuration Management Page", "behaviour": "Displayed", "type": "State"}   ],   "links": [     {"source": "N1", "target": "N2", "type": "sequence", "probability": "1"},     {"source": "N2", "target": "N3", "type": "sequence", "probability": "1"}   ] }';
        var jsonObj = JSON.parse(jsonFile);
        const rectWidth = 140,
            rectHeight = 100;

        // Checks if browser is supported
        if (!mxClient.isBrowserSupported())
        {
            // Displays an error message if the browser is not supported.
            mxUtils.error('Browser is not supported!', 200, false);
        }
        else
        {
            // Creates the graph inside the document container.
            // Initialises clickable elements
            var graph = new mxGraph(container);
            var modal = document.getElementById('nodeModal');
            var save = document.getElementById("saveNode");
            var close = document.getElementsByClassName("btn btn-secondary")[0];
            var dismiss = document.getElementsByClassName("dismiss")[0];
            var lock = document.getElementsByClassName("btn-lock")[0];
            var unlock = document.getElementsByClassName("btn-unlock")[0];

            //Initialises graph settings
            graph.setHtmlLabels(true);
            graph.setCellsResizable(false);
            graph.setCellsMovable(true);
            graph.setCellsEditable(false);


            // Initialise style of Vertices
            var style = graph.getStylesheet().getDefaultVertexStyle();
            style[mxConstants.STYLE_SHAPE] = 'box';
            style[mxConstants.STYLE_FILLCOLOR] = '#A8DDB5';
            style[mxConstants.OUTLINE_STROKEWIDTH] = 2;
            style[mxConstants.STYLE_STROKECOLOR] = '#FFFFFF';
            style[mxConstants.STYLE_SHADOW] = true;
            style[mxConstants.STYLE_WHITE_SPACE] = 'wrap';
            style[mxConstants.STYLE_FONTCOLOR] = '#FFFFFF';
            style[mxConstants.DEFAULT_FONTSTYLE] = 0;

            // Initialise style of edges
            style = graph.getStylesheet().getDefaultEdgeStyle();
            style[mxConstants.STYLE_STROKECOLOR] = '#B6B6B6';

            // Gets the default parent for inserting new cells. This
            // is normally the first child of the root (ie. layer 0).
            var parent = graph.getDefaultParent();

            //Click events for buttons
            //Disables movement of cells and changes icon
            lock.onclick = function() {
                graph.setCellsMovable(false);
                lock.style.display = "none";
                unlock.style.display = "unset";
            };
            //Enables movement of cells and changes icon
            unlock.onclick = function(){
                graph.setCellsMovable(true);
                unlock.style.display = "none";
                lock.style.display = "unset";
            };


            //Begins update of graph visuals, tries to sequentially add nodes and links based on json data
            graph.getModel().beginUpdate();
            try
                {
                    var i;
                    var vertex = [],
                        edge = [];
                    //Determines relative starting points to make middle element appear in middle of container.
                    var xPos = document.getElementById("graphContainer").clientWidth/2 - (jsonObj.nodes.length*rectWidth)+.5* rectWidth,
                        yPos = (document.getElementById("graphContainer").clientHeight)*.5 - .5*rectHeight;
                    var lEnclosure = '[ ';
                    var rEnclosure = ' ]';

                    //If there are a more nodes that can fit across screen sets new starting position
                    if (jsonObj.nodes.length > 6) {
                        xPos = rectWidth;
                        yPos = rectHeight;
                    }
                    //Iterates through jason object's data and adds new vertices
                    for (i = 0; i < jsonObj.nodes.length; i++) {
                        //Every sixth vertex created will be created on a new line
                        if (i > 1 && i % 5 === 0) {
                            xPos = rectWidth;
                            yPos += 2*rectHeight;
                        }
                        vertex[i] = graph.insertVertex(parent, jsonObj.nodes[i].id, jsonObj.nodes[i].component + '\n' + lEnclosure + jsonObj.nodes[i].behaviour + rEnclosure, xPos, yPos , rectWidth, rectHeight,'whiteSpace = wrap;');
                        xPos +=  rectWidth*2;
                    }
                    //Iterates through jason object's data and adds edges
                    for (i = 0; i < jsonObj.links.length; i++) {
                        edge[i] = graph.insertEdge(parent, null,'',graph.getModel().getCell(jsonObj.links[i].source),graph.getModel().getCell(jsonObj.links[i].target));
                    }

                    //Adds double click listener to graph
                    //If a cell was double clicked a modal appears
                    // it's input fields are populated with data.
                    graph.addListener(mxEvent.DOUBLE_CLICK, function(sender, evt) {
                        var curCell = evt.getProperty('cell');
                        var curObj =  getJsonById(curCell.id);
                        var val = curObj.type;

                        modal.style.display = "block";
                        document.getElementById("componentInput").value = curObj.component;
                        document.getElementById("behaviourInput").value = curObj.behaviour;
                        document.getElementById("typeInput").value = curObj.type;

                        //When save button is clicked updates the vertex's value based on input
                        window.onclick = function(event) {
                            if (event.target === save){
                                val = document.getElementById('componentInput').value + '\n' + lEnclosure + document.getElementById('behaviourInput').value + rEnclosure;
                                graph.getModel().setValue(curCell,val);
                                modal.style.display = "none";
                            }
                            else if (event.target === modal || event.target === close || event.target === dismiss){
                                modal.style.display = "none";
                            }
                        }
                    });

                }
            finally {
                // Updates the display
                graph.getModel().endUpdate();
            }

            //Functions:
            //  Searches json data's nodes until a match for id is found
            //  once found the object's node is returned.
                          function getJsonById(id)
                          {var found = false,i = 0;
                              while(!found){
                                if (id === jsonObj.nodes[i].id){
                                    found = true;
                                }else {
                                    i++;
                                }

                              }
                              return jsonObj.nodes[i];
                          }
        }
    }
