import React from 'react';
import ReactDom from'react-dom';
import './style.scss';

function Point(x, y) {
    this.x = x;
    this.y = y;
    
    this.mult = (value) => {
        this.x = this.x * value;
        this.y = this.y * value;
    }
    this.add = (value) => {
        this.x = this.x + value;
        this.y = this.y + value;
    }
}

Array.prototype.intercalate = function (f,s,cant){
    for(let i = 0; i < cant; i++){
        let temp = this[i + f] ;
        this[i + f] = this[i + s];
        this[s + i] = temp;
    }
}

Array.prototype.reverseBlock = function (f,cant){
    const block = this.splice(f,cant*4);
    const temp = [];
    temp.unshift(...block.splice(0,cant));
    temp.unshift(...block.splice(0,cant));
    temp.unshift(...block.splice(0,cant));
    temp.unshift(...block.splice(0,cant));
    this.splice(f,0,...temp)
}




function App(){
    const canvasRef = React.useRef(null);
    const inputRef = React.useRef(null);
    const [canvas,setCanvas] = React.useState(null);
    const [order,setOrder] = React.useState(0);
    React.useLayoutEffect(()=>{
        setCanvas(canvasRef);
    });

    const directions = {
        R: {
            points: [[0, 0], [1, 0], [1, 1], [0, 1]],
            rotateRigth: "D",
            rotateLeft: "U"
        },
        L: {
            points: [[1, 1], [0, 1], [0, 0], [1, 0]],
            rotateRigth: "U",
            rotateLeft: "D"
        },
        D: {
            points: [[0, 0], [0, 1], [1, 1], [1, 0]],
            rotateRigth: "R",
            rotateLeft: "L"
        },
        U: {
            points: [[1, 1], [1, 0], [0, 0], [0, 1]],
            rotateRigth: "L",
            rotateLeft: "R"
        },
    }

    function rotate(arr, dir,order){
        let rotated = [];
        let tempArray = [...arr];
        switch(dir){
            case 'R': {
                for(let i = 0; i < order; i++){         
                    let el = Math.pow(4,i);
                    for(let j = 0; j < tempArray.length; j = j + el * 4){
                            tempArray.intercalate(j,j + el * 3,el);
                    }  
                }


                tempArray.forEach((el) => {
                    rotated.push(directions[el].rotateRigth);
                })
                break; 
            }

            case 'L': {
                const cant = tempArray.length;
                for(let i = 0; i < order; i++){         
                    let el = Math.pow(4,i);
                    for(let j = 0; j < cant; j = j + el * 4){
                            tempArray.reverseBlock(j,el);
                    }  
                }

                tempArray.forEach((el) => {
                rotated.push(directions[el].rotateLeft);
                });
                break;
            }
        }
        return rotated;

    }

    function makeLeters(order, first){
        let arr = [first];
        for(let i = 1; i <= order; i++){
            const temp = arr;
            arr = [];
            switch(first){
                case 'R': {

                }
                case 'L': {

                }
                case 'U': {

                }
                case 'D': {
                    arr = [...rotate(temp, 'R',i - 1)]
                    arr = [...arr, ...temp]
                    arr = [...arr, ...temp]
                    arr = [...arr, ...rotate(temp, 'L',i - 1)]
                }    

            }
        }
        return arr;
    }
    
    function makePoint(arr,size,dx,dy){
        let arrayPoint = [];
        if(order === 0) {
            directions[arr[0]].points.forEach(
                                        el=>arrayPoint.push(
                                                new Point(dx + el[0] * size, dy + el[1] * size)
                                                )
                                    )
            return arrayPoint; 
            
        }
        
        const lengthBin = (arr.length - 1).toString(2).length;
        console.log(arr);
        for(let i = 0; i < arr.length; i++){
            
            let newSize = size;
            const number = i.toString(2).padStart(lengthBin,"0");
            let x = 0;
            let y = 0;
            let count = 0;
            let block = arr.length;

            for(let j = order; j > 0; j--){
                let comb = number.substr(count,2);
                newSize = newSize * 0.5;
                count = count + 2;
                let actualBlock = parseInt(i/block);
                let indexLeter = actualBlock * block;
              console.log(indexLeter);
                const letter = 'D';
                switch(comb){
                    case '00':{
                        x+= newSize * directions[letter].points[0][0];
                        y+= newSize  * directions[letter].points[0][1];
                        break;
                    }
                    case'01':{
                        x+= newSize * directions[letter].points[1][0];
                        y+= newSize  * directions[letter].points[1][1];
                        break;
                    }
                    case '10':{
                        x+= newSize * directions[letter].points[2][0];
                        y+= newSize  * directions[letter].points[2][1];
                        break;
                    }
                    case '11':{
                        x+= newSize * directions[letter].points[3][0];
                        y+= newSize  * directions[letter].points[3][1];
                        break;
                    }
                }
            }
            directions[arr[i]].points.forEach(
                                    p=> {
                                            arrayPoint.push(new Point(dx + x + p[0] * newSize * 0.7, dy + y + p[1] * newSize * 0.7))
                                        }
                                )
        }

        return arrayPoint; 
    }

    function definitive(size,dx,dy,first){
        const arr = [];
        if(!order){
            directions[first].points.forEach(p => arr.push(new Point(dx + p[0] *size,dy + p[1] * size))); 
            return arr;
        }
        const q = Math.pow(4,order);
        const lengthBin = (q - 1).toString(2).length;
        for(let i = 0; i < q; i++){
            let letter = first;
            let x = dx;
            let y = dy;
            let newSize = size * 0.5;
            const number = i.toString(2).padStart(lengthBin,"0");
            while(number.length !== 0){   
                switch(number.slice(0, 2)){
                    case '00':{
                        x += newSize * directions[letter].points[0][0];
                        y += newSize * directions[letter].points[0][1];
                        letter = directions[letter].rotateRigth;
                        break;
                    }
                    case '01':{
                        x += newSize * directions[letter].points[1][0];
                        y += newSize * directions[letter].points[1][1];
                        break;
                    }
                    case '10':{
                        x += newSize * directions[letter].points[2][0];
                        y += newSize * directions[letter].points[2][1];
                        break;
                    }
                    case '11':{
                        x += newSize * directions[letter].points[3][0];
                        y += newSize * directions[letter].points[3][1];
                        letter = directions[letter].rotateLeft;
                        break;
                    }
                }
                newSize = newSize * 0.5;
                number = number.slice(2, number.length); 
            }
            directions[letter].points.forEach(
                p => {
                                arr.push(new Point(x + p[0] * newSize *1.5, y + p[1] * newSize*1.5))
                            }
                                
                            ); 
        }
        return arr;
    }

    if(canvas){
        var ctx = canvas.current.getContext("2d");
        const arrPoint = definitive(1002,10,10,'D');
        ctx.lineWidth = 2;
        const inc = 360/Math.pow(4,order + 1);
        ctx.clearRect(0, 0, 1024, 1024);
        for (let i = 0; i < (arrPoint.length - 1); i++) {
            ctx.strokeStyle = `hsl(${0 + inc * i},100%,50%)`;
            ctx.beginPath();
            ctx.moveTo(arrPoint[i].x, arrPoint[i].y);
            ctx.lineTo(arrPoint[i + 1].x, arrPoint[i + 1].y);
            ctx.stroke();
        }

    }


    return(
        <div
            id="container"
        >
            <input
                ref={inputRef}
            />
            <button
                onClick={
                    () => {
                    setOrder(Number(inputRef.current.value));
                    }
                }
            >Cambiar orden
            </button>
            <canvas
                width="1024"
                height="1024"
                ref={canvasRef}
            />
        </div>
    
    );
}

ReactDom.render(<App/>, document.getElementById("app"));