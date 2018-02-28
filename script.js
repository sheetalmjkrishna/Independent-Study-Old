var globalData = {};
$(window).on('load', function() {
    $("#loadFile").prop('disabled', true);
    $("#loadSample").on("change", function() {
        if ($(this).is(":checked")) {
            $("#fileToLoad").closest(".col-md-4").hide();
            $("#loadFile").prop('disabled', false);
        } else {
            $("#fileToLoad").closest(".col-md-4").show();
            if ($("#fileToLoad").val().length > 1)
                $("#loadFile").prop('disabled', false);
            else
                $("#loadFile").prop('disabled', true);
        }
    });
    $("#fileToLoad").on("change", function() {
        $("#fileName").html($("#fileToLoad").val().replace("C:\\fakepath\\", ""));
        $("#loadFile").prop('disabled', false);
    });
    $('#myModal').modal('show');
});

function loadFileAsText() {
    if ($("#loadSample").is(":checked")) {
        d3.json('some_hops.json', function(error, data) {
            loadData(data);
        });
        $('#myModal').modal('hide');
    } else {
        let fileToLoad = document.getElementById("fileToLoad").files[0];
        let fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent) {
            let textFromFileLoaded = JSON.parse(fileLoadedEvent.target.result);
            if (textFromFileLoaded.nodes.length < 1 || textFromFileLoaded.edges.length < 1)
                alert("Invalid File!");
            else {
                loadData(textFromFileLoaded);
                $('#myModal').modal('hide');
            }

        };
        fileReader.readAsText(fileToLoad, "UTF-8");
    }

}

