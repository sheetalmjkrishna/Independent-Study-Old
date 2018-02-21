var globalData = {};
d3.json('some_hops.json', function(error, data) {
    data = JSON.parse(JSON.stringify(data).replace(/SourceStructureID/g, "source").replace(/TargetStructureID/g, "target").replace(/StructureID/g, "id").replace(/SourceID/g, "source").replace(/TargetID/g, "target").replace(/ID/g, "id"));
    let globalNode = 0;
    let globalEdge = 0;
    let optgroupDict = {};
    let loneCells = [];
    let listOfNodes = {};
    let listOfEdges = {};
    let typesOfEdges = [];
    let edge_source = {};
    let edge_dest = {};
    let node_outgoingEdges = {};
    let node_incomingEdges = {};
    $.each(data.nodes, function(index, value) {
        if (value.Label == null || value.Label.trim() == "") {
            value.Label = "Unknown";
        }
        if (value.Label.trim() in optgroupDict) {
            if (!(optgroupDict[value.Label.trim()].includes(value.id)))
                optgroupDict[value.Label.trim()].push(value.id);
        } else {
            optgroupDict[value.Label.trim()] = [value.id];
        }
        if ((!loneCells.includes(value.id))) {
            loneCells.push(value.id); //initially add everything as a lone cell
            listOfNodes[value.id] = value.Label.trim();
        }
    });
    $.each(data.edges, function(index, value) {
        if (!(value.source in listOfNodes)) {
            if ("Unknown" in optgroupDict)
                optgroupDict["Unknown"].push(value.source);
            else
                optgroupDict["Unknown"] = [value.source];
            listOfNodes[value.source] = "Unknown";
        } else {
            let index = loneCells.indexOf(value.source);
            if (index > -1) {
                loneCells.splice(index, 1); //not a lone cell, so remove
            }
        }
        if (!(value.target in listOfNodes)) {
            if ("Unknown" in optgroupDict)
                optgroupDict["Unknown"].push(value.target);
            else
                optgroupDict["Unknown"] = [value.target];
            listOfNodes[value.target] = "Unknown";
        } else {
            let index = loneCells.indexOf(value.target);
            if (index > -1) {
                loneCells.splice(index, 1); //not a lone cell, so remove
            }
        }
        if (value.Type == null || value.Type == "") {
            value.Type = "Unknown";
        }
        if (!(typesOfEdges.includes(value.Type.trim()))) {
            typesOfEdges.push(value.Type.trim());
        }
        listOfEdges[value.id] = value.Type.trim();
        edge_source[value.id] = value.source;
        edge_dest[value.id] = value.target;
        if (value.Directional) {
            if (value.source in node_outgoingEdges) {
                node_outgoingEdges[value.source][value.id] = value.Type.trim();
            } else {
                node_outgoingEdges[value.source] = {};
                node_outgoingEdges[value.source][value.id] = value.Type.trim();
            }
            if (value.target in node_incomingEdges) {
                node_incomingEdges[value.target][value.id] = value.Type.trim();
            } else {
                node_incomingEdges[value.target] = {};
                node_incomingEdges[value.target][value.id] = value.Type.trim();
            }
        } else {
            if (value.source in node_outgoingEdges) {
                node_outgoingEdges[value.source][value.id] = value.Type.trim();
            } else {
                node_outgoingEdges[value.source] = {};
                node_outgoingEdges[value.source][value.id] = value.Type.trim();
            }
            if (value.source in node_incomingEdges) {
                node_incomingEdges[value.source][value.id] = value.Type.trim();
            } else {
                node_incomingEdges[value.source] = {};
                node_incomingEdges[value.source][value.id] = value.Type.trim();
            }


            if (value.target in node_incomingEdges) {
                node_incomingEdges[value.target][value.id] = value.Type.trim();
            } else {
                node_incomingEdges[value.target] = {};
                node_incomingEdges[value.target][value.id] = value.Type.trim();
            }
            if (value.target in node_outgoingEdges) {
                node_outgoingEdges[value.target][value.id] = value.Type.trim();
            } else {
                node_outgoingEdges[value.target] = {};
                node_outgoingEdges[value.target][value.id] = value.Type.trim();
            }
        }
    });
    let object = new Object();
    object.outgoingEdges = node_outgoingEdges;
    object.incomingEdges = node_incomingEdges;
    object.nodesOfType = optgroupDict;
    object.loneCells = loneCells;
    globalNode = new nodes(object);

    object = new Object();
    object.edge_source = edge_source;
    object.edge_dest = edge_dest;
    globalEdge = new edges(object);

    globalData["node"] = globalNode;
    globalData["edge"] = globalEdge;

    $(document).ready(function() {
        $("[name='length']").on("click", function() {
            generateDropdowns($("[name='length']:checked").val(), typesOfEdges, optgroupDict);
        });
        $("[value='2']").trigger("click");
    });
});

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
        "onclick": "getPaths(this)"
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
                } else {
                    $(e.target.closest("ul")).find('.multiselect-group input').trigger('click');
                }
            }
        });
        $('.edgeDropdown .multiselect-container').addClass("pull-right");
    }, 2);
    $("#toggle").css("top", window.innerHeight / 2 + "px");
}

