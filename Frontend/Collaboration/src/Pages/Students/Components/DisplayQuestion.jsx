import React from 'react'
import ShortAnswers from '../../Instructors/Form/QuestionComponents/ShortAnswers';
import TrueFalse from '../../Instructors/Form/QuestionComponents/TrueFalse';
import MultipleChoice from '../../Instructors/Form/QuestionComponents/MultipleChoice ';
import Paragraph from '../../Instructors/Form/QuestionComponents/Paragraph';

const DisplayQuestion = ({item , index ,updateArrayItemInstructor, updateArrayItem , WhoIsAnswering , DisplayAnswer , DisableQuestionbyIndex , HandleSave}) => {
    console.log("item",item);
    
    const RenderTypeOfComponents = (type , item , index)=>{
        switch (type) {
            case "short_answer":
                return (
                    <ShortAnswers
                    
                        item={item}
                        index={index}
                        type ={"Students"}
                        updateArrayItem ={updateArrayItem}
                        updateArrayItemInstructor={updateArrayItemInstructor}
                        DisplayAnswer = {DisplayAnswer}
                        WhoIsAnswering = {WhoIsAnswering}
                        DisableQuestionbyIndex = {DisableQuestionbyIndex}
                        HandleSave = {HandleSave}

                    />
                );
            case "true_false":
                return(
                    <TrueFalse
                        item={item}
                        index={index}
                        type ={"Students"}
                        updateArrayItem ={updateArrayItem}
                        updateArrayItemInstructor={updateArrayItemInstructor}
                        DisplayAnswer = {DisplayAnswer}
                        WhoIsAnswering = {WhoIsAnswering}
                        DisableQuestionbyIndex = {DisableQuestionbyIndex}
                        HandleSave = {HandleSave}
                    />
                    
                )
            case "mcq":
                return(
                    <MultipleChoice 
                        item={item}
                        index={index}
                        type ={"Students"}
                        updateArrayItem ={updateArrayItem}
                        updateArrayItemInstructor={updateArrayItemInstructor}
                        DisplayAnswer = {DisplayAnswer}
                        WhoIsAnswering = {WhoIsAnswering}
                        DisableQuestionbyIndex = {DisableQuestionbyIndex}
                        HandleSave = {HandleSave}
                    />
                    
                )
             case "code":
                return(
                    <Paragraph item={item}
                        index={index}

                    />
                    
                )
        
        
            default:
                break;
        }
    }
  return (
    <div className='text-black '>
         {
             RenderTypeOfComponents(item.type , item ,index)
         }
    </div>
  )
}

export default DisplayQuestion