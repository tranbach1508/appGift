import React, { useState, useEffect } from 'react';
import { Page, Layout, LegacyCard, ResourceList, EmptyState, Thumbnail, ResourceItem, Text, Button } from '@shopify/polaris';
import Switch from "react-switch";
import { useNavigate } from "react-router-dom";
import callapi from './CallApi';

const Goals = () => {
    const [goals, setGoals] = useState({
        free_gift: [],
        free_shipping: [],
        discount: []
    });
    useEffect(() => {
        callapi(window.App.appUrl + '/api/goals', { type: 'free_gift' })
            .then((response) => {
                setGoals({
                    free_gift: response.data.free_gift,
                    free_shipping: response.data.free_shipping,
                    discount: response.data.discount
                })
            })
    }, [])
    const navigate = useNavigate();

    const createGoal = (type,name) => {
        navigate("/create-goal",
            {
                state: {
                    goal_type: type,
                    goal_name: name
                }
            });
    }

    const editGoal = (path) => {
        navigate(path)
    }

    const changeStatus = (id, type) => {
        callapi(window.App.appUrl + '/api/change-status-goal', { id: id })
            .then((response) => {
                if (response.data.status) {
                    let _goals = { ...goals };
                    _goals[type].find(x => x.id == id).status = _goals[type].find(x => x.id == id).status == 1 ? 0 : 1;
                    setGoals(_goals)
                }
            })
    }

    return (
        <Page
            title="Goals"
        >
            <Layout>
                <Layout.Section>
                    <LegacyCard>
                        <LegacyCard.Section>
                            <div className='space-between'>
                                <Text variant="headingLg" as="h5">
                                    Free Gift Goals
                                </Text>
                                <Button primary onClick={() => createGoal('free_gift','Free Gift')}>Create Goal</Button>
                            </div>
                        </LegacyCard.Section>
                        <LegacyCard.Section>
                            {goals.free_gift.length > 0 ?
                                <LegacyCard>
                                    <ResourceList
                                        resourceName={{ singular: 'customer', plural: 'customers' }}
                                        items={goals.free_gift}
                                        renderItem={(item) => {
                                            const { id, status, name } = item;
                                            const media = <Thumbnail source={window.App.appUrl + "/images/free-gift.png"} size="small" />;

                                            return (
                                                <ResourceItem
                                                    id={id}
                                                    media={media}
                                                >
                                                    <div className="space-between center" onClick={() => editGoal("/goals/"+id)} style={{ height: '38px' }}>
                                                        <Text variant="bodyMd" fontWeight="bold" as="h3">
                                                            {name}
                                                        </Text>
                                                        <Switch width={55} height={25} uncheckedIcon={false} checkedIcon={false} checked={status == 1} onChange={() => changeStatus(id, 'free_gift')} />
                                                    </div>
                                                </ResourceItem>
                                            );
                                        }}
                                    />
                                </LegacyCard>
                                :
                                <div>Create gift goals which customers need to reach in order to receive a free gift.</div>}
                        </LegacyCard.Section>
                    </LegacyCard>
                </Layout.Section>
                <Layout.Section>
                    <LegacyCard>
                        <LegacyCard.Section>
                            <div className='space-between'>
                                <Text variant="headingLg" as="h5">
                                    Free Shipping Goals
                                </Text>
                                <Button primary onClick={() => createGoal('free_shipping','Free Shipping')}>Create Goal</Button>
                            </div>
                        </LegacyCard.Section>
                        <LegacyCard.Section>
                            {goals.free_shipping.length > 0 ?
                                <LegacyCard>
                                    <ResourceList
                                        resourceName={{ singular: 'customer', plural: 'customers' }}
                                        items={goals.free_shipping}
                                        renderItem={(item) => {
                                            const { id, status, name } = item;
                                            const media = <Thumbnail source={window.App.appUrl + "/images/free-shipping.png"} size="small" />;

                                            return (
                                                <ResourceItem
                                                    id={id}
                                                    media={media}
                                                >
                                                    <div className="space-between center" onClick={() => editGoal("/goals/"+id)} style={{ height: '38px' }}>
                                                        <Text variant="bodyMd" fontWeight="bold" as="h3">
                                                            {name}
                                                        </Text>
                                                        <Switch width={55} height={25} uncheckedIcon={false} checkedIcon={false} checked={status == 1} onChange={() => changeStatus(id, 'free_shipping')} />
                                                    </div>
                                                </ResourceItem>
                                            );
                                        }}
                                    />
                                </LegacyCard>
                                :
                                <div>Create shipping goals which customers need to reach in order to receive free shipping.</div>}
                        </LegacyCard.Section>
                    </LegacyCard>
                </Layout.Section>
                <Layout.Section>
                    <LegacyCard>
                        <LegacyCard.Section>
                            <div className='space-between'>
                                <Text variant="headingLg" as="h5">
                                    Discount Code Goals
                                </Text>
                                <Button primary onClick={() => createGoal('discount','Discount')}>Create Goal</Button>
                            </div>
                        </LegacyCard.Section>
                        <LegacyCard.Section>
                            {goals.discount.length > 0 ?
                                <LegacyCard>
                                    <ResourceList
                                        resourceName={{ singular: 'customer', plural: 'customers' }}
                                        items={goals.discount}
                                        renderItem={(item) => {
                                            const { id, status, name } = item;
                                            const media = <Thumbnail source={window.App.appUrl + "/images/discount.png"} size="small" />;

                                            return (
                                                <ResourceItem
                                                    id={id}
                                                    media={media}
                                                >
                                                    <div className="space-between center" onClick={() => editGoal("/goals/"+id)} style={{ height: '38px' }}>
                                                        <Text variant="bodyMd" fontWeight="bold" as="h3">
                                                            {name}
                                                        </Text>
                                                        <Switch width={55} height={25} uncheckedIcon={false} checkedIcon={false} checked={status == 1} onChange={() => changeStatus(id, 'discount')} />
                                                    </div>
                                                </ResourceItem>
                                            );
                                        }}
                                    />
                                </LegacyCard>
                                :
                                <div>Create discount code goals which customers need to reach in order to receive discount code.</div>}
                        </LegacyCard.Section>
                    </LegacyCard>
                </Layout.Section>
            </Layout>
        </Page>
    );
};

export default Goals;