function loadData(data) {
    //  data = JSON.parse(data.replace(/SourceStructureID/g, "source").replace(/TargetStructureID/g, "target").replace(/StructureID/g, "id").replace(/SourceID/g, "source").replace(/TargetID/g, "target").replace(/ID/g, "id"));
    //data = JSON.parse(JSON.stringify(data).replace(/SourceStructureID/g, "source").replace(/TargetStructureID/g, "target").replace(/StructureID/g, "id").replace(/SourceID/g, "source").replace(/TargetID/g, "target").replace(/ID/g, "id"));

    let globalNode = 0;
    let globalEdge = 0;
    let optgroupDict = {};
    let loneCells = {};
    let listOfNodes = {};
    let listOfEdges = {};
    let typesOfEdges = {};
    let edge_source = {};
    let edge_dest = {};
    let node_outgoingEdges = {};
    let node_incomingEdges = {};
    let loadNodes=function(){
        $.each(data.nodes, function(index, value) {
            let label="";
            if (value.Label == null || value.Label.trim() == "") {
                label = "Unknown";
            }
            else{
                label=value.Label.trim();
            }        
            if (label in optgroupDict) {
                /*if (!(optgroupDict[label].includes(value.StructureID)))
                    optgroupDict[label].push(value.StructureID);*/
                    optgroupDict[label].push(value.StructureID);
            } else {
                optgroupDict[label] = [value.StructureID];
            }
            /*if ((!loneCells.includes(value.StructureID))) {
                loneCells.push(value.StructureID); //initially add everything as a lone cell
                listOfNodes[value.StructureID] = label;
            }*/
            listOfNodes[value.StructureID] = label;
            loneCells[value.StructureID]=true;
        });
        for(let label in optgroupDict){
            optgroupDict[label]=Array.from(new Set(optgroupDict[label]));
        }
    }
    let loadEdges=function(){
        $.each(data.edges, function(index, value) {
            if (!(value.SourceStructureID in listOfNodes)) {
                if ("Unknown" in optgroupDict)
                    optgroupDict["Unknown"].push(value.SourceStructureID);
                else
                    optgroupDict["Unknown"] = [value.SourceStructureID];
                listOfNodes[value.SourceStructureID] = "Unknown";
            } else {
                /*let index = loneCells.indexOf(value.SourceStructureID);
                if (index > -1) {
                    loneCells.splice(index, 1); //not a lone cell, so remove
                }*/
                loneCells[value.SourceStructureID]=false;
            }
            if (!(value.TargetStructureID in listOfNodes)) {
                if ("Unknown" in optgroupDict)
                    optgroupDict["Unknown"].push(value.TargetStructureID);
                else
                    optgroupDict["Unknown"] = [value.TargetStructureID];
                listOfNodes[value.TargetStructureID] = "Unknown";
            } else {
                /*let index = loneCells.indexOf(value.TargetStructureID);
                if (index > -1) {
                    loneCells.splice(index, 1); //not a lone cell, so remove
                }*/
                loneCells[value.TargetStructureID]=false;
            }
            let edgeType=value.Type.trim();
            if (value.Type == null || edgeType == "") {
                value.Type = "Unknown";
            }
            /*if (!(typesOfEdges.includes(edgeType))) {
                typesOfEdges.push(edgeType);
            }*/
            typesOfEdges[edgeType]=1;
            listOfEdges[value.ID] = edgeType;
            edge_source[value.ID] = value.SourceStructureID;
            edge_dest[value.ID] = value.TargetStructureID;
            if (value.Directional) {
                if (value.SourceStructureID in node_outgoingEdges) {
                    node_outgoingEdges[value.SourceStructureID][value.ID] = edgeType;
                } else {
                    node_outgoingEdges[value.SourceStructureID] = {};
                    node_outgoingEdges[value.SourceStructureID][value.ID] = edgeType;
                }
                if (value.TargetStructureID in node_incomingEdges) {
                    node_incomingEdges[value.TargetStructureID][value.ID] = edgeType;
                } else {
                    node_incomingEdges[value.TargetStructureID] = {};
                    node_incomingEdges[value.TargetStructureID][value.ID] = edgeType;
                }
            } else {
                if (value.SourceStructureID in node_outgoingEdges) {
                    node_outgoingEdges[value.SourceStructureID][value.ID] = edgeType;
                } else {
                    node_outgoingEdges[value.SourceStructureID] = {};
                    node_outgoingEdges[value.SourceStructureID][value.ID] = edgeType;
                }
                if (value.SourceStructureID in node_incomingEdges) {
                    node_incomingEdges[value.SourceStructureID][value.ID] = edgeType;
                } else {
                    node_incomingEdges[value.SourceStructureID] = {};
                    node_incomingEdges[value.SourceStructureID][value.ID] = edgeType;
                }


                if (value.TargetStructureID in node_incomingEdges) {
                    node_incomingEdges[value.TargetStructureID][value.ID] = edgeType;
                } else {
                    node_incomingEdges[value.TargetStructureID] = {};
                    node_incomingEdges[value.TargetStructureID][value.ID] = edgeType;
                }
                if (value.TargetStructureID in node_outgoingEdges) {
                    node_outgoingEdges[value.TargetStructureID][value.ID] = edgeType;
                } else {
                    node_outgoingEdges[value.TargetStructureID] = {};
                    node_outgoingEdges[value.TargetStructureID][value.ID] = edgeType;
                }
            }
        });
    typesOfEdges=Object.keys(typesOfEdges);
    loneCells=Object.keys(loneCells).filter(c=>loneCells[c]==true).map(d => parseInt(d));
    }
    loadNodes();
    loadEdges();

    let object = new Object();
    object.outgoingEdges = node_outgoingEdges;
    object.incomingEdges = node_incomingEdges;
    object.nodesOfType = optgroupDict;
    object.loneCells = loneCells;
    object.cellType = listOfNodes;
    globalNode = new nodes(object);

    object = new Object();
    object.edge_source = edge_source;
    object.edge_dest = edge_dest;
    object.edgeType = listOfEdges;
    globalEdge = new edges(object);

    globalData["node"] = globalNode;
    globalData["edge"] = globalEdge;

    $(document).ready(function() {
        $("[name='length']").on("click", function() {
            generateDropdowns($("[name='length']:checked").val(), typesOfEdges, optgroupDict);
        });
        $("[value='2']").trigger("click");
    });
} //comment for loading from server directly
//});

