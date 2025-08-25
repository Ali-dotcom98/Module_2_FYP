import React from 'react'
import Input from '../../../Components/Inputs/Input';
import ShortAnswers from './QuestionComponents/ShortAnswers';
import TrueFalse from './QuestionComponents/TrueFalse';
import MultipleChoice from './QuestionComponents/MultipleChoice ';
import Paragraph from './QuestionComponents/Paragraph';

const AssignmentBodyForm = ({questions , addQuestion , removeQuestion , updateQuestion}) => {
    console.log("questions",questions);
    
    const RenderTypeOfComponents = (type , item , index)=>{
        switch (type) {
            case "short_answer":
                return (
                    <ShortAnswers
                        item={item}
                        index={index}
                        removeQuestion={removeQuestion}
                    />
                );
            case "true_false":
                return(
                    <TrueFalse item={item}
                        index={index}
                        removeQuestion={removeQuestion}
                    />
                    
                )
            case "mcq":
                return(
                    <MultipleChoice item={item}
                        index={index}
                        removeQuestion={removeQuestion}
                    />
                    
                )
             case "code":
                return(
                    <Paragraph item={item}
                        index={index}
                        removeQuestion={removeQuestion}
                    />
                    
                )
        
        
            default:
                break;
        }
    }

  return (
    <div className='px-5 py-3'>
        <div>AssignmentBodyForm</div>
        {
            questions.map((item , index)=>(
                RenderTypeOfComponents(item.type , item ,index)
            ))
        }
    </div>
  )
}

export default AssignmentBodyForm