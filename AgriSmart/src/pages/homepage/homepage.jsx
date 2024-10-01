import './homepage.scss';
import React,{useState,useEffect,useRef} from 'react';
import homepageBG from '../../images/homepageBG.jpg';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import DiseaseDetection from '../../components/modelComponents/diseaseDetection/diseaseDetection';
import FertilizerRequired from '../../components/modelComponents/fertilizerRequired/fertilizerRequired';
import YieldDetection from '../../components/modelComponents/yieldDetection/yieldDetection';
import ResponsiveAppBar from '../../components/navbar/navbar';

import { Button, ButtonGroup } from '@mui/material';
import { FormControl, useFormControlContext } from '@mui/base/FormControl';
import { Input, inputClasses } from '@mui/base/Input';
import { styled } from '@mui/system';
import ModelForm from '../../components/modelForm/modelForm';


export default function Homepage() {

    const icons = [
        {
            icon: GraphicEqIcon,
            title: 'Disease Detection',
            text: 'Refers to the process of identifying diseases in plants, animals, or humans through various diagnostic methods.',
            requirements: 'Image of the soil'
        },
        {
            icon: GraphicEqIcon,
            title:'Fertilizer Required',
            text: 'Refers to the amount and type of fertilizer needed to optimize the growth and yield of crops.',
            requirements: 'Grant access for location\nInput the Crop which you want to grow'
        },
        {
            icon: GraphicEqIcon,
            title: 'Yield % Value Metrics',
            text: 'A crucial performance indicator used across various industries to measure the efficiency and profitability of processes or investments.',
            requirements:'Input the state\nGive your current District\nInput the Crop which you want to grow\nInput the Area (Hectares) of the land'
        }
    ];

    const [currTab,setCurrTab] = useState({
            icon:  null,
            title: null,
            text: null,
            requirements:null
    });

    const [showDetail,setShowDetail] = useState(true);

    useEffect(() => {
        console.log(currTab);
    }, [currTab]);



  return (
    <>
        <ResponsiveAppBar/>
        <div className="problem-container">
            <h1 className="title">How can we assist?</h1>
            <p className="subtitle">We are here to help you with your problems. Here are our solutions:</p>
        </div>

        <div className="solution-container">
                <div className="row">  

                    {icons.map((icon, index) => (

                    <div className="col" 
                        onClick={
                            ()=>{
                                setShowDetail(false);
                                setCurrTab(icon);
                                console.log(icon);
                            }
                        }
                        style={
                            { 
                                height: showDetail ? '16vw' : 'auto', 
                                backgroundColor: currTab.title==icon.title ? 'rgba(0,0,0,1)' : 'rgba(255, 255, 255, 1)',
                                color: currTab.title===icon.title ? 'rgba(255,255,255,1)' : 'rgba(0, 0, 0, 1)', 
                            }
                            }    
                    >
                        
                        <div className="icon">
                            <GraphicEqIcon fontSize='large'/>
                        </div>
                        
                        <h2>{icon.title}</h2>
                        {showDetail && (<p className='text'>{icon.text}</p>)}
                    </div>

                    ))}
                </div>
            
                {currTab.title!=null &&
                (<div className="details">
                    <ModelForm currTab={currTab}/>
                    <div className="formSol">
                        {currTab.title === 'Disease Detection' && <DiseaseDetection />}
                        {currTab.title === 'Fertilizer Required' && <FertilizerRequired />}
                        {currTab.title === 'Yield % Value Metrics' && <YieldDetection />}
                    </div>
                </div>)
                }

            </div>

        <div className="background-image">
            <img src={homepageBG} alt="background" />
        </div>
        

        
    </>
    
  );
}