function getPaths(e) {
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
    let hops = parseInt($("[name='length']:checked").val());
    listOfPathsPreFinal = [];
    listOfPathsFinal = [];
    let left = $("#cell-dropdown1").val();
    left = left.map(a => parseInt(a));
    let right = [];
    for (let i = 1; i <= hops; i++) {
        //EACH TIME FIND O---O; TEMP NODES TO THE NEW SET OF TEMP NODES 
        let edges = [];
        right = $("#cell-dropdown" + (i + 1)).val();
        right = right.map(a => parseInt(a));
        let paths = [];
        for (let node of left) {
            let temp = globalData.node.getOutgoingEdgesOfTypes(node, $("#edge-dropdown" + i).val());
            for (let edge of temp)
                edges.push(edge);
        }
        left = [];
        for (let edge of edges) {
            if (right.includes(globalData.edge.getEdgeDest(edge))) {
                paths.push(edge);
                left.push(globalData.edge.getEdgeDest(edge));
            }

        }
        listOfPathsPreFinal[i] = paths; //.join();
    }
    let right1 = [],
        right2 = [];
    for (let j = hops; j >= 1; j--) {
        if (j == hops) {
            listOfPathsFinal[j] = listOfPathsPreFinal[j]; //.replace(/,/g, "<br/>");
            if (listOfPathsFinal[j].length == 0) {
                alert("No paths available for search criteria!");
                return;
            }
            //for (let item of listOfPathsFinal[j].split(',').map(a => parseInt(a))) {
            for (let item of listOfPathsFinal[j].map(a => parseInt(a))) {
                right1.push(globalData.edge.getEdgeSource(item));
            }
            listOfPathsFinal[j] = listOfPathsFinal[j].map(a => parseInt(a));
        } else {
            if (listOfPathsPreFinal[j].length == 0) {
                alert("No paths available for search criteria!");
                return;
            }
            let temp = [];
            //for (let item of listOfPathsPreFinal[j].split(',').map(a => parseInt(a))) {
            for (let item of listOfPathsPreFinal[j].map(a => parseInt(a))) {
                if (right1.includes(globalData.edge.getEdgeDest(item))) {
                    temp.push(item);
                    right2.push(globalData.edge.getEdgeSource(item));
                }
            }
            right1 = right2;
            listOfPathsFinal[j] = temp; //.join();//('</br>');
        }
    }
    let listOfPathsFinalArray = listOfPathsFinal.slice();
    for (let i = 1; i <= hops; i++) {
        let temp = 0;
        if (i == 1) {
            temp = listOfPathsFinalArray[i].sort(function(x, y) {
                return d3.ascending(globalData.edge.getEdgeSource(x), globalData.edge.getEdgeSource(y));
            });
        } else {
            temp = {};
            for (let value of listOfPathsFinalArray[i]) {
                if ((globalData.edge.getEdgeSource(value) in temp) && !(temp[globalData.edge.getEdgeSource(value)].includes(globalData.edge.getEdgeDest(value))))
                    temp[globalData.edge.getEdgeSource(value)].push(globalData.edge.getEdgeDest(value));
                else {
                    temp[globalData.edge.getEdgeSource(value)] = [globalData.edge.getEdgeDest(value)]
                }

            }
        }
        listOfPathsFinal[i] = temp;
    }
    if (hops == 1) {
        $("#hop1-edges").html("");
        $("#hop2-edges").html("");
        $("#hop3-edges").html("");
        $.each(listOfPathsFinal[1], function(ind,value) {
            $("#hop1-edges").append(globalData.edge.getEdgeSource(value) + "---" + globalData.edge.getEdgeDest(value) + "<br/>");
        });
    } else if (hops == 2) {
        $("#hop1-edges").html("");
        $("#hop2-edges").html("");
        $("#hop3-edges").html("");
        $.each(listOfPathsFinal[1], function(ind1,value1) {
            $.each(listOfPathsFinal[2][globalData.edge.getEdgeDest(value1)], function(ind2,value2) {
                $("#hop2-edges").append(globalData.edge.getEdgeSource(value1) + "---" + globalData.edge.getEdgeDest(value1) + "---" + value2 + "<br/>");
            });
        });
    } else {
        $("#hop1-edges").html("");
        $("#hop2-edges").html("");
        $("#hop3-edges").html("");
        $.each(listOfPathsFinal[1], function(ind1,value1) {
            $.each(listOfPathsFinal[2][globalData.edge.getEdgeDest(value1)], function(ind2,value2) {
                $.each(listOfPathsFinal[3][value2], function(ind3,value3) {
                    $("#hop3-edges").append(globalData.edge.getEdgeSource(value1) + "---" + globalData.edge.getEdgeDest(value1) + "---" + value2 + "---" + value3 + "<br/>");
                });
            });
        });
    }

}