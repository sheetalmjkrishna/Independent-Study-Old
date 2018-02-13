switch(hops){
		case 1:
		//O---O		 
		$.each(globalData.edges,function(index,value){
			if(value.Directional)
			{
				if(edgeOnes.includes(value.Type) && nodeOnes.includes(value.source.toString())  && nodeTwos.includes(value.target.toString()))
				{
					listOfPaths1.push(value);
				}
			}
			else{
				if(edgeOnes.includes(value.Type) && (nodeOnes.includes(value.source.toString())  && nodeTwos.includes(value.target.toString())))
				{
					listOfPaths1.push(value);
				}	
				else if(edgeOnes.includes(value.Type) && (nodeOnes.includes(value.target.toString())  && nodeTwos.includes(value.source.toString())))
				{
					let temp=value.source;
					value.source=value.target;
					value.target=temp;
					listOfPaths1.push(value);
				}
			}				
		});
		listOfPathsFinal=listOfPaths1;
		break;
		case 2:
		//O---O---O
		$.each(globalData.edges,function(index,value){
			if(value.Directional){
				if(edgeOnes.includes(value.Type) && nodeOnes.includes(value.source.toString())  && nodeTwos.includes(value.target.toString()))
				{
					listOfPaths1.push(value);
				}
				if(edgeTwos.includes(value.Type) && nodeTwos.includes(value.source.toString())  && nodeThrees.includes(value.target.toString()))
				{
					listOfPaths2.push(value);
				}
			}				
			else
			{
				if(edgeOnes.includes(value.Type) && (nodeOnes.includes(value.source.toString())  && nodeTwos.includes(value.target.toString())))
				{
					listOfPaths1.push(value);
				}	
				else if(edgeOnes.includes(value.Type) && (nodeOnes.includes(value.target.toString())  && nodeTwos.includes(value.source.toString())))
				{
					let temp=value.source;
					value.source=value.target;
					value.target=temp;
					listOfPaths1.push(value.source+" - "+value.target);
				}
				if(edgeTwos.includes(value.Type) && (nodeTwos.includes(value.source.toString())  && nodeThrees.includes(value.target.toString())))
				{
					listOfPaths2.push(value);
				}	
				else if(edgeTwos.includes(value.Type) && (nodeTwos.includes(value.target.toString())  && nodeThrees.includes(value.source.toString())))
				{
					let temp=value.source;
					value.source=value.target;
					value.target=temp;
					listOfPaths2.push(value);
				}
			}						
		});
		//let temp = listOfPaths2.map(a => a.source);
		$.each(listOfPaths1,function(index1,value1){
			$.each(listOfPaths2,function(index2,value2){
				if(value1.target==value2.source)
				{
					listOfPathsFinal.push(value1.source+" - "+value1.target+" - "+ value2.target);
				}
			});
		});
		break;

		case 3:
		//O---O---O---O
		$.each(globalData.edges,function(index,value){
			if(value.Directional)
			{
				if(edgeOnes.includes(value.Type) && nodeOnes.includes(value.source.toString())  && nodeTwos.includes(value.target.toString()))
				{
					listOfPaths1.push(value);
				}
				if(edgeTwos.includes(value.Type) && nodeTwos.includes(value.source.toString())  && nodeThrees.includes(value.target.toString()))
				{
					listOfPaths2.push(value);
				}
				if(edgeThrees.includes(value.Type) && nodeThrees.includes(value.source.toString())  && nodeFours.includes(value.target.toString()))
				{
					listOfPaths3.push(value);
				}
			}				
			else
			{
				if(edgeOnes.includes(value.Type) && (nodeOnes.includes(value.source.toString())  && nodeTwos.includes(value.target.toString())))
				{
					listOfPaths1.push(value);
				}	
				else if(edgeOnes.includes(value.Type) && (nodeOnes.includes(value.target.toString())  && nodeTwos.includes(value.source.toString())))
				{
					let temp=value.source;
					value.source=value.target;
					value.target=temp;
					listOfPaths1.push(value.source+" - "+value.target);
				}
				if(edgeTwos.includes(value.Type) && (nodeTwos.includes(value.source.toString())  && nodeThrees.includes(value.target.toString())))
				{
					listOfPaths2.push(value);
				}	
				else if(edgeTwos.includes(value.Type) && (nodeTwos.includes(value.target.toString())  && nodeThrees.includes(value.source.toString())))
				{
					let temp=value.source;
					value.source=value.target;
					value.target=temp;
					listOfPaths2.push(value);
				}
				if(edgeThrees.includes(value.Type) && (nodeThrees.includes(value.source.toString())  && nodeFours.includes(value.target.toString())))
				{
					listOfPaths3.push(value);
				}	
				else if(edgeThrees.includes(value.Type) && (nodeThrees.includes(value.target.toString())  && nodeFours.includes(value.source.toString())))
				{
					let temp=value.source;
					value.source=value.target;
					value.target=temp;
					listOfPaths3.push(value);
				}
			}	
		});
		//let temp = listOfPaths2.map(a => a.source);
		$.each(listOfPaths1,function(index1,value1){
			$.each(listOfPaths2,function(index2,value2){
				$.each(listOfPaths3,function(index3,value3){
					if(value1.target==value2.source && value2.target==value3.source)
					{
						listOfPathsFinal.push(value1.source+" - "+value1.target+" - "+ value2.target+" - "+value3.target);
					}
				});	
			});
		});
		break;
		default:
		break;
	}