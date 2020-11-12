function listEmployees () {
    this.list = [];
    this.addEmployees = function (value){
        this.list.push(value);
    }
    this.deleteEmployees = function (values){
        // value 0 --- 1
        values.forEach(value=>{
            this.list.forEach((item,index)=>{
                
            })
        })
    }
    this.editEmployees = function () {}
    this.seatchEmployees = function () {}
} 