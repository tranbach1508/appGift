import React from 'react';
import { Page } from '@shopify/polaris';

const GoalTypes = () => {
    return (
        <Page>
            <div className='goal-types'>
                <div className='goal-type'>
                    <img className='thumb' src={window.App.appUrl + "/images/free-gift.png"}/>
                    <div>Free Gift Goals</div>
                </div>
                <div className='goal-type'>
                    <img className='thumb' src={window.App.appUrl + "/images/free-shipping.png"}/>
                    <div>Free Shipping Goals</div>
                </div>
                <div className='goal-type'>
                    <img className='thumb' src={window.App.appUrl + "/images/discount.png"}/>
                    <div>Discount Code Goals</div>
                </div>
            </div>
        </Page>
    );
};

export default GoalTypes;