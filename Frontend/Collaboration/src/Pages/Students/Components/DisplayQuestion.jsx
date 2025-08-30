import React from 'react'
import ShortAnswers from '../../Instructors/Form/QuestionComponents/ShortAnswers';
import TrueFalse from '../../Instructors/Form/QuestionComponents/TrueFalse';
import MultipleChoice from '../../Instructors/Form/QuestionComponents/MultipleChoice ';
import Paragraph from '../../Instructors/Form/QuestionComponents/Paragraph';

const DisplayQuestion = ({item , index}) => {

    const RenderTypeOfComponents = (type , item , index)=>{
        switch (type) {
            case "short_answer":
                return (
                    <ShortAnswers
                        item={item}
                        index={index}
                    />
                );
            case "true_false":
                return(
                    <TrueFalse item={item}
                        index={index}
                    />
                    
                )
            case "mcq":
                return(
                    <MultipleChoice item={item}
                        index={index}
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
    <div className='text-black'>
         {
             RenderTypeOfComponents(item.type , item ,index)
         }
    </div>
  )
}

export default DisplayQuestion