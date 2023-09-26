import { Button, ButtonGroup, Icon, Layout, LegacyCard, Page, Popover, RadioButton, RangeSlider, Select, Thumbnail, Toast, Tooltip } from '@shopify/polaris';
import { QuestionMarkMinor } from '@shopify/polaris-icons';
import React, { useState, useCallback, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import callapi from './CallApi';
import { replace } from 'lodash';

const ProgressBar = () => {
    const [rangePrice, setRangePrice] = useState(10);
    const [rangeTextSize, setRangeTextSize] = useState(15);
    const [colorBar, setColorBar] = useState('#4A90E2');
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [separatorColor, setSeparatorColor] = useState('#0707F4');
    const [textColor, setTextColor] = useState('#000000');
    const [checked, setChecked] = useState("1");
    const [selected, setSelected] = useState('None');
    const [showUnsavedBar, setShowUnsavedBar] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [loadingSaveBtn, setLoadingSaveBtn] = useState(false);
    const [toast, setToast] = useState({
        message: '',
        active: false,
        error: false
    });
    const [goals, setGoals] = useState([]);
    const handleSelectChange = useCallback((value) => {
        setSelected(value);
        handleInputChange();
    }, []
    );
    const options = [
        { label: 'None', value: 'None' },
        { label: 'Bold', value: 'Bold' },
        { label: 'Italic', value: 'Italic' },
        { label: 'Underline', value: 'Underline' }
    ];

    const handleRangeSliderChange = useCallback((value) => {
        setRangePrice(value);
    }, []);

    const handleRangeTextSize = useCallback((value) => {
        setRangeTextSize(value);
        handleInputChange();
    }, []);

    const handleColorChange = useCallback((color) => {
        setColorBar(color.hex);
        handleInputChange();
    }, []);
    const [colorBarActive, setColorBarActive] = useState(false);
    const togglePopoverActive = useCallback(() => {
        setColorBarActive((colorBarActive) => !colorBarActive);
    }, []);

    const activatorColorBar = (
        <button className='button-color' onClick={togglePopoverActive} style={{ backgroundColor: colorBar }}></button>
    );
    const handleBackgroundColor = useCallback((color) => {
        setBackgroundColor(color.hex);
        handleInputChange();
    }, []);
    const [BackgroundColorActive, setBackgroundColorActive] = useState(false);
    const toggleBackgroundColor = useCallback(() => {
        setBackgroundColorActive((BackgroundColorActive) => !BackgroundColorActive);
    }, []);
    const activatorBackgroundColor = (
        <button className='button-color' onClick={toggleBackgroundColor} style={{ backgroundColor: backgroundColor }}></button>
    );
    const handleSeparatorColor = useCallback((color) => {
        setSeparatorColor(color.hex);
        handleInputChange();
    });
    const [separatorColorActive, setSeparatorColorActive] = useState(false);
    const toggleSeparator = useCallback(() => {
        setSeparatorColorActive((separatorColorActive) => !separatorColorActive);
    }, []);

    const activatorSeparatorColor = (
        <button className='button-color' onClick={toggleSeparator} style={{ backgroundColor: separatorColor }}></button>
    );
    const handleTextColor = useCallback((color) => {
        setTextColor(color.hex);
        handleInputChange();
    }, []);
    const [textColorActive, setTextColorActive] = useState(false);
    const toggleTextColorActicve = useCallback(() => {
        setTextColorActive((textColorActive) => !textColorActive)
    }, []);
    const activatorTextColor = (
        <button className='button-color' onClick={toggleTextColorActicve} style={{ backgroundColor: textColor }}></button>
    );
    const handleChange = useCallback((_, newValue) => {
        setChecked(newValue);
        handleInputChange()
    }, []);
    const fetchData = useCallback(() => {
        callapi(window.App.appUrl + '/api/progressBar')
            .then((response) => {
                const data = response.data;
                const color = data.color;
                const style = data.style;
                const goals = data.goal_id;
                const gift = data.gift;
                setColorBar(color["Color bar"]);
                setBackgroundColor(color["Background color"]);
                setSeparatorColor(color["Separator Color"]);
                setTextColor(color["Text color"]);
                setRangeTextSize(style["Text size"]);
                setSelected(style["Text Style"]);
                setChecked(String(data.status));
                setGoals(goals.map(item => {
                    const goalData = {
                        name: item.name,
                        message: item.message,
                        target: item.target,
                        discount_code: item.discount_code,
                        type: item.type,
                        gift_id: item.gift_id,
                    };
                    if (item.gift_id != null) {
                        const ProductImage = gift.find(image => image.id === item.gift_id);
                        if (ProductImage) {
                            goalData.gift = ProductImage.product_image;
                        }
                    }
                    return goalData;
                }));
            })
            .catch((error) => {
                console.error('Error fetching', error);
            });
    });
    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = useCallback(() => {
        if (!hasChanges) {
            setHasChanges(true);
            setShowUnsavedBar(true);
        }
    }, [hasChanges]);
    const save = useCallback(() => {
        setLoadingSaveBtn(true);
        if (hasChanges === true) {
            callapi(window.App.appUrl + '/api/createProgress', {
                backgroundColor: backgroundColor,
                colorBar: colorBar,
                separatorColor: separatorColor,
                textColor: textColor,
                textSize: rangeTextSize,
                textStyle: selected,
                status: checked,
            })
                .then((response) => {
                    if (response.data.status === true) {
                        setToast({
                            message: 'Saved successfully!',
                            active: true,
                            error: false
                        });

                        setHasChanges(false);
                    } else {
                        setToast({
                            message: 'Saved error!',
                            active: true,
                            error: true
                        });
                    }
                    setLoadingSaveBtn(false);
                    setShowUnsavedBar(false);
                });
        } else {
            setShowUnsavedBar(false);
        }
    }, [hasChanges]);

    const toggleActive = useCallback(() => {
        setToast(!toast.active);
    }, []);
    const toastMarkup = toast.active ? (
        <Toast error={toast.error} content={toast.message} onDismiss={toggleActive} />
    ) : null;

    const handleCancel = () => {
        if (confirm("You have unsaved changes, are you sure you want to leave?")) {
            fetchData();
            setShowUnsavedBar(false);
        }
    }
    const ProgressBar = () => {
        const sortedGoals = goals.slice().sort((a, b) => a.target - b.target);
        const messages = sortedGoals.map(goal => JSON.parse(goal.message));
        const target = sortedGoals.map(goal => goal.target);
        const unit = checked == 1 ? "$" : "items";
        const message = () => {
            const message = [];
            const lastmessage = target.length - 1;
            for (let i = 0; i <= target.length; i++) {
                if (rangePrice ==0) {
                    message.push(
                        <div key={i} className="progress-bar-static-text" id="progress-bar-static-text-under" style={{ color: textColor, fontSize: rangeTextSize }}>
                            {selected === 'Bold' ? (
                                <span style={{ fontWeight: 'bold' }} dangerouslySetInnerHTML={{ __html: messages[i].cart_empty.replace('{{required}}', target[i] + unit) }}></span>
                            ) : selected === 'Italic' ? (
                                <span style={{ fontStyle: 'italic' }} dangerouslySetInnerHTML={{ __html: messages[i].cart_empty.replace('{{required}}', target[i] + unit) }}></span>
                            ) : selected === 'Underline' ? (
                                <span style={{ textDecoration: 'underline' }} dangerouslySetInnerHTML={{ __html: messages[i].cart_empty.replace('{{required}}', target[i] + unit) }}></span>
                            ) : (
                                <span dangerouslySetInnerHTML={{ __html: messages[i].cart_empty.replace('{{required}}', target[i] + unit) }}></span>
                            )}
                        </div>
                    );
                    break;
                } else if (rangePrice < target[i]) {
                    message.push(
                        <div key={i} className="progress-bar-static-text" id="progress-bar-static-text-under" style={{ color: textColor, fontSize: rangeTextSize }}>
                            {selected === 'Bold' ? (
                                <span style={{ fontWeight: 'bold' }} dangerouslySetInnerHTML={{ __html: messages[i].not_reached.replace('{{remaining}}', target[i] - rangePrice + unit) }}></span>
                            ) : selected === 'Italic' ? (
                                <span style={{ fontStyle: 'italic' }} dangerouslySetInnerHTML={{ __html: messages[i].not_reached.replace('{{remaining}}', target[i] - rangePrice + unit) }}></span>
                            ) : selected === 'Underline' ? (
                                <span style={{ textDecoration: 'underline' }} dangerouslySetInnerHTML={{ __html: messages[i].not_reached.replace('{{remaining}}', target[i] - rangePrice + unit) }}></span>
                            ) : (
                                <span dangerouslySetInnerHTML={{ __html: messages[i].not_reached.replace('{{remaining}}', target[i] - rangePrice + unit) }}></span>
                            )}
                        </div>
                    );
                    break;
                } else if (i === lastmessage) {
                    message.push(
                        <div key={i} className="progress-bar-static-text" id="progress-bar-static-text-under" style={{ color: textColor, fontSize: rangeTextSize }}>
                            {selected === 'Bold' ? (
                                <span style={{ fontWeight: 'bold' }} dangerouslySetInnerHTML={{ __html: messages[i].reached }}></span>
                            ) : selected === 'Italic' ? (
                                <span style={{ fontStyle: 'italic' }} dangerouslySetInnerHTML={{ __html: messages[i].reached }}></span>
                            ) : selected === 'Underline' ? (
                                <span style={{ textDecoration: 'underline' }} dangerouslySetInnerHTML={{ __html: messages[i].reached }}></span>
                            ) : (
                                <span dangerouslySetInnerHTML={{ __html: messages[i].reached }}></span>
                            )}
                        </div>
                    );
                }
            }
            return message;
        }
        return (
            <div className="progress-bar-wrapper" style={{ marginTop: '50px' }}>
                <div className="progress-bar-checkpoints" style={{ position: 'relative', width: '100%', height: '20px' }}>
                    {sortedGoals.map((goal, index) => (
                        <div key={index}>
                            <div className="checkpoint-image-wrapper" style={{ left: `${goal.target}%`, transform: 'translateY(-50%) translateX(-20px)' }}>
                                <div style={{ position: 'relative', width: '100%', paddingTop: '100%', display: 'block' }}>
                                    <div className="progress-bar-product-img">
                                        {goal.type === 3 ? (<Thumbnail source={window.App.appUrl + "/images/discount.png"} size="Small" />) :
                                            goal.type === 2 ? (<Thumbnail source={window.App.appUrl + "/images/free-shipping.png"} size="small" />) :
                                                (<Thumbnail source={goal.gift} size="small" />)}
                                    </div>
                                </div>
                            </div>
                            <div className="checkpoint-title" style={{ top: 'max(30px, 20px)', left: `${goal.target}%`, transform: 'translateY(-30%) translateX(-20px)' }}>
                                <span>{goal.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <br />
                <div id="progress-bar" style={{ width: '100%', height: '15px', top: '-40px', backgroundColor: backgroundColor, backgroundSize: 'auto 15px', overflow: 'hidden', position: 'relative', border: '1px solid rgb(151, 209, 255)', borderRadius: '7px' }}>
                    {sortedGoals.map((goal, index) => (
                        <div key={index}>
                            <div className="checkpoint-separator" style={{ width: '5px', left: `${goal.target}%`, backgroundColor: separatorColor }}>
                                <span></span>
                            </div>
                        </div>
                    ))}
                    <div id="progress-bar-progress" style={{ height: '15px', backgroundColor: colorBar, transition: 'width 0.3s ease-in-out 0s', width: `${rangePrice}%` }}>
                        <span></span>
                    </div>
                </div>
                {message()}
            </div>
        );
    };
    return (
        <div id='progressbar'>
            {showUnsavedBar ? (
                <div className="unsaved-bar">
                    <div className='unsaved-text'>Unsaved changes</div>
                    <ButtonGroup>
                        <Button disabled={loadingSaveBtn} onClick={handleCancel}>Discard</Button>
                        <Button loading={loadingSaveBtn} disabled={loadingSaveBtn} onClick={save} primary>Save</Button>
                    </ButtonGroup>
                </div>
            ) : ''}
            <Page>
                <Layout>
                    <Layout.Section oneHalf>
                        <LegacyCard sectioned>
                            <LegacyCard.Section>
                                <div className='primary-color' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div className='primary-color_title' style={{ display: 'flex', gap: '5px' }}>
                                        <span>Color of the bar</span>
                                        <Tooltip content='The background color of the part of the bar which represents the current progress and that of the completed goals.' dismissOnMouseOut>
                                            <Icon source={QuestionMarkMinor} color='interactive' />
                                        </Tooltip>
                                    </div>
                                    <div className='preview-color'>
                                        <Popover activator={activatorColorBar} active={colorBarActive} onClose={togglePopoverActive}>
                                            <SketchPicker color={colorBar} onChange={handleColorChange} />
                                        </Popover>
                                    </div>
                                </div>
                            </LegacyCard.Section>
                            <LegacyCard.Section>
                                <div className='secondary-color' style={{ display: 'flex', justifyContent: 'space-between' }} >
                                    <div className='secondary-color_title' style={{ display: 'flex', gap: '5px' }}>
                                        <span>Bar background color</span>
                                        <Tooltip content='The background color of the part of the bar which represents the current progress and that of the completed goals.' dismissOnMouseOut>
                                            <Icon source={QuestionMarkMinor} color='interactive' />
                                        </Tooltip>
                                    </div>
                                    <div className='preview-color'>
                                        <Popover activator={activatorBackgroundColor} active={BackgroundColorActive} onClose={toggleBackgroundColor}>
                                            <SketchPicker color={backgroundColor} onChange={handleBackgroundColor} />
                                        </Popover>
                                    </div>
                                </div>
                            </LegacyCard.Section>
                            <LegacyCard.Section>
                                <div className='separator-color' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div className='separator-color_title' style={{ display: 'flex', gap: '5px' }}>
                                        <span>Separator Color </span>
                                        <Tooltip content='The color of the checkmark under completed goals.'>
                                            <Icon source={QuestionMarkMinor} color='interactive' />
                                        </Tooltip>
                                    </div>
                                    <div className='preview-color'>
                                        <Popover activator={activatorSeparatorColor} active={separatorColorActive} onClose={toggleSeparator}>
                                            <SketchPicker color={separatorColor} onChange={handleSeparatorColor} />
                                        </Popover>
                                    </div>
                                </div>
                            </LegacyCard.Section>
                            <LegacyCard.Section>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div>
                                        <span>
                                            Default Metric To Use When Both Subtotal And Item Count Goals Exist
                                        </span>
                                    </div>
                                    <div className='checkbox' style={{ display: 'flex', gap: '15px' }}>
                                        <RadioButton
                                            label='Subtotal'
                                            checked={checked === "1"}
                                            id="1"
                                            onChange={handleChange}
                                        />
                                        <RadioButton
                                            label='Item Count'
                                            id="0"
                                            checked={checked === "0"}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </LegacyCard.Section>
                        </LegacyCard>
                        <LegacyCard title="Progress Bar Description" sectioned>
                            <LegacyCard.Section>
                                <div className='text-color' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div className='text-color_title' style={{ display: 'flex', gap: '5px' }}>
                                        <span>Description Color</span>
                                        <Tooltip content="The color of all text generated by the progress bar - to change a specific span's color switch to All Options above." dismissOnMouseOut>
                                            <Icon source={QuestionMarkMinor} color='interactive' />
                                        </Tooltip>
                                    </div>
                                    <div className='preview-color'>
                                        <Popover activator={activatorTextColor} active={textColorActive} onClose={toggleTextColorActicve}>
                                            <SketchPicker color={textColor} onChange={handleTextColor} />
                                        </Popover>
                                    </div>
                                </div>
                            </LegacyCard.Section>
                            <LegacyCard.Section>
                                <div className='text-size' style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div className='text-size_title' style={{ display: 'flex', gap: '5px' }}>
                                        <span>Description Size</span>
                                        <Tooltip content="The size of all text generated by the progress bar - to change a specific label's size switch to All Options above." dismissOnMouseOut>
                                            <Icon source={QuestionMarkMinor} color='interactive' />
                                        </Tooltip>
                                    </div>
                                    <div>
                                        <RangeSlider
                                            output
                                            min={10}
                                            max={25}
                                            value={rangeTextSize}
                                            onChange={handleRangeTextSize}
                                            prefix={<span>10px</span>}
                                            suffix={<span style={{ minWidth: '24px', textAlign: 'right' }}>25px</span>}
                                        />
                                    </div>
                                </div>
                            </LegacyCard.Section>
                            <LegacyCard.Section>
                                <div className='description-style' style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                    <div className='description-style_title'>
                                        <span>Description Style</span>
                                    </div>
                                    <div>
                                        <Select
                                            options={options}
                                            onChange={handleSelectChange}
                                            value={selected}
                                        />
                                    </div>
                                </div>
                            </LegacyCard.Section>
                        </LegacyCard>
                    </Layout.Section>
                    <Layout.Section oneHalf>
                        <LegacyCard title="Preview Progress-Bar:">
                            <LegacyCard.Section>
                                <ProgressBar />
                            </LegacyCard.Section>
                            <LegacyCard.Section>
                                <p><em><strong>Note:</strong> All goals are shown i the preview of country targetings. On the live shop,
                                    only the goals that are eligible for a customer's location (based on IP geolocation) will be shown.</em></p>
                            </LegacyCard.Section>
                        </LegacyCard>
                        <LegacyCard sectioned title='Change The Previewed Cart:'>
                            {checked === "0" ? (
                                <RangeSlider
                                    label={
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            Change The Number of Cart Items
                                            <Tooltip content='Change the item count to see how it affects the bar.' dismissOnMouseOut>
                                                <Icon source={QuestionMarkMinor} color='interactive' />
                                            </Tooltip>
                                        </div>
                                    }
                                    value={rangePrice}
                                    min={0}
                                    max={1}
                                    onChange={handleRangeSliderChange}
                                    output
                                    prefix={<span>0</span>}
                                    suffix={<span style={{ minWidth: '24px', textAlign: 'right' }}>1</span>}
                                />
                            ) : (
                                <RangeSlider
                                    label={
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            Change The Subtotal
                                            <Tooltip content='Change the subtotal to see how it affects the bar.' dismissOnMouseOut>
                                                <Icon source={QuestionMarkMinor} color='interactive' />
                                            </Tooltip>
                                        </div>
                                    }
                                    value={rangePrice}
                                    min={0}
                                    max={100}
                                    onChange={handleRangeSliderChange}
                                    output
                                    prefix={<span>0$</span>}
                                    suffix={<span style={{ minWidth: '24px', textAlign: 'right' }}>100$</span>}
                                />
                            )}
                        </LegacyCard>
                    </Layout.Section>
                </Layout>
                {toastMarkup}
            </Page>
        </div>
    );
};
export default ProgressBar;