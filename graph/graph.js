const InitGraph = (() => {
    class Node {
        constructor(vertex) {
            this.vertex = vertex;
            this.next = null;
        }
    }
    class TagEdge {
        constructor (start, end, weight = 0) {
            this.start = start;
            this.end = end;
            this.weight = weight;
        }
    }

    return class InitGraph {
        constructor(vertexCount = 0, isDirected = true) {
            this.vertexCount = vertexCount;
            this.edgeCount = 0;
            this.isVisited = new Array(vertexCount);
            this.isDirected = isDirected;
            this.graph = new Array(vertexCount);

            // initailize the adjoin list
            for (let i = 0; i < vertexCount; i++) {
                this.graph[i] = new Node(i);
                this.isVisited[i] = false;
            }
        }
        resetVisit() {
            for (let i = this.vertexCount; i >= 0; i--) {
                this.isVisited[i] = false;
            }
        }
        destroy() {
            this.vertexCount = 0;
            this.edgeCount = 0;
            this.graph = null;
            this.visitedTag = null;
        }
        isDirected() {
            if (!!this.graph) return this.isDirected;
            return false;
        }
        isEdge(index1, index2) {
            let currentVertex = this.graph[index1],
                compareVertex = this.graph[index2];
            while (!!currentVertex) {
                if (currentVertex.vertex === compareVertex.vertex)
                    return true;
                currentVertex = currentVertex.next;
            }
            return false;
        }
        vertex() {
            return this.vertexCount;
        }
        edge() {
            return this.edgeCount;
        }
        firstAdjoinVertex(vertex) {
            let t = this.graph[vertex].next;
            if (!!t) return this.graph[t.vertex];
            return false;
        }
        nextAdjoinVertex(index1, index2) {
            let currentVertex = this.graph[index1],
                compareVertex = this.graph[index2];
            while (!!currentVertex && !!currentVertex.next) {
                if (currentVertex.vertex === compareVertex.vertex) {
                    return this.graph[currentVertex.next.vertex];
                }
                currentVertex = currentVertex.next;
            }
            return false;
        }
        addEdge(index1, index2) {
            // check if the two vertexs have edge
            if (this.isEdge(index1, index2)) return false;

            let currentVertex = this.graph[index1],
                newVertex = new Node(index2);
            while (currentVertex.next !== null) {
                currentVertex = currentVertex.next;
            }
            currentVertex.next = newVertex;
            this.edgeCount++;

            // if the graph is undirected, then add an edge response to other vertex
            if (this.isDirected === false) {
                let currentVertex = this.graph[index2],
                    newVertex = new Node(index1);
                while (currentVertex.next !== null) {
                    currentVertex = currentVertex.next;
                }
                currentVertex.next = newVertex;
                // this.edgeCount++;
            }
            return this.graph[index1];
        }
        deleteEdge(index1, index2) {
            // if there is no edges beteween vertex1 and vertex2, then 
            if (!this.isEdge(index1, index2) || !this.isEdge(index2, index1))
                return {
                    vertex1: this.graph[index1],
                    vertex2: this.graph[index2]
                };

            for (let currentVertex = this.graph[index1]; !!currentVertex.next;) {
                // if the next vertex of current vertex is the target vertex, 
                // then remove it from vertex1 list
                if (currentVertex.next.vertex === this.graph[index2].vertex) {
                    let vertex2 = currentVertex.next;
                    currentVertex.next = vertex2.next;
                    this.edgeCount--;
                    break;
                }
                currentVertex = currentVertex.next;
            }
            if (this.isDirected === false) {
                for (let currentVertex = this.graph[index2]; !!currentVertex.next;) {
                    if (currentVertex.next.vertex === this.graph[index1].vertex) {
                        let vertex1 = currentVertex.next;
                        currentVertex.next = vertex1.next;
                        break;
                    }
                    currentVertex = currentVertex.next;
                }
            }
            return {
                vertex1: this.graph[index1],
                vertex2: this.graph[index2]
            }
        }
        // depth-first search;
        DFS(visit, index) {
            let vertex = this.graph[index];
            visit(vertex);
            this.isVisited[index] = true;
            for (let currentVertex = vertex.next; !!currentVertex; currentVertex = currentVertex.next) {
                if (this.isVisited[currentVertex.vertex] === false) {
                    this.DFS(visit, currentVertex.vertex);
                }
            }
        }
        // breadth-first search;
        BFS(visit, index) {
            let queue = new Array();
            queue.push(this.graph[index]);
            this.isVisited[index] = true;
            while (queue.length !== 0) {
                let visitedVertex = queue.shift();
                visit(visitedVertex);
                for (let current = visitedVertex.next; !!current; current = current.next) {
                    if (this.isVisited[current.vertex] === false) {
                        let newPush = this.graph[current.vertex];
                        queue.push(newPush);
                        this.isVisited[current.vertex] = true;
                    }
                }
            }
        }

        // the following are some commen and simple algorithms
        topoSort() {
            // if the graph is directed, then we can't use topoSort to this graph,
            //topoSort works only for undirected graph; 
            if (this.isDirected === false) return false; 
            let topoSeq = [],
                queue = [],
                inEdge = new Array(this.vertexCount);
            for (let i = 0; i < this.vertexCount ; i++) {
                inEdge[i] = 0;
            }
            for (let v = 0; v < this.vertexCount; v++) {
                for (let current = this.firstAdjoinVertex(v); !!current; current = this.nextAdjoinVertex(v, current.vertex)) {
                    inEdge[current.vertex]++;
                }
            }
            for (let v = 0; v < this.vertexCount; v++) {
                if (inEdge[v] === 0) queue.push(v);
            }
            while (queue.length !== 0) {
                let outVertex = queue.shift();
                topoSeq.push(outVertex);
                for (let current = this.firstAdjoinVertex(outVertex); !!current; current = this.nextAdjoinVertex(outVertex, current.vertex)) {
                    inEdge[current.vertex]--;
                    if (inEdge[current.vertex] === 0) {
                        queue.push(current.vertex);
                    }
                }
            }
            return topoSeq;
        } 
    }
})();

var test = new InitGraph(9);
test.addEdge(0, 7);
test.addEdge(0, 2);
test.addEdge(7, 8);
test.addEdge(8, 6);
test.addEdge(2, 3);
test.addEdge(3, 6);
test.addEdge(1, 2);
test.addEdge(1, 3);
test.addEdge(3, 5);
test.addEdge(1, 4);
test.addEdge(4, 5);

console.log(test.topoSort());