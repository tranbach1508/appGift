import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router';
import { useLocation, useNavigate } from 'react-router-dom';
import { ResourcePicker } from '@shopify/app-bridge-react';
import { Page, Layout, LegacyCard, Text, TextField, Select, FormLayout, LegacyStack, RadioButton, Button, ResourceList, Thumbnail, ResourceItem, ButtonGroup, Toast } from '@shopify/polaris';
import Switch from "react-switch";
import { DeleteMinor } from '@shopify/polaris-icons';
import PreviewGoal from './PreviewGoal';
import callapi from './CallApi';
import SkeletonPageShopify from './SkeletonPageShopify';

const Goal = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    window.onbeforeunload = function () {
        if(statusState.changed){
            return "Are you sure?";
        }
    };
    const [goal, setGoal] = useState()
    const [gifts, setGifts] = useState([])
    const [selectGiftOptions, setSelectGiftOptions] = useState([])
    const [statusState, setStatusState] = useState({
        loadingData: false,
        changed: false,
        loadingSaveBtn: false
    })
    const changeStatusState = (field, value) => {
        setStatusState({
            ...statusState,
            [field]: value
        })
    }
    useEffect(() => {
        callapi(window.App.appUrl + '/api/goal/', {
            id: id
        })
            .then((response) => {
                let goalData = response.data.goal;
                let giftsData = response.data.gifts;
                setGoal({
                    name: goalData.name,
                    gift: goalData.gift,
                    type: goalData.type,
                    status: goalData.status,
                    gift_count: goalData.gift_count,
                    times: goalData.times,
                    discount_code: goalData.discount_code,
                    target_type: goalData.target_type,
                    target: goalData.target,
                    condition: goalData.condition,
                    message: goalData.message
                })
                setGifts(giftsData);
                setSelectGiftOptions(giftsData.map(x => ({
                    value: x.id,
                    label: x.product_title
                })))
                changeStatusState("loadingData", true)
            })
    }, [])
    const [toast, setToast] = useState({
        message: '',
        active: false,
        error: false
    })
    const [resourcePickerOpened, setResourcePickerOpened] = useState(false)
    const setGoalField = (field, value) => {
        setGoal({
            ...goal,
            [field]: value
        });
        changeStatusState('changed',true);
    }
    const changeGift = (value) => {
        setGoal({
            ...goal,
            gift: gifts.find(x => x.id == value)
        });
        changeStatusState('changed',true);
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
        });
        changeStatusState('changed',true);
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
        });
        changeStatusState('changed',true);
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
        });
        changeStatusState('changed',true);
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
        changeStatusState('changed',true);
    }
    const truncateString = (str, num) => {
        if (str.length > num) {
            return str.slice(0, num) + "...";
        } else {
            return str;
        }
    }
    const save = () => {
        changeStatusState("loadingSaveBtn",true)
        callapi(window.App.appUrl + '/api/update-goal', {
            id: id,
            goal: goal
        })
            .then((response) => {
                if (response.data.status) {
                    setToast({
                        message: 'Save goal successful',
                        active: true,
                        error: false
                    })
                } else {
                    setToast({
                        message: 'Save goal not successful',
                        active: true,
                        error: true
                    })
                }
                changeStatusState("loadingSaveBtn",false)
                changeStatusState("changed",false)
            })
    }
    const deleteGoal = () =>{
        if (confirm("Are you sure you want to delete?")) {
            callapi(window.App.appUrl + '/api/delete-goal', {
                id: id
            })
                .then((response) => {
                    if (response.data.status) {
                        setToast({
                            message: 'Goal deleted',
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
                })
        }
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
        statusState.loadingData ?
            <div id="create-goal-page">
                {statusState.changed ?
                <div className="unsaved-bar space-between">
                    <div className='unsaved-text'>Unsaved changes</div>
                    <ButtonGroup>
                        <Button outline onClick={discard} disabled={statusState.loadingSaveBtn}>Discard</Button>
                        <Button loading={statusState.loadingSaveBtn} disabled={statusState.loadingSaveBtn} onClick={save}>Save</Button>
                    </ButtonGroup>
                </div> : null }
                <Page
                    title={goal.type == "free_gift" ? "Edit Free Gift Goal" : (goal.type == "free_shipping" ? "Edit Free Shipping Goal" : "Edit Discount Goal")}
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
                                        checked={goal.target_type === 'item count'}
                                        onChange={() => setGoalField("target_type", "item count")}
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
                                <ButtonGroup>
                                    <Button loading={statusState.loadingSaveBtn} disabled={statusState.loadingSaveBtn} primary onClick={save}>Save</Button>
                                    <Button destructive plain onClick={deleteGoal}>Delete</Button>

                                </ButtonGroup>
                            </LegacyCard>
                        </Layout.Section >
                        <PreviewGoal goal={goal}>
                        </PreviewGoal>
                    </Layout>
                    {toastMarkup}
                </Page>
            </div>
            : <SkeletonPageShopify></SkeletonPageShopify>
    );
};

export default Goal;