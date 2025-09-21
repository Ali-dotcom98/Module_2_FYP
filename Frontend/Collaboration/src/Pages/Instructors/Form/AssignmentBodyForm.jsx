import React from 'react'
import Input from '../../../Components/Inputs/Input';
import ShortAnswers from './QuestionComponents/ShortAnswers';
import TrueFalse from './QuestionComponents/TrueFalse';
import MultipleChoice from './QuestionComponents/MultipleChoice ';
import Paragraph from './QuestionComponents/Paragraph';

const AssignmentBodyForm = ({questions , addQuestion , removeQuestion ,UpdateItemInArray, AddItemInNestedArray, UpdateItemInNestedArray}) => {
    console.log("questions",questions);
    
    const RenderTypeOfComponents = (type , item , index)=>{
        switch (type) {
            case "short_answer":
                return (
                    <ShortAnswers
                        item={item}
                        index={index}
                        removeQuestion={removeQuestion}
                        UpdateItemInArray={UpdateItemInArray}
                    />
                );
            case "true_false":
                return(
                    <TrueFalse item={item}
                        index={index}
                        removeQuestion={removeQuestion}
                        UpdateItemInArray={UpdateItemInArray}
                    />
                    
                )
            case "mcq":
                return(
                    <MultipleChoice item={item}
                        index={index}
                        removeQuestion={removeQuestion}
                        UpdateItemInArray={UpdateItemInArray}
                        AddItemInNestedArray= {AddItemInNestedArray}
                        UpdateItemInNestedArray={UpdateItemInNestedArray}
                    />
                    
                )
             case "code":
                return(
                    <Paragraph item={item}
                        index={index}
                        removeQuestion={removeQuestion}
                        UpdateItemInArray={UpdateItemInArray}
                    />
                    
                )
        
        
            default:
                break;
        }
    }

  return (
    <div className='px-5 pt-5 min-h-[32vw] space-y-5'>
        <div className='text-lg  font-semibold text-gray-900'>Assignment Body </div>
        {
            questions.map((item , index)=>(
                RenderTypeOfComponents(item.type , item ,index)
            ))
        }
    </div>
  )
}

export default AssignmentBodyForm