function generateDropdowns(hops, typesOfEdges, optgroupDict) {
    $('#dropdowns').html("");
    if (parseInt(hops) == 0) {
        console.log("Lone cells are: \n");
        for (let item of globalData.node.getLoneCells()) {
            console.log(item + " ");
        }
        return;
    }
    let i = 1;
    let spanDiv = $("<div />").attr("class", "validationMsg");
    spanDiv.append($("<span />").text("Please select a value!"));
    for (i = 1; i <= hops; i++) {
        let div0 = $("<div />").attr("class", "filterBodyItem row");
        let div1 = $("<div />").attr("class", "nodeDropdown");
        div1.append($("<h4 />").text("Node " + i + " Type:"));
        div1.append($("<select />").attr({
            "id": "cell-dropdown" + i,
            "multiple": "multiple"
        }));
        div1.append(spanDiv.clone());
        div0.append(div1);

        let div2 = $("<div />").attr("class", "edgeDropdown");
        div2.append($("<h4 />").text("Edge " + i + " Type:"));
        div2.append($("<select />").attr({
            "id": "edge-dropdown" + i,
            "multiple": "multiple"
        }));
        div2.append(spanDiv.clone());
        div0.append(div2);

        $('#dropdowns').append(div0);

        let select1 = $("#cell-dropdown" + i);
        $.each(Object.keys(optgroupDict).sort(), function(index1, value1) {
            let optgroup = $("<optgroup />").attr({
                "value": value1,
                "label": value1
            });
            $.each(optgroupDict[value1], function(index2, value2) {
                optgroup.append($("<option />").val(value2).text(value2));
            });
            select1.append(optgroup);
        });


        let select2 = $("#edge-dropdown" + i);
        $.each(typesOfEdges.sort(), function(index, value) {
            select2.append($("<option />").val(value).text(value));
        });
        select1.multiselect({
            enableClickableOptGroups: true,
            enableCollapsibleOptGroups: true,
            enableFiltering: true,
            includeSelectAllOption: true,
            enableCaseInsensitiveFiltering: true
        });

        select2.multiselect({
            enableClickableOptGroups: true,
            enableCollapsibleOptGroups: true,
            enableFiltering: true,
            includeSelectAllOption: true,
            enableCaseInsensitiveFiltering: true
        });
        select2.multiselect('selectAll', false);
        select2.multiselect('updateButtonText');
    }
    let div0 = $("<div />").attr("class", "filterBodyItem row");
    let div3 = $("<div />").attr("class", "nodeDropdown");
    div3.append($("<h4 />").text("Node " + i + " Type:"));
    div3.append($("<select />").attr({
        "id": "cell-dropdown" + i,
        "multiple": "multiple"
    }));
    div3.append(spanDiv.clone());
    div0.append(div3);
    $('#dropdowns').append(div0);
    let select1 = $("#cell-dropdown" + i);
    $.each(Object.keys(optgroupDict).sort(), function(index1, value1) {
        let optgroup = $("<optgroup />").attr({
            "value": value1,
            "label": value1
        });
        $.each(optgroupDict[value1], function(index2, value2) {
            optgroup.append($("<option />").val(value2).text(value2));
        });
        select1.append(optgroup);
    });
    select1.multiselect({
        enableClickableOptGroups: true,
        enableCollapsibleOptGroups: true,
        enableFiltering: true,
        includeSelectAllOption: true,
        enableCaseInsensitiveFiltering: true
    });
    let div4 = $("<div />").attr("class", "edgeDropdown");
    div4.append($("<button />").attr({
        "type": "button",
        "class": "btn btn-default",
        "id": "submitButton",
        "onclick": "submit(this)"
    }).text("Get Paths"));
    div0.append(div4);
    setTimeout(function() {
        $('.multiselect-group').attr("state", "collapsed");
        $("[id ^=cell-dropdown]").parent().find('li').not(".multiselect-item").css("display", "none");
        $('.caret-container').on("click", function() {
            if ($(this.parentElement.parentElement).attr("state") == "uncollapsed") {
                $(this.firstElementChild).css("transform", "rotate(360deg)");
                $(this.parentElement.parentElement).attr("state", "collapsed");
            } else {
                $(this.firstElementChild).css("transform", "rotate(180deg)");
                $(this.parentElement.parentElement).attr("state", "uncollapsed");
            }
        });
        $('.multiselect-all').on('click', function(e) {
            if (e.target.type == "checkbox") {
                if (e.target.checked) {
                    $(e.target.closest("ul")).find('.multiselect-group input').not(":checked").trigger('click');
                    e.stopPropagation();
                } else {
                    $(e.target.closest("ul")).find('.multiselect-group input').trigger('click');
                    e.stopPropagation();
                }
            }
        });
        $('.edgeDropdown .multiselect-container').addClass("pull-right");
    }, 2);
    $("#toggle").css("top", window.innerHeight / 2 + "px");
    $("#filters a label").css("width", "90%");
}

function submit(e) {
    let flag = 0;
    $.each($(e.parentElement.parentElement.parentElement).find("select"), function(index, value) {
        if ($(value).val().length == 0) {
            $(value).closest("div").find(".validationMsg").show();
            flag = 1;
        } else
            $(value).closest("div").find(".validationMsg").hide();
    });
    if (flag)
        return;
    let left = $("#cell-dropdown1").val();
    let cells = [];
    $.each($("[id ^='cell']"), function(i, v) {
        cells.push($(v).val());
    });
    let edges = [];
    $.each($("[id ^='edge']"), function(i, v) {
        edges.push($(v).val());
    });
    let paths = getPaths(cells, edges);
    drawPaths(paths);
}

