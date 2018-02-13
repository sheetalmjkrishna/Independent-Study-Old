class edges{
	constructor(input){
		this.edgeSource=input.edge_source;
		this.edgeDest=input.edge_dest;
	};
	getEdgeSource(edge){
		return this.edgeSource[edge];
	}
	getEdgeDest(edge){
		return this.edgeDest[edge];
	}
}