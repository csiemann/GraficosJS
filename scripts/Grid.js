var Grid = function(parent, rows, columns){
    this.parent = parent;
    this.rows = rows;
    this.columns = columns;
    this.init();
}
window['Grid'] = Grid;

Grid.prototype.init = function() {
    this.grid = document.createElement("div");
    this.grid.classList.add("grid");
    for(var i = 0; i < this.rows ; i++){
        var row = document.createElement("div");
        row.classList.add("row");
        row.id = "row-"+i;
        for(var j = 0; j < this.columns ; j++){
            var column = document.createElement("div");
            column.classList.add("column");
            column.id = "column-"+j;
            var cell = document.createElement("div");
            cell.classList.add("cell");
            cell.id = "cell-"+i+"-"+j;
            row.appendChild(column);
            column.appendChild(cell);
        }
        this.grid.appendChild(row)
    }
    this.parent.appendChild(this.grid);
}

Grid.prototype.addElement = function(element, row, column) {
    var cell = document.getElementById("cell-"+row+"-"+column)
    cell.appendChild(element);
}