function drawPaths(paths) {
    if (Object.keys(paths).length == 0) {
        alert("No paths present for chosen combination!");
        $("#paths").html("");
        return;
    }

    $("#paths").html("Paths are: <br/>")
    let i = 1;
    for (let path in paths) {
        let printablePath = "";
        for (let partOfPath of paths[path]) {
            printablePath += (partOfPath[0] + "(" + globalData.node.getNodeType(partOfPath[0]) + ")" + " - ");
            printablePath += (partOfPath[1] + "(" + globalData.edge.getEdgeType(partOfPath[1]) + ")" + " - ");
            printablePath += (partOfPath[2] + "(" + globalData.node.getNodeType(partOfPath[2]) + ")" + "  ");
        }
        $("#paths").append(i + ") " + printablePath + "<br/>");
        // console.log(i + ") " + printablePath);
        i++;
    }
}

function getPaths(validCells, validEdges) {
    /*
      FINAL PATHS:
      UNIQUE ID: PATH
      EG:
      {
          1:[[LeftNode,Edge,RightNode],[LeftNode,Edge,RightNode],[LeftNode,Edge,RightNode]]
          2:[[LeftNode,Edge,RightNode],[LeftNode,Edge,RightNode],[LeftNode,Edge,RightNode]]
      }
      The above is of the form:
      {
          1:[PartOfPath1, PartOfPath2,PartOfPath3]
          2:[PartOfPath1, PartOfPath2,PartOfPath3]
      }
      Steps:
      -Find First "part of path" add to final paths dict
      -from the end point sof the previous part of paths see if you can form another set of part of paths, if you can't, remove this part of path else attach the next part pf path
      -do this recursively
      */
    let pathId = 1;
    let listOfPathsFinal = {};
    let pathContinuity = {};
    let left = validCells[0];
    left = left.map(a => parseInt(a));
    let right = [];
    let hops = validEdges.length;
    for (let i = 0; i < hops; i++) {
        //EACH TIME FIND O---O; TEMP NODES TO THE NEW SET OF TEMP NODES 
        //reset pathContinuity
        for (let id in pathContinuity) {
            pathContinuity[id] = false;
        }
        right = validCells[i + 1];
        right = right.map(a => parseInt(a));
        let newLeft = [];
        for (let node of left) {
            let tempEdges = globalData.node.getOutgoingEdgesOfTypes(node, validEdges[i]);
            for (let edge of tempEdges) {
                let destinationNode = globalData.edge.getEdgeDest(edge);
                if (right.includes(destinationNode)) {
                    let partOfPath = [node, edge, destinationNode];
                    if (i == 0) {
                        listOfPathsFinal[pathId] = [];
                        listOfPathsFinal[pathId].push(partOfPath);
                        pathContinuity[pathId] = false;
                        pathId++;
                    } else {
                        for (let id in listOfPathsFinal) { //for each path that we have:
                            //if we haven't added another partOfPath and the last node of this path matches the source of the current edge
                            //OR we have added another partOfPath and the second last node of this path matches the source of the current edge
                            if ((!pathContinuity[id] && listOfPathsFinal[id][listOfPathsFinal[id].length - 1][2] == node) || (pathContinuity[id] && listOfPathsFinal[id][listOfPathsFinal[id].length - 2][2] == node)) //if the last partOfPath's dest node is the current path of part's source node, then attach them
                            {
                                if (pathContinuity[id]) //if this is NOT the first path of part that we want to attach to this path, create a new path instead of just attaching it
                                {
                                    //creating new path by first copying previous path
                                    let previousPath = listOfPathsFinal[id].slice();
                                    previousPath.pop(); //to remove the new path of part that we've attached
                                    listOfPathsFinal[pathId] = previousPath;
                                    listOfPathsFinal[pathId].push(partOfPath);
                                    pathContinuity[pathId] = true;
                                    pathId++;
                                } else {
                                    listOfPathsFinal[id].push(partOfPath);
                                    pathContinuity[id] = true;
                                }
                            }
                        }
                    }
                    if (!newLeft.includes(destinationNode))
                        newLeft.push(destinationNode);
                }
            }
        }
        left = newLeft;
        //Now remove half constructed paths that we weren't able to extend in this iteration
        if (i != 0) {
            for (let id in pathContinuity) {
                if (!pathContinuity[id]) {
                    delete pathContinuity[id];
                    delete listOfPathsFinal[id];
                }
            }
        }
    }
    return listOfPathsFinal;
}