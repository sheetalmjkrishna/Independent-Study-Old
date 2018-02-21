class nodes{
	constructor(input){
		this.outgoingEdges=input.outgoingEdges;
		this.incomingEdges=input.incomingEdges;
		this.nodesOfType = input.nodesOfType;	
		this.loneCells = input.loneCells;	
		this.nodeType=input.cellType;
	};
	getLoneCells(){
		return this.loneCells;
	}
	/*getNodesOfTypes(labels){
		
		result={};
		for(let label of labels){
			result[label]=nodesOfType[label];
		}
		return result;
	}*/
	getNodeType(nodeId){
		return this.nodeType[nodeId];
	}
	getOutgoingEdgesOfTypes(nodeId,labels){
		
		let result=[];
		for(let edgeId in this.outgoingEdges[nodeId]){
			if(labels.includes(this.outgoingEdges[nodeId][edgeId]))
				result.push(edgeId);
		}
		return result;
	}
	getIncomingEdgesOfTypes(nodeId,labels){
		
		let result=[];
		for(let edgeId in this.incomingEdges[nodeId]){
			if(labels.includes(this.incomingEdges[nodeId][edgeId]))
				result.push(edgeId);
		}
		return result;
	}	
}