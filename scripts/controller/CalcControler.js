class CalcController{

    constructor(){

        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastValue = '';
        this._operator = [];
        this.locale = 'pt-br';
        this._displayCalcElement = document.querySelector('#display');
        this._dateElement =  document.querySelector('#data');
        this._timeElement =  document.querySelector('#hora');
        this._currentDate;
        this.initButtonsEvents();
        this.initKeyBoard();
        this.initialize();
    }

    copyToClipboard(){

        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();
    }

    pasteFromClipboard(){

        document.addEventListener('paste', e =>{
           let text =  e.clipboardData.getData('Text');
           this.displayCalc = parseFloat(text);
        });
    }

    //Setup a initial display
    initialize(){

        this.setDisplayDateTime();

        setInterval(() =>{
            this.setDisplayDateTime();
        }, 1000);

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn =>{

            btn.addEventListener('dblclick', e =>{

                this.toggleAudio();
            });
        });
    }


    toggleAudio(){

        this._audioOnOff = !this._audioOnOff;
    }

    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }


    //Setup multiple events 
    addEventListenerAll(btnElement, events, fn){

        events.split(' ').forEach(event =>{

            btnElement.addEventListener(event, fn, false);
        });

    }

    //Clear Dispaly number
    clearAll(){
        this._operator = [];
        this._lastValue = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }

    //Clear last Entry of display
    clearEntry(){
        this._operator.pop();
        this.setLastNumberToDisplay();
    }

    // Get the last item of array
    getLastOperation(){
          return this._operator[this._operator.length -1];
    }


    //Change current operation if user change the operation
    setLastOperation(value){
        this._operator[this._operator.length -1] = value;
    }


    //Verify if the value is a kind of operation
    isOperator(value){

      return (['+', '-', '*', '/', '%'].indexOf(value) > -1);
          
    }

    //insert operation and call the method to calc
    pushOperator(value){
        this._operator.push(value);

        if(this._operator.length > 3){

            this.calc();
        }
    }


    getResults(){

        try{
            return eval(this._operator.join(""));
        }catch(error){
            setTimeout(() =>{
                this.setError();
            }, 1);
            
        }
        
    }


    // Method that execute the calcs
    calc(){

        let lastItem = '';
        this._lastOperator = this.getLastItem();

        if(this._operator.length < 3){
            
            let firstItem = this._operator[0];
            this._operator = [firstItem, this._lastOperator, this._lastValue];
        }


        if(this._operator.length > 3){
            lastItem = this._operator.pop();

            
            this._lastValue = this.getResults();

        }else if(this._operator.length == 3){
            
            this._lastValue = this.getLastItem(false);
        }
       
        let result = this.getResults();

        if(lastItem == '%'){

            result /= 100;
            this._operator = [result];

        }else{
            
            this._operator = [result];

            if(lastItem) this._operator.push(lastItem);
        }
        
        this.setLastNumberToDisplay();
    }


    getLastItem(isOperator = true){

        let lastItem;

        for(let i = this._operator.length-1; i >= 0; i--){

            if(this.isOperator(this._operator[i]) == isOperator){
                lastItem = this._operator[i];
                break;
            }
        }

        if(!lastItem){
            lastItem = (isOperator) ? this._lastOperator : this._lastValue;
        }
       

            return lastItem;

    }


    //Update display number;
    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);

        if(!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }


    //Set a operation
    addOperation(value){
        
        if(isNaN(this.getLastOperation())){
            if(this.isOperator(value)){
             
               this.setLastOperation(value);
            }else{

                this.pushOperator(value);
                this.setLastNumberToDisplay();
            }

        }else{

            if(this.isOperator(value)){
                this.pushOperator(value);
            }else{
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                this.setLastNumberToDisplay();
            }
        }

    }

    addDot(){

        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.')> -1) return;

        if(this.isOperator(lastOperation) || !lastOperation){
            this.pushOperator('0.');
        }else{
            this.setLastOperation(lastOperation.toString() + '.'); 
        }

        this.setLastNumberToDisplay();

        // console.log(lastOperation);
    }

    //Set error on Display
    setError(){
        this.displayCalc = 'Error';
    }


//Buttons actions
    execBtn(value){

        this.playAudio();

        switch(value){

            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                this.calc();
                break;
            case 'ponto':
                this.addDot();
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;
            
        }
    }

    initKeyBoard(){

        document.addEventListener('keyup', e =>{

            this.playAudio();
            
            switch(e.key){

                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                    break;

                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case '.':
                case ',':
                    this.addDot();
                    break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;  
                
                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
                    break;
            }
        });
    }




    //Setup button click event
    initButtonsEvents(){

        let buttons = document.querySelectorAll('#buttons > g, #parts > g');

        buttons.forEach((btn, index) =>{
            this.addEventListenerAll(btn, "click drag", e =>{
                let btnText = btn.className.baseVal.replace("btn-", "");

                this.execBtn(btnText);
            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e =>{
                btn.style.cursor = "pointer";
            });
        });
    }


    // Setup a inital DateTime from initial display
    setDisplayDateTime(){
        this.displayDate = this.currentData.toLocaleDateString(this.locale, {
            day: '2-digit',
            month: 'short',
            year:'numeric'
        });
        this.displayTime = this.currentData.toLocaleTimeString(this.locale);
    }


//Getters and Setters
    get displayDate(){
        return this.dateElement.innerHTML;
    }

    set displayDate(date){
        this._dateElement.innerHTML = date;
    }

    get displayTime(){
        return this._timeElement.innerHTML;
    }

    set displayTime(time){
        this._timeElement.innerHTML = time;
    }

    get displayCalc(){
        return this._displayCalcElement.innerHTML;
    }

    set displayCalc(value){

        if(value.toString().length > 10){
            this.setError();
            return false;
        }
        this._displayCalcElement.innerHTML = value;
    }

    get currentData(){
        return new Date();
    }

    set currentData(date){
        this._currentDate = date;
    }


}