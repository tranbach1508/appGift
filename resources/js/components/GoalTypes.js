import React,{useState} from 'react';
import { Page,TextField } from '@shopify/polaris';
import callapi from './CallApi';

const GoalTypes = () => {
    const [value,setValue] = useState("");
    const submit = () =>{
        fetch(value+'.json').then(res => res.json()).then((response) => {
            callapi(window.App.appUrl + '/api/test', {
                product: response.product
            })
            .then((data) => {
                
            })
        })
    }
    return (
        <Page>
            <TextField
            label="Store name"
            value={value}
            onChange={(value) => setValue(value)}
            autoComplete="off"
            />
            <button onClick={submit}>click</button>
        </Page>
    );
};

export default GoalTypes;