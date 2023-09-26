import React, { useCallback, useState, useEffect } from 'react';
import { Layout, LegacyCard, RangeSlider, SkeletonBodyText, Thumbnail, SkeletonThumbnail, Text } from '@shopify/polaris';

const PreviewGoal = (props) => {
    const [rangeValue, setRangeValue] = useState(0);
    useEffect(() => {
        setRangeValue(0)
    }, [props.goal.target_type])
    const handleRangeSliderChange = useCallback(
        (value) => setRangeValue(value),
        [],
    );
    const ProgressBar = () => {
        let message = '';
        let unit = props.goal.target_type == "subtotal" ? "$" : " items"
        if (props.goal && props.goal.message && props.goal.message.not_reached && props.goal.message.reached) {
            if (rangeValue < props.goal.target) {
                message = props.goal.message.not_reached.replace('{{remaining}}', (props.goal.target - rangeValue) + unit);
            } else {
                message = props.goal.message.reached.replace('{{remaining}}', (props.goal.target - rangeValue) + unit);
            }
        }
        return (
            <div className='preview-progress-bar'>
                <div className='preview-progress-bar__message'
                    dangerouslySetInnerHTML={{
                        __html: message
                    }}>
                </div>
                <div className='preview-progress-bar__bar'>
                    <span className='preview-progress-bar__bar-bg'></span>
                    <span className='preview-progress-bar__bar-track-active' style={{ width: rangeValue / props.goal.target * 100 > 100 ? '100%' : rangeValue / props.goal.target * 100 + '%' }}></span>
                </div>
            </div>
        )
    }
    return (
        <Layout.Section oneHalf title="Preview Goal In Progress Bar:">
            <LegacyCard sectioned>
                <ProgressBar></ProgressBar>
                <div className='cart-items'>
                    {props.goal.gift === null ? (
                        <LegacyCard sectioned>
                            <div className='flex cart-item'>
                                <div className='cart-item__thumbnail'>
                                    <SkeletonThumbnail size="small" />
                                </div>
                                <div className='cart-item__info'>
                                    <SkeletonBodyText lines="2" />
                                </div>
                            </div>
                        </LegacyCard>
                    ) : (
                        props.goal.type === "free_gift" && props.goal.gift !== null ? (
                            <LegacyCard sectioned>
                                <div className='flex cart-item'>
                                    <div className='cart-item__thumbnail'>
                                        <Thumbnail
                                            size="small"
                                            source={props.goal.gift.product_image}
                                            alt={props.goal.gift.product_title}
                                        />
                                    </div>
                                    <div className='cart-item__info'>
                                        <Text variant="headingMd" as="h6">
                                            {props.goal.gift.product_title}
                                        </Text>
                                    </div>
                                </div>
                            </LegacyCard>
                        ) : null
                    )}
                </div>
            </LegacyCard>
            <LegacyCard sectioned title="Cart Value">
                {props.goal.target_type == "subtotal" ?
                    <RangeSlider
                        label={<div>Change The Subtotal: <strong>{rangeValue}$</strong></div>}
                        value={rangeValue}
                        min={0}
                        max={props.goal.target * 10}
                        onChange={handleRangeSliderChange}
                        output
                        prefix={<p>0$</p>}
                        suffix={
                            <p
                                style={{
                                    minWidth: '24px',
                                    textAlign: 'right',
                                }}
                            >
                                {props.goal.target * 10}$
                            </p>
                        }
                    />
                    :
                    <RangeSlider
                        label={<div>Change The Items Count: <strong>{rangeValue} items</strong></div>}
                        min={0}
                        max={100}
                        value={rangeValue}
                        onChange={handleRangeSliderChange}
                        output
                        prefix={<p>0 items</p>}
                        suffix={
                            <p
                                style={{
                                    minWidth: '24px',
                                    textAlign: 'right',
                                }}
                            >
                                100 items
                            </p>
                        }
                    />}
            </LegacyCard>
        </Layout.Section>
    );
};

export default PreviewGoal;