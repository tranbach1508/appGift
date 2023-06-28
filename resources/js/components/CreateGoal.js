import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ResourcePicker } from '@shopify/app-bridge-react';
import { Page, Layout, LegacyCard, Text, TextField, Select, FormLayout, LegacyStack, RadioButton, Button, ResourceList, Thumbnail, ResourceItem, ButtonGroup, Toast } from '@shopify/polaris';
import Switch from "react-switch";
import { DeleteMinor } from '@shopify/polaris-icons';
import PreviewGoal from './PreviewGoal';
import callapi from './CallApi';

const CreateGoal = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const messageForm = () => {
        let goal_type = location.state != null ? location.state.goal_type : window.localStorage.getItem("goal_type");
        if(goal_type == "free_gift"){
            return {
                cart_empty: "Get a <strong>Free Gift</strong> when you spend {{required}}.",
                not_reached: "Spend <strong>{{remaining}}</strong> more to get a <strong>Free Gift!</strong>",
                reached: "Congrats! You got a <strong>Free Gift</strong>!"
            }
        }else if(goal_type == "free_shipping"){
            return {
                cart_empty: "Get <strong>Free Shipping</strong> when you spend {{required}}.",
                not_reached: "Spend <strong>{{remaining}}</strong> more to get <strong>Free Shipping!</strong>",
                reached: "Congrats! You got <strong>Free Shipping</strong>!"
            }
        }else{
            return {
                cart_empty: "Get <strong>10% Off</strong> when you spend {{required}}.",
                not_reached: "Spend <strong>{{remaining}}</strong> more to get a <strong>10% Discount!</strong>",
                reached: "Congrats! You got a <strong>10% Off Code: SAVE10</strong>!"
            }
        }
    }
    window.onbeforeunload = function() {
        if(location.pathname == "/create-goal"){
            window.localStorage.setItem("goal_type",goal.type)
            window.localStorage.setItem("goal_name",goal.name)
            return "Are you sure?";
        }
    };
    const [goal, setGoal] = useState({
        name: location.state != null ? location.state.goal_name : window.localStorage.getItem("goal_name"),
        gift: null,
        type: location.state != null ? location.state.goal_type : window.localStorage.getItem("goal_type"),
        status: false,
        gift_count: 1,
        times: 1,
        discount_code: '',
        target_type: 'subtotal',
        target: 50,
        condition: {
            all: {
                enable: true,
            },
            includes_item: {
                enable: false,
                collections: {
                    enable: false,
                    list: []
                },
                products: {
                    enable: true,
                    list: []
                },
                variants: {
                    enable: false,
                    list: []
                },
            },
            except: {
                enable: false,
                collections: {
                    enable: false,
                    list: []
                },
                products: {
                    enable: true,
                    list: []
                },
                variants: {
                    enable: false,
                    list: []
                },
            }
        },
        message: messageForm()
    })
    const [gifts, setGifts] = useState([])
    const [selectGiftOptions, setSelectGiftOptions] = useState([])
    useEffect(() => {
        callapi(window.App.appUrl + '/api/gifts')
            .then((response) => {
                setGifts(response.data)
                setSelectGiftOptions(response.data.map(x => ({
                    value: x.id,
                    label: x.product_title
                })))
            })
    }, [])
    const [toast, setToast] = useState({
        message: '',
        active: false,
        error: false
    })
    const [loadingSaveBtn, setLoadingSaveBtn] = useState(false)
    const [resourcePickerOpened, setResourcePickerOpened] = useState(false)
    const setGoalField = (field, value) => {
        setGoal({
            ...goal,
            [field]: value
        })
    }
    const changeGift = (value) => {
        setGoal({
            ...goal,
            gift: gifts.find(x => x.id == value)
        })
    }
    const changeGoalCondition = (option) => {
        let condition = goal.condition
        condition.all.enable = false;
        condition.includes_item.enable = false;
        condition.except.enable = false;
        condition[option].enable = true
        setGoal({
            ...goal,
            condition: condition
        })
    }
    const changeGoalConditionIncludes = (option) => {
        let condition = goal.condition
        if (condition.includes_item.enable) {
            condition.includes_item.products.enable = false;
            condition.includes_item.collections.enable = false;
            condition.includes_item.variants.enable = false;
            condition.includes_item[option].enable = true;
        } else {
            condition.except.products.enable = false;
            condition.except.collections.enable = false;
            condition.except.variants.enable = false;
            condition.except[option].enable = true;
        }
        setGoal({
            ...goal,
            condition: condition
        })
    }
    const changeGoalConditionList = (payload, type) => {
        let selected_item = [];
        let condition = goal.condition
        selected_item = payload.selection.map(x => {
            if (type == "product") {
                return {
                    full_id: x.id,
                    id: x.id.replace('gid://shopify/Product/', ''),
                    title: x.title,
                    image: x.images[0].originalSrc
                }
            } else if (type == "variant") {
                return {
                    full_id: x.id,
                    id: x.id.replace('gid://shopify/ProductVariant/', ''),
                    title: x.title,
                    image: x.images[0].originalSrc
                }
            } else {
                return {
                    full_id: x.id,
                    id: x.id.replace('gid://shopify/Collection/', ''),
                    title: x.title,
                    image: x.images[0].originalSrc
                }
            }
        })
        setResourcePickerOpened(false)
        if (goal.condition.includes_item.enable) {
            goal.condition.includes_item[Object.keys(goal.condition.includes_item).find(x => goal.condition.includes_item[x].enable == true)].list = selected_item
        } else {
            goal.condition.except[Object.keys(goal.condition.except).find(x => goal.condition.except[x].enable == true)].list = selected_item
        }
        setGoal({
            ...goal,
            condition: condition
        })
    }
    const listItemsApplied = (condition) => {
        if (condition.includes_item.enable) {
            return condition.includes_item[Object.keys(condition.includes_item).find(x => condition.includes_item[x].enable == true)].list
        } else {
            return condition.except[Object.keys(condition.except).find(x => condition.except[x].enable == true)].list
        }
    }
    const listItemsIdApplied = (condition) => {
        if (listItemsApplied(condition).length > 0) {
            return listItemsApplied(condition).map(x => {
                return {
                    id: x.full_id
                }
            })
        } else {
            return []
        }
    }
    const changeMessages = (field, value) => {
        let message = goal.message;
        message[field] = value;
        setGoal({
            ...goal,
            message: message
        })
    }
    const truncateString = (str, num) => {
        if (str.length > num) {
            return str.slice(0, num) + "...";
        } else {
            return str;
        }
    }
    const save = () => {
        setLoadingSaveBtn(true)
        callapi(window.App.appUrl + '/api/addGoal', goal)
            .then((response) => {
                if (response.data.status) {
                    setToast({
                        message: 'Create goal successful',
                        active: true,
                        error: false
                    })
                    navigate("/goals")
                } else {
                    setToast({
                        message: 'Create goal not successful',
                        active: true,
                        error: true
                    })
                }
                setLoadingSaveBtn(false)
            })
    }
    const discard = () => {
        if (confirm("You have unsaved changes, are you sure you want to leave?")) {
            navigate(-1)
        }
    }
    const toggleActive = useCallback(() => {
        setToast(!toast.active);
    }, []);
    const toastMarkup = toast.active ? (
        <Toast error={toast.error} content={toast.message} onDismiss={toggleActive} />
    ) : null;
    return (
        <div id="create-goal-page">
            <div className="unsaved-bar space-between">
                <div className='unsaved-text'>Unsaved changes</div>
                <ButtonGroup>
                    <Button outline onClick={discard} disabled={loadingSaveBtn}>Discard</Button>
                    <Button loading={loadingSaveBtn} disabled={loadingSaveBtn} onClick={save}>Save</Button>
                </ButtonGroup>
            </div>
            <Page
                title="Create Gift Goal"
            >
                <Layout>
                    <Layout.Section oneHalf>
                        <LegacyCard sectioned>
                            <div className="space-between">
                                <Text variant="headingMd" as="h2">
                                    Enable This Goal?
                                </Text>
                                <Switch onChange={() => setGoalField('status', !goal.status)} width={55} height={25} uncheckedIcon={false} checkedIcon={goal.status} checked={goal.status} />
                            </div>
                        </LegacyCard>
                        <LegacyCard sectioned title="Goal Name">
                            <TextField
                                value={goal.name}
                                onChange={(value) => setGoalField('name', value)}
                                autoComplete="off"
                                helpText="Note: Define what the customer is getting."
                            />
                        </LegacyCard>
                        {goal.type == "free_gift" || goal.type == "discount" ?
                            <LegacyCard sectioned title="Goal Reward">
                                {goal.type == "free_gift" ?
                                    <FormLayout>
                                        <Select
                                            label="Which Gift The Customer Gets"
                                            options={selectGiftOptions}
                                            onChange={changeGift}
                                            value={goal.gift != null ? goal.gift.id : ''}
                                            placeholder="Select a Gift"
                                        />
                                        <FormLayout.Group>
                                            <TextField
                                                type="number"
                                                label="How Many Gifts To Award When The Goal Is Met Once"
                                                onChange={(value) => setGoalField("gift_count", value)}
                                                autoComplete="off"
                                                value={goal.gift_count}
                                            />
                                            <TextField
                                                type="number"
                                                label="Maximum Times The Goal Can Be Met Per Order:"
                                                onChange={(value) => setGoalField("times", value)}
                                                autoComplete="off"
                                                value={goal.times}
                                            />
                                        </FormLayout.Group>
                                    </FormLayout>
                                    :
                                    <TextField
                                        type="text"
                                        label="Discount Code"
                                        onChange={(value) => setGoalField("discount_code", value)}
                                        autoComplete="off"
                                        value={goal.discount_code}
                                    />}
                            </LegacyCard> : null
                        }
                        <LegacyCard sectioned title="Goal Target">
                            <LegacyStack vertical>
                                <RadioButton
                                    label="Cart Subtotal"
                                    helpText="Customer needs to reach a minimum subtotal to meet the goal."
                                    checked={goal.target_type === 'subtotal'}
                                    name="target"
                                    onChange={() => setGoalField("target_type", "subtotal")}
                                />
                                <RadioButton
                                    label="Cart Item Count"
                                    helpText="Customer needs to reach a minimum cart item count in order to meet the goal."
                                    name="target"
                                    checked={goal.target_type === 'item_count'}
                                    onChange={() => setGoalField("target_type", "item_count")}
                                />
                                <TextField
                                    type="number"
                                    label="Minimum Requirement"
                                    onChange={(value) => setGoalField("target", value)}
                                    autoComplete="off"
                                    value={goal.target}
                                />
                            </LegacyStack>
                        </LegacyCard>
                        <LegacyCard title="Applies To:">
                            <LegacyCard.Section>
                                <LegacyStack>
                                    <RadioButton
                                        label="All Items"
                                        checked={goal.condition.all.enable}
                                        name="condition"
                                        onChange={() => changeGoalCondition("all")}
                                    />
                                    <RadioButton
                                        label="Included Items"
                                        name="condition"
                                        checked={goal.condition.includes_item.enable}
                                        onChange={() => changeGoalCondition("includes_item")}
                                    />
                                    <RadioButton
                                        label="All But Excluded Items"
                                        name="condition"
                                        checked={goal.condition.except.enable}
                                        onChange={() => changeGoalCondition("except")}
                                    />
                                </LegacyStack>
                            </LegacyCard.Section>
                            {goal.condition.includes_item.enable || goal.condition.except.enable ?
                                <LegacyCard.Section subdued title="Included Items Filtered By:">
                                    <FormLayout>
                                        <Select
                                            options={[
                                                { label: 'Products', value: 'products' },
                                                { label: 'Variants', value: 'variants' },
                                                { label: 'Collections', value: 'collections' },
                                            ]}
                                            onChange={(value) => changeGoalConditionIncludes(value)}
                                            value={
                                                goal.condition.includes_item.enable ?
                                                    Object.keys(goal.condition.includes_item).find(x => goal.condition.includes_item[x].enable == true)
                                                    : Object.keys(goal.condition.except).find(x => goal.condition.except[x].enable == true)
                                            }
                                        />
                                        <Button primary onClick={() => setResourcePickerOpened(true)}>Select {goal.condition.includes_item.enable ?
                                            Object.keys(goal.condition.includes_item).find(x => goal.condition.includes_item[x].enable == true)
                                            : Object.keys(goal.condition.except).find(x => goal.condition.except[x].enable == true)} {listItemsApplied(goal.condition).length > 0 ? listItemsApplied(goal.condition).length : ''}</Button>
                                    </FormLayout>
                                    {(goal.condition.includes_item.enable ?
                                        Object.keys(goal.condition.includes_item).find(x => goal.condition.includes_item[x].enable == true)
                                        : Object.keys(goal.condition.except).find(x => goal.condition.except[x].enable == true)) == "products" ?
                                        <ResourcePicker
                                            open={resourcePickerOpened}
                                            resourceType="Product"
                                            showVariants={false}
                                            selectMultiple={true}
                                            showHidden={true}
                                            onCancel={() => {
                                                setResourcePickerOpened(false)
                                            }}
                                            onSelection={(payload) => changeGoalConditionList(payload, "product")}
                                            initialSelectionIds={listItemsIdApplied(goal.condition)}
                                        /> : null
                                    }
                                    {(goal.condition.includes_item.enable ?
                                        Object.keys(goal.condition.includes_item).find(x => goal.condition.includes_item[x].enable == true)
                                        : Object.keys(goal.condition.except).find(x => goal.condition.except[x].enable == true)) == "variants" ?
                                        <ResourcePicker
                                            open={resourcePickerOpened}
                                            resourceType="ProductVariant"
                                            showVariants={true}
                                            selectMultiple={true}
                                            showHidden={true}
                                            onCancel={() => {
                                                setResourcePickerOpened(false)
                                            }}
                                            onSelection={(payload) => changeGoalConditionList(payload, "variant")}
                                            initialSelectionIds={listItemsIdApplied(goal.condition)}
                                        /> : null
                                    }
                                    {(goal.condition.includes_item.enable ?
                                        Object.keys(goal.condition.includes_item).find(x => goal.condition.includes_item[x].enable == true)
                                        : Object.keys(goal.condition.except).find(x => goal.condition.except[x].enable == true)) == "collections" ?
                                        <ResourcePicker
                                            open={resourcePickerOpened}
                                            resourceType="Collection"
                                            showVariants={false}
                                            selectMultiple={true}
                                            showHidden={true}
                                            onCancel={() => {
                                                setResourcePickerOpened(false)
                                            }}
                                            onSelection={(payload) => changeGoalConditionList(payload, "collection")}
                                            initialSelectionIds={listItemsIdApplied(goal.condition)}
                                        /> : null
                                    }
                                </LegacyCard.Section>
                                : null}
                            {(goal.condition.includes_item.enable || goal.condition.except.enable) && listItemsApplied(goal.condition).length > 0 ?
                                <LegacyCard.Section subdued title="Items Selected:">
                                    <ResourceList
                                        resourceName={{ singular: 'customer', plural: 'customers' }}
                                        items={listItemsApplied(goal.condition)}
                                        renderItem={(item) => {
                                            const { id, title, image } = item;
                                            const media = <Thumbnail source={image} size="small" />;

                                            return (
                                                <ResourceItem
                                                    id={id}
                                                    media={media}
                                                    accessibilityLabel={`View details for ${name}`}
                                                >
                                                    <div className="space-between center" style={{ height: '38px' }}>
                                                        <Text variant="bodyMd" fontWeight="bold" as="h3">
                                                            {truncateString(title, 80)}
                                                        </Text>
                                                        <Button icon={DeleteMinor} plain></Button>
                                                    </div>
                                                </ResourceItem>
                                            );
                                        }}
                                    />
                                </LegacyCard.Section>
                                : null}
                        </LegacyCard>
                        <LegacyCard sectioned title="Goal Messages">
                            <FormLayout>
                                <TextField
                                    label="Message When Cart Is Empty"
                                    onChange={(value) => changeMessages('cart_empty', value)} autoComplete="off"
                                    value={goal.message.cart_empty}
                                    helpText="Note: Supports the {{required}} placeholder." />
                                <TextField
                                    label="Message When Goal Not Reached"
                                    onChange={(value) => changeMessages('not_reached', value)} autoComplete="off"
                                    value={goal.message.not_reached}
                                    helpText="Note: Supports the {{remaining}} placeholder." />
                                <TextField
                                    label="Message When Gift Goal Is Met"
                                    onChange={(value) => changeMessages('reached', value)} autoComplete="off"
                                    value={goal.message.reached} />
                            </FormLayout>
                        </LegacyCard>
                        <LegacyCard sectioned>
                            <Button loading={loadingSaveBtn} disabled={loadingSaveBtn} primary onClick={save}>Save</Button>
                        </LegacyCard>
                    </Layout.Section >
                    <PreviewGoal goal={goal}>
                    </PreviewGoal>
                </Layout>
                {toastMarkup}
            </Page>
        </div>
    );
};

export default CreateGoal;