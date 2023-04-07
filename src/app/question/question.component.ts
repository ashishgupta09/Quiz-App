import { Component,OnInit } from '@angular/core';
import { QuestionService } from '../Service/question.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit{
  
  public name: String=""
  public questionList:any=[];
  public currentQuestion:number=0;
  public points:number=0;
  counter=60;
  correctAnswer:number=0;
  incorrectAnswer:number=0;
  interval$:any;
  progress:string="0";
  isQuiz:boolean=false;

 constructor(private questionService:QuestionService){}

  ngOnInit(): void {
    this.name=localStorage.getItem('name')!;
    this.getAllQuestions();
    this.startCounter();
  }

  getAllQuestions(){
    this.questionService.getQuestionjson().subscribe(res=>{
      this.questionList=res.questions;
    })
  }

  nextQuestion(){
   this.currentQuestion++;
  }
  
  prevQuestion(){
   this.currentQuestion--;
  }

  answer(currentQno:number,ops:any){

    if(currentQno==this.questionList.length){
     this.isQuiz=true;
     this.stopCounter();
    }

   if(ops.correct){
    this.points+=10;
    this.correctAnswer++;
    setTimeout(()=>{
      this.currentQuestion++;
      this.resetCounter();
      this.getProgressPercent();
    },1000);
   
   }
    else{
    setTimeout(()=>{
    this.currentQuestion++;
    this.incorrectAnswer++;
    this.resetCounter();
    this.getProgressPercent();
    } ,1000);
    this.points-=10;
   }
  }

  startCounter(){
  this.interval$=interval(1000).subscribe(val=>{
  this.counter--;
  if(this.counter==0){
    this.currentQuestion++;
    this.counter=60;
    this.points-=10;
  }
  });
  setTimeout(()=>{
    this.interval$.unsubscribe()
  },600000);
  }

  stopCounter(){
    this.interval$.unsubscribe();
    this.counter=0;
  }

  resetCounter(){
    this.stopCounter();
    this.counter=60;
    this.startCounter();
  }

  resetQuiz(){
    this.resetCounter();
    this.getAllQuestions();
    this.points=0;
    this.counter=60;
    this.currentQuestion=0;
    this.progress='0';
  }
 
  getProgressPercent(){
    this.progress=((this.currentQuestion/this.questionList.length)*100).toString();
    return this.progress;
  }


}
