class edges{
	constructor(input){
		this.edgeSource=input.edge_source;
		this.edgeDest=input.edge_dest;
		this.edgeType=input.edgeType;
	};
	getEdgeSource(edge){
		return this.edgeSource[edge];
	}
	getEdgeDest(edge){
		return this.edgeDest[edge];
	}	
	getEdgeType(edgeId){
		return this.edgeType[edgeId];
	}